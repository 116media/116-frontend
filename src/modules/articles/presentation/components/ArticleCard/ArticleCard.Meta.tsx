"use client";

import { useTranslation } from "react-i18next";

import { ClockIcon } from "@/shared/presentation/components/ui/Icon";
import { Separator } from "@/shared/presentation/components/ui/Separator";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * Props for ArticleCardMeta.
 *
 * @interface ArticleCardMetaProps
 * @property {string} categoryName - The article category display name (rendered as a Tag).
 * @property {number} [readTimeInMinutes] - Estimated reading time in minutes.
 */
export interface ArticleCardMetaProps {
    categoryName: string;
    readTimeInMinutes?: number;
}

/**
 * ArticleCardMeta
 *
 * @description
 * The row above the title: the article category as a Tag and the reading time, separated
 * by a vertical rule. Wraps on narrow cards. The publication date is shown separately in
 * the byline row via {@link ArticleCardDate}.
 *
 * @param categoryName - The category display name.
 * @param readTimeInMinutes - Estimated reading time in minutes.
 */
export function ArticleCardMeta({ categoryName, readTimeInMinutes }: ArticleCardMetaProps) {
    const { t } = useTranslation();
    return (
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <Tag
                as="span"
                size="md"
                variant="outline"
            >
                {categoryName}
            </Tag>
            <Separator
                className="h-4"
                orientation="vertical"
            />
            <span className="flex items-center text-muted-foreground text-xs">
                <ClockIcon className="mr-1 size-3.5" />
                {t("articles.card.readTime", { count: readTimeInMinutes ?? 0 })}
            </span>
        </div>
    );
}
