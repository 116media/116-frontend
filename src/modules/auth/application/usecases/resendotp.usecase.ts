import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IResendOtpResponse } from "@/modules/auth/domain/entities/IResendOtpResponse";
import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * IResendOtpUseCase
 *
 * @interface IResendOtpUseCase
 * @extends {IResultUseCase<IResendOtpCredentials, IResendOtpResponse>}
 */
interface IResendOtpUseCase extends IResultUseCase<IResendOtpCredentials, IResendOtpResponse> {}

/**
 * ResendOtpUseCase
 *
 * @class ResendOtpUseCase
 * @implements {IResendOtpUseCase}
 *
 * @description
 * Re-sends an OTP for the given purpose.
 */
export class ResendOtpUseCase implements IResendOtpUseCase {
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
    execute(credentials: IResendOtpCredentials): Promise<Result<IResendOtpResponse>> {
        return this.authRepository.resendOtp(credentials);
    }
}
