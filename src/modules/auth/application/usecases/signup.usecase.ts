import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISignupUseCase
 *
 * @interface ISignupUseCase
 * @extends {IResultUseCase<ISignupCredentials, IAuthResponse>}
 */
interface ISignupUseCase extends IResultUseCase<ISignupCredentials, IAuthResponse> {}

/**
 * SignupUseCase
 *
 * @class SignupUseCase
 * @implements {ISignupUseCase}
 *
 * @description
 * Registers a new account; the user is returned unverified pending email verification.
 */
export class SignupUseCase implements ISignupUseCase {
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
    execute(credentials: ISignupCredentials): Promise<Result<IAuthResponse>> {
        return this.authRepository.signup(credentials);
    }
}
