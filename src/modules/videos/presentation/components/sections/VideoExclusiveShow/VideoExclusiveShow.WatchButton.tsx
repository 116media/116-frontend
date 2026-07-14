"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/presentation/components/ui/Button";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { useExclusiveShow } from "@/modules/videos/presentation/context/ExclusiveShowProvider";

/**
 * Props for the VideoExclusiveShowWatchButton component.
 *
 * @interface VideoExclusiveShowWatchButtonProps
 * @property {string} [className] - Sizing classes merged onto the button.
 */
export interface VideoExclusiveShowWatchButtonProps {
    className?: string;
}

/**
 * VideoExclusiveShowWatchButton
 *
 * @description
 * The primary watch CTA shared by both layouts, linking to the show's most
 * recently published episode (resolved by the Root context).
 */
export function VideoExclusiveShowWatchButton({ className }: VideoExclusiveShowWatchButtonProps) {
    const { t } = useTranslation();
    const { watchHref } = useExclusiveShow();

    return (
        <Button
            asChild
            size="lg"
            className={className}
        >
            <Link href={watchHref}>
                <PlayIcon className="fill-current" />
                <span suppressHydrationWarning>{t("videos.home.watchNow")}</span>
            </Link>
        </Button>
    );
}
