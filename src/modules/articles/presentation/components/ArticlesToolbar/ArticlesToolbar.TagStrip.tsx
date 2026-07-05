"use client";

import { useArticlePopularTags } from "@/modules/articles/presentation/hooks/useArticlePopularTags";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { ArticlesToolbarAllTagsPopover } from "./ArticlesToolbar.AllTagsPopover";
import { orderTags } from "./orderTags";

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
 * A horizontally scrollable row of popular tag pills plus an "All tags" trigger opening
 * {@link ArticlesToolbarAllTagsPopover}. Single-select: the active tag is highlighted and
 * pinned to the front; clicking it clears the filter. Emits `tagSlug | undefined`.
 *
 * @param value - The active tag slug, or undefined.
 * @param onChange - Emits the selected tag slug (undefined to clear).
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
                        key={tag.slug}
                        variant={tag.slug === value ? "primary" : "outline"}
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
