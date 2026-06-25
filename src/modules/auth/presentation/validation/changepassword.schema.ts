import { z } from "zod";

import { matches, Validators } from "@/shared/presentation/validation/validators";

/**
 * Change-password form schema (later Settings page) — current password, a strong
 * new password, and a matching confirmation.
 */
export const changePasswordSchema = matches(
    z.object({
        oldPassword: Validators.required("auth.password.oldPasswordLabel"),
        newPassword: Validators.password("auth.password.newPasswordLabel"),
        confirmPassword: Validators.required("auth.password.confirmPasswordLabel")
    }),
    "confirmPassword",
    "newPassword",
    "auth.password.confirmPasswordLabel"
);
