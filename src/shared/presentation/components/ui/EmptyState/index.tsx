"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for EmptyState.
 *
 * @interface EmptyStateProps
 * @property {string} context - Identifies the data type or the place this state is shown
 * (for example "articles-feed" or "bookmarks"). Exposed as a `data-empty-state` attribute
 * for styling and analytics hooks.
 * @property {ReactNode} icon - The illustrative icon, rendered above the title. The caller
 * controls its size; it inherits the muted foreground color unless it sets its own.
 * @property {string} title - The primary line describing the empty or error condition.
 * @property {string} [subtitle] - An optional secondary line with guidance or detail.
 * @property {ReactNode} [action] - An optional action element (typically a Button) shown
 * below the text.
 * @property {string} [className] - Extra classes merged onto the container (later utilities
 * win), so callers can adjust height, padding, or spacing per placement.
 */
export interface EmptyStateProps {
    context: string;
    icon: ReactNode;
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

/**
 * EmptyState
 *
 * @description
 * A reusable full-area placeholder for "no data", "no results", and error conditions. The
 * container is a rounded, muted-gray surface that fills the available width and stands tall
 * enough to dominate the viewport, with the icon, title, optional subtitle, and optional
 * action stacked and centered. Copy, icon, and action are supplied by the caller so the
 * same shell serves any feature; `context` records where it is used.
 *
 * @param context - Identifies the data type or place the state is shown.
 * @param icon - The illustrative icon.
 * @param title - The primary message.
 * @param subtitle - An optional secondary message.
 * @param action - An optional action element.
 * @param className - Extra classes merged onto the container.
 */
export function EmptyState({ context, icon, title, subtitle, action, className }: EmptyStateProps) {
    return (
        <div
            data-empty-state={context}
            className={cn(
                "flex min-h-[70vh] w-full flex-col items-center justify-center gap-3 rounded-lg bg-sidebar p-8 text-center",
                className
            )}
        >
            <div className="text-muted-foreground">{icon}</div>
            <p className="font-medium text-foreground text-lg">{title}</p>
            {subtitle && <p className="max-w-sm text-muted-foreground">{subtitle}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
