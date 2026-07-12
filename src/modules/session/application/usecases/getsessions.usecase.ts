import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { ISessionEntity } from "@/modules/session/domain/entities/ISessionEntity";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IGetSessionsUseCase
 *
 * @interface IGetSessionsUseCase
 * @extends {IResultUseCase<boolean, ISessionEntity[]>}
 */
interface IGetSessionsUseCase extends IResultUseCase<boolean, ISessionEntity[]> {}

/**
 * GetSessionsUseCase
 *
 * @class GetSessionsUseCase
 * @implements {IGetSessionsUseCase}
 *
 * @description
 * Lists the current user's device sessions, optionally filtered to active ones.
 */
export class GetSessionsUseCase implements IGetSessionsUseCase {
    private readonly sessionRepository: ISessionRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.sessionRepository - The session repository (injected).
     */
    constructor({ sessionRepository }: { sessionRepository: ISessionRepositoryPort }) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Executes the get-sessions use case.
     *
     * @param isActive - Optional filter for active sessions only.
     * @returns `ok(ISessionEntity[])` on success, `err(Failure)` on failure.
     */
    execute(isActive?: boolean): Promise<Result<ISessionEntity[]>> {
        return this.sessionRepository.getSessions(isActive);
    }
}
