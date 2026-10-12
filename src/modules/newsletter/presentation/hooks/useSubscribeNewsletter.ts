"use client";

import { useMutation } from "@tanstack/react-query";

import type { ISubscribeNewsletterCredentials } from "@/modules/newsletter/presentation/model/ISubscribeNewsletterCredentials";
import { NewsletterNotification } from "@/modules/newsletter/presentation/utils/notification/newsletter.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useSubscribeNewsletter
 *
 * @description
 * Subscribes an email to the newsletter, unwrapping the use case `Result` into the
 * mutation channels — value on success, thrown `Failure` on error. Success raises the
 * confirm-your-inbox toast.
 *
 * @returns A TanStack mutation for the sign-up action; its `error` is a `Failure`.
 */
export function useSubscribeNewsletter() {
    return useMutation<boolean, Failure, ISubscribeNewsletterCredentials>({
        mutationKey: ["newsletter", "subscribe"],
        mutationFn: async ({ email }) => {
            const result = await container.cradle.subscribeNewsletterUseCase.execute(email);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => showNotification(NewsletterNotification.subscribed())
    });
}
