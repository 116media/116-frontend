import { CommentActions } from "./Comment.Actions";
import { CommentAvatar } from "./Comment.Avatar";
import { CommentBody } from "./Comment.Body";
import { CommentBubble } from "./Comment.Bubble";
import { CommentByline } from "./Comment.Byline";
import { CommentEditForm } from "./Comment.EditForm";
import { CommentLikeButton } from "./Comment.LikeButton";
import { CommentOwnerActions } from "./Comment.OwnerActions";
import { CommentReplies } from "./Comment.Replies";
import { CommentRepliesToggle } from "./Comment.RepliesToggle";
import { CommentReplyButton } from "./Comment.ReplyButton";
import { CommentReplyComposer } from "./Comment.ReplyComposer";
import { CommentRoot } from "./Comment.Root";
import { CommentView } from "./Comment.View";

/**
 * Comment
 *
 * @description
 * Compound component for one article comment. `.View` is the ready-made row used by the
 * list and by each reply; the remaining members are the context-fed slots it arranges,
 * exposed under `.Root` for a surface to compose its own layout.
 */
export const Comment = {
    View: CommentView,
    Root: CommentRoot,
    Avatar: CommentAvatar,
    Bubble: CommentBubble,
    Byline: CommentByline,
    Body: CommentBody,
    Actions: CommentActions,
    LikeButton: CommentLikeButton,
    ReplyButton: CommentReplyButton,
    OwnerActions: CommentOwnerActions,
    EditForm: CommentEditForm,
    ReplyComposer: CommentReplyComposer,
    RepliesToggle: CommentRepliesToggle,
    Replies: CommentReplies
} as const;

export type { CommentProps } from "./types";
