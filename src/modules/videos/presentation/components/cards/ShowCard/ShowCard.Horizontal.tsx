"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { SHOWS_PATH } from "@/shared/presentation/constants/paths";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

const TINT_ALPHA_DARK = 0.25;
const TINT_ALPHA_LIGHT = 0.05;

/**
 * Props for the Horizontal show card variant.
 *
 * @interface ShowCardHorizontalProps
 * @property {IShowEntity} show - The show rendered as a themed row card.
 * @property {() => void} [onNavigate] - Fired when the card is clicked (e.g. closes a modal).
 */
export interface ShowCardHorizontalProps {
    show: IShowEntity;
    onNavigate?: () => void;
}

/**
 * Horizontal
 *
 * @description
 * Row-style show card themed with the show's poster-derived colors — poster thumbnail
 * beside the name and a clamped description — linking to the show's page. The color is a
 * wash over the card surface, weighted per theme; the text stays on the theme palette.
 */
export function Horizontal({ show, onNavigate }: ShowCardHorizontalProps) {
    const { resolvedTheme } = useTheme();
    const background = show.colors?.background ?? SHOW_FALLBACK_COLORS.background;
    const tint = withAlpha(
        background,
        resolvedTheme === "light" ? TINT_ALPHA_LIGHT : TINT_ALPHA_DARK
    );

    return (
        <Link
            onClick={onNavigate}
            href={`${SHOWS_PATH}/${show.slug}`}
            style={{ backgroundImage: `linear-gradient(${tint}, ${tint})` }}
            className="flex items-center gap-3 rounded-lg border border-outlined bg-card p-3 text-foreground transition-transform hover:scale-[1.01] hover:opacity-95"
        >
            <span className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-md">
                {show.posterUrl && (
                    <Image
                        fill
                        sizes="96px"
                        alt={show.name}
                        src={show.posterUrl}
                        className="object-cover"
                    />
                )}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-md">{show.name}</span>
                <span className="line-clamp-3 text-muted-foreground text-sm">
                    {show.description}
                </span>
            </span>
        </Link>
    );
}
