import { VideoExclusiveShowEpisodes } from "@/modules/videos/presentation/components/sections/VideoExclusiveShowEpisodes";
import { VideoExclusiveShowPoster } from "@/modules/videos/presentation/components/sections/VideoExclusiveShowPoster";
import type { VideoExclusiveShowViewProps } from "./types";

/**
 * VideoExclusiveShow
 *
 * @description
 * Presentation component for the homepage exclusive show section, composing
 * the poster and episodes panels into a two-column layout. Carries `dark` +
 * `always-dark` so it always renders with the dark palette.
 */
export function VideoExclusiveShow({ category }: VideoExclusiveShowViewProps) {
    return (
        <article className="always-dark dark grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.1fr_1fr]">
            <VideoExclusiveShowPoster category={category} />
            <VideoExclusiveShowEpisodes episodes={category.episodes} />
        </article>
    );
}
