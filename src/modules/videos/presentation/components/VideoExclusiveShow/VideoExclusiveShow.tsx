import type { VideoExclusiveShowViewProps } from "./types";
import { VideoExclusiveShowEpisodes } from "./VideoExclusiveShow.Episodes";
import { VideoExclusiveShowPoster } from "./VideoExclusiveShow.Poster";

/**
 * VideoExclusiveShow
 *
 * @description
 * Presentation component for the homepage exclusive show section. Composes the
 * poster panel (left) and the episodes panel (right) into a split, two-column
 * layout. The section carries the `dark` + `always-dark` classes so it always
 * renders with the dark theme palette, regardless of the active app theme.
 *
 * @param category - The exclusive category (show) with its episodes
 */
export function VideoExclusiveShow({ category }: VideoExclusiveShowViewProps) {
    return (
        <article className="always-dark dark grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.1fr_1fr]">
            <VideoExclusiveShowPoster category={category} />
            <VideoExclusiveShowEpisodes episodes={category.episodes} />
        </article>
    );
}
