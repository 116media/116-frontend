"use client";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for FeedError.
 *
 * @interface FeedErrorProps
 * @property {() => void} onRetry - Re-runs the failed query.
 * @property {string} title - The error message shown to the user.
 * @property {string} retryLabel - Label for the retry button.
 * @property {string} [context] - Stable identifier for the underlying empty-state.
 */
export interface FeedErrorProps {
    onRetry: () => void;
    title: string;
    retryLabel: string;
    context?: string;
}

/**
 * FeedError
 *
 * @description
 * Generic retryable error state for any feed: a message and a button that re-runs the
 * query. Copy is supplied by the caller so it stays content-agnostic.
 */
export function FeedError({ onRetry, title, retryLabel, context = "feed-error" }: FeedErrorProps) {
    return (
        <EmptyState
            context={context}
            title={title}
            icon={<AlertCircleIcon className="size-10 text-destructive" />}
            action={
                <Button
                    variant="outline"
                    onClick={onRetry}
                >
                    {retryLabel}
                </Button>
            }
        />
    );
}
