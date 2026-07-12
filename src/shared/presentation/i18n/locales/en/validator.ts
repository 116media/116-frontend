/**
 * validator (en)
 *
 * @description
 * English validation messages, resolved at validation time. Every message names its
 * field via the `{{field}}` interpolation (the localized field label supplied by
 * `Validators`). Must stay key-complete with the French mirror.
 */
export const validator = {
    required: "{{field}} is required",
    email: "{{field}} must be a valid email address",
    invalid: "{{field}} is invalid",
    minLength: "{{field}} must be at least {{min}} characters",
    maxLength: "{{field}} must be at most {{max}} characters",
    passwordStrength:
        "{{field}} must be at least {{min}} characters with an uppercase, a lowercase and a number",
    otp: "{{field}} must be a 6-digit code",
    mustMatch: "{{field}} does not match"
} as const;
