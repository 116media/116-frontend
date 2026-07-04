"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IRevokeSessionResponse } from "@/modules/auth/domain/entities/IRevokeSessionResponse";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useRevokeSession
 *
 * @description
 * Revokes a single device session by id, disconnecting that device. The use case
 * returns a `Result`; this hook folds it into the mutation's channels — unwrapping the
 * value on success and throwing the `Failure` on error. On success the sessions query
 * is invalidated so the list refetches.
 *
 * @returns A TanStack mutation; call `.mutate(sessionId)`. Its `error` is a `Failure`.
 */
export function useRevokeSession() {
    const queryClient = useQueryClient();
    return useMutation<IRevokeSessionResponse, Failure, string>({
        mutationFn: async (sessionId) => {
            const result = await container.cradle.revokeSessionUseCase.execute(sessionId);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.sessions })
    });
}
