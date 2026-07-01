"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticleDetailError.
 *
 * @interface ArticleDetailErrorProps
 * @property {() => void} onRetry - Re-runs the detail query (`refetch`).
 */
export interface ArticleDetailErrorProps {
    onRetry: () => void;
}

/**
 * ArticleDetailError
 *
 * @description
 * Retryable error state for the article detail query. Renders the shared `EmptyState`
 * with the error copy and a "Try again" button that re-runs `useArticleDetail`. Used for
 * transient failures (offline, 5xx, rate limit) — a genuinely missing article takes the
 * `notFound()` path instead.
 *
 * @param onRetry - Re-runs the detail query.
 */
export function ArticleDetailError({ onRetry }: ArticleDetailErrorProps) {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="article-detail"
            title={t("articles.detail.error.title")}
            icon={<AlertCircleIcon className="size-10" />}
            subtitle={t("articles.detail.error.subtitle")}
            action={
                <Button
                    variant="outline"
                    onClick={onRetry}
                >
                    {t("articles.detail.error.retry")}
                </Button>
            }
        />
    );
}
