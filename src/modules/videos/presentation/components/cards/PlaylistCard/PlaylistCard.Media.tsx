"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import { ListVideoIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

const COLLAGE_LAYOUT: Record<1 | 2 | 3 | 4, { grid: string; firstSpan: string }> = {
    1: { grid: "grid-cols-1 grid-rows-1", firstSpan: "" },
    2: { grid: "grid-cols-2 grid-rows-1", firstSpan: "" },
    3: { grid: "grid-cols-2 grid-rows-2", firstSpan: "row-span-2" },
    4: { grid: "grid-cols-2 grid-rows-2", firstSpan: "" }
};

/**
 * Props for the playlist collage.
 *
 * @property {string} name - Accessible playlist name.
 * @property {string[]} thumbnailUrls - Candidate collage thumbnails.
 * @property {number} videoCount - Video count shown in the overlay tag.
 * @property {() => void} onOpen - Opens the playlist.
 */
export interface PlaylistCardMediaProps {
    name: string;
    videoCount: number;
    onOpen: () => void;
    thumbnailUrls: Array<string | null>;
}

/**
 * Clickable playlist collage with a video-count overlay.
 */
export function PlaylistCardMedia({
    name,
    videoCount,
    onOpen,
    thumbnailUrls
}: PlaylistCardMediaProps) {
    const { t } = useTranslation();
    const thumbnails = thumbnailUrls.filter((url): url is string => Boolean(url));
    const layout = COLLAGE_LAYOUT[Math.min(Math.max(thumbnails.length, 1), 4) as 1 | 2 | 3 | 4];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onOpen}
                aria-label={name}
                className="block w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <div
                    className={cn(
                        "grid aspect-video gap-px bg-border",
                        thumbnails.length > 0 && layout.grid
                    )}
                >
                    {thumbnails.length > 0 ? (
                        thumbnails.slice(0, 4).map((url, index) => (
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: fixed ordered collage slots
                                key={index}
                                className={cn(
                                    "relative overflow-hidden bg-muted",
                                    index === 0 && layout.firstSpan
                                )}
                            >
                                <Image
                                    fill
                                    alt=""
                                    src={url}
                                    sizes="(max-width: 640px) 50vw, 200px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center bg-muted text-muted-foreground">
                            <ListVideoIcon className="size-6" />
                        </div>
                    )}
                </div>
            </button>

            <Tag
                as="span"
                variant="ghost"
                className="pointer-events-none absolute top-2 right-2 z-10 cursor-default bg-white/10 text-white/90 backdrop-blur-sm"
            >
                {t("favorites.playlist.videoCount", { count: videoCount })}
            </Tag>
        </div>
    );
}
