"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/presentation/components/ui/Badge";
import {
    BookmarkIcon,
    HeartIcon,
    ListVideoIcon,
    MessageSquareIcon,
    ShareIcon,
    StarIcon
} from "@/shared/presentation/components/ui/Icon";
import { Tabs, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";
import { FAVORITES_COLLECTION_PARAM } from "@/shared/presentation/constants/favorites";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

const COLLECTION_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    bookmarked: BookmarkIcon,
    commented: MessageSquareIcon,
    liked: HeartIcon,
    shared: ShareIcon,
    playlists: ListVideoIcon,
    rated: StarIcon,
    saved: BookmarkIcon
};

/**
 * One selectable favorites collection tab, with its total item count.
 *
 * @interface FavoriteLayoutTab
 * @property {string} key - The collection key (also the `collection` query value).
 * @property {number} [count] - Total items in the collection, shown as a badge.
 */
export interface FavoriteLayoutTab {
    key: string;
    count?: number;
}

/**
 * Props for FavoriteLayout.Tabs.
 *
 * @interface FavoriteLayoutTabsProps
 * @property {ReadonlyArray<FavoriteLayoutTab>} collections - The route's allow-listed collections (max four), in display order.
 * @property {string} active - The currently active collection, already normalized by the container.
 */
export interface FavoriteLayoutTabsProps {
    collections: ReadonlyArray<FavoriteLayoutTab>;
    active: string;
}

/**
 * FavoriteLayout.Tabs
 *
 * @description
 * Route-scoped selector for the inner collection view, built on the shared `Tabs`
 * primitive (the single-page tab look) with a per-collection count badge. Below `sm` the
 * track spans the width and each tab stacks its icon over its name with the count as a
 * badge on the icon, so every tab keeps its label in one row. Switching writes the chosen
 * collection to the `collection` query param via `router.replace`, preserving the pathname
 * so only the active island section changes.
 */
export function FavoriteLayoutTabs({ collections, active }: FavoriteLayoutTabsProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const select = (collection: string) => {
        if (collection === active) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set(FAVORITES_COLLECTION_PARAM, collection);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Tabs
            size="md"
            value={active}
            onValueChange={select}
        >
            <TabsList className="flex w-full flex-nowrap sm:inline-flex sm:w-auto">
                {collections.map(({ key, count }) => {
                    const Icon = COLLECTION_ICONS[key];
                    return (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="min-w-0 flex-1 px-2 py-2 sm:flex-none sm:px-3 sm:py-1.5"
                        >
                            <span className="flex flex-col items-center gap-1 sm:flex-row sm:gap-1.5">
                                <span className="relative">
                                    {Icon && <Icon className="size-4" />}
                                    {count !== undefined && (
                                        <Badge
                                            variant="muted"
                                            className="-top-2 -right-3 absolute px-1.5 py-0 font-medium text-[10px] tabular-nums leading-4 sm:hidden"
                                        >
                                            {formatCount(count)}
                                        </Badge>
                                    )}
                                </span>
                                <span className="max-w-full truncate text-xs sm:text-sm">
                                    {t(`favorites.collections.${key}`)}
                                </span>
                                {count !== undefined && (
                                    <Badge
                                        variant="muted"
                                        className="hidden px-1.5 font-medium tabular-nums sm:inline-flex"
                                    >
                                        {formatCount(count)}
                                    </Badge>
                                )}
                            </span>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}
