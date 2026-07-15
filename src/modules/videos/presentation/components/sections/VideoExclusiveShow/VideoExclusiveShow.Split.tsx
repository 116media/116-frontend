import { VideoExclusiveShowEpisodes } from "./VideoExclusiveShow.Episodes";
import { VideoExclusiveShowHeading } from "./VideoExclusiveShow.Heading";
import { VideoExclusiveShowPoster } from "./VideoExclusiveShow.Poster";
import { VideoExclusiveShowRoot } from "./VideoExclusiveShow.Root";
import { VideoExclusiveShowScrim } from "./VideoExclusiveShow.Scrim";
import { VideoExclusiveShowTag } from "./VideoExclusiveShow.Tag";
import { VideoExclusiveShowWatchButton } from "./VideoExclusiveShow.WatchButton";
import type { VideoExclusiveShowViewProps } from "./types";

/**
 * Split
 *
 * @description
 * Two-column exclusive show layout used on the homepage: the poster panel with
 * the tag, heading, and watch CTA beside the stacked episodes list. Pure
 * arrangement of the shared slots; carries `dark` + `always-dark` so it always
 * renders with the dark palette.
 */
export function Split({ category }: VideoExclusiveShowViewProps) {
    return (
        <VideoExclusiveShowRoot
            category={category}
            className="always-dark dark grid grid-cols-1 overflow-hidden rounded-2xl border lg:grid-cols-[1.2fr_1fr]"
        >
            <div className="relative flex min-h-112 flex-col lg:min-h-130 lg:border-r">
                <VideoExclusiveShowPoster />
                <VideoExclusiveShowScrim direction="panel" />

                <div className="relative gap-3 flex-1 space-y-4 p-4 sm:p-4 lg:p-12 flex flex-col justify-end items-start">
                    <VideoExclusiveShowTag />
                    <VideoExclusiveShowHeading />
                    <VideoExclusiveShowWatchButton className="w-full sm:w-auto" />
                </div>
            </div>

            <VideoExclusiveShowEpisodes layout="stack" />
        </VideoExclusiveShowRoot>
    );
}
