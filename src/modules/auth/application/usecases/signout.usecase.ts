import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { ISignOutResponse } from "@/modules/auth/domain/entities/ISignOutResponse";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISignOutUseCase
 *
 * @interface ISignOutUseCase
 * @extends {IResultUseCase<void, ISignOutResponse>}
 */
interface ISignOutUseCase extends IResultUseCase<void, ISignOutResponse> {}

/**
 * SignOutUseCase
 *
 * @class SignOutUseCase
 * @implements {ISignOutUseCase}
 *
 * @description
 * Signs out the current session; the backend expires the cookies.
 */
export class SignOutUseCase implements ISignOutUseCase {
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
    execute(): Promise<Result<ISignOutResponse>> {
        return this.authRepository.signOut();
    }
}
