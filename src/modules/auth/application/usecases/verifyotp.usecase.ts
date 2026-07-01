import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IVerifyOtpResponse } from "@/modules/auth/domain/entities/IVerifyOtpResponse";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IVerifyOtpUseCase
 *
 * @interface IVerifyOtpUseCase
 * @extends {IResultUseCase<IVerifyOtpCredentials, IVerifyOtpResponse>}
 */
interface IVerifyOtpUseCase extends IResultUseCase<IVerifyOtpCredentials, IVerifyOtpResponse> {}

/**
 * VerifyOtpUseCase
 *
 * @class VerifyOtpUseCase
 * @implements {IVerifyOtpUseCase}
 *
 * @description
 * Verifies a one-time code for the given purpose.
 */
export class VerifyOtpUseCase implements IVerifyOtpUseCase {
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
    execute(credentials: IVerifyOtpCredentials): Promise<Result<IVerifyOtpResponse>> {
        return this.authRepository.verifyOtp(credentials);
    }
}
