"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAllVideoTags } from "@/modules/videos/presentation/hooks/useAllVideoTags";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CheckIcon, TagsIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useDismiss } from "@/shared/presentation/hooks/useDismiss";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for VideosToolbarAllTagsPopover.
 *
 * @interface VideosToolbarAllTagsPopoverProps
 * @property {string | undefined} value - The active tag slug, or undefined.
 * @property {(tagSlug: string | undefined) => void} onChange - Emits the selected tag slug.
 */
export interface VideosToolbarAllTagsPopoverProps {
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
}

/**
 * VideosToolbarAllTagsPopover
 *
 * @description
 * "All tags" trigger and dropdown: a debounced search over
 * {@link useAllVideoTags} (enabled only while open) rendered as selectable
 * rows. Selecting emits the slug and closes; dismissed on outside-click /
 * Escape via {@link useDismiss}.
 */
export function VideosToolbarAllTagsPopover({
    value,
    onChange
}: VideosToolbarAllTagsPopoverProps) {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search, 300);
    const { data: tags = [] } = useAllVideoTags(debounced, open);

    useDismiss(open, () => setOpen(false), containerRef);

    const select = (slug: string) => {
        onChange(slug === value ? undefined : slug);
        setOpen(false);
        setSearch("");
    };

    return (
        <div
            ref={containerRef}
            className="relative shrink-0"
        >
            <Button
                variant="outline"
                onClick={() => setOpen((previous) => !previous)}
            >
                <TagsIcon className="size-4" />
                {t("videos.browse.filters.allTags")}
            </Button>
            {open && (
                <div className="absolute right-0 z-20 mt-1 flex max-h-72 w-64 flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="shrink-0 p-2">
                        <Input
                            autoFocus
                            value={search}
                            placeholder={t("videos.browse.filters.tagSearch")}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <ul className="flex-1 overflow-y-auto p-1">
                        {tags.map((tag) => (
                            <li key={tag.slug}>
                                <button
                                    type="button"
                                    onClick={() => select(tag.slug)}
                                    className={cn(
                                        "flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                        tag.slug === value && "bg-accent/50"
                                    )}
                                >
                                    <span className="truncate">{tag.name}</span>
                                    {tag.slug === value && (
                                        <CheckIcon className="ml-auto size-4 shrink-0" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
