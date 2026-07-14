"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { Button } from "@/shared/presentation/components/ui/Button";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the Poster show card variant.
 *
 * @interface ShowCardPosterProps
 * @property {IShowEntity} show - The show to display.
 * @property {boolean} isHero - Whether to render the larger hero variant.
 */
export interface ShowCardPosterProps {
    show: IShowEntity;
    isHero: boolean;
}

/**
 * RevealOnHover
 *
 * @description
 * Collapses its children to zero height and slides them open on group-hover
 * using the grid-rows `0fr` → `1fr` trick, so the "watch" call-to-action only
 * appears when the focal card is hovered.
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
 * Poster
 *
 * @description
 * Full-bleed poster content for a show inside an MD3 hero carousel slot, themed
 * from the backend `colors` pair via inline styles with a neutral fallback.
 * While focal, it shows the title, description, and a "watch" button.
 */
export function Poster({ show, isHero }: ShowCardPosterProps) {
    const { t } = useTranslation();

    const background = show.colors?.background ?? SHOW_FALLBACK_COLORS.background;
    const foreground = show.colors?.foreground ?? SHOW_FALLBACK_COLORS.foreground;

    return (
        <>
            {show.posterUrl && (
                <Image
                    fill
                    alt={show.name}
                    draggable={false}
                    src={show.posterUrl}
                    sizes="(max-width: 1024px) 80vw, 720px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            )}

            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to top, ${withAlpha(background, 0.95)} 0%, ${withAlpha(background, 0.25)} 35%)`
                }}
            />

            <span
                style={{ color: foreground }}
                className="absolute left-4 top-4 drop-shadow"
            >
                <PlayIcon
                    aria-hidden
                    className="size-4 fill-current sm:size-5"
                />
            </span>

            {isHero && (
                <div
                    style={{
                        color: foreground,
                        backgroundImage: `linear-gradient(to top, ${background} 0%, ${withAlpha(background, 0.85)} 60%, ${withAlpha(background, 0)} 100%)`
                    }}
                    className="absolute inset-x-0 bottom-0 p-4 pt-12 transition-all duration-300"
                >
                    <h3 className="text-base font-bold leading-snug line-clamp-1 sm:text-lg">
                        {show.name}
                    </h3>
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
            )}
        </>
    );
}
