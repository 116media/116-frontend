import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IForgotPasswordUseCase
 *
 * @interface IForgotPasswordUseCase
 * @extends {IResultUseCase<IForgotPasswordCredentials, IForgotPasswordResponse>}
 */
interface IForgotPasswordUseCase
    extends IResultUseCase<IForgotPasswordCredentials, IForgotPasswordResponse> {}

/**
 * ForgotPasswordUseCase
 *
 * @class ForgotPasswordUseCase
 * @implements {IForgotPasswordUseCase}
 *
 * @description
 * Requests a password-recovery OTP for an account email.
 */
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
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
    execute(credentials: IForgotPasswordCredentials): Promise<Result<IForgotPasswordResponse>> {
        return this.authRepository.forgotPassword(credentials);
    }
}
