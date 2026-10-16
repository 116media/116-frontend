"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAllVideoTags } from "@/modules/videos/presentation/hooks/useAllVideoTags";
import { TagPicker } from "@/shared/presentation/components/ui/TagPicker";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";

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
 * The videos feed's tag filter: owns the open state and the debounced search that
 * {@link useAllVideoTags} runs while open, and hands both to the shared {@link TagPicker} along with
 * this feed's own copy.
 */
export function VideosToolbarAllTagsPopover({ value, onChange }: VideosToolbarAllTagsPopoverProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search, 300);
    const { data: tags = [] } = useAllVideoTags(debounced, open);

    return (
        <TagPicker
            tags={tags}
            open={open}
            value={value}
            search={search}
            onChange={onChange}
            onOpenChange={setOpen}
            onSearchChange={setSearch}
            labels={{
                title: t("videos.browse.filters.allTags"),
                close: t("videos.browse.filters.tagsClose"),
                trigger: t("videos.browse.filters.tagsTrigger"),
                searchPlaceholder: t("videos.browse.filters.tagSearch"),
                clearSearch: t("videos.browse.filters.clearSearch"),
                empty: t("videos.browse.filters.tagsEmpty")
            }}
        />
    );
}
