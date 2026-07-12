import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface ISocialLoginUseCase
 * @extends {IResultUseCase<ISocialLoginCredentials, IAuthResponse>}
 */
interface ISocialLoginUseCase extends IResultUseCase<ISocialLoginCredentials, IAuthResponse> {}

/**
 * Use case for authenticating a user via a social provider (Google/Facebook).
 *
 * @class SocialLoginUseCase
 * @implements {ISocialLoginUseCase}
 *
 * @description
 * Posts the provider's profile (email/userName/avatar) to the backend, which
 * creates or logs in the account (auto-verified) and sets the session cookies.
 */
export class SocialLoginUseCase implements ISocialLoginUseCase {
    private readonly authRepository: IAuthRepositoryPort;

    /**
     * @param authRepository - Repository for auth operations (injected)
     */
    constructor({ authRepository }: { authRepository: IAuthRepositoryPort }) {
        this.authRepository = authRepository;
    }

    /**
     * Executes the social-login use case.
     *
     * @param credentials - Provider profile + provider name
     * @returns {Promise<Result<IAuthResponse>>} `ok(IAuthResponse)` on success, `err(Failure)` on failure
     */
    execute(credentials: ISocialLoginCredentials): Promise<Result<IAuthResponse>> {
        return this.authRepository.socialLogin(credentials);
    }
}
