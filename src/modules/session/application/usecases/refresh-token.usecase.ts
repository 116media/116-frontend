import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { IUseCase } from "@/shared/application/usecases/IUseCase";

/**
 * IRefreshTokenUseCase
 *
 * @interface IRefreshTokenUseCase
 * @extends {IUseCase<void, void>}
 */
interface IRefreshTokenUseCase extends IUseCase<void, void> {}

/**
 * RefreshTokenUseCase
 *
 * @class RefreshTokenUseCase
 * @implements {IRefreshTokenUseCase}
 *
 * @description
 * Requests a new access token using the refresh-token cookie. Stays Promise/throw
 * based (no `Result` wrapper) because it is consumed by the access-token-expiry
 * interceptor, which relies on a thrown rejection to detect refresh failure.
 */
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    private readonly sessionRepository: ISessionRepositoryPort;

    /**
     * @param deps - Awilix cradle slice.
     * @param deps.sessionRepository - The session repository (injected).
     */
    constructor({ sessionRepository }: { sessionRepository: ISessionRepositoryPort }) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Executes the token refresh.
     *
     * @returns Resolves on success, rejects on failure.
     */
    async execute(): Promise<void> {
        await this.sessionRepository.refreshToken();
    }
}
