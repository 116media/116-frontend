"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { SHOWS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * Props for the VideoExclusiveShowAllEpisodesLink component.
 *
 * @interface VideoExclusiveShowAllEpisodesLinkProps
 * @property {string} [className] - Sizing classes merged onto the button.
 */
export interface VideoExclusiveShowAllEpisodesLinkProps {
    className?: string;
}

/**
 * VideoExclusiveShowAllEpisodesLink
 *
 * @description
 * Outlined CTA linking to the show's page, themed from the show's foreground
 * color so it stays readable over the poster scrim.
 */
export function VideoExclusiveShowAllEpisodesLink({
    className
}: VideoExclusiveShowAllEpisodesLinkProps) {
    const { t } = useTranslation();
    const { category, foreground } = useExclusiveShow();

    return (
        <Button
            asChild
            size="lg"
            variant="outline"
            className={cn("bg-transparent font-semibold hover:bg-foreground/10", className)}
            style={{ color: foreground, borderColor: withAlpha(foreground, 0.4) }}
        >
            <Link href={`${SHOWS_PATH}/${category.slug}`}>
                <span suppressHydrationWarning>{t("videos.exclusiveShow.allEpisodes")}</span>
                <span aria-hidden>→</span>
            </Link>
        </Button>
    );
}
