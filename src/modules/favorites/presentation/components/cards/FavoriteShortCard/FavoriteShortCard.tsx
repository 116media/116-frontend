"use client";

import { useTranslation } from "react-i18next";

import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import type { IShortVideoActivityEntity } from "@/modules/shorts/domain/entities/IShortVideoActivityEntity";
import { useToggleShortBookmark } from "@/modules/shorts/presentation/hooks/useToggleShortBookmark";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for FavoriteShortCard.
 *
 * @interface FavoriteShortCardProps
 * @property {IShortVideoActivityEntity} activity - The short and its interaction metadata.
 * @property {() => void} onOpen - Opens the short (navigates to its detail page).
 * @property {"liked" | "saved" | "shared"} variant - Which favorites collection this tile belongs to.
 * @property {(shortId: string) => void} [onRemoved] - Called after an optimistic unbookmark, for the saved variant.
 */
export interface FavoriteShortCardProps {
    onOpen: () => void;
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
 * variant shows the caller's own share count and latest date; liked is title-only.
 */
export function FavoriteShortCard({
    activity,
    onOpen,
    variant,
    onRemoved
}: FavoriteShortCardProps) {
    const { t } = useTranslation();
    const short = activity.shortVideo;
    const { toggle } = useToggleShortBookmark(short.id, short.bookmarkCount, true);

    const remove = () => {
        toggle();
        onRemoved?.(short.id);
    };

    return (
        <FavoriteCard>
            <FavoriteCard.Media
                aspect="portrait"
                alt={short.title}
                onOpen={onOpen}
                thumbnailUrl={short.thumbnailUrl}
                icon={<PlayIcon className="size-8" />}
                sizes="(max-width: 640px) 50vw, 160px"
            >
                {variant === "saved" && (
                    <FavoriteCard.Remove
                        icon="bookmark"
                        onRemove={remove}
                        label={t("favorites.playlist.removeVideo")}
                    />
                )}
            </FavoriteCard.Media>
            <FavoriteCard.Body>
                <FavoriteCard.Title onOpen={onOpen}>{short.title}</FavoriteCard.Title>
                {variant === "saved" && (
                    <FavoriteCard.Meta
                        dateKind="saved"
                        date={activity.lastInteractedAt}
                    />
                )}
                {variant === "shared" && (
                    <FavoriteCard.Meta
                        dateKind="shared"
                        date={activity.lastInteractedAt}
                        shareCount={activity.interactionCount}
                    />
                )}
            </FavoriteCard.Body>
        </FavoriteCard>
    );
}
