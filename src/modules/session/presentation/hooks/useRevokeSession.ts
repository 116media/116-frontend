"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { IRevokeSessionResponse } from "@/modules/session/domain/entities/IRevokeSessionResponse";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useRevokeSession
 *
 * @description
 * Revokes a single device session by id, disconnecting that device. Unwraps the use
 * case `Result` (value on success, thrown `Failure` on error) and invalidates the
 * sessions query on success.
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
