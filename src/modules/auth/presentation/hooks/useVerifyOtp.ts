"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IVerifyOtpResponse } from "@/modules/auth/domain/entities/IVerifyOtpResponse";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVerifyOtp
 *
 * @description
 * Verifies a 6-digit OTP for the given purpose. The use case returns a `Result`;
 * this hook folds it into the mutation's channels — unwrapping the value on success
 * and throwing the `Failure` on error. On success invalidates `me` so the user's
 * `isVerified` flips and the derived status becomes `authenticated`.
 *
 * @returns A TanStack mutation for OTP verification; its `error` is a `Failure`.
 */
export function useVerifyOtp() {
    const queryClient = useQueryClient();
    return useMutation<IVerifyOtpResponse, Failure, IVerifyOtpCredentials>({
        mutationFn: async (credentials) => {
            const result = await container.cradle.verifyOtpUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.me });
        }
    });
}
