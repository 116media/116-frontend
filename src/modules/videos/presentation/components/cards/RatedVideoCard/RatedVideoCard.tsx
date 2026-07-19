"use client";

import { useTranslation } from "react-i18next";
import type { IVideoActivityEntity } from "@/modules/videos/domain/entities/IVideoActivityEntity";
import { FavoriteVideoContent } from "@/modules/videos/presentation/components/cards/FavoriteVideoContent";
import { FavoriteCard } from "@/shared/presentation/components/common/FavoriteCard";
import { Button } from "@/shared/presentation/components/ui/Button";

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
 * A rated video tile: the poster body from {@link FavoriteVideoContent} (matching
 * VideoCard.Vertical) plus the caller's own star rating, last-rated date, and a "rate
 * again" action in the favorites slot.
 */
export function RatedVideoCard({ activity, onRateAgain }: RatedVideoCardProps) {
    const { t } = useTranslation();
    const { video } = activity;

    return (
        <FavoriteVideoContent video={video}>
            <div className="-mx-1 mt-auto flex flex-col gap-3 rounded-lg bg-accent/50 p-3 transition-colors group-hover:bg-background">
                <FavoriteCard.Meta
                    dateKind="rated"
                    rating={activity.ratedStars}
                    date={activity.lastInteractedAt}
                />
                <FavoriteCard.Actions>
                    <Button
                        size="sm"
                        className="w-full mt-1"
                        onClick={onRateAgain}
                        variant="brand-outline"
                    >
                        {t("favorites.videos.rateAgain")}
                    </Button>
                </FavoriteCard.Actions>
            </div>
        </FavoriteVideoContent>
    );
}
