"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/shared/presentation/components/ui/Button";
import { FilmIcon } from "@/shared/presentation/components/ui/Icon";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ShortsPlayerFullVideoLink component.
 *
 * @interface ShortsPlayerFullVideoLinkProps
 * @property {string} videoSlug - The parent full video's slug.
 */
export interface ShortsPlayerFullVideoLinkProps {
    videoSlug: string;
}

/**
 * ShortsPlayerFullVideoLink
 *
 * @description
 * Frosted pill linking a teaser short to its parent full-length video's detail page.
 * Rendered only when the short is linked to a full video.
 */
export function ShortsPlayerFullVideoLink({ videoSlug }: ShortsPlayerFullVideoLinkProps) {
    const { t } = useTranslation();

    return (
        <Link
            href={`${VIDEOS_PATH}/${videoSlug}`}
            className={cn(
                buttonVariants({ size: "sm" }),
                "absolute bottom-28 left-4 z-30 gap-1.5 rounded-lg bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            )}
        >
            <FilmIcon className="size-4" />
            {t("shorts.actions.watchFullVideo")}
        </Link>
    );
}
