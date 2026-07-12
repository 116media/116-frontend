"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { ISessionEntity } from "@/modules/session/domain/entities/ISessionEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSessions
 *
 * @description
 * Lists the current user's device sessions (active and expired). Unwraps the use case
 * `Result` (value on success, thrown `Failure` on error). Keyed on `authKeys.sessions`
 * so a revoke can invalidate it.
 *
 * @returns A TanStack query resolving the current user's sessions.
 */
export function useSessions() {
    return useQuery<ISessionEntity[], Failure>({
        queryKey: authKeys.sessions,
        queryFn: async () => {
            const result = await container.cradle.getSessionsUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
