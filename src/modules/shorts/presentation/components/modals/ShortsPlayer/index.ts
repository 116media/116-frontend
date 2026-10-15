import { ShortsPlayer as ShortsPlayerRoot } from "./ShortsPlayer";
import { ShortsPlayerActionRail } from "./ShortsPlayer.ActionRail";
import { ShortsPlayerAudioControl } from "./ShortsPlayer.AudioControl";
import { ShortsPlayerCaption } from "./ShortsPlayer.Caption";
import { ShortsPlayerClose } from "./ShortsPlayer.Close";
import { ShortsPlayerFullVideoLink } from "./ShortsPlayer.FullVideoLink";
import { ShortsPlayerLikeBurst } from "./ShortsPlayer.LikeBurst";
import { ShortsPlayerNav } from "./ShortsPlayer.Nav";
import { ShortsPlayerSlide } from "./ShortsPlayer.Slide";
import { ShortsPlayerTrack } from "./ShortsPlayer.Track";

export type { ShortsPlayerProps } from "./ShortsPlayer";

/**
 * ShortsPlayer
 *
 * @description
 * The full-screen shorts viewer: the root owns the dialog, `.Track` the paged slides and
 * `.Slide` one short, with `.ActionRail`, `.AudioControl`, `.Caption`, `.Close`,
 * `.FullVideoLink`, `.LikeBurst` and `.Nav` as its overlaid controls.
 */
export const ShortsPlayer = {
    Root: ShortsPlayerRoot,
    ActionRail: ShortsPlayerActionRail,
    AudioControl: ShortsPlayerAudioControl,
    Caption: ShortsPlayerCaption,
    Close: ShortsPlayerClose,
    FullVideoLink: ShortsPlayerFullVideoLink,
    LikeBurst: ShortsPlayerLikeBurst,
    Nav: ShortsPlayerNav,
    Slide: ShortsPlayerSlide,
    Track: ShortsPlayerTrack
} as const;
