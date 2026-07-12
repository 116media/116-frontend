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
 * Requests a password-recovery OTP, unwrapping the use case `Result` into the
 * mutation channels — value on success, thrown `Failure` on error. The success
 * data carries the email for the verify-otp step.
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
