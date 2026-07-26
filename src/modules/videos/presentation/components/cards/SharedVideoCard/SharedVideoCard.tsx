"use client";

import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";
import { FavoriteVideoContent } from "@/modules/videos/presentation/components/cards/FavoriteVideoContent";
import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";

/**
 * Props for SharedVideoCard.
 *
 * @interface SharedVideoCardProps
 * @property {IVideoActivityEntity} activity - The shared video with the caller's share tally.
 */
export interface SharedVideoCardProps {
    activity: IVideoActivityEntity;
}

/**
 * SharedVideoCard
 *
 * @description
 * A shared video tile: the poster body from {@link FavoriteVideoContent} (matching
 * VideoCard.Vertical) plus the caller's own share count, last-shared date, and channel in
 * the favorites slot.
 */
export function SharedVideoCard({ activity }: SharedVideoCardProps) {
    const { video } = activity;

    return (
        <FavoriteVideoContent video={video}>
            <FavoriteCard.Meta
                dateKind="shared"
                date={activity.lastInteractedAt}
                shareCount={activity.interactionCount}
                shareChannel={activity.lastShareChannel}
                className="-mx-1 mt-auto flex justify-between gap-3 rounded-lg bg-accent/50 p-3 transition-colors group-hover:bg-background"
            />
        </FavoriteVideoContent>
    );
}
