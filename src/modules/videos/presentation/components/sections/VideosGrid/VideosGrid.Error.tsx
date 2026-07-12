"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideosGridError.
 *
 * @interface VideosGridErrorProps
 * @property {() => void} onRetry - Re-runs the feed query (`refetch`).
 */
export interface VideosGridErrorProps {
    onRetry: () => void;
}

/**
 * VideosGridError
 *
 * @description
 * Retryable error state for the videos feed. Renders a short message and a
 * button that re-runs the query. Never falls back to dummy data — a real
 * failure stays visible.
 */
export function VideosGridError({ onRetry }: VideosGridErrorProps) {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="videos-feed-error"
            title={t("videos.browse.grid.error.title")}
            icon={<AlertCircleIcon className="size-10 text-destructive" />}
            action={
                <Button
                    variant="outline"
                    onClick={onRetry}
                >
                    {t("videos.browse.grid.error.retry")}
                </Button>
            }
        />
    );
}
