import type { INewsletterRepositoryPort } from "@/modules/newsletter/application/repositories/newsletter.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ISubscribeNewsletterUseCase
 * @extends {IResultUseCase<string, boolean>}
 */
interface ISubscribeNewsletterUseCase extends IResultUseCase<string, boolean> {}

/**
 * Use case for subscribing an email address to the newsletter.
 *
 * @class SubscribeNewsletterUseCase
 * @implements {ISubscribeNewsletterUseCase}
 */
export class SubscribeNewsletterUseCase implements ISubscribeNewsletterUseCase {
    private readonly newsletterRepository: INewsletterRepositoryPort;

    /**
     * @param newsletterRepository - Repository for newsletter operations (injected)
     */
    constructor({ newsletterRepository }: { newsletterRepository: INewsletterRepositoryPort }) {
        this.newsletterRepository = newsletterRepository;
    }

    /**
     * Executes the subscribe use case.
     *
     * @param email - The address to subscribe.
     * @returns {Promise<Result<boolean>>} `ok(boolean)` on success, `err(Failure)` on failure
     */
    async execute(email: string): Promise<Result<boolean>> {
        return this.newsletterRepository.subscribe(email);
    }
}
