"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSocialLogin
 *
 * @description
 * Logs in with a social provider (Google/Facebook). The use case returns a `Result`;
 * this hook folds it into the mutation's channels — unwrapping the value on success
 * and throwing the `Failure` on error. On success the returned user is written into
 * `['auth','me']` and other tabs are pinged (same write-through as `useLogin`); the
 * caller closes the modal.
 *
 * @returns A TanStack mutation for the social-login action; its `error` is a `Failure`.
 */
export function useSocialLogin() {
    const queryClient = useQueryClient();
    return useMutation<IAuthResponse, Failure, ISocialLoginCredentials>({
        mutationFn: async (credentials) => {
            const result = await container.cradle.socialLoginUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, ok(data.user));
            const channel = new BroadcastChannel("auth");
            channel.postMessage("login");
            channel.close();
        }
    });
}
