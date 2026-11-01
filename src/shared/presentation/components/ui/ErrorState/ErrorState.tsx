"use client";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ErrorState.
 *
 * @interface ErrorStateProps
 * @property {() => void} onRetry - Re-runs the failed query.
 * @property {string} title - The error message shown to the user.
 * @property {string} retryLabel - Label for the retry button.
 * @property {string} [context] - Stable identifier for the underlying empty-state.
 * @property {string} [className] - Extra classes for the shell, so a panel can collapse
 * the page-sized height it defaults to.
 */
export interface ErrorStateProps {
    onRetry: () => void;
    title: string;
    retryLabel: string;
    context?: string;
    className?: string;
}

/**
 * ErrorState
 *
 * @description
 * Retryable failure state for any query: a message and a button that runs it again.
 * Copy is supplied by the caller so the same shell serves a feed, a panel or a detail.
 */
export function ErrorState({
    onRetry,
    title,
    retryLabel,
    context = "error-state",
    className
}: ErrorStateProps) {
    return (
        <EmptyState
            context={context}
            title={title}
            className={className}
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
