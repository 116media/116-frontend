"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import { getAuthChannel } from "@/modules/auth/presentation/utils/authChannel";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useLogin
 *
 * @description
 * Logs in with credentials + password, unwrapping the use case `Result` into
 * the mutation channels — value on success, thrown `Failure` on error. On
 * success the user is written into the `me` cache and other tabs are pinged.
 *
 * @returns A TanStack mutation for the login action; its `error` is a `Failure`.
 */
export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation<IAuthResponse, Failure, ILoginCredentials>({
        mutationKey: authKeys.mutation,
        mutationFn: async (credentials) => {
            const result = await container.cradle.loginUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, ok(data.user));
            getAuthChannel()?.postMessage("login");
        }
    });
}
