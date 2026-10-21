import type { INotificationsRepositoryPort } from "@/modules/notifications/application/repositories/notifications.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IGetUnreadNotificationCountUseCase
 * @extends {IResultUseCase<void, number>}
 */
interface IGetUnreadNotificationCountUseCase extends IResultUseCase<void, number> {}

/**
 * Use case for reading the caller's unread notification count.
 *
 * @class GetUnreadNotificationCountUseCase
 * @implements {IGetUnreadNotificationCountUseCase}
 */
export class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationCountUseCase {
    private readonly notificationsRepository: INotificationsRepositoryPort;

    /**
     * @param notificationsRepository - Repository for notification operations (injected)
     */
    constructor({
        notificationsRepository
    }: {
        notificationsRepository: INotificationsRepositoryPort;
    }) {
        this.notificationsRepository = notificationsRepository;
    }

    /**
     * Executes the unread-count use case.
     *
     * @returns {Promise<Result<number>>} `ok(count)` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<number>> {
        return this.notificationsRepository.getUnreadCount();
    }
}
