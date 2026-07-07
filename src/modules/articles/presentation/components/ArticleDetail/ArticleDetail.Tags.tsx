"use client";

import { useTranslation } from "react-i18next";

import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * Props for the ArticleDetail.Tags component.
 *
 * @interface ArticleDetailTagsProps
 * @property {IArticleTagEntity[]} tags - The article's tags.
 */
export interface ArticleDetailTagsProps {
    tags: IArticleTagEntity[];
}

/**
 * ArticleDetail.Tags
 *
 * @description
 * The tag block shown at the end of the article body: an uppercase "Tags:" label followed
 * by each article tag as a Tag pill in the hashtag style (prefix "#") linking to the
 * tag-filtered articles feed (/articles?tagSlug=<slug>). Renders nothing when the article
 * has no tags. Set off from the body above by a token-colored top border.
 *
 * @param tags - The article's tags.
 */
export function ArticleDetailTags({ tags }: ArticleDetailTagsProps) {
    const { t } = useTranslation();

    if (tags.length === 0) return null;
    return (
        <div className="flex flex-wrap items-center gap-1 border-border border-t pt-6">
            <span className="mr-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                {t("articles.detail.tags")}:
            </span>
            {tags.map((tag) => (
                <Tag
                    as="a"
                    size="lg"
                    prefix="#"
                    key={tag.id}
                    variant="default"
                    href={`/articles?tagSlug=${tag.slug}`}
                    className="border-transparent bg-muted text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:hover:border-secondary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
                >
                    {tag.name}
                </Tag>
            ))}
        </div>
    );
}
