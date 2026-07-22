"use client";

import { useRouter } from "next/navigation";

import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import { FavoriteVideoContent } from "@/modules/favorites/presentation/components/cards/FavoriteVideoContent";
import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";
import { FilmIcon } from "@/shared/presentation/components/ui/Icon";
import { VIDEO_DETAIL_PATH } from "@/shared/presentation/constants/paths";

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
 * A shared video tile: 16:9 thumbnail media plus the base video body (title, date, share
 * count, rating) with the caller's own share count, last-shared date, and channel in the
 * favorites slot.
 */
export function SharedVideoCard({ activity }: SharedVideoCardProps) {
    const router = useRouter();
    const { video } = activity;
    const href = VIDEO_DETAIL_PATH.replace(":slug", video.slug);

    return (
        <FavoriteCard>
            <FavoriteCard.Media
                aspect="video"
                alt={video.title}
                thumbnailUrl={video.thumbnailUrl}
                onOpen={() => router.push(href)}
                icon={<FilmIcon className="size-10" />}
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
            <FavoriteVideoContent video={video}>
                <FavoriteCard.Meta
                    dateKind="shared"
                    date={activity.lastInteractedAt}
                    shareCount={activity.interactionCount}
                    shareChannel={activity.lastShareChannel}
                />
            </FavoriteVideoContent>
        </FavoriteCard>
    );
}
