"use client";

import { useMutation } from "@tanstack/react-query";

import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useForgotPassword
 *
 * @description
 * Requests a password-recovery OTP. The use case returns a `Result`; this hook folds
 * it into the mutation's channels — unwrapping the value on success and throwing the
 * `Failure` on error. The caller advances the modal to the verify-otp view, carrying
 * the email returned in the success data.
 *
 * @returns A TanStack mutation for the forgot-password action; its `error` is a `Failure`.
 */
export function useForgotPassword() {
    return useMutation<IForgotPasswordResponse, Failure, IForgotPasswordCredentials>({
        mutationKey: authKeys.mutation,
        mutationFn: async (credentials) => {
            const result = await container.cradle.forgotPasswordUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
