import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IResetPasswordResponse } from "@/modules/auth/domain/entities/IResetPasswordResponse";
import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IResetPasswordUseCase
 *
 * @interface IResetPasswordUseCase
 * @extends {IResultUseCase<IResetPasswordCredentials, IResetPasswordResponse>}
 */
interface IResetPasswordUseCase
    extends IResultUseCase<IResetPasswordCredentials, IResetPasswordResponse> {}

/**
 * ResetPasswordUseCase
 *
 * @class ResetPasswordUseCase
 * @implements {IResetPasswordUseCase}
 *
 * @description
 * Sets a new password using the recovery OTP.
 */
export class ResetPasswordUseCase implements IResetPasswordUseCase {
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
     * @param credentials - The presentation credential model.
     * @returns A `Result` of the operation.
     */
    execute(credentials: IResetPasswordCredentials): Promise<Result<IResetPasswordResponse>> {
        return this.authRepository.resetPassword(credentials);
    }
}
