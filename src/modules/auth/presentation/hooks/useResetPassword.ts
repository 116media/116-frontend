"use client";

import { useMutation } from "@tanstack/react-query";

import type { IResetPasswordResponse } from "@/modules/auth/domain/entities/IResetPasswordResponse";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useResetPassword
 *
 * @description
 * Sets a new password using the recovery OTP, unwrapping the use case `Result`
 * into the mutation channels — value on success, thrown `Failure` on error.
 *
 * @returns A TanStack mutation for the reset-password action; its `error` is a `Failure`.
 */
export function useResetPassword() {
    return useMutation<IResetPasswordResponse, Failure, IResetPasswordCredentials>({
        mutationKey: authKeys.mutation,
        mutationFn: async (credentials) => {
            const result = await container.cradle.resetPasswordUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
