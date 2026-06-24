import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import HttpStatus from "http-status";

import type { IApiProblemDetails } from "@/shared/infrastructure/api/type";
import { apiErrors } from "@/shared/infrastructure/constants/api";
import { REFRESH_TOKEN_EXPIRED_EVENT } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";

/** An original request, tagged so a single retry can never loop. */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

/** Whether a refresh call is currently in flight (single-flight guard). */
let isRefreshing = false;

/** Requests that 401'd while a refresh was in progress; replayed on success. */
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
 * is imported lazily (dynamic `import`) to avoid a static cycle between this module
 * and the API client (the container registers `apiClient`); by the time a 401 fires,
 * every module is fully initialized.
 *
 * @returns Resolves on success, rejects on failure.
 */
const runRefresh = async (): Promise<void> => {
    const { default: container } = await import("@/shared/infrastructure/service.locator");
    await container.cradle.refreshTokenUseCase.execute();
};

/**
 * accessTokenExpiryInterceptor
 *
 * @description
 * Creates the access-token-expiry response interceptor bound to `instance`. On
 * `401 AccessTokenExpiryException`, refreshes the session once (single-flight) while
 * queueing concurrent 401s, then retries the original request(s). If the refresh
 * fails with a `403 RefreshTokenExpiryException`, dispatches
 * {@link REFRESH_TOKEN_EXPIRED_EVENT}. Runs BEFORE the error handler so it gets first
 * chance at 401s. The `_retry` flag prevents loops.
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

        try {
            await runRefresh();
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
