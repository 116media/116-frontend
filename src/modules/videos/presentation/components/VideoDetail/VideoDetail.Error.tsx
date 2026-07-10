"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideoDetailError.
 *
 * @interface VideoDetailErrorProps
 * @property {() => void} onRetry - Re-runs the detail query (`refetch`).
 */
export interface VideoDetailErrorProps {
    onRetry: () => void;
}

/**
 * VideoDetailError
 *
 * @description
 * Retryable error state for the video detail query. Renders the shared
 * `EmptyState` with the error copy and a "Try again" button that re-runs
 * `useVideoDetail`. Used for transient failures (offline, 5xx, rate limit) —
 * a genuinely missing video takes the `notFound()` path instead.
 *
 * @param onRetry - Re-runs the detail query.
 */
export function VideoDetailError({ onRetry }: VideoDetailErrorProps) {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="video-detail"
            title={t("videos.detail.error.title")}
            icon={<AlertCircleIcon className="size-10" />}
            subtitle={t("videos.detail.error.subtitle")}
            action={
                <Button
                    variant="outline"
                    onClick={onRetry}
                >
                    {t("videos.detail.error.retry")}
                </Button>
            }
        />
    );
}
