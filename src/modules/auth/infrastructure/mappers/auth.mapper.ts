import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { IAuthUser } from "@/modules/auth/domain/entities/IAuthUser";
import type { IFile } from "@/modules/auth/domain/entities/IFile";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { ISession } from "@/modules/auth/domain/entities/ISession";
import type { EAuthProvider } from "@/modules/auth/domain/enums/EAuthProvider";
import type { IActionResponse } from "@/shared/domain/types/action.response";
import type {
    FileDto,
    SessionDto,
    UserResponseDto
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * AuthMapper
 *
 * @description
 * Pure DTO to entity mappers for the auth module, mirroring `VideosMapper` and the
 * dashboard's `AuthMapper`. No DTO type leaks past this layer; the user entity keeps
 * the DTO's flat country/phone fields.
 */
export const AuthMapper = {
    /**
     * Maps a `FileDto` to an `IFile` (used for the user's avatar).
     *
     * @param dto - The file DTO.
     * @returns The mapped file entity.
     */
    fileFromDto(dto: FileDto): IFile {
        return {
            id: dto.id,
            fileName: dto.fileName,
            originalFileName: dto.originalFileName,
            mimeType: dto.mimeType,
            storageUrl: dto.storageUrl,
            sizeInBytes: dto.sizeInBytes,
            isDeleted: dto.isDeleted
        };
    },

    /**
     * Maps a `UserResponseDto` to an `IAuthUser`.
     *
     * @param dto - The user DTO from the backend.
     * @returns The mapped user entity.
     */
    userFromDto(dto: UserResponseDto): IAuthUser {
        return {
            id: dto.id,
            email: dto.email ?? null,
            userName: dto.userName,
            roles: dto.roles.map((role) => ({
                id: role.id,
                name: role.name,
                description: role.description
            })),
            permissions: dto.permissions.map((permission) => ({
                id: permission.id,
                resource: permission.resource,
                action: permission.action
            })),
            authProvider: String(dto.authProvider) as EAuthProvider,
            isVerified: dto.isVerified,
            isActive: dto.isActive,
            avatar: dto.avatar ? AuthMapper.fileFromDto(dto.avatar) : null,
            countryName: dto.countryName ?? null,
            countryIsoCode: dto.countryIsoCode ?? null,
            countryDialCode: dto.countryDialCode ?? null,
            partialPhoneNumber: dto.partialPhoneNumber ?? null,
            fullPhoneNumber: dto.fullPhoneNumber ?? null,
            createdAt: dto.createdAt ?? null,
            updatedAt: dto.updatedAt ?? null
        };
    },

    /**
     * Maps a web auth response (`{ user, verificationRequired? }`) to the domain.
     *
     * @param dto - The login/signup web response.
     * @returns The mapped auth response entity.
     */
    authResponseFromDto(dto: {
        user: UserResponseDto;
        verificationRequired?: boolean;
    }): IAuthResponse {
        return {
            user: AuthMapper.userFromDto(dto.user),
            verificationRequired: dto.verificationRequired
        };
    },

    /**
     * Maps a `SessionDto` to an `ISession`.
     *
     * @param dto - The session DTO.
     * @returns The mapped session entity.
     */
    sessionFromDto(dto: SessionDto): ISession {
        return {
            id: dto.id,
            ipAddress: dto.ipAddress ?? null,
            userAgent: dto.userAgent ?? null,
            browser: String(dto.browser),
            device: String(dto.device),
            platform: String(dto.platform),
            client: String(dto.client),
            expiresAt: dto.expiresAt,
            isActive: dto.isActive,
            isCurrent: dto.isCurrent,
            createdAt: dto.createdAt ?? null
        };
    },

    /**
     * Maps a list of `SessionDto` to `ISession` entities.
     *
     * @param dtos - The session DTOs.
     * @returns The mapped session entities.
     */
    sessionListFromDto(dtos: SessionDto[]): ISession[] {
        return dtos.map(AuthMapper.sessionFromDto);
    },

    /**
     * Maps any `{ isSuccess }` DTO to an `IActionResponse`-shaped entity. The
     * verify/resend/reset/change/sign-out/revoke responses all reuse this.
     *
     * @param dto - A DTO exposing `isSuccess`.
     * @returns The mapped action response.
     */
    actionFromDto(dto: { isSuccess: boolean }): IActionResponse {
        return { isSuccess: dto.isSuccess };
    },

    /**
     * Maps a forgot-password DTO (`{ isSuccess, email }`) to its entity.
     *
     * @param dto - The forgot-password DTO.
     * @returns The mapped forgot-password response (with `email`).
     */
    forgotPasswordResponseFromDto(dto: {
        isSuccess: boolean;
        email: string;
    }): IForgotPasswordResponse {
        return { isSuccess: dto.isSuccess, email: dto.email };
    }
} as const;
