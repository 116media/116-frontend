"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { SHOWS_PATH } from "@/shared/presentation/constants/paths";

/**
 * ShowDetailNotFound
 *
 * @description
 * Content of the show route's not-found boundary, rendered when the slug
 * matches no active or dummy show. Shows the shared `EmptyState` with
 * not-found copy and a link back to the shows page.
 */
export function ShowDetailNotFound() {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="show-detail-not-found"
            icon={<PlayIcon className="size-10" />}
            title={t("videos.shows.notFound.title")}
            subtitle={t("videos.shows.notFound.subtitle")}
            action={
                <Button
                    asChild
                    variant="outline"
                >
                    <Link href={SHOWS_PATH}>{t("videos.shows.backToShows")}</Link>
                </Button>
            }
        />
    );
}
