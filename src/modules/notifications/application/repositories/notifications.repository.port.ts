import type { Result } from "@/shared/domain/results/result";

/**
 * INotificationsRepositoryPort
 *
 * @description
 * Application-layer contract for the caller's notification surface.
 *
 * @interface INotificationsRepositoryPort
 */
export interface INotificationsRepositoryPort {
    /**
     * Reads how many notifications the caller has not yet read.
     *
     * @returns `ok(count)` on success, `err(Failure)` on failure.
     */
    getUnreadCount(): Promise<Result<number>>;
}
