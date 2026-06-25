import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { GetSessionsUseCase } from "@/modules/session/application/usecases/getsessions.usecase";
import { RefreshTokenUseCase } from "@/modules/session/application/usecases/refresh-token.usecase";
import { RevokeSessionUseCase } from "@/modules/session/application/usecases/revokesession.usecase";
import { SessionRepositoryImpl } from "@/modules/session/infrastructure/repositories/session.repository.impl";

/**
 * Registers session module dependencies in the Awilix container.
 *
 * @description
 * Registers the session repository as a singleton and the session use cases as
 * transient. Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerSessionDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        sessionRepository: asClass(SessionRepositoryImpl).singleton(),

        // Use cases
        refreshTokenUseCase: asClass(RefreshTokenUseCase).transient(),
        getSessionsUseCase: asClass(GetSessionsUseCase).transient(),
        revokeSessionUseCase: asClass(RevokeSessionUseCase).transient()
    });
}
