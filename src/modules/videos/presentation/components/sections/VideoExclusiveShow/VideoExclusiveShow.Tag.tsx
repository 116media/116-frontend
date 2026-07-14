"use client";

import { useTranslation } from "react-i18next";
import { CrownIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the VideoExclusiveShowTag component.
 *
 * @interface VideoExclusiveShowTagProps
 * @property {string} [className] - Placement classes merged onto the tag.
 */
export interface VideoExclusiveShowTagProps {
    className?: string;
}

/**
 * VideoExclusiveShowTag
 *
 * @description
 * The crown-prefixed "Exclusive" tag shared by both exclusive show layouts.
 * suppressHydrationWarning guards the streamed-in language label.
 */
export function VideoExclusiveShowTag({ className }: VideoExclusiveShowTagProps) {
    const { t } = useTranslation();

    return (
        <Tag
            size="md"
            as="span"
            variant="primary"
            className={cn("uppercase tracking-wider", className)}
            prefix={<CrownIcon className="size-3" />}
        >
            <span suppressHydrationWarning>{t("videos.exclusiveShow.exclusive")}</span>
        </Tag>
    );
}
