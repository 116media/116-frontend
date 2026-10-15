import { z } from "zod";

import { Validators } from "@/shared/presentation/validation/validators";

/**
 * Newsletter sign-up schema — a valid email address.
 */
export const subscribeNewsletterSchema = z.object({
    email: Validators.email("newsletter.card.emailLabel")
});
