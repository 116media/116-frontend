import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { GetUnreadNotificationCountUseCase } from "@/modules/notifications/application/usecases/getunreadnotificationcount.usecase";
import { NotificationsRepositoryImpl } from "@/modules/notifications/infrastructure/repositories/notifications.repository.impl";

/**
 * Registers notification module dependencies in the Awilix container.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerNotificationsDependencies(container: AwilixContainer): void {
    container.register({
        notificationsRepository: asClass(NotificationsRepositoryImpl).singleton(),
        getUnreadNotificationCountUseCase: asClass(GetUnreadNotificationCountUseCase).transient()
    });
}
