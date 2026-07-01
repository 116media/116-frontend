import { z } from "zod";

import { matches, Validators } from "@/shared/presentation/validation/validators";

/**
 * Reset-password form schema — a strong new password and a matching confirmation.
 * The email + verified OTP code come from the modal context (set by the earlier
 * verify-otp step), not from this form.
 */
export const resetPasswordSchema = matches(
    z.object({
        newPassword: Validators.password("auth.password.newPasswordLabel"),
        confirmPassword: Validators.required("auth.password.confirmPasswordLabel")
    }),
    "confirmPassword",
    "newPassword",
    "auth.password.confirmPasswordLabel"
);
