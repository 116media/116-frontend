import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * SettingsMapper
 *
 * @description
 * Pure DTO to entity mappers for the settings module. The user profile itself maps
 * through the shared `UserMapper`; only settings-specific responses live here.
 */
export const SettingsMapper = {
    /**
     * Maps any `{ isSuccess }` DTO to an `IActionResponse`-shaped entity (password
     * change and similar acknowledgements).
     *
     * @param dto - A DTO exposing `isSuccess`.
     * @returns The mapped action response.
     */
    actionFromDto(dto: { isSuccess: boolean }): IActionResponse {
        return { isSuccess: dto.isSuccess };
    }
} as const;
