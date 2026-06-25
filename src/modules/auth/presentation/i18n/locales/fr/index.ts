import { common } from "@/modules/auth/presentation/i18n/locales/fr/common";
import { errors } from "@/modules/auth/presentation/i18n/locales/fr/errors";
import { login } from "@/modules/auth/presentation/i18n/locales/fr/login";
import { otp } from "@/modules/auth/presentation/i18n/locales/fr/otp";
import { password } from "@/modules/auth/presentation/i18n/locales/fr/password";
import { session } from "@/modules/auth/presentation/i18n/locales/fr/session";
import { signup } from "@/modules/auth/presentation/i18n/locales/fr/signup";

/**
 * fr
 *
 * @description
 * Mirror français du catalogue d'authentification. Doit contenir exactement les
 * mêmes clés que l'anglais.
 */
export const fr = {
    common,
    login,
    signup,
    otp,
    password,
    session,
    errors
} as const;
