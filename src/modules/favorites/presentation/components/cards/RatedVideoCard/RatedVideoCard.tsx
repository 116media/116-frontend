"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FavoriteCard } from "@/modules/favorites/presentation/components/cards/FavoriteCard";
import { FavoriteVideoContent } from "@/modules/favorites/presentation/components/cards/FavoriteVideoContent";
import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FilmIcon } from "@/shared/presentation/components/ui/Icon";
import { VIDEO_DETAIL_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for RatedVideoCard.
 *
 * @interface RatedVideoCardProps
 * @property {IVideoActivityEntity} activity - The rated video and the caller's star rating.
 * @property {() => void} onRateAgain - Opens the rating modal seeded with the prior stars.
 */
export interface RatedVideoCardProps {
    activity: IVideoActivityEntity;
    onRateAgain: () => void;
}

/**
 * RatedVideoCard
 *
 * @description
 * A rated video tile: 16:9 thumbnail media plus the base video body (title, date, share
 * count, rating) with the caller's own star rating, last-rated date, and a "rate again"
 * action in the favorites slot.
 */
export function RatedVideoCard({ activity, onRateAgain }: RatedVideoCardProps) {
    const { t } = useTranslation();
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
                    rating={activity.ratedStars}
                    dateKind="rated"
                    date={activity.lastInteractedAt}
                />
                <FavoriteCard.Actions>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRateAgain}
                    >
                        {t("favorites.videos.rateAgain")}
                    </Button>
                </FavoriteCard.Actions>
            </FavoriteVideoContent>
        </FavoriteCard>
    );
}
