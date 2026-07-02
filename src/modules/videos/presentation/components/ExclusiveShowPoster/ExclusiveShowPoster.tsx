"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CrownIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

interface ExclusiveShowPosterProps {
    category: IVideoExclusiveShowEntity;
}

/**
 * ExclusiveShowPoster
 *
 * @description
 * Left panel of the exclusive show section — the landscape poster with a gradient
 * overlay, the exclusive tag, the show title and description, and the watch CTA.
 * The chrome labels are read from the i18n context so they update live on a language
 * change; they use suppressHydrationWarning because the section streams in after the
 * provider has applied the persisted language, so the server (default locale) and the
 * late client hydration (persisted locale) can differ on first paint.
 *
 * @param category - The exclusive category (show)
 */
export function ExclusiveShowPoster({ category }: ExclusiveShowPosterProps) {
    const { t } = useTranslation();
    const watchHref = category.episodes[0]
        ? `${VIDEOS_PATH}/${category.episodes[0].slug}`
        : VIDEOS_PATH;

    return (
        <div className="relative min-h-112 lg:min-h-130 lg:border-r lg:border-border">
            {category.posterUrl && (
                <Image
                    fill
                    priority
                    alt={category.title}
                    src={category.posterUrl}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-card via-card via-45% to-transparent" />

            <div className="absolute left-5 top-5">
                <Tag
                    size="md"
                    as="span"
                    variant="primary"
                    className="uppercase tracking-wider"
                    prefix={<CrownIcon className="size-3" />}
                >
                    <span suppressHydrationWarning>{t("videos.exclusiveShow.exclusive")}</span>
                </Tag>
            </div>

            <div className="absolute inset-x-2 sm:inset-x-3 md:inset-x-6 bottom-5 space-y-3">
                <h2 className="text-2xl font-bold leading-tight text-foreground lg:text-xl xl:text-3xl">
                    {category.title}
                </h2>
                <p className="mb-6 text-base sm:text-sm text-muted-foreground line-clamp-4 md:text-base lg:text-sm xl:text-base">
                    {category.description}
                </p>
                <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    <Link href={watchHref}>
                        <PlayIcon className="fill-current" />
                        <span suppressHydrationWarning>{t("videos.home.watchNow")}</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
