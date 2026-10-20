import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import HttpStatus from "http-status";
import { REFRESH_LOCK_NAME } from "@/modules/session/infrastructure/constants/storage";
import {
    getLastRefreshAt,
    markRefreshedAt
} from "@/modules/session/infrastructure/storage/refresh-sync.storage";
import type { IApiProblemDetails } from "@/shared/infrastructure/api/type";
import { apiErrors } from "@/shared/infrastructure/constants/api";
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";

let isRefreshing = false;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

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
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

/**
 * Refreshes the session via the DI container's `refreshTokenUseCase`. The container
 * is imported lazily to avoid a static cycle with the API client it registers.
 *
 * @returns Resolves on success, rejects on failure.
 */
const runRefresh = async (): Promise<void> => {
    const { default: container } = await import("@/shared/infrastructure/service.locator");
    await container.cradle.refreshTokenUseCase.execute();
};

/**
 * Refreshes under a Web Lock so only one tab of the origin rotates the shared cookie.
 * `isRefreshing` guards a single tab's heap; the lock guards the browser. A sibling that
 * already refreshed after `startedAt` makes this a no-op.
 *
 * @param startedAt - Epoch ms at which this caller observed the expiry.
 */
const runRefreshOnce = async (startedAt: number): Promise<void> => {
    if (typeof navigator === "undefined" || !navigator.locks) {
        await runRefresh();
        markRefreshedAt(Date.now());
        return;
    }

    await navigator.locks.request(REFRESH_LOCK_NAME, async () => {
        if (getLastRefreshAt() > startedAt) return;
        await runRefresh();
        markRefreshedAt(Date.now());
    });
};

/**
 * accessTokenExpiryInterceptor
 *
 * @description
 * Response interceptor that refreshes the session once (single-flight) on
 * `401 AccessTokenExpiryException` and retries queued requests; a failed refresh with
 * `403 RefreshTokenExpiryException` dispatches {@link REFRESH_TOKEN_EXPIRED_EVENT}.
 *
 * @param instance - The axios instance to retry requests against.
 * @returns The rejected-response handler for `interceptors.response.use`.
 */
export const accessTokenExpiryInterceptor = (instance: AxiosInstance) => {
    return async (error: AxiosError): Promise<AxiosResponse> => {
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
        const startedAt = Date.now();

        try {
            await runRefreshOnce(startedAt);
            processQueue(null);
            return await instance.request(originalRequest);
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
