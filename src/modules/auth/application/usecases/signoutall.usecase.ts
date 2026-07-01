import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { ISignOutAllResponse } from "@/modules/auth/domain/entities/ISignOutAllResponse";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISignOutAllUseCase
 *
 * @interface ISignOutAllUseCase
 * @extends {IResultUseCase<void, ISignOutAllResponse>}
 */
interface ISignOutAllUseCase extends IResultUseCase<void, ISignOutAllResponse> {}

/**
 * SignOutAllUseCase
 *
 * @class SignOutAllUseCase
 * @implements {ISignOutAllUseCase}
 *
 * @description
 * Signs out every session for the user.
 */
export class SignOutAllUseCase implements ISignOutAllUseCase {
    private readonly authRepository: IAuthRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.authRepository - The auth repository (injected).
     */
    constructor({ authRepository }: { authRepository: IAuthRepositoryPort }) {
        this.authRepository = authRepository;
    }

    /**
     * Executes the use case.
     * @returns A `Result` of the operation.
     */
    execute(): Promise<Result<ISignOutAllResponse>> {
        return this.authRepository.signOutAll();
    }
}
