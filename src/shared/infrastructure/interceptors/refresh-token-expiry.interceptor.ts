import type { AxiosError } from "axios";
import HttpStatus from "http-status";

import { apiErrors } from "@/shared/infrastructure/constants/api";

/**
 * Window event dispatched when the refresh token itself has expired.
 */
export const REFRESH_TOKEN_EXPIRED_EVENT = "refresh-token-expired";

/**
 * refreshTokenExpiryInterceptor
 *
 * @description
 * Response error interceptor that dispatches {@link REFRESH_TOKEN_EXPIRED_EVENT} on
 * `403 RefreshTokenExpiryException` so the presentation layer can drop to guest.
 * Runs after the access-token-expiry interceptor, so a normal refresh is attempted first.
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
