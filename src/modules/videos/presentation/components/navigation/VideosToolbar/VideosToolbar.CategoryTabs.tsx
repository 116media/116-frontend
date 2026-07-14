"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { VIDEO_BROWSE_CHIP_LIMIT } from "@/modules/videos/presentation/constants/videoKeys";
import { useVideoCategories } from "@/modules/videos/presentation/hooks/useVideoCategories";
import { Button } from "@/shared/presentation/components/ui/Button";
import { LayoutGridIcon } from "@/shared/presentation/components/ui/Icon";
import { Tabs, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

const EDGE_SLACK = 4;
const ALL_TAB_VALUE = "all";

/**
 * Props for VideosToolbarCategoryTabs.
 *
 * @interface VideosToolbarCategoryTabsProps
 * @property {string | undefined} value - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onChange - Emits the category id.
 * @property {() => void} onBrowseAll - Opens the "browse all shows" modal.
 */
export interface VideosToolbarCategoryTabsProps {
    value: string | undefined;
    onBrowseAll: () => void;
    onChange: (categoryId: string | undefined) => void;
}

/**
 * VideosToolbarCategoryTabs
 *
 * @description
 * Swipeable single-select category bar for the browse feed, styled like the
 * video detail tabs: an "All" tab plus the categories up to the chip limit
 * (the active one always included), with edge fades signalling overflow and
 * the active tab auto-scrolled into view. The "browse all shows" trigger
 * opens the full modal list.
 */
export function VideosToolbarCategoryTabs({
    value,
    onChange,
    onBrowseAll
}: VideosToolbarCategoryTabsProps) {
    const { t } = useTranslation();
    const { data: categories = [] } = useVideoCategories();

    const railRef = useRef<HTMLDivElement>(null);
    const [overflow, setOverflow] = useState({ left: false, right: false });

    const visible = categories.slice(0, VIDEO_BROWSE_CHIP_LIMIT);
    const active = categories.find((category) => category.id === value);
    const tabs =
        active && !visible.some((category) => category.id === active.id)
            ? [active, ...visible.slice(0, -1)]
            : visible;

    const updateOverflow = useCallback(() => {
        const rail = railRef.current;
        if (!rail) return;
        setOverflow({
            left: rail.scrollLeft > EDGE_SLACK,
            right: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - EDGE_SLACK
        });
    }, []);

    useEffect(() => {
        updateOverflow();
        window.addEventListener("resize", updateOverflow);
        return () => window.removeEventListener("resize", updateOverflow);
    }, [updateOverflow]);

    // Keep the active tab visible when it changes (e.g. a mega-menu deep link).
    useEffect(() => {
        const activeTab = railRef.current?.querySelector<HTMLElement>('[data-state="active"]');
        activeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }, []);

    return (
        <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="relative min-w-0 flex-1">
                <div
                    ref={railRef}
                    onScroll={updateOverflow}
                    className="scrollbar-hide overflow-x-auto"
                >
                    <Tabs
                        size="md"
                        value={value ?? ALL_TAB_VALUE}
                        onValueChange={(next) =>
                            onChange(next === ALL_TAB_VALUE ? undefined : next)
                        }
                    >
                        <TabsList className="w-max rounded-md">
                            <TabsTrigger
                                value={ALL_TAB_VALUE}
                                className="shrink-0 whitespace-nowrap"
                            >
                                {t("videos.browse.filters.all")}
                            </TabsTrigger>
                            {tabs.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="shrink-0 whitespace-nowrap"
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                <div
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-background to-transparent opacity-0 transition-opacity",
                        overflow.left && "opacity-100"
                    )}
                />
                <div
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent opacity-0 transition-opacity",
                        overflow.right && "opacity-100"
                    )}
                />
            </div>

            <Button
                size="lg"
                variant="outline"
                className="shrink-0"
                onClick={onBrowseAll}
            >
                <LayoutGridIcon className="size-4" />
                {t("videos.browse.filters.browseAllShows")}
            </Button>
        </div>
    );
}
