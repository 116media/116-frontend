import type { INotificationsRepositoryPort } from "@/modules/notifications/application/repositories/notifications.repository.port";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * NotificationsRepositoryImpl
 *
 * @description
 * Implements the notifications port over the generated API client.
 */
export class NotificationsRepositoryImpl implements INotificationsRepositoryPort {
    private readonly api: Api<unknown>["api"];

    /**
     * @param apiClient - The generated API client (injected).
     */
    constructor({ apiClient }: { apiClient: Api<unknown> }) {
        this.api = apiClient.api;
    }

    async getUnreadCount(): Promise<Result<number>> {
        try {
            const response = await this.api.publicGetUnreadNotificationCount();
            return ok(response.data.count);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
