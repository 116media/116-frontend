import { FavoriteCardRoot } from "./FavoriteCard";
import { FavoriteCardActions } from "./FavoriteCard.Actions";
import { FavoriteCardBody } from "./FavoriteCard.Body";
import { FavoriteCardComment } from "./FavoriteCard.Comment";
import { FavoriteCardMedia } from "./FavoriteCard.Media";
import { FavoriteCardMeta } from "./FavoriteCard.Meta";
import { FavoriteCardRemove } from "./FavoriteCard.Remove";
import { FavoriteCardTitle } from "./FavoriteCard.Title";

export type { FavoriteCardProps } from "./FavoriteCard";
export type { FavoriteCardActionsProps } from "./FavoriteCard.Actions";
export type { FavoriteCardBodyProps } from "./FavoriteCard.Body";
export type { FavoriteCardCommentProps } from "./FavoriteCard.Comment";
export type { FavoriteCardMediaAspect, FavoriteCardMediaProps } from "./FavoriteCard.Media";
export type { FavoriteCardDateKind, FavoriteCardMetaProps } from "./FavoriteCard.Meta";
export type { FavoriteCardRemoveProps } from "./FavoriteCard.Remove";
export type { FavoriteCardTitleProps } from "./FavoriteCard.Title";

/**
 * FavoriteCard
 *
 * @description
 * Compound for every favorites tile: a bordered card root with `.Media` (clickable
 * thumbnail), a `.Remove` media overlay, and body parts `.Body`, `.Title`, `.Meta`,
 * `.Comment`, and `.Actions`.
 */
export const FavoriteCard = Object.assign(FavoriteCardRoot, {
    Media: FavoriteCardMedia,
    Remove: FavoriteCardRemove,
    Body: FavoriteCardBody,
    Title: FavoriteCardTitle,
    Meta: FavoriteCardMeta,
    Comment: FavoriteCardComment,
    Actions: FavoriteCardActions
});
