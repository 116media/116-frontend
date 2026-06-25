import { common } from "@/modules/auth/presentation/i18n/locales/en/common";
import { errors } from "@/modules/auth/presentation/i18n/locales/en/errors";
import { login } from "@/modules/auth/presentation/i18n/locales/en/login";
import { otp } from "@/modules/auth/presentation/i18n/locales/en/otp";
import { password } from "@/modules/auth/presentation/i18n/locales/en/password";
import { session } from "@/modules/auth/presentation/i18n/locales/en/session";
import { signup } from "@/modules/auth/presentation/i18n/locales/en/signup";

/**
 * en
 *
 * @description
 * English translation catalog for the auth module. Nested under the `auth` key by
 * the composition root, so keys resolve as `t("auth.login.title")`. Must stay
 * key-aligned with the French mirror.
 */
export const en = {
    common,
    login,
    signup,
    otp,
    password,
    session,
    errors
} as const;
