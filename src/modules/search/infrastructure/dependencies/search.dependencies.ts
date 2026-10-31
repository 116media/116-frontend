import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { SearchContentUseCase } from "@/modules/search/application/usecases/searchcontent.usecase";
import { SearchRepositoryImpl } from "@/modules/search/infrastructure/repositories/search.repository.impl";

/**
 * Registers search module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as scoped and the use case as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerSearchDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        searchRepository: asClass(SearchRepositoryImpl).scoped(),

        // Queries
        searchContentUseCase: asClass(SearchContentUseCase).transient()
    });
}
