/**
 * apiErrors (fr)
 *
 * @description
 * Localised titles and details for API error handling. Covers the network-error fallback
 * and the backend exception titles mapped in shared/infrastructure/constants/api.ts. The API
 * client resolves these keys to the active language at the moment an error is handled.
 */
export const apiErrors = {
    networkTitle: "Erreur réseau",
    networkDetail: "Une erreur réseau est survenue. Veuillez vérifier votre connexion.",
    validation: "Validation",
    authentication: "Authentification",
    authorization: "Autorisation",
    notFound: "Introuvable",
    resourceNotFound: "Ressource introuvable",
    conflict: "Conflit",
    badRequest: "Requête Invalide",
    invalidFormat: "Format invalide",
    formatException: "Format invalide",
    methodNotAllowed: "Méthode non autorisée",
    otpAttemptsLimit: "Limite atteinte",
    otpExpiration: "Expiré",
    rateLimitExceeded: "Limite de requêtes atteinte",
    accessDenied: "Accès refusé",
    accessTokenExpiry: "Session expirée",
    refreshTokenExpiry: "Session expirée",
    accountNotVerified: "Compte non vérifié",
    accountInactive: "Compte inactif",
    internalServer: "Erreur interne du serveur",
    internalServerError: "Erreur interne du serveur",
    badGateway: "Erreur de passerelle"
} as const;
