"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn";
import type { VideosMegaCategoryListProps } from "./types";

/**
 * VideosMegaCategoryList
 *
 * @description
 * Left column of the videos mega menu.
 * Renders each video category as a link to the videos list
 * filtered by that category. Category names use brighter foreground
 * styling to stand out from the section label. A chevron icon on
 * the right reinforces the navigational intent.
 */
export function VideosMegaCategoryList({ categories }: VideosMegaCategoryListProps) {
    return (
        <div className="flex flex-col">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catégories
            </p>
            <div className="mb-2 h-px bg-border/60 mx-3" />
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`${VIDEOS_PATH}?categoryId=${category.id}`}
                    className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-2 transition-colors",
                        "hover:bg-accent"
                    )}
                >
                    <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground">
                        {category.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
