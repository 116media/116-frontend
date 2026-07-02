"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import { getAuthChannel } from "@/modules/auth/presentation/context/authChannel";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useLogin
 *
 * @description
 * Logs in with credentials + password. The use case returns a `Result`; this hook
 * folds it into the mutation's two channels — unwrapping the value on success and
 * throwing the `Failure` on error — so `mutation.error`/`isError`/`reset()` are real
 * and truthful (rather than a failure hidden inside `data`). On success the returned
 * user is written into `['auth','me']` (instant, authoritative) and other tabs are
 * pinged; the caller closes the modal.
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
