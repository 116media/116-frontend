import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { IActionResponse } from "@/shared/domain/types/action.response";
import type { UserResponseDto } from "@/shared/infrastructure/api/generated/116.api";
import { UserMapper } from "@/shared/infrastructure/mappers/user.mapper";

/**
 * AuthMapper
 *
 * @description
 * Pure DTO to entity mappers for the auth module. No DTO type leaks past this
 * layer; the user entity keeps the DTO's flat country/phone fields.
 */
export const AuthMapper = {
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
            user: UserMapper.userFromDto(dto.user),
            verificationRequired: dto.verificationRequired
        };
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
