import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { SubscribeNewsletterUseCase } from "@/modules/newsletter/application/usecases/subscribenewsletter.usecase";
import { NewsletterRepositoryImpl } from "@/modules/newsletter/infrastructure/repositories/newsletter.repository.impl";

/**
 * Registers newsletter module dependencies in the Awilix container.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerNewsletterDependencies(container: AwilixContainer): void {
    container.register({
        newsletterRepository: asClass(NewsletterRepositoryImpl).scoped(),
        subscribeNewsletterUseCase: asClass(SubscribeNewsletterUseCase).transient()
    });
}
