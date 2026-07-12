import type { IAuthUserEntity } from "@/shared/domain/entities/IAuthUserEntity";
import type { IFile } from "@/shared/domain/entities/IFile";
import type { EAuthProvider } from "@/shared/domain/enums/EAuthProvider";
import type { FileDto, UserResponseDto } from "@/shared/infrastructure/api/generated/116.api";

/**
 * UserMapper
 *
 * @description
 * Pure DTO to entity mappers for the cross-cutting user identity, consumed by the
 * auth and settings repositories. No DTO type leaks past this layer.
 */
export const UserMapper = {
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
     * Maps a `UserResponseDto` to an `IAuthUserEntity`.
     *
     * @param dto - The user DTO from the backend.
     * @returns The mapped user entity.
     */
    userFromDto(dto: UserResponseDto): IAuthUserEntity {
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
            avatar: dto.avatar ? UserMapper.fileFromDto(dto.avatar) : null,
            countryName: dto.countryName ?? null,
            countryIsoCode: dto.countryIsoCode ?? null,
            countryDialCode: dto.countryDialCode ?? null,
            partialPhoneNumber: dto.partialPhoneNumber ?? null,
            fullPhoneNumber: dto.fullPhoneNumber ?? null,
            createdAt: dto.createdAt ?? null,
            updatedAt: dto.updatedAt ?? null
        };
    }
} as const;
