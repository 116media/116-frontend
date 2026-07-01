import type { ISession } from "@/modules/auth/domain/entities/ISession";
import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IGetSessionsUseCase
 *
 * @interface IGetSessionsUseCase
 * @extends {IResultUseCase<boolean, ISession[]>}
 */
interface IGetSessionsUseCase extends IResultUseCase<boolean, ISession[]> {}

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
     * @returns `ok(ISession[])` on success, `err(Failure)` on failure.
     */
    execute(isActive?: boolean): Promise<Result<ISession[]>> {
        return this.sessionRepository.getSessions(isActive);
    }
}
