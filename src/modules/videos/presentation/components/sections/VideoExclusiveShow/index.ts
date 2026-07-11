import { VideoExclusiveShowAllEpisodesLink } from "./VideoExclusiveShow.AllEpisodesLink";
import { VideoExclusiveShowEpisodes } from "./VideoExclusiveShow.Episodes";
import { VideoExclusiveShowHeading } from "./VideoExclusiveShow.Heading";
import { Hero } from "./VideoExclusiveShow.Hero";
import { VideoExclusiveShowPoster } from "./VideoExclusiveShow.Poster";
import { VideoExclusiveShowRoot } from "./VideoExclusiveShow.Root";
import { VideoExclusiveShowScrim } from "./VideoExclusiveShow.Scrim";
import { Split } from "./VideoExclusiveShow.Split";
import { VideoExclusiveShowTag } from "./VideoExclusiveShow.Tag";
import { VideoExclusiveShowWatchButton } from "./VideoExclusiveShow.WatchButton";

/**
 * VideoExclusiveShow
 *
 * @description
 * Compound component for the exclusive show section. `.Split` (homepage
 * two-column) and `.Hero` (videos page full-bleed) are ready-made layouts;
 * the remaining members are the context-fed slots they arrange, exposed for
 * future surfaces to compose their own layout under `.Root`.
 */
export const VideoExclusiveShow = {
    Split,
    Hero,
    Root: VideoExclusiveShowRoot,
    Poster: VideoExclusiveShowPoster,
    Scrim: VideoExclusiveShowScrim,
    Tag: VideoExclusiveShowTag,
    Heading: VideoExclusiveShowHeading,
    WatchButton: VideoExclusiveShowWatchButton,
    AllEpisodesLink: VideoExclusiveShowAllEpisodesLink,
    Episodes: VideoExclusiveShowEpisodes
} as const;

export type { VideoExclusiveShowViewProps } from "./types";
