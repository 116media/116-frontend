"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSignup
 *
 * @description
 * Registers a new account. The use case returns a `Result`; this hook folds it into
 * the mutation's channels — unwrapping the value on success and throwing the
 * `Failure` on error. On success the user is logged in but `unverified`; the user is
 * written to the cache and the caller advances the modal to the verify-otp view (an
 * `EmailVerification` OTP was emailed).
 *
 * @returns A TanStack mutation for the signup action; its `error` is a `Failure`.
 */
export function useSignup() {
    const queryClient = useQueryClient();
    return useMutation<IAuthResponse, Failure, ISignupCredentials>({
        mutationKey: authKeys.mutation,
        mutationFn: async (credentials) => {
            const result = await container.cradle.signupUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, ok(data.user));
        }
    });
}
