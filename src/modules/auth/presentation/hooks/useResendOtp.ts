"use client";

import { useMutation } from "@tanstack/react-query";

import type { IResendOtpResponse } from "@/modules/auth/domain/entities/IResendOtpResponse";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useResendOtp
 *
 * @description
 * Re-sends an OTP for the given purpose, unwrapping the use case `Result` into
 * the mutation channels — value on success, thrown `Failure` on error.
 *
 * @returns A TanStack mutation for resending an OTP; its `error` is a `Failure`.
 */
export function useResendOtp() {
    return useMutation<IResendOtpResponse, Failure, IResendOtpCredentials>({
        mutationKey: authKeys.mutation,
        mutationFn: async (credentials) => {
            const result = await container.cradle.resendOtpUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
