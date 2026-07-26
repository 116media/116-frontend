"use client";

import { useTranslation } from "react-i18next";
import type { IShortVideoActivityEntity } from "@/modules/shorts/domain/entities/IShortVideoActivityEntity";
import { ShortCardOverlay } from "@/modules/shorts/presentation/components/cards/ShortCard";
import { useOpenShort } from "@/modules/shorts/presentation/hooks/useOpenShort";
import { useToggleShortBookmark } from "@/modules/shorts/presentation/hooks/useToggleShortBookmark";
import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for FavoriteShortCard.
 *
 * @interface FavoriteShortCardProps
 * @property {IShortVideoActivityEntity} activity - The short and its interaction metadata.
 * @property {"liked" | "saved" | "shared"} variant - Which favorites collection this tile belongs to.
 * @property {(shortId: string) => void} [onRemoved] - Called after an optimistic unbookmark, for the saved variant.
 */
export interface FavoriteShortCardProps {
    onRemoved?: (shortId: string) => void;
    variant: "liked" | "saved" | "shared";
    activity: IShortVideoActivityEntity;
}

/**
 * FavoriteShortCard
 *
 * @description
 * A portrait favorites shorts tile built on {@link FavoriteCard} with per-collection meta:
 * the saved variant adds the saved date and an optimistic unsave overlay; the shared
 * variant shows the caller's own share count and latest date; the liked variant shows
 * the latest liked date. Every variant keeps its activity metadata at the card bottom.
 */
export function FavoriteShortCard({ activity, variant, onRemoved }: FavoriteShortCardProps) {
    const { t } = useTranslation();
    const short = activity.shortVideo;
    const openShort = useOpenShort();
    const { toggle } = useToggleShortBookmark(short.id, short.bookmarkCount, true);
    const onOpen = () => openShort(short.slug);

    const remove = () => {
        toggle();
        onRemoved?.(short.id);
    };

    return (
        <FavoriteCard className="relative aspect-9/16 h-auto">
            <FavoriteCard.Media
                aspect="portrait"
                alt={short.title}
                onOpen={onOpen}
                scaleOnHover={false}
                thumbnailUrl={short.thumbnailUrl}
                icon={<PlayIcon className="size-8" />}
                sizes="(max-width: 640px) 50vw, 160px"
                className="absolute inset-0 aspect-auto"
            >
                <ShortCardOverlay
                    title={short.title}
                    viewCount={short.viewCount}
                >
                    <FavoriteCard.Meta
                        dateKind={variant}
                        date={activity.lastInteractedAt}
                        shareCount={variant === "shared" ? activity.interactionCount : undefined}
                        className="mt-1 flex items-center justify-center gap-x-4 gap-y-1 rounded-md bg-black/45 p-3 text-white/80 text-xs backdrop-blur-sm"
                    />
                </ShortCardOverlay>
                {variant === "saved" && (
                    <FavoriteCard.Remove
                        icon="bookmark"
                        onRemove={remove}
                        label={t("favorites.playlist.removeVideo")}
                    />
                )}
            </FavoriteCard.Media>
        </FavoriteCard>
    );
}
