/**
 * Security tab strings — change password and active sessions.
 */
export const security = {
    title: "Security",
    subtitle: "Manage your password and your active sessions.",
    password: {
        title: "Change password",
        subtitle: "Update your password to keep your account secure.",
        current: "Current password",
        new: "New password",
        confirm: "Confirm password",
        submit: "Update"
    },
    sessions: {
        title: "Active sessions",
        subtitle: "Devices currently connected to your account.",
        count: "{{count}} session(s)",
        current: "This device",
        expired: "Expired",
        revoke: "Revoke",
        revokeTitle: "Revoke this session?",
        revokeDescription: "The device will be signed out immediately.",
        empty: "No active sessions.",
        unknownIp: "—"
    }
} as const;
