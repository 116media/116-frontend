"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";

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
 * primitive (the single-page tab look) with a per-collection count badge. Switching
 * writes the chosen collection to the `collection` query param via `router.replace`,
 * preserving the pathname so only the active island section changes.
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
            <TabsList className="flex-wrap">
                {collections.map(({ key, count }) => {
                    const Icon = COLLECTION_ICONS[key];
                    return (
                        <TabsTrigger
                            key={key}
                            value={key}
                        >
                            <span className="flex items-center gap-1.5">
                                {Icon && <Icon className="size-4" />}
                                {t(`favorites.collections.${key}`)}
                                {count !== undefined && (
                                    <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs tabular-nums">
                                        {formatCount(count)}
                                    </span>
                                )}
                            </span>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}
