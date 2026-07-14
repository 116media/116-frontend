import type { VideoExclusiveShowViewProps } from "./types";
import { VideoExclusiveShowAllEpisodesLink } from "./VideoExclusiveShow.AllEpisodesLink";
import { VideoExclusiveShowEpisodes } from "./VideoExclusiveShow.Episodes";
import { VideoExclusiveShowHeading } from "./VideoExclusiveShow.Heading";
import { VideoExclusiveShowPoster } from "./VideoExclusiveShow.Poster";
import { VideoExclusiveShowRoot } from "./VideoExclusiveShow.Root";
import { VideoExclusiveShowScrim } from "./VideoExclusiveShow.Scrim";
import { VideoExclusiveShowTag } from "./VideoExclusiveShow.Tag";
import { VideoExclusiveShowWatchButton } from "./VideoExclusiveShow.WatchButton";

/**
 * Hero
 *
 * @description
 * Full-bleed exclusive show layout used on the videos page: the poster as
 * background under color-themed scrims, the tag, large heading, watch and
 * all-episodes CTAs, and the swipeable episodes rail. Pure arrangement of the
 * shared slots; carries `dark` + `always-dark` for the dark palette.
 */
export function Hero({ category }: VideoExclusiveShowViewProps) {
    return (
        <VideoExclusiveShowRoot
            category={category}
            className="always-dark dark relative overflow-hidden rounded-2xl border"
        >
            <VideoExclusiveShowPoster bleed />
            <VideoExclusiveShowScrim direction="right" />
            <VideoExclusiveShowScrim direction="top" />

            <div className="relative space-y-4 p-4 sm:p-6 lg:p-8">
                <VideoExclusiveShowTag />
                <VideoExclusiveShowHeading />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <VideoExclusiveShowWatchButton className="px-8 font-semibold" />
                    <VideoExclusiveShowAllEpisodesLink className="px-8" />
                </div>

                <VideoExclusiveShowEpisodes layout="rail" />
            </div>
        </VideoExclusiveShowRoot>
    );
}
