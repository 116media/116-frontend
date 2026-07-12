"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import type { IUpdateAccountCredentials } from "@/modules/settings/presentation/model/IUpdateAccountCredentials";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";

/**
 * useUpdateProfile
 *
 * @description
 * Updates the current user's profile. Unwraps the use case `Result`; on success
 * writes the returned user straight into `['auth','me']` — no refetch, no stale data
 * anywhere `useAuth()` is read.
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
