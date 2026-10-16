"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAllTags } from "@/modules/articles/presentation/hooks/useAllTags";
import { TagPicker } from "@/shared/presentation/components/ui/TagPicker";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";

/**
 * Props for ArticlesToolbarAllTagsPopover.
 *
 * @interface ArticlesToolbarAllTagsPopoverProps
 * @property {string | undefined} value - The active tag slug, or undefined.
 * @property {(tagSlug: string | undefined) => void} onChange - Emits the selected tag slug.
 */
export interface ArticlesToolbarAllTagsPopoverProps {
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
}

/**
 * ArticlesToolbarAllTagsPopover
 *
 * @description
 * The articles feed's tag filter: owns the open state and the debounced search that
 * {@link useAllTags} runs while open, and hands both to the shared {@link TagPicker} along with
 * this feed's own copy.
 */
export function ArticlesToolbarAllTagsPopover({
    value,
    onChange
}: ArticlesToolbarAllTagsPopoverProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search, 300);
    const { data: tags = [] } = useAllTags(debounced, open);

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
                title: t("articles.filters.allTags"),
                close: t("articles.filters.tagsClose"),
                trigger: t("articles.filters.tagsTrigger"),
                searchPlaceholder: t("articles.filters.tagSearch"),
                clearSearch: t("articles.filters.clearSearch"),
                empty: t("articles.filters.tagsEmpty")
            }}
        />
    );
}
