import type { INewsletterRepositoryPort } from "@/modules/newsletter/application/repositories/newsletter.repository.port";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * NewsletterRepositoryImpl
 *
 * @description
 * Implements the newsletter port over the generated API client.
 */
export class NewsletterRepositoryImpl implements INewsletterRepositoryPort {
    private readonly api: Api<unknown>["api"];

    /**
     * @param apiClient - The generated API client (injected).
     */
    constructor({ apiClient }: { apiClient: Api<unknown> }) {
        this.api = apiClient.api;
    }

    async subscribe(email: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicSubscribeNewsletter({ email });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
