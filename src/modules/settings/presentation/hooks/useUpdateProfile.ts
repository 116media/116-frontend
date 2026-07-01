"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IUpdateAccountCredentials } from "@/modules/settings/presentation/model/IUpdateAccountCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useUpdateProfile
 *
 * @description
 * Updates the current user's profile. The use case returns a `Result`; this hook
 * folds it into the mutation's channels — unwrapping the value on success and
 * throwing the `Failure` on error. The endpoint returns the updated user, so on
 * success we write it straight into `['auth','me']` — authoritative and instant, no
 * refetch, no stale data anywhere `useAuth()` is read. (Used by the later Settings
 * page.)
 *
 * @returns A TanStack mutation for updating the profile; its `error` is a `Failure`.
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation<IProfile, Failure, IUpdateAccountCredentials>({
        mutationFn: async (credentials) => {
            const result = await container.cradle.updateAccountUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, ok(data));
        }
    });
}
