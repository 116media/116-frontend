"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticlesGridError.
 *
 * @interface ArticlesGridErrorProps
 * @property {() => void} onRetry - Re-runs the feed query (`refetch`).
 */
export interface ArticlesGridErrorProps {
    onRetry: () => void;
}

/**
 * ArticlesGridError
 *
 * @description
 * Retryable error state for the article feed. Renders a short message and a button that
 * re-runs the query. Never falls back to dummy data — a real failure stays visible.
 */
export function ArticlesGridError({ onRetry }: ArticlesGridErrorProps) {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="articles-feed-error"
            title={t("articles.grid.error.title")}
            icon={<AlertCircleIcon className="size-10 text-destructive" />}
            action={
                <Button
                    variant="outline"
                    onClick={onRetry}
                >
                    {t("articles.grid.error.retry")}
                </Button>
            }
        />
    );
}
