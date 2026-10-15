import type { Result } from "@/shared/domain/results/result";

/**
 * INewsletterRepositoryPort
 *
 * @description
 * Application-layer contract for the public newsletter surface.
 *
 * @interface INewsletterRepositoryPort
 */
export interface INewsletterRepositoryPort {
    /**
     * Subscribes an email address to the newsletter. The API answers with a
     * confirmation mail rather than an active subscription.
     *
     * @param email - The address to subscribe.
     * @returns `ok(true)` once the request is accepted, `err(Failure)` on failure.
     */
    subscribe(email: string): Promise<Result<boolean>>;
}
