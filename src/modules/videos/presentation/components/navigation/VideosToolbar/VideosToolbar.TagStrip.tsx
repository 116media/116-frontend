"use client";

import { useVideoPopularTags } from "@/modules/videos/presentation/hooks/useVideoPopularTags";
import { orderTags } from "@/modules/videos/presentation/utils/tags/tags.utils";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { VideosToolbarAllTagsPopover } from "./VideosToolbar.AllTagsPopover";

const TAG_SKELETON_WIDTHS = ["w-16", "w-24", "w-20", "w-14", "w-28", "w-12", "w-32"];

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
    const { data: popular = [], isPending } = useVideoPopularTags();
    return (
        <div className="flex items-center gap-2">
            <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
                {isPending &&
                    TAG_SKELETON_WIDTHS.map((width) => (
                        <Skeleton
                            key={width}
                            className={cn("h-8 shrink-0 rounded-md", width)}
                        />
                    ))}
                {!isPending &&
                    orderTags(popular, value).map((tag) => (
                    <Tag
                        size="lg"
                        as="span"
                        prefix="#"
                        shape="pill"
                        key={tag.slug}
                        variant={tag.slug === value ? "primary" : "default"}
                        onClick={() => onChange(tag.slug === value ? undefined : tag.slug)}
                        className={tag.slug === value ? undefined : "border-border bg-surface-raised"}
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
