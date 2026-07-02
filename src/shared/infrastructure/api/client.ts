import type { AxiosError, AxiosResponse } from "axios";
import HttpStatus from "http-status";
import { Api } from "@/shared/infrastructure/api/generated/116.api";
import type { IApiProblemDetails } from "@/shared/infrastructure/api/type";
import { apiErrors } from "@/shared/infrastructure/constants/api";
import { API_URL, CLIENT_APP } from "@/shared/infrastructure/constants/common";
import { accessTokenExpiryInterceptor } from "@/shared/infrastructure/interceptors/access-token-expiry.interceptor";
import { deviceIdInterceptor } from "@/shared/infrastructure/interceptors/device-id.interceptor";
import { refreshTokenExpiryInterceptor } from "@/shared/infrastructure/interceptors/refresh-token-expiry.interceptor";
import { i18n } from "@/shared/presentation/i18n/config";
import { getClientLanguage } from "@/shared/presentation/utils/getClientLanguage";

/**
 * Configured API client instance.
 *
 * @description
 * Auto-generated API client from swagger with:
 * - Dynamic Accept-Language header (request interceptor reads the active language)
 * - Client-App identification header
 * - HttpOnly cookie-based authentication (withCredentials)
 * - Response/error interceptors for normalized error handling
 */
export const apiClient = new Api({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Client-App": CLIENT_APP
    }
});

/**
 * Axios request interceptor — sets a dynamic Accept-Language header.
 *
 * @description
 * Reads the active i18n language on every request so the backend negotiates content
 * language and localised error `detail` against exactly what the UI is rendering. The
 * live `i18n.language` is the source of truth (it always reflects the active locale
 * even if `localStorage` is blocked or stale); `getClientLanguage()` is the SSR-safe
 * fallback for the pre-init window.
 */
apiClient.instance.interceptors.request.use((config) => {
    config.headers.set("Accept-Language", i18n.language || getClientLanguage());
    return config;
});

// Request: attach X-Device-Id so the backend attributes sessions per device.
apiClient.instance.interceptors.request.use(deviceIdInterceptor);

/**
 * Axios response handler — passes through successful responses.
 */
const responseHandler = (response: AxiosResponse): AxiosResponse => response;

/**
 * Axios error interceptor — handles and normalizes API errors.
 *
 * @description
 * Handles the following cases in order:
 * - 400 ValidationException: Normalize title, set detail to first error message, preserve errors array
 * - 429 responses: Parse Retry-After header, attach as retryAfter
 * - Other API errors: Map exception codes to localised titles via the active language
 * - Network errors: Return structured error with status 0
 */
const errorHandler = async (error: AxiosError<IApiProblemDetails>): Promise<never> => {
    if (error.response) {
        const problemDetails = error.response.data;

        // Normalize validation errors to first message (errors array preserved via spread)
        if (problemDetails.title === apiErrors.validation.code && problemDetails.errors?.length) {
            const normalizedError: IApiProblemDetails = {
                ...problemDetails,
                title: i18n.t(apiErrors.validation.key),
                detail: problemDetails.errors[0].errorMessage
            };
            return await Promise.reject(normalizedError);
        }

        // Parse Retry-After header for rate-limited responses
        if (error.response.status === HttpStatus.TOO_MANY_REQUESTS) {
            const retryAfterHeader = error.response.headers?.["retry-after"];
            const retryAfter = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : undefined;
            const errorType = Object.values(apiErrors).find((e) => e.code === problemDetails.title);
            const normalizedError: IApiProblemDetails = {
                ...problemDetails,
                title: errorType ? i18n.t(errorType.key) : problemDetails.title,
                retryAfter: Number.isNaN(retryAfter) ? undefined : retryAfter
            };
            return await Promise.reject(normalizedError);
        }

        // Map exception names to localised titles
        const errorType = Object.values(apiErrors).find((e) => e.code === problemDetails.title);
        const normalizedError: IApiProblemDetails = {
            ...problemDetails,
            title: errorType ? i18n.t(errorType.key) : problemDetails.title
        };

        return await Promise.reject(normalizedError);
    }

    return await Promise.reject({
        type: null,
        title: i18n.t("apiErrors.networkTitle"),
        status: 0,
        detail: i18n.t("apiErrors.networkDetail"),
        instance: error.config?.url
    } as IApiProblemDetails);
};

// Runs first: silently refreshes expired access tokens and retries the request.
apiClient.instance.interceptors.response.use(
    responseHandler,
    accessTokenExpiryInterceptor(apiClient.instance)
);
// Runs second: detects expired refresh tokens and signals the UI via a DOM event.
apiClient.instance.interceptors.response.use(responseHandler, refreshTokenExpiryInterceptor);
// Runs last: normalizes API errors into localized ProblemDetails.
apiClient.instance.interceptors.response.use(responseHandler, errorHandler);
