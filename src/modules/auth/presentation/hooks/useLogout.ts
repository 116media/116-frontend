"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ISignOutAllResponse } from "@/modules/auth/domain/entities/ISignOutAllResponse";
import type { ISignOutResponse } from "@/modules/auth/domain/entities/ISignOutResponse";
import { getAuthChannel } from "@/modules/auth/presentation/context/authChannel";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import { AuthNotification } from "@/modules/auth/presentation/notifications/auth.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import { err } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification";

/**
 * useLogout
 *
 * @description
 * Signs the user out — this device by default, or everywhere when `all` is true. The
 * use case returns a `Result`; this hook folds it into the mutation's channels —
 * unwrapping the value on success and throwing the `Failure` on error. The backend
 * expires the cookies; on success the client clears the query cache (→ guest) and
 * pings other tabs. A failed sign-out throws (leaving the session intact).
 *
 * @returns A TanStack mutation; call `.mutate({ all })`. Its `error` is a `Failure`.
 */
export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation<ISignOutResponse | ISignOutAllResponse, Failure, { all?: boolean }>({
        mutationFn: async ({ all }) => {
            const result = await (all
                ? container.cradle.signOutAllUseCase.execute()
                : container.cradle.signOutUseCase.execute());
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => {
            queryClient.setQueryData(authKeys.me, err({ title: "", detail: "" }));
            queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== "auth" });
            getAuthChannel()?.postMessage("logout");
            showNotification(AuthNotification.signOutSuccess());
        }
    });
}
