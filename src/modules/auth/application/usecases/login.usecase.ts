import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * ILoginUseCase
 *
 * @interface ILoginUseCase
 * @extends {IResultUseCase<ILoginCredentials, IAuthResponse>}
 */
interface ILoginUseCase extends IResultUseCase<ILoginCredentials, IAuthResponse> {}

/**
 * LoginUseCase
 *
 * @class LoginUseCase
 * @implements {ILoginUseCase}
 *
 * @description
 * Logs a user in with credentials (email or username) + password; tokens are set by the backend as cookies.
 */
export class LoginUseCase implements ILoginUseCase {
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
    execute(credentials: ILoginCredentials): Promise<Result<IAuthResponse>> {
        return this.authRepository.login(credentials);
    }
}
