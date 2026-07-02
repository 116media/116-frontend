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
 * The content of the video route's not-found boundary, rendered when
 * `getVideoBySlug` reports the slug is missing or unpublished and the page
 * calls Next's `notFound()`. Shows the shared `EmptyState` with the not-found
 * copy and a link back to the videos page, so a dead link resolves to a clear
 * dead-end rather than a stack trace.
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
