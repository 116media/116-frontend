/**
 * API error code mappings.
 *
 * @description
 * Maps backend exception types (ProblemDetails `title` field) to
 * user-friendly error titles in French.
 *
 * Used by the API client error handler to normalize error responses.
 */
export const apiErrors = {
    validation: { code: "ValidationException", title: "Validation" },
    authentication: { code: "AuthenticationException", title: "Authentification" },
    authorization: { code: "AuthorizationException", title: "Autorisation" },
    notFound: { code: "NotFoundException", title: "Introuvable" },
    resourceNotFound: { code: "ResourceNotFoundException", title: "Ressource introuvable" },
    conflict: { code: "ConflictException", title: "Conflit" },
    badRequest: { code: "BadRequestException", title: "Requête Invalide" },
    invalidFormat: { code: "InvalidFormatException", title: "Format invalide" },
    formatException: { code: "FormatException", title: "Format invalide" },
    methodNotAllowed: { code: "MethodNotAllowedException", title: "Méthode non autorisée" },
    otpAttemptsLimit: { code: "OtpAttemptsLimitException", title: "Limite atteinte" },
    otpExpiration: { code: "OtpExpirationException", title: "Expiré" },
    rateLimitExceeded: { code: "RateLimitExceededException", title: "Limite de requêtes atteinte" },
    accessDenied: { code: "AccessDeniedException", title: "Accès refusé" },
    accessTokenExpiry: { code: "AccessTokenExpiryException", title: "Session expirée" },
    refreshTokenExpiry: { code: "RefreshTokenExpiryException", title: "Session expirée" },
    accountNotVerified: { code: "AccountNotVerifiedException", title: "Compte non vérifié" },
    accountInactive: { code: "AccountInactiveException", title: "Compte inactif" },
    internalServer: { code: "InternalServerException", title: "Erreur interne du serveur" },
    internalServerError: { code: "InternalServerError", title: "Erreur interne du serveur" },
    badGateway: { code: "BadGatewayException", title: "Erreur de passerelle" }
} as const;
