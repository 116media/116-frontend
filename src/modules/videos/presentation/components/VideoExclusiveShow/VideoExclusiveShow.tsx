import { Crown, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { VideoCard } from "@/modules/videos/presentation/components/VideoCard";
import { Button } from "@/shared/presentation/components/ui/Button";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import type { VideoExclusiveShowViewProps } from "./types";

/**
 * VideoExclusiveShow
 *
 * @description
 * Presentation component for the homepage exclusive show section. Renders a split
 * layout: a landscape poster on the left (exclusive tag, title, description, and a
 * watch CTA over a gradient) and the show's episodes as a vertical stack of
 * horizontal cards on the right. The section carries the `dark` + `always-dark` classes
 * so it always renders with the dark theme palette, regardless of the active app theme.
 *
 * Rendered on the server with its chrome labels resolved from the request language,
 * so the streamed markup is stable and never mismatches on hydration.
 *
 * @param category - The exclusive category (show) with its episodes
 * @param labels - Server-resolved translated chrome labels
 */
export function VideoExclusiveShow({ category, labels }: VideoExclusiveShowViewProps) {
    const watchHref = category.episodes[0]
        ? `${VIDEOS_PATH}/${category.episodes[0].slug}`
        : VIDEOS_PATH;

    return (
        <article className="always-dark dark grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-112 lg:min-h-130 lg:border-r lg:border-border">
                {category.posterUrl && (
                    <Image
                        fill
                        priority
                        alt={category.title}
                        src={category.posterUrl}
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-card via-card via-45% to-transparent" />

                <div className="absolute left-5 top-5">
                    <Tag
                        size="md"
                        as="span"
                        variant="primary"
                        className="uppercase tracking-wider"
                        prefix={<Crown className="size-3" />}
                    >
                        {labels.exclusive}
                    </Tag>
                </div>

                <div className="absolute inset-x-2 sm:inset-x-3 md:inset-x-6 bottom-5 space-y-3">
                    <h2 className="text-2xl font-bold leading-tight text-foreground lg:text-xl xl:text-3xl">
                        {category.title}
                    </h2>
                    <p className="mb-6 text-base sm:text-sm text-muted-foreground line-clamp-4 md:text-base lg:text-sm xl:text-base">
                        {category.description}
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        <Link href={watchHref}>
                            <Play className="fill-current" />
                            {labels.watchNow}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="p-2 sm:p-3 md:p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                    {labels.episodes}
                </h3>

                <div className="flex flex-col gap-3">
                    {category.episodes.map((episode) => (
                        <VideoCard.Horizontal
                            video={episode}
                            key={episode.id}
                        />
                    ))}
                </div>
            </div>
        </article>
    );
}
