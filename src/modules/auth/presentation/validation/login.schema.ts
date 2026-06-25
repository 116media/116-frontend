import { z } from "zod";

import { Validators } from "@/shared/presentation/validation/validators";

/**
 * Login form schema — credentials present (email OR username, no length/format
 * checks, matching the backend's presence-only rule) + a present password.
 */
export const loginSchema = z.object({
    credentials: Validators.required("auth.login.credentialsLabel"),
    password: Validators.required("auth.login.passwordLabel")
});
