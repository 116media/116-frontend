"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import { SettingsNotification } from "@/modules/settings/presentation/utils/notification/settings.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import { ok } from "@/shared/domain/results/result";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useUpdateAvatar
 *
 * @description
 * Uploads a new avatar image for the current user. Unwraps the use case `Result`; on
 * success writes the returned user straight into `['auth','me']` (no refetch) and
 * shows a toast.
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
