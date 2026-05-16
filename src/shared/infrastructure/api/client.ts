import type { AxiosError, AxiosResponse } from "axios";
import HttpStatus from "http-status";
import { Api } from "@/shared/infrastructure/api/generated/116.api";
import type { IApiProblemDetails } from "@/shared/infrastructure/api/type";
import { apiErrors } from "@/shared/infrastructure/constants/api";
import { API_URL, CLIENT_APP } from "@/shared/infrastructure/constants/common";

/**
 * Configured API client instance.
 *
 * @description
 * Auto-generated API client from swagger with:
 * - French language header
 * - Client-App identification header
 * - HttpOnly cookie-based authentication (withCredentials)
 * - Response/error interceptors for normalized error handling
 */
export const apiClient = new Api({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Accept-Language": "fr",
        "Client-App": CLIENT_APP
    }
});

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
 * - Other API errors: Map exception codes to user-friendly French titles
 * - Network errors: Return structured error with status 0
 */
const errorHandler = async (error: AxiosError<IApiProblemDetails>): Promise<never> => {
    if (error.response) {
        const problemDetails = error.response.data;

        // Normalize validation errors to first message (errors array preserved via spread)
        if (problemDetails.title === apiErrors.validation.code && problemDetails.errors?.length) {
            const normalizedError: IApiProblemDetails = {
                ...problemDetails,
                title: apiErrors.validation.title,
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
                title: errorType?.title || problemDetails.title,
                retryAfter: Number.isNaN(retryAfter) ? undefined : retryAfter
            };
            return await Promise.reject(normalizedError);
        }

        // Map exception names to user-friendly titles
        const errorType = Object.values(apiErrors).find((e) => e.code === problemDetails.title);
        const normalizedError: IApiProblemDetails = {
            ...problemDetails,
            title: errorType?.title || problemDetails.title
        };

        return await Promise.reject(normalizedError);
    }

    return await Promise.reject({
        type: null,
        title: "Erreur réseau",
        status: 0,
        detail: "Une erreur réseau est survenue. Veuillez vérifier votre connexion.",
        instance: error.config?.url
    } as IApiProblemDetails);
};

apiClient.instance.interceptors.response.use(responseHandler, errorHandler);
