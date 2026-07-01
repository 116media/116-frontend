# Spec 04 — API Client & Interceptors

Silent refresh on expired access token (single-flight + queue), the
refresh-token-expiry signal, and an `X-Device-Id` request header.

> Server-side resolution of the current user for SSR hydration is **not** here —
> it follows the codebase's inline `createServerCradle()` → use-case → `unwrap`
> pattern in the layout. See [05](05-providers-and-context.md#ssr-hydration).

Interceptors live in `src/shared/infrastructure/interceptors/` as **separate
files per concern**, exactly like the dashboard — never inlined in `client.ts`:

```text
src/shared/infrastructure/interceptors/
├── device-id.interceptor.ts            # request: attaches X-Device-Id
├── access-token-expiry.interceptor.ts  # response: 401 → silent refresh + retry
└── refresh-token-expiry.interceptor.ts # response: 403 refresh expired → DOM event
```

Status codes use the `http-status` package (`HttpStatus.UNAUTHORIZED`,
`HttpStatus.FORBIDDEN`), never hardcoded integers — matching `client.ts` and the
dashboard.

Design ref: [../06-api-client-interceptors.md](../06-api-client-interceptors.md).

---

## Tasks

- [ ] Session storage constants (`X_DEVICE_ID_HEADER`, `DEVICE_ID_STORAGE_KEY`)
- [ ] Device-id storage helper (UUID persisted once per browser)
- [ ] `device-id.interceptor.ts` (request: attaches `X-Device-Id`)
- [ ] `access-token-expiry.interceptor.ts` (single-flight refresh + queue + retry guard)
- [ ] `refresh-token-expiry.interceptor.ts` (exports `REFRESH_TOKEN_EXPIRED_EVENT`)
- [ ] Wire all three into `client.ts` in the correct order
- [ ] Verify: refresh fires once, queues, retries; refresh-expiry → guest

---

## Storage constants & device-id helper

The device id is owned by the session module (like the dashboard's
`platform/session` storage constants), used as a tracking identifier — not a
secret — so `localStorage` is acceptable.

```ts
// src/modules/session/infrastructure/constants/storage.constants.ts
import { APP_NAME } from "@/shared/infrastructure/constants/common";

export const DEVICE_ID_STORAGE_KEY = `${APP_NAME}-device-id`;

export const X_DEVICE_ID_HEADER = "X-Device-Id";
```

```ts
// src/modules/session/infrastructure/storage/device-id.storage.ts
import { DEVICE_ID_STORAGE_KEY } from "@/modules/session/infrastructure/constants/storage.constants";

/**
 * Returns a stable per-browser device id (UUID v4), creating and persisting one on
 * first read. Unlike the dashboard — which seeds the id from an
 * `InitializeDeviceUseCase` at startup — the web generates it lazily on first use,
 * so no startup hook is needed. Returns `null` during SSR (no `window`), in which
 * case the header is simply omitted.
 *
 * @returns The persisted device id, or null on the server.
 */
export function getDeviceId(): string | null {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
    }
    return id;
}
```

---

## Device-id interceptor

```ts
// src/shared/infrastructure/interceptors/device-id.interceptor.ts
import type { InternalAxiosRequestConfig } from "axios";

import { X_DEVICE_ID_HEADER } from "@/modules/session/infrastructure/constants/storage.constants";
import { getDeviceId } from "@/modules/session/infrastructure/storage/device-id.storage";

/**
 * Axios request interceptor that attaches the `X-Device-Id` header.
 *
 * @description
 * Reads the persisted device id and adds it to every outgoing request so the
 * backend can attribute sessions per device (parity with dashboard/mobile). On the
 * server (no device id) the header is omitted.
 *
 * @param config - Axios request configuration.
 * @returns The config with the `X-Device-Id` header attached when available.
 */
export const deviceIdInterceptor = (
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
    const deviceId = getDeviceId();
    if (deviceId) {
        config.headers.set(X_DEVICE_ID_HEADER, deviceId);
    }
    return config;
};
```

---

## Refresh-token-expiry interceptor

Standalone response interceptor: any `403 RefreshTokenExpiryException` (a request
made with no/rotated refresh token) dispatches a DOM event the presentation layer
listens for — no cross-layer coupling. It also owns the event-name constant so
both interceptors and `AuthProvider` import it from one place.

```ts
// src/shared/infrastructure/interceptors/refresh-token-expiry.interceptor.ts
import type { AxiosError } from "axios";
import HttpStatus from "http-status";

import { apiErrors } from "@/shared/infrastructure/constants/api";

export const REFRESH_TOKEN_EXPIRED_EVENT = "refresh-token-expired";

/**
 * Axios response error interceptor that handles expired refresh tokens.
 *
 * @description
 * On `403 RefreshTokenExpiryException`, dispatches {@link REFRESH_TOKEN_EXPIRED_EVENT}
 * on `window` so the presentation layer can react (drop to guest, open the login
 * modal). Runs AFTER the access-token-expiry interceptor so a normal refresh is
 * attempted first.
 *
 * @param error - The axios error.
 * @returns A rejected promise (always re-throws).
 */
export const refreshTokenExpiryInterceptor = async (error: AxiosError): Promise<never> => {
    const problemDetails = error.response?.data as { title?: string } | undefined;

    const isRefreshTokenExpiry =
        error.response?.status === HttpStatus.FORBIDDEN &&
        problemDetails?.title === apiErrors.refreshTokenExpiry.code;

    if (isRefreshTokenExpiry && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(REFRESH_TOKEN_EXPIRED_EVENT));
    }

    return Promise.reject(error);
};
```

---

## Access-token-expiry interceptor (silent refresh)

A factory bound to the axios instance (the instance is injected at registration
to avoid a circular import with `client.ts`). On `401 AccessTokenExpiryException`
it refreshes **once** (single-flight) while queueing any concurrent 401s, then
retries each original request. A failed refresh that is a `403
RefreshTokenExpiryException` dispatches the expiry event; the `_retry` flag
prevents loops.

```ts
// src/shared/infrastructure/interceptors/access-token-expiry.interceptor.ts
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import HttpStatus from "http-status";

import type { IApiProblemDetails } from "@/shared/infrastructure/api/type";
import { apiErrors } from "@/shared/infrastructure/constants/api";
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";
import container from "@/shared/infrastructure/service.locator";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

/**
 * Drains the queued requests after a refresh attempt.
 *
 * @param error - The refresh error, or null on success.
 */
const processQueue = (error: AxiosError | null): void => {
    failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
    failedQueue = [];
};

/**
 * Creates the access-token-expiry response interceptor bound to `instance`.
 *
 * @description
 * On `401 AccessTokenExpiryException`, refreshes the session once
 * (`refreshTokenUseCase` → bare client, no interceptors) while queueing concurrent
 * 401s, then retries the original request(s). If the refresh fails with a `403
 * RefreshTokenExpiryException`, dispatches {@link REFRESH_TOKEN_EXPIRED_EVENT}.
 * Runs BEFORE the error handler so it gets first chance at 401s.
 *
 * @param instance - The axios instance to retry requests against.
 * @returns The rejected-response handler for `interceptors.response.use`.
 */
export const accessTokenExpiryInterceptor = (instance: AxiosInstance) => {
    return async (error: AxiosError): Promise<never> => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        if (!originalRequest) return Promise.reject(error);

        const problemDetails = error.response?.data as { title?: string } | undefined;
        const isAccessTokenExpiry =
            error.response?.status === HttpStatus.UNAUTHORIZED &&
            problemDetails?.title === apiErrors.accessTokenExpiry.code;

        if (!isAccessTokenExpiry || originalRequest._retry) return Promise.reject(error);

        if (isRefreshing) {
            // Wait for the in-flight refresh, then retry this request.
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => instance.request(originalRequest));
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
            // `refreshTokenUseCase.execute()` is Promise/throw-based (no Result
            // wrapper) — it rejects when the refresh token is gone or rotated.
            await container.cradle.refreshTokenUseCase.execute();
            processQueue(null);
            return instance.request(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            const axiosError = refreshError as AxiosError<IApiProblemDetails>;

            const isRefreshTokenExpiry =
                axiosError.response?.status === HttpStatus.FORBIDDEN &&
                axiosError.response?.data?.title === apiErrors.refreshTokenExpiry.code;

            if (isRefreshTokenExpiry && typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent(REFRESH_TOKEN_EXPIRED_EVENT));
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    };
};
```

> **Detection note:** only `AccessTokenExpiryException` triggers refresh — a plain
> 401 (wrong password) must not. The refresh call itself goes through the **bare**
> `refreshClient` in `SessionRepositoryImpl` ([03](03-repositories-and-usecases.md))
> so it can never recurse.

---

## Wiring in `client.ts`

Register the interceptors after the existing request (Accept-Language) and error
interceptors, in the same order the dashboard uses:

```ts
// src/shared/infrastructure/api/client.ts (additions)
import { accessTokenExpiryInterceptor } from "@/shared/infrastructure/interceptors/access-token-expiry.interceptor";
import { deviceIdInterceptor } from "@/shared/infrastructure/interceptors/device-id.interceptor";
import { refreshTokenExpiryInterceptor } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";

// Request: attach X-Device-Id (alongside the existing Accept-Language interceptor)
apiClient.instance.interceptors.request.use(deviceIdInterceptor);

// Runs first: silently refreshes expired access tokens and retries the original request
apiClient.instance.interceptors.response.use(
    responseHandler,
    accessTokenExpiryInterceptor(apiClient.instance),
);
// Runs second: detects expired refresh tokens and signals the UI via a DOM event
apiClient.instance.interceptors.response.use(responseHandler, refreshTokenExpiryInterceptor);
// Runs last: the existing normalize-and-reject error handler
apiClient.instance.interceptors.response.use(responseHandler, errorHandler);
```

---

## Session-expiry listener (in AuthProvider)

`AuthProvider` ([05](05-providers-and-context.md)) listens for the event using the
exported constant (never a magic string):

```ts
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";

useEffect(() => {
    const onExpired = () => {
        queryClient.removeQueries({ queryKey: authKeys.me });
        openAuthModal?.("login"); // optional notice
    };
    window.addEventListener(REFRESH_TOKEN_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(REFRESH_TOKEN_EXPIRED_EVENT, onExpired);
}, [queryClient]);
```

No hard redirect — the visitor stays on the public page.

---

## Verification

- [ ] All three interceptors live under `src/shared/infrastructure/interceptors/`.
- [ ] Status checks use `HttpStatus.*` — no hardcoded `401`/`403`.
- [ ] One expired-access request triggers exactly **one** refresh; parallel 401s
      queue and replay.
- [ ] A failed refresh dispatches `REFRESH_TOKEN_EXPIRED_EVENT` and the UI drops to guest.
- [ ] `X-Device-Id` is present on requests and stable across reloads.
- [ ] tsc + biome clean.
