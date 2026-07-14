"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for VideosGridEmpty.
 *
 * @interface VideosGridEmptyProps
 * @property {boolean} [filtered] - Whether the emptiness is due to active filters.
 * @property {() => void} [onClear] - Clears all filters (shown only when `filtered`).
 */
export interface VideosGridEmptyProps {
    filtered?: boolean;
    onClear?: () => void;
}

/**
 * VideosGridEmpty
 *
 * @description
 * Empty state for the videos grid. With `filtered`, the current
 * search/category/tag matched nothing and a "Clear filters" action is offered;
 * without it, the feed itself has no content.
 */
export function VideosGridEmpty({ filtered, onClear }: VideosGridEmptyProps) {
    const { t } = useTranslation();
    const key = filtered ? "noResults" : "empty";
    return (
        <EmptyState
            context="videos-feed"
            title={t(`videos.browse.grid.${key}.title`)}
            subtitle={t(`videos.browse.grid.${key}.body`)}
            icon={<PlayIcon className="size-16" />}
            action={
                filtered && onClear ? (
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={onClear}
                    >
                        {t("videos.browse.filters.clear")}
                    </Button>
                ) : undefined
            }
        />
    );
}
