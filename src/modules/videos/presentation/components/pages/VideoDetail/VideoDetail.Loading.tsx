"use client";

import { useTranslation } from "react-i18next";

import { VideosPopularSidebarLoading } from "@/modules/videos/presentation/components/sections/VideosPopularSidebar/VideosPopularSidebar.Loading";
import { FlameIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

const SCOREBOARD_COLUMNS = [0, 1, 2];

const TAG_CHIPS = [0, 1, 2, 3];

const DESCRIPTION_LINES = [0, 1, 2, 3, 4, 5];

/**
 * ScoreboardColumnSkeleton
 *
 * @description
 * One column of the header scoreboard skeleton — a label line, a large value
 * block, and a muted secondary line — matching the rating / views / likes
 * columns of the resolved scoreboard.
 */
function ScoreboardColumnSkeleton() {
    return (
        <div className="flex flex-col items-center gap-1.5 px-2 py-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

/**
 * VideoDetailLoading
 *
 * @description
 * Full-page skeleton for the video detail route, mirroring the resolved
 * {@link VideoDetail} layout. Every block is the shared `Skeleton` primitive,
 * so no layout shift occurs when the video resolves.
 */
export function VideoDetailLoading() {
    const { t } = useTranslation();

    return (
        <div className="lg:grid lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-6">
            <div className="flex min-w-0 flex-col gap-2">
                <Skeleton className="aspect-video w-full rounded-lg" />

                <div className="flex flex-col gap-4 rounded-lg border p-3 md:p-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-7 w-24 rounded-md" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-24 rounded-lg" />
                            <Skeleton className="h-9 w-24 rounded-lg" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-full md:h-7" />
                        <Skeleton className="h-6 w-3/4 md:h-7" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/20 p-2">
                        {SCOREBOARD_COLUMNS.map((column) => (
                            <ScoreboardColumnSkeleton key={column} />
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1 border-border border-t pt-4">
                        <Skeleton className="mr-2 h-4 w-16" />
                        {TAG_CHIPS.map((tag) => (
                            <Skeleton
                                key={tag}
                                className="h-6 w-16 rounded-full"
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <Skeleton className="h-10 w-64 rounded-lg" />
                    <div className="rounded-lg border p-4">
                        <div className="flex flex-col gap-3">
                            {DESCRIPTION_LINES.map((line) => (
                                <Skeleton
                                    key={line}
                                    className={line % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <aside className="mt-10 hidden lg:mt-0 lg:flex lg:flex-col lg:gap-4">
                <SectionHeader
                    icon={<FlameIcon />}
                    title={t("videos.detail.sidebar.popular")}
                />
                <VideosPopularSidebarLoading />
            </aside>
        </div>
    );
}
