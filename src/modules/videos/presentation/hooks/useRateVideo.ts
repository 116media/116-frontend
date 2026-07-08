"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { RatingNotification } from "@/modules/videos/presentation/utils/notification/videos.rating.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useRateVideo
 *
 * @description
 * Auth-gated mutation that submits the user's star rating (1–5) for a video
 * behind `useRequireAuth`. On success it toasts and invalidates the cached
 * detail entity so the server-recomputed average and count come back.
 *
 * @param videoId - The video being rated.
 * @param slug - The video slug keying the cached detail entity.
 * @returns `{ submit, isPending }` for the rating stars.
 */
export function useRateVideo(videoId: string, slug: string) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, number>({
        mutationFn: async (stars) => {
            const result = await container.cradle.rateVideoUseCase.execute({
                id: videoId,
                stars
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => {
            showNotification(RatingNotification.success(t));
            queryClient.invalidateQueries({ queryKey: videoKeys.detail(slug) });
        },
        onError: () => {
            showNotification(RatingNotification.failed(t));
        }
    });

    const submit = (stars: number) => requireAuth(() => mutation.mutate(stars));

    return { submit, isPending: mutation.isPending };
}
