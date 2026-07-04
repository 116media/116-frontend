/**
 * Account tab strings — sign out and sign out from all devices.
 */
export const account = {
    title: "Compte",
    subtitle: "Gérez la déconnexion de vos appareils.",
    signOut: {
        title: "Se déconnecter",
        description: "Se déconnecter de cet appareil.",
        action: "Se déconnecter"
    },
    signOutAll: {
        title: "Déconnexion de tous les appareils",
        description: "Vous serez déconnecté de tous les appareils.",
        action: "Se déconnecter",
        confirmTitle: "Se déconnecter de tous les appareils ?",
        confirmDescription:
            "Cela met fin à toutes les sessions actives, y compris celle-ci. Vous devrez vous reconnecter partout."
    }
} as const;
