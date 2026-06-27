"use client";

import { useMutation } from "@tanstack/react-query";

import type { IChangePasswordResponse } from "@/modules/settings/domain/entities/IChangePasswordResponse";
import type { IChangePasswordCredentials } from "@/modules/settings/presentation/model/IChangePasswordCredentials";
import { SettingsNotification } from "@/modules/settings/presentation/notifications/settings.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification";

/**
 * useChangePassword
 *
 * @description
 * Changes the signed-in user's password. The use case returns a `Result`; this hook
 * folds it into the mutation's channels — unwrapping the value on success and throwing
 * the `Failure` on error, so the form reads `error` directly. A success toast is shown
 * from the centralized settings notification config.
 *
 * @returns A TanStack mutation for changing the password; its `error` is a `Failure`.
 */
export function useChangePassword() {
    return useMutation<IChangePasswordResponse, Failure, IChangePasswordCredentials>({
        mutationFn: async (credentials) => {
            const result = await container.cradle.changePasswordUseCase.execute(credentials);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => showNotification(SettingsNotification.passwordChanged())
    });
}
