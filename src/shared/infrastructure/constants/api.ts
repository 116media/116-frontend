/**
 * API error code mappings.
 *
 * @description
 * Maps backend exception types (ProblemDetails `title` field) to translation keys in the
 * `apiErrors` namespace; the API client resolves the key against the active language.
 */
export const apiErrors = {
    validation: { code: "ValidationException", key: "apiErrors.validation" },
    authentication: { code: "AuthenticationException", key: "apiErrors.authentication" },
    authorization: { code: "AuthorizationException", key: "apiErrors.authorization" },
    notFound: { code: "NotFoundException", key: "apiErrors.notFound" },
    resourceNotFound: { code: "ResourceNotFoundException", key: "apiErrors.resourceNotFound" },
    conflict: { code: "ConflictException", key: "apiErrors.conflict" },
    badRequest: { code: "BadRequestException", key: "apiErrors.badRequest" },
    invalidFormat: { code: "InvalidFormatException", key: "apiErrors.invalidFormat" },
    formatException: { code: "FormatException", key: "apiErrors.formatException" },
    methodNotAllowed: { code: "MethodNotAllowedException", key: "apiErrors.methodNotAllowed" },
    otpAttemptsLimit: { code: "OtpAttemptsLimitException", key: "apiErrors.otpAttemptsLimit" },
    otpExpiration: { code: "OtpExpirationException", key: "apiErrors.otpExpiration" },
    rateLimitExceeded: { code: "RateLimitExceededException", key: "apiErrors.rateLimitExceeded" },
    accessDenied: { code: "AccessDeniedException", key: "apiErrors.accessDenied" },
    accessTokenExpiry: { code: "AccessTokenExpiryException", key: "apiErrors.accessTokenExpiry" },
    refreshTokenExpiry: {
        code: "RefreshTokenExpiryException",
        key: "apiErrors.refreshTokenExpiry"
    },
    accountNotVerified: {
        code: "AccountNotVerifiedException",
        key: "apiErrors.accountNotVerified"
    },
    accountInactive: { code: "AccountInactiveException", key: "apiErrors.accountInactive" },
    internalServer: { code: "InternalServerException", key: "apiErrors.internalServer" },
    internalServerError: { code: "InternalServerError", key: "apiErrors.internalServerError" },
    badGateway: { code: "BadGatewayException", key: "apiErrors.badGateway" }
} as const;
