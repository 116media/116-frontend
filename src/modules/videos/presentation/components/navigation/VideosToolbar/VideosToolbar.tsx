"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { VideosCategoriesModal } from "@/modules/videos/presentation/components/modals/VideosCategoriesModal";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";
import { useScrollDirection } from "@/shared/presentation/hooks/useScrollDirection";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { VideosToolbarCategoryTabs } from "./VideosToolbar.CategoryTabs";
import { VideosToolbarSearchInput } from "./VideosToolbar.SearchInput";
import { VideosToolbarTagStrip } from "./VideosToolbar.TagStrip";

/**
 * Sentinel options matching the toolbar's sticky offset (`top-28`, under the
 * sticky TopBar + Header stack): the sentinel counts as gone — the toolbar as
 * pinned — once it crosses that line. Module-level so the observer is stable.
 */
const PINNED_SENTINEL_OPTIONS: IntersectionObserverInit = {
    rootMargin: "-112px 0px 0px 0px"
};

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
 */
export interface VideosToolbarProps {
    search: string;
    tagSlug: string | undefined;
    categoryId: string | undefined;
    onSearchChange: (value: string) => void;
    onCategoryChange: (categoryId: string | undefined) => void;
    onTagChange: (tagSlug: string | undefined) => void;
}

/**
 * VideosToolbar
 *
 * @description
 * Filter region of the videos browse feed: the browse title, the category
 * tabs with the "browse all shows" trigger, the video search, and the
 * popular-tags strip, as one sticky group pinned under the navbar. In its
 * natural position it scrolls like regular content; once pinned it hides while
 * scrolling down and reveals on scroll-up. Fully controlled — the container
 * owns the filter state.
 */
export function VideosToolbar(props: VideosToolbarProps) {
    const { t } = useTranslation();
    const direction = useScrollDirection();
    const [modalOpen, setModalOpen] = useState(false);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(PINNED_SENTINEL_OPTIONS);
    const isPinned = !isSentinelVisible;
    const isHidden = isPinned && direction === "down";

    return (
        <>
            <div
                aria-hidden
                className="h-px"
                ref={sentinelRef}
            />
            <div
                className={cn(
                    "sticky top-28 z-30 flex flex-col gap-3 py-3",
                    "before:-z-10 before:-translate-x-1/2 before:absolute before:inset-y-0 before:left-1/2 before:w-screen before:bg-background/95 before:backdrop-blur",
                    isPinned && "before:border-b before:border-border/50 transition-all duration-300",
                    isHidden && "-translate-y-2 pointer-events-none opacity-0"
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
            </div>

            <VideosCategoriesModal
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </>
    );
}
