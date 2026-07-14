# Spec 05 — Comments

Design ref: [../06-comments.md](../06-comments.md). Create + list are **shipped**
(`ArticleDetailComments`, `ArticleDetailComment`, `ArticleDetailCommentComposer`,
`useArticleComments`, `useAddArticleComment`). This spec documents the shipped post hook and
specs the deferred **reply**, **edit**, **delete**, and **comment-like** UI.

---

## 1. `useAddArticleComment` (shipped — the post contract)

`src/modules/articles/presentation/hooks/useAddArticleComment.ts`

Auth-gated; optimistically prepends with an author from the auth context, bumps the article's
`commentCount`, invalidates, and runs `onPosted`. (Full source is in the codebase; the
contract is: `{ submit, isPending }` where `submit(body, onPosted?)` runs behind
`useRequireAuth`.)

---

## 2. `useReplyToComment` (new)

`src/modules/articles/presentation/hooks/useReplyToComment.ts`

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useReplyToComment
 *
 * @description
 * Auth-gated mutation that posts a one-level reply to a top-level comment. On success it
 * prepends the reply into the parent's cached replies page, bumps the parent's `replyCount`,
 * and runs the caller's `onReplied`.
 *
 * @param articleId - The article the comment belongs to.
 * @param parentCommentId - The top-level comment being replied to.
 * @returns `{ submit, isPending }` for the reply composer.
 */
export function useReplyToComment(articleId: string, parentCommentId: string) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const requireAuth = useRequireAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation<IArticleCommentEntity, Failure, string>({
        mutationFn: async (body) => {
            const result = await container.cradle.addCommentReplyUseCase.execute({
                articleId,
                parentCommentId,
                body
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => showNotification(ArticleCommentNotification.replyFailed(t))
    });

    const submit = (body: string, onReplied?: () => void) =>
        requireAuth(() =>
            mutation.mutate(body, {
                onSuccess: (reply) => {
                    queryClient.setQueryData<{ pages: IArticleCommentPage[]; pageParams: unknown[] }>(
                        articleKeys.replies(parentCommentId),
                        (current) => {
                            if (!current) return current;
                            const withAuthor: IArticleCommentEntity = {
                                ...reply,
                                author:
                                    reply.author ??
                                    (user ? { userName: user.userName, avatarUrl: user.avatar?.storageUrl ?? null } : undefined)
                            };
                            const [first, ...rest] = current.pages;
                            if (!first) return current;
                            return {
                                ...current,
                                pages: [{ ...first, items: [withAuthor, ...first.items], count: first.count + 1 }, ...rest]
                            };
                        }
                    );
                    onReplied?.();
                }
            })
        );

    return { submit, isPending: mutation.isPending };
}
```

---

## 3. `useEditArticleComment` (new)

`src/modules/articles/presentation/hooks/useEditArticleComment.ts`

Inline edit; on success patches the cached comment's `body` in place.

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useEditArticleComment
 *
 * @description
 * Mutation that edits the user's own comment and patches the cached comment's body in
 * place on success. Ownership is enforced server-side and gated in the UI.
 *
 * @param articleId - The article the comment belongs to.
 * @param commentId - The comment being edited.
 * @returns `{ submit, isPending }` for the inline edit form.
 */
export function useEditArticleComment(articleId: string, commentId: string) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, string>({
        mutationFn: async (body) => {
            const result = await container.cradle.editArticleCommentUseCase.execute({
                articleId,
                commentId,
                body
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => showNotification(ArticleCommentNotification.editFailed(t))
    });

    const submit = (body: string, onSaved?: () => void) =>
        mutation.mutate(body, {
            onSuccess: () => {
                queryClient.setQueryData<{ pages: IArticleCommentPage[]; pageParams: unknown[] }>(
                    articleKeys.comments(articleId),
                    (current) =>
                        current
                            ? {
                                  ...current,
                                  pages: current.pages.map((page) => ({
                                      ...page,
                                      items: page.items.map((c) => (c.id === commentId ? { ...c, body } : c))
                                  }))
                              }
                            : current
                );
                onSaved?.();
            }
        });

    return { submit, isPending: mutation.isPending };
}
```

`useDeleteArticleComment` is in [03-hooks-and-keys.md](03-hooks-and-keys.md).

---

## 4. Comment card action row (extend `ArticleDetailComment`)

`src/modules/articles/presentation/components/sections/ArticleDetailComment/ArticleDetailComment.tsx`

Adds a like heart, a reply affordance (top-level only), and owner-only edit/delete. Ownership
compares `comment.userId` with the auth user id.

```tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import { useToggleArticleCommentLike } from "@/modules/articles/presentation/hooks/useToggleArticleCommentLike";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { Button } from "@/shared/presentation/components/ui/Button";
import { HeartIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ArticleDetailCommentActions component.
 *
 * @interface ArticleDetailCommentActionsProps
 * @property {IArticleCommentEntity} comment - The comment the actions operate on.
 * @property {() => void} onReply - Opens the reply composer for a top-level comment.
 * @property {() => void} onEdit - Opens the inline edit form (owner only).
 * @property {() => void} onDelete - Requests deletion (owner only).
 */
export interface ArticleDetailCommentActionsProps {
    comment: IArticleCommentEntity;
    onReply: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

/**
 * ArticleDetailCommentActions
 *
 * @description
 * The action row under a comment: an auth-gated like heart, a reply affordance shown only
 * on top-level comments, and owner-only edit / delete. Hidden entirely on tombstones.
 */
export function ArticleDetailCommentActions({
    comment,
    onReply,
    onEdit,
    onDelete
}: ArticleDetailCommentActionsProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const requireAuth = useRequireAuth();
    const { liked, count, toggle } = useToggleArticleCommentLike(comment.id, comment.likeCount, comment.isLiked);

    if (comment.isDeleted) return null;

    const isOwner = Boolean(user && user.id === comment.userId);
    const isTopLevel = comment.parentCommentId === null;

    return (
        <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <button
                type="button"
                aria-pressed={liked}
                onClick={() => requireAuth(toggle)}
                className="flex items-center gap-1"
            >
                <HeartIcon className={cn("size-4", liked && "fill-destructive text-destructive")} />
                <span className="tabular-nums">{count}</span>
            </button>

            {isTopLevel && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => requireAuth(onReply)}
                >
                    {t("articles.comments.reply")}
                </Button>
            )}

            {isOwner && (
                <>
                    <Button size="sm" variant="ghost" onClick={onEdit}>
                        {t("articles.comments.edit")}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onDelete}
                        className="text-destructive"
                    >
                        {t("articles.comments.delete")}
                    </Button>
                </>
            )}
        </div>
    );
}
```

The reply thread ("view N replies" → `useCommentReplies` list + a reply composer) and the
delete confirm (`ConfirmDialog` + `useDeleteArticleComment`) compose these hooks; both live in
the `ArticleDetailComment` folder as dotted parts.

---

## Tasks

- [ ] `useReplyToComment` — prepend into `replies(parentId)`, bump `replyCount`, auth-gated.
- [ ] `useEditArticleComment` — patch `body` in place on success.
- [ ] `useDeleteArticleComment` — tombstone + `commentCount` −1 (spec 03).
- [ ] Comment action row: like heart, reply (top-level only), owner-only edit/delete; hidden on tombstones.
- [ ] Ownership from `comment.userId === user.id`; reply affordance never on a reply.
- [ ] Reply thread lazy via `useCommentReplies`; delete guarded by `ConfirmDialog`.
- [ ] Tombstone renders a muted "comment deleted" row.
- [ ] `tsc` + biome clean.
