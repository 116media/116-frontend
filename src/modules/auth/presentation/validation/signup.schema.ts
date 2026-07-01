import { z } from "zod";

import { Validators } from "@/shared/presentation/validation/validators";

/**
 * Signup form schema — valid email, username 3–20, strong password.
 */
export const signupSchema = z.object({
    email: Validators.email("auth.signup.emailLabel"),
    userName: Validators.minMax("auth.signup.userNameLabel", 3, 20),
    password: Validators.password("auth.signup.passwordLabel")
});
