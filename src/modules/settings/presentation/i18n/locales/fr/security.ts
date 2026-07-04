/**
 * Security tab strings — change password and active sessions.
 */
export const security = {
    title: "Sécurité",
    subtitle: "Gérez votre mot de passe et vos sessions actives.",
    password: {
        title: "Changer le mot de passe",
        subtitle: "Mettez à jour votre mot de passe pour sécuriser votre compte.",
        current: "Mot de passe actuel",
        new: "Nouveau mot de passe",
        confirm: "Confirmer le mot de passe",
        submit: "Mettre à jour"
    },
    sessions: {
        title: "Sessions actives",
        subtitle: "Appareils actuellement connectés à votre compte.",
        count: "{{count}} session(s)",
        current: "Ce navigateur",
        expired: "Expiré",
        revoke: "Révoquer",
        revokeTitle: "Révoquer la session",
        revokeDescription:
            "Êtes-vous sûr de vouloir révoquer cette session ? L'appareil sera déconnecté immédiatement.",
        empty: "Aucune session active.",
        unknownIp: "—"
    }
} as const;
