/**
 * Account tab strings — sign out and sign out from all devices.
 */
export const account = {
    title: "Account",
    subtitle: "Manage signing out of your devices.",
    signOut: {
        title: "Sign out",
        description: "Sign out of this device.",
        action: "Sign out"
    },
    signOutAll: {
        title: "Sign out from all devices",
        description: "You will be signed out everywhere.",
        action: "Sign out",
        confirmTitle: "Sign out from all devices?",
        confirmDescription:
            "This ends every active session, including this one. You'll need to sign in again everywhere."
    }
} as const;
