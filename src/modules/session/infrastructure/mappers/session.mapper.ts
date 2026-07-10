import type { ISessionEntity } from "@/modules/session/domain/entities/ISessionEntity";
import type { IActionResponse } from "@/shared/domain/types/action.response";
import type { SessionDto } from "@/shared/infrastructure/api/generated/116.api";

/**
 * SessionMapper
 *
 * @description
 * Pure DTO to entity mappers for the session module, mirroring the other module
 * mappers. No DTO type leaks past this layer.
 */
export const SessionMapper = {
    /**
     * Maps a `SessionDto` to an `ISessionEntity`.
     *
     * @param dto - The session DTO.
     * @returns The mapped session entity.
     */
    sessionFromDto(dto: SessionDto): ISessionEntity {
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
     * Maps a list of `SessionDto` to `ISessionEntity` entities.
     *
     * @param dtos - The session DTOs.
     * @returns The mapped session entities.
     */
    sessionListFromDto(dtos: SessionDto[]): ISessionEntity[] {
        return dtos.map(SessionMapper.sessionFromDto);
    },

    /**
     * Maps any `{ isSuccess }` DTO to an `IActionResponse`-shaped entity.
     *
     * @param dto - A DTO exposing `isSuccess`.
     * @returns The mapped action response.
     */
    actionFromDto(dto: { isSuccess: boolean }): IActionResponse {
        return { isSuccess: dto.isSuccess };
    }
} as const;
