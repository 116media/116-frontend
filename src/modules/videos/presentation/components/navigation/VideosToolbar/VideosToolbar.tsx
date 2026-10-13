"use client";

import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { VideosCategoriesModal } from "@/modules/videos/presentation/components/modals/VideosCategoriesModal";
import { useFilterBarPinned } from "@/shared/presentation/hooks/useFilterBarPinned";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { VideosToolbarCategoryTabs } from "./VideosToolbar.CategoryTabs";
import { VideosToolbarClearFilters } from "./VideosToolbar.ClearFilters";
import { VideosToolbarSearchInput } from "./VideosToolbar.SearchInput";
import { VideosToolbarTagStrip } from "./VideosToolbar.TagStrip";

/**
 * Props for VideosToolbar.
 *
 * @interface VideosToolbarProps
 * @property {string} search - The current (raw) search text.
 * @property {(value: string) => void} onSearchChange - Emits the search text.
 * @property {string | undefined} categoryId - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onCategoryChange - Emits the category.
 * @property {string | undefined} tagSlug - The selected tag slug, or undefined for none.
 * @property {(tagSlug: string | undefined) => void} onTagChange - Emits the tag.
 * @property {boolean} hasActiveFilters - Whether any filter is set (shows "Clear filters").
 * @property {() => void} onClear - Clears all filters.
 */
export interface VideosToolbarProps {
    search: string;
    tagSlug: string | undefined;
    categoryId: string | undefined;
    hasActiveFilters: boolean;
    onSearchChange: (value: string) => void;
    onCategoryChange: (categoryId: string | undefined) => void;
    onTagChange: (tagSlug: string | undefined) => void;
    onClear: () => void;
}

/**
 * VideosToolbar
 *
 * @description
 * Filter region of the videos browse feed: the browse title, the category
 * tabs with the "browse all shows" trigger, the video search, and the
 * popular-tags strip, as one sticky group pinned under the navbar. In its
 * natural position it scrolls like regular content; once pinned it stays put and the
 * header stands its own search field down for as long as it is pinned. Fully
 * controlled — the container owns the filter state.
 */
export function VideosToolbar(props: VideosToolbarProps) {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const { sentinelRef, isPinned, isHidden } = useFilterBarPinned();

    return (
        <Fragment>
            <div
                aria-hidden
                className="h-px"
                ref={sentinelRef}
            />
            <div
                className={cn(
                    "sticky top-28 z-30 flex flex-col gap-3 py-3",
                    "before:-z-10 before:-translate-x-1/2 before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:bg-background/95 before:backdrop-blur",
                    isPinned &&
                        "before:border-b before:border-outlined/60 transition-transform duration-300",
                    isHidden && "-translate-y-[calc(100%+1px)]"
                )}
            >
                <h2
                    suppressHydrationWarning
                    className="text-xl font-bold tracking-wide text-foreground sm:text-2xl lg:text-3xl"
                >
                    {t("videos.browse.title")}
                </h2>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <VideosToolbarCategoryTabs
                        value={props.categoryId}
                        onChange={props.onCategoryChange}
                        onBrowseAll={() => setModalOpen(true)}
                    />
                    <VideosToolbarSearchInput
                        value={props.search}
                        onChange={props.onSearchChange}
                    />
                </div>

                <VideosToolbarTagStrip
                    value={props.tagSlug}
                    onChange={props.onTagChange}
                />

                {props.hasActiveFilters && <VideosToolbarClearFilters onClear={props.onClear} />}
            </div>

            <VideosCategoriesModal
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </Fragment>
    );
}
