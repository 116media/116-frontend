"use client";

import { useMutation } from "@tanstack/react-query";

import type { IChangePasswordResponse } from "@/modules/settings/domain/entities/IChangePasswordResponse";
import type { IChangePasswordCredentials } from "@/modules/settings/presentation/model/IChangePasswordCredentials";
import { SettingsNotification } from "@/modules/settings/presentation/utils/notification/settings.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useChangePassword
 *
 * @description
 * Changes the signed-in user's password. Unwraps the use case `Result` — value on
 * success, thrown `Failure` on error — and shows the centralized success toast.
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
