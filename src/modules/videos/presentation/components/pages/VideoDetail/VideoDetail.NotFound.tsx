"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

/**
 * VideoDetailNotFound
 *
 * @description
 * Content of the video route's not-found boundary, rendered when
 * `getVideoBySlug` reports the slug missing or unpublished. Shows the shared
 * `EmptyState` with not-found copy and a link back to the videos page.
 */
export function VideoDetailNotFound() {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="video-detail-not-found"
            icon={<PlayIcon className="size-10" />}
            title={t("videos.detail.notFound.title")}
            subtitle={t("videos.detail.notFound.subtitle")}
            action={
                <Button
                    asChild
                    variant="outline"
                >
                    <Link href={VIDEOS_PATH}>{t("videos.detail.backToVideos")}</Link>
                </Button>
            }
        />
    );
}
