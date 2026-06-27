"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import { SettingsNotification } from "@/modules/settings/presentation/notifications/settings.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification";

/**
 * useUpdateAvatar
 *
 * @description
 * Uploads a new avatar image for the current user. The use case returns a `Result`;
 * this hook folds it into the mutation's channels — unwrapping the value on success and
 * throwing the `Failure` on error. The endpoint returns the updated user, so on success
 * the new user is written straight into `['auth','me']` (authoritative, no refetch) and
 * a toast is shown.
 *
 * @returns A TanStack mutation; call `.mutate(file)`. Its `error` is a `Failure`.
 */
export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    return useMutation<IProfile, Failure, File>({
        mutationFn: async (file) => {
            const result = await container.cradle.updateAvatarUseCase.execute(file);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me, ok(data));
            showNotification(SettingsNotification.avatarUpdated());
        }
    });
}
