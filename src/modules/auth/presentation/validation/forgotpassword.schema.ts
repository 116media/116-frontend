import { z } from "zod";

import { Validators } from "@/shared/presentation/validation/validators";

/**
 * Forgot-password form schema — a valid account email.
 */
export const forgotPasswordSchema = z.object({
    email: Validators.email("auth.password.emailLabel")
});
