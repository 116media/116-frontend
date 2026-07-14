"use client";

import { useArticlePopularTags } from "@/modules/articles/presentation/hooks/useArticlePopularTags";
import { orderTags } from "@/modules/articles/presentation/utils/tags/tags.utils";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { ArticlesToolbarAllTagsPopover } from "./ArticlesToolbar.AllTagsPopover";

/**
 * Props for ArticlesToolbarTagStrip.
 *
 * @interface ArticlesToolbarTagStripProps
 * @property {string | undefined} value - The active tag slug, or undefined.
 * @property {(tagSlug: string | undefined) => void} onChange - Emits the selected tag slug.
 */
export interface ArticlesToolbarTagStripProps {
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
}

/**
 * ArticlesToolbarTagStrip
 *
 * @description
 * Scrollable row of popular tag pills plus the {@link ArticlesToolbarAllTagsPopover}
 * trigger. Single-select: the active tag is pinned to the front and clicking it clears
 * the filter.
 */
export function ArticlesToolbarTagStrip({ value, onChange }: ArticlesToolbarTagStripProps) {
    const { data: popular = [] } = useArticlePopularTags();
    return (
        <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
                {orderTags(popular, value).map((tag) => (
                    <Tag
                        size="lg"
                        as="span"
                        prefix="#"
                        shape="pill"
                        key={tag.slug}
                        variant={tag.slug === value ? "primary" : "default"}
                        onClick={() => onChange(tag.slug === value ? undefined : tag.slug)}
                    >
                        {tag.name}
                    </Tag>
                ))}
            </div>
            <ArticlesToolbarAllTagsPopover
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
