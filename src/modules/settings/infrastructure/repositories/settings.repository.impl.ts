import { AuthMapper } from "@/modules/auth/infrastructure/mappers/auth.mapper";
import type { ISettingsRepositoryPort } from "@/modules/settings/application/repositories/settings.repository.port";
import type { IChangePasswordResponse } from "@/modules/settings/domain/entities/IChangePasswordResponse";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IChangePasswordCredentials } from "@/modules/settings/presentation/model/IChangePasswordCredentials";
import type { IUpdateAccountCredentials } from "@/modules/settings/presentation/model/IUpdateAccountCredentials";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Settings repository implementation using the public REST API.
 *
 * @description
 * Implements `ISettingsRepositoryPort` against the generated API client — profile
 * get/update and password change. The user DTO is mapped by the shared `AuthMapper`.
 * All methods return `Result<T>`; errors are converted via `ProblemMapper.toFailure`.
 */
export class SettingsRepositoryImpl implements ISettingsRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async getProfile(): Promise<Result<IProfile>> {
        try {
            const response = await this.api.publicGetOwnProfile();
            return ok(AuthMapper.userFromDto(response.data.user));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async updateAccount(credentials: IUpdateAccountCredentials): Promise<Result<IProfile>> {
        try {
            const response = await this.api.publicUpdateOwnProfile(credentials);
            return ok(AuthMapper.userFromDto(response.data.user));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async changePassword(
        credentials: IChangePasswordCredentials
    ): Promise<Result<IChangePasswordResponse>> {
        try {
            const response = await this.api.publicChangePassword(credentials);
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async updateAvatar(file: File): Promise<Result<IProfile>> {
        try {
            const response = await this.api.publicUpdateAvatar({ avatarFile: file });
            return ok(AuthMapper.userFromDto(response.data.user));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
