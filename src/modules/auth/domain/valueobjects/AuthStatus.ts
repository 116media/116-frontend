/**
 * AuthStatus
 *
 * @description
 * The derived authentication status of the current visitor.
 */
export type AuthStatus = "loading" | "guest" | "unverified" | "authenticated";

/**
 * Whether the status grants full (verified) access.
 *
 * @param status - The current auth status.
 * @returns True only when authenticated and verified.
 */
export const isAuthenticatedStatus = (status: AuthStatus): boolean => status === "authenticated";

/**
 * Whether the status requires email verification before protected access.
 *
 * @param status - The current auth status.
 * @returns True when logged in but unverified.
 */
export const needsVerification = (status: AuthStatus): boolean => status === "unverified";
