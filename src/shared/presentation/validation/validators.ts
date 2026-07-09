import { z } from "zod";

import { i18n } from "@/shared/presentation/i18n/config";

/**
 * Resolves an i18n key (with optional params) against the active language.
 *
 * @param key - A translation key in the `validator` namespace.
 * @param params - Optional interpolation params.
 * @returns The localized string.
 */
const translate = (key: string, params?: Record<string, unknown>): string => {
    return i18n.t(key, params) as string;
};

/**
 * Builds a lazy, field-aware zod 4 `error` callback, invoked at validation time so the
 * message is localized in the active language and names the field via its i18n label
 * key. In zod an explicit message wins over the error map, so localization lives here.
 *
 * @param key - The `validator.*` message key.
 * @param field - The i18n key of the field's label (interpolated as `{{field}}`).
 * @param params - Extra interpolation params (e.g. `{ min }`).
 * @returns A zero-arg function returning the localized message.
 */
const fieldError = (key: string, field: string, params?: Record<string, number>) => (): string =>
    translate(key, { field: translate(field), ...params });

/**
 * Shared, reusable zod field builders. Each builder takes the field's i18n label key
 * (e.g. `"auth.login.credentialsLabel"`) so its error messages name the field.
 */
export const Validators = {
    /**
     * A required, non-empty string.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema requiring at least one character.
     */
    required: (field: string) =>
        z.string().min(1, { error: fieldError("validator.required", field) }),

    /**
     * A required, valid email address.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema requiring a non-empty, well-formed email.
     */
    email: (field: string) =>
        z
            .string()
            .min(1, { error: fieldError("validator.required", field) })
            .pipe(z.email({ error: fieldError("validator.email", field) })),

    /**
     * A string within an inclusive length range.
     *
     * @param field - The field's i18n label key, named in the message.
     * @param min - Minimum length.
     * @param max - Maximum length.
     * @returns A zod string schema bounded by `min`/`max`.
     */
    minMax: (field: string, min: number, max: number) =>
        z
            .string()
            .min(min, { error: fieldError("validator.minLength", field, { min }) })
            .max(max, { error: fieldError("validator.maxLength", field, { max }) }),

    /**
     * A strong password: at least 6 characters with at least one lowercase, one
     * uppercase, and one digit (mobile parity). All failures surface the single
     * `validator.passwordStrength` message so the policy is described once.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema enforcing the password policy.
     */
    password: (field: string) =>
        z
            .string()
            .min(6, { error: fieldError("validator.passwordStrength", field, { min: 6 }) })
            .regex(/[a-z]/, { error: fieldError("validator.passwordStrength", field, { min: 6 }) })
            .regex(/[A-Z]/, { error: fieldError("validator.passwordStrength", field, { min: 6 }) })
            .regex(/\d/, { error: fieldError("validator.passwordStrength", field, { min: 6 }) }),

    /**
     * A 6-digit numeric one-time code.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema requiring exactly six digits.
     */
    otp: (field: string) =>
        z.string().regex(/^\d{6}$/, { error: fieldError("validator.otp", field) })
} as const;

/**
 * Adds a cross-field equality refinement (e.g. confirm-password must equal
 * password), attaching the field-aware `validator.mustMatch` message to `field`.
 *
 * @param schema - The object schema to refine.
 * @param field - The field that must match (where the error is attached).
 * @param other - The field it must equal.
 * @param label - The i18n label key of `field`, named in the message.
 * @returns The refined schema.
 */
export function matches<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    field: keyof T & string,
    other: keyof T & string,
    label: string
) {
    return schema.refine(
        (value) => {
            const record = value as Record<string, unknown>;
            return record[field] === record[other];
        },
        {
            path: [field],
            error: fieldError("validator.mustMatch", label)
        }
    );
}
