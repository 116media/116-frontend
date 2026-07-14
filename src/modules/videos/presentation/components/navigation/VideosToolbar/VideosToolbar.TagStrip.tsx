"use client";

import { useVideoPopularTags } from "@/modules/videos/presentation/hooks/useVideoPopularTags";
import { orderTags } from "@/modules/videos/presentation/utils/tags/tags.utils";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VideosToolbarAllTagsPopover } from "./VideosToolbar.AllTagsPopover";

/**
 * Props for VideosToolbarTagStrip.
 *
 * @interface VideosToolbarTagStripProps
 * @property {string | undefined} value - The active tag slug, or undefined.
 * @property {(tagSlug: string | undefined) => void} onChange - Emits the selected tag slug.
 */
export interface VideosToolbarTagStripProps {
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
}

/**
 * VideosToolbarTagStrip
 *
 * @description
 * Scrollable row of popular tag pills plus the
 * {@link VideosToolbarAllTagsPopover} trigger. Single-select: the active tag
 * is pinned to the front and clicking it clears the filter.
 */
export function VideosToolbarTagStrip({ value, onChange }: VideosToolbarTagStripProps) {
    const { data: popular = [] } = useVideoPopularTags();
    return (
        <div className="flex items-center gap-2">
            <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
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
            <VideosToolbarAllTagsPopover
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
