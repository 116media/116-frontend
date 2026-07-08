"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import { getAuthChannel } from "@/modules/auth/presentation/utils/authChannel";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSocialLogin
 *
 * @description
 * Logs in with a social provider (Google/Facebook), unwrapping the use case
 * `Result` into the mutation channels — value on success, thrown `Failure` on
 * error. On success the user is written to the `me` cache and tabs are pinged.
 *
 * @returns A TanStack mutation for the social-login action; its `error` is a `Failure`.
 */
export function useSocialLogin() {
    const queryClient = useQueryClient();
    return useMutation<IAuthResponse, Failure, ISocialLoginCredentials>({
        mutationKey: authKeys.mutation,
        mutationFn: async (credentials) => {
            const result = await container.cradle.socialLoginUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, ok(data.user));
            getAuthChannel()?.postMessage("login");
        }
    });
}
