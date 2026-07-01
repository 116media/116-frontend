import type { IRevokeSessionResponse } from "@/modules/auth/domain/entities/IRevokeSessionResponse";
import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IRevokeSessionUseCase
 *
 * @interface IRevokeSessionUseCase
 * @extends {IResultUseCase<string, IRevokeSessionResponse>}
 */
interface IRevokeSessionUseCase extends IResultUseCase<string, IRevokeSessionResponse> {}

/**
 * RevokeSessionUseCase
 *
 * @class RevokeSessionUseCase
 * @implements {IRevokeSessionUseCase}
 *
 * @description
 * Revokes a single device session, disconnecting that device.
 */
export class RevokeSessionUseCase implements IRevokeSessionUseCase {
    private readonly sessionRepository: ISessionRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.sessionRepository - The session repository (injected).
     */
    constructor({ sessionRepository }: { sessionRepository: ISessionRepositoryPort }) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Executes the revoke-session use case.
     *
     * @param id - The session id to revoke.
     * @returns `ok(IRevokeSessionResponse)` on success, `err(Failure)` on failure.
     */
    execute(id: string): Promise<Result<IRevokeSessionResponse>> {
        return this.sessionRepository.revokeSession(id);
    }
}
