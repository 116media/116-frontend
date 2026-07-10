"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
    CircleCheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    XCircleIcon,
    XIcon,
} from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";
import { Button } from "../Button";

export type FlashType = "success" | "error" | "info" | "warning";

/**
 * Per-type surface (background + foreground tokens) and leading glyph. `info`
 * maps to the brand primary, the other three to their status tokens; every
 * foreground token resolves to white, so the icon disc and close ring are
 * white overlays that read on any of the four surfaces in both themes.
 */
const TYPE_STYLES: Record<FlashType, { surface: string; icon: ReactNode }> = {
    info: {
        surface: "bg-primary text-primary-foreground",
        icon: <InfoIcon className="size-5" />
    },
    success: {
        surface: "bg-success text-success-foreground",
        icon: <CircleCheckIcon className="size-5" />
    },
    error: {
        surface: "bg-destructive text-destructive-foreground",
        icon: <XCircleIcon className="size-5" />
    },
    warning: {
        surface: "bg-warning text-warning-foreground",
        icon: <TriangleAlertIcon className="size-5" />
    }
};

/**
 * Props for FlashToast.
 *
 * @interface FlashToastProps
 * @property {FlashType} type - The variant, selecting the surface and glyph.
 * @property {string} title - The (already-localized) headline.
 * @property {string} [description] - The (already-localized) supporting line.
 * @property {() => void} onDismiss - Dismisses the toast (wired to sonner's dismiss).
 */
export interface FlashToastProps {
    title: string;
    type: FlashType;
    description?: string;
    onDismiss: () => void;
}

/**
 * FlashToast
 *
 * @description
 * The flash-message toast body rendered inside sonner: a fully filled,
 * `rounded-lg` colored surface with a circular leading icon (white glyph on a
 * translucent white disc), a bold title over an optional muted description, and
 * a circular outline close button on the trailing edge. The surface color and
 * glyph follow the variant; every variant uses a white foreground, so the
 * overlays stay legible in light and dark. Dismissal is delegated to the caller
 * (sonner's `toast.dismiss`).
 *
 * @param type - The variant, selecting the surface and glyph.
 * @param title - The localized headline.
 * @param description - The localized supporting line.
 * @param onDismiss - Dismisses the toast.
 */
export function FlashToast({
    type,
    title,
    description,
    onDismiss
}: FlashToastProps) {
    const { t } = useTranslation();
    const { surface, icon } = TYPE_STYLES[type];

    return (
        <div
            role="alert"
            className={cn(
                "inline-flex items-start gap-3 rounded-lg p-4 shadow-lg",
                surface
            )}
        >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/25">
                {icon}
            </span>

            <div className="flex flex-col">
                <p className="font-semibold text-sm leading-snug whitespace-nowrap">
                    {title}
                </p>

                {description && (
                    <p className="text-sm leading-snug opacity-70 whitespace-nowrap">
                        {description}
                    </p>
                )}
            </div>

            <Button
                size="icon"
                variant="ghost"
                onClick={onDismiss}
                aria-label={t("common.close", { defaultValue: "Close" })}
                className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/30 text-current transition-colors hover:bg-white/15"
            >
                <XIcon className="size-4" />
            </Button>
        </div>
    );
}
