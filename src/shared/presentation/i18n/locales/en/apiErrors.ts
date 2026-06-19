/**
 * apiErrors (en)
 *
 * @description
 * English mirror of the apiErrors namespace. Must contain the exact same keys as fr.
 */
export const apiErrors = {
    networkTitle: "Network error",
    networkDetail: "A network error occurred. Please check your connection.",
    validation: "Validation",
    authentication: "Authentication",
    authorization: "Authorization",
    notFound: "Not found",
    resourceNotFound: "Resource not found",
    conflict: "Conflict",
    badRequest: "Invalid request",
    invalidFormat: "Invalid format",
    formatException: "Invalid format",
    methodNotAllowed: "Method not allowed",
    otpAttemptsLimit: "Limit reached",
    otpExpiration: "Expired",
    rateLimitExceeded: "Rate limit exceeded",
    accessDenied: "Access denied",
    accessTokenExpiry: "Session expired",
    refreshTokenExpiry: "Session expired",
    accountNotVerified: "Account not verified",
    accountInactive: "Account inactive",
    internalServer: "Internal server error",
    internalServerError: "Internal server error",
    badGateway: "Gateway error"
} as const;
