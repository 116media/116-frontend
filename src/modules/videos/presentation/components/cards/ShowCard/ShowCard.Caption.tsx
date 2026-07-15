"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { Button } from "@/shared/presentation/components/ui/Button";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the Caption show card part.
 *
 * @interface ShowCardCaptionProps
 * @property {IShowEntity} show - The show whose title and description are shown.
 * @property {"md" | "lg"} [size] - Title scale; "lg" suits large grid tiles.
 */
export interface ShowCardCaptionProps {
    show: IShowEntity;
    size?: "md" | "lg";
}

/**
 * Per-size classes for the caption title.
 */
const TITLE_CLASSES = {
    md: "text-base font-bold leading-snug line-clamp-1 sm:text-lg",
    lg: "text-xl font-bold leading-snug line-clamp-1 sm:text-2xl"
} as const;

/**
 * RevealOnHover
 *
 * @description
 * Collapses its children to zero height and slides them open on group-hover
 * using the grid-rows `0fr` → `1fr` trick, so the "watch" call-to-action only
 * appears when the card is hovered.
 *
 * @param children - The content revealed on hover
 */
function RevealOnHover({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
                <div className="pt-3">{children}</div>
            </div>
        </div>
    );
}

/**
 * Caption
 *
 * @description
 * Bottom overlay of a show card: the show title, clamped description, and the
 * hover-revealed watch CTA over a gradient grounded in the show's
 * poster-derived colors.
 */
export function Caption({ show, size = "md" }: ShowCardCaptionProps) {
    const { t } = useTranslation();

    const background = show.colors?.background ?? SHOW_FALLBACK_COLORS.background;
    const foreground = show.colors?.foreground ?? SHOW_FALLBACK_COLORS.foreground;

    return (
        <div
            style={{
                color: foreground,
                backgroundImage: `linear-gradient(to top, ${background} 0%, ${withAlpha(background, 0.85)} 60%, ${withAlpha(background, 0)} 100%)`
            }}
            className="absolute inset-x-0 bottom-0 p-4 pt-12 transition-all duration-300"
        >
            <h3 className={TITLE_CLASSES[size]}>{show.name}</h3>
            <p
                style={{ color: withAlpha(foreground, 0.8) }}
                className="mt-1.5 text-sm leading-5 line-clamp-2 transition-all group-hover:line-clamp-3"
            >
                {show.description}
            </p>
            <RevealOnHover>
                <Button
                    size="lg"
                    variant="ghost"
                    className="w-full rounded-lg font-semibold"
                    style={{ backgroundColor: foreground, color: background }}
                >
                    <PlayIcon className="size-4 fill-current" />
                    <span suppressHydrationWarning>{t("videos.home.watchNow")}</span>
                </Button>
            </RevealOnHover>
        </div>
    );
}
