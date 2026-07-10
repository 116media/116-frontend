import type { AuthView } from "@/modules/auth/presentation/context/AuthModalProvider";

/**
 * The i18n title + subtitle key for each auth view. `as const satisfies` keeps the keys
 * literal (so the typed `t()` accepts them) while ensuring every view is covered.
 */
export const VIEW_TITLES = {
    login: { title: "auth.login.title", subtitle: "auth.login.subtitle" },
    signup: { title: "auth.signup.title", subtitle: "auth.signup.subtitle" },
    "verify-otp": { title: "auth.otp.title", subtitle: "auth.otp.subtitle" },
    "forgot-password": {
        title: "auth.password.forgotTitle",
        subtitle: "auth.password.forgotSubtitle"
    },
    "reset-password": { title: "auth.password.resetTitle", subtitle: "auth.password.resetSubtitle" }
} as const satisfies Record<AuthView, { title: string; subtitle: string }>;
