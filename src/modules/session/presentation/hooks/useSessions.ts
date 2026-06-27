"use client";

import { useQuery } from "@tanstack/react-query";

import type { ISession } from "@/modules/auth/domain/entities/ISession";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSessions
 *
 * @description
 * Lists the current user's device sessions (active and expired). The use case returns
 * a `Result`; this hook folds it into the query's channels — unwrapping the value on
 * success and throwing the `Failure` on error, so the query `error` is a typed
 * `Failure`. Keyed on `authKeys.sessions` so a revoke can invalidate it.
 *
 * @returns A TanStack query resolving the current user's sessions.
 */
export function useSessions() {
    return useQuery<ISession[], Failure>({
        queryKey: authKeys.sessions,
        queryFn: async () => {
            const result = await container.cradle.getSessionsUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
