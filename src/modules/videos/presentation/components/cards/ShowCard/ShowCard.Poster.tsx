import Image from "next/image";
import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the Poster show card part.
 *
 * @interface ShowCardPosterProps
 * @property {IShowEntity} show - The show whose poster fills the card.
 */
export interface ShowCardPosterProps {
    show: IShowEntity;
}

/**
 * Poster
 *
 * @description
 * The poster layer of a show card: the fill image with a color-derived scrim
 * and the corner play glyph. Captions are composed on top by the consuming
 * surface via `ShowCard.Caption`.
 */
export function Poster({ show }: ShowCardPosterProps) {
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
        </>
    );
}
