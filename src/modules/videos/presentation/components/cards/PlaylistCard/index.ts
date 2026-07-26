import { PlaylistCardRoot } from "./PlaylistCard";
import { PlaylistCardActions } from "./PlaylistCard.Actions";
import { PlaylistCardLoading } from "./PlaylistCard.Loading";
import { PlaylistCardMedia } from "./PlaylistCard.Media";

export type { PlaylistCardProps } from "./PlaylistCard";
export type { PlaylistCardActionsProps } from "./PlaylistCard.Actions";
export type { PlaylistCardMediaProps } from "./PlaylistCard.Media";

/**
 * PlaylistCard
 *
 * @description
 * Compound playlist tile built on FavoriteCard. `.Media` renders the collage, `.Actions`
 * owns its controls, and `.Loading` mirrors the composed layout.
 */
export const PlaylistCard = Object.assign(PlaylistCardRoot, {
    Media: PlaylistCardMedia,
    Actions: PlaylistCardActions,
    Loading: PlaylistCardLoading
});
