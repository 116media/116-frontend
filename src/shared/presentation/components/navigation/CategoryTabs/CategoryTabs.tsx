"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

const EDGE_SLACK = 4;
const ALL_TAB_VALUE = "all";
const DEFAULT_LIMIT = 12;

const COMPACT_TRIGGER = [
    "shrink-0 whitespace-nowrap px-2.5 py-1.5 text-sm sm:px-3",
    "hover:text-foreground",
    "data-[state=active]:bg-background data-[state=active]:text-foreground",
    "data-[state=active]:shadow-sm"
].join(" ");

/**
 * A selectable category in the rail.
 *
 * @interface ICategoryTab
 * @property {string} id - The category id emitted on selection.
 * @property {string} name - The label rendered on the tab.
 */
export interface ICategoryTab {
    id: string;
    name: string;
}

/**
 * Props for CategoryTabs.
 *
 * @interface CategoryTabsProps
 * @property {string | undefined} value - The selected category id, or undefined for all.
 * @property {ICategoryTab[]} categories - The categories to offer, in display order.
 * @property {string} allLabel - Label for the leading "all" tab.
 * @property {(categoryId: string | undefined) => void} onChange - Emits the category id.
 * @property {number} [limit] - How many categories to render before overflow.
 * @property {ReactNode} [action] - Trailing control beside the rail, e.g. a "browse all" trigger.
 */
export interface CategoryTabsProps {
    limit?: number;
    allLabel: string;
    action?: ReactNode;
    value: string | undefined;
    categories: ICategoryTab[];
    onChange: (categoryId: string | undefined) => void;
}

/**
 * CategoryTabs
 *
 * @description
 * Swipeable single-select category rail shared by the browse feeds: an "all" tab plus the
 * categories up to the limit (the active one always included), with edge fades signalling
 * overflow and the active tab auto-scrolled into view. Its track is the `filter-rail`
 * surface, kept apart from the search field's, and it spans the full row only on mobile.
 */
export function CategoryTabs({
    value,
    categories,
    allLabel,
    onChange,
    limit = DEFAULT_LIMIT,
    action
}: CategoryTabsProps) {
    const railRef = useRef<HTMLDivElement>(null);
    const [overflow, setOverflow] = useState({ left: false, right: false });

    const visible = categories.slice(0, limit);
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

    // Bring the active tab into the rail on mount, e.g. a mega-menu deep link selecting a
    // category that sits past the fold of the strip. The rail is scrolled directly rather
    // than through `scrollIntoView`, which would also scroll the page down to it.
    useEffect(() => {
        const rail = railRef.current;
        const activeTab = rail?.querySelector<HTMLElement>('[data-state="active"]');
        if (!rail || !activeTab) return;

        const left = activeTab.offsetLeft;
        const right = left + activeTab.offsetWidth;
        const isVisible = left >= rail.scrollLeft && right <= rail.scrollLeft + rail.clientWidth;
        if (isVisible) return;

        rail.scrollTo({ left: left - EDGE_SLACK, behavior: "smooth" });
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
                        <TabsList className="w-max min-w-full rounded-md bg-filter-rail sm:min-w-0">
                            <TabsTrigger
                                value={ALL_TAB_VALUE}
                                className={COMPACT_TRIGGER}
                            >
                                {allLabel}
                            </TabsTrigger>
                            {tabs.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className={COMPACT_TRIGGER}
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

            {action}
        </div>
    );
}
