# Spec 03 — Hooks & Keys

Design ref: [../10-state-management-and-hooks.md](../10-state-management-and-hooks.md). The
shared `useToggle` and the shipped article/video hooks are the reference. New: the comment
keys, the comment-completion hooks, and my-bookmarks.

---

## 1. `useToggle` (shipped — the contract)

`src/shared/presentation/hooks/useToggle.ts`

```ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import type { Failure } from "@/shared/domain/failures/failure";
import type { Result } from "@/shared/domain/results/result";

/**
 * useToggle
 *
 * @description
 * Shared optimistic toggle used by like and bookmark: flips `on` and `count`
 * immediately, runs the on/off use case, and rolls both back on failure. `initialOn`
 * seeds the state from the entity's per-user flag when the DTO has one.
 *
 * @param initialCount - The baseline count from the entity.
 * @param onExecute - Runs the on (true) or off (false) mutation; resolves the success flag.
 * @param initialOn - The entity's per-user flag baseline. Defaults to false.
 * @returns `{ on, count, toggle }`.
 */
export function useToggle(
    initialCount: number,
    onExecute: (next: boolean) => Promise<boolean>,
    initialOn = false
) {
    const [on, setOn] = useState(initialOn);
    const [count, setCount] = useState(initialCount);

    const mutation = useMutation<boolean, Failure, boolean>({
        mutationFn: (next) => onExecute(next)
    });

    const toggle = () => {
        const next = !on;
        setOn(next);
        setCount((c) => c + (next ? 1 : -1));
        mutation.mutate(next, {
            onError: () => {
                setOn(!next);
                setCount((c) => c + (next ? -1 : 1));
            }
        });
    };

    return { on, count, toggle };
}

/**
 * runInteraction
 *
 * @description
 * Runs a `Result<boolean>` use case and throws its `Failure` on error (so the mutation's
 * `onError` fires), returning the success flag otherwise.
 *
 * @param execute - The use-case call producing a `Result<boolean>`.
 * @returns The success flag from the result.
 */
export async function runInteraction(execute: () => Promise<Result<boolean>>) {
    const result = await execute();
    if (!result.ok) throw result.error;
    return result.value;
}
```

---

## 2. Query keys (extend)

`src/modules/articles/presentation/constants/articleKeys.ts`

Add `replies` and `myBookmarks`; `comments` is shipped.

```ts
    comments: (articleId: string) => [...articleKeys.all, "detail", articleId, "comments"] as const,
    replies: (commentId: string) => [...articleKeys.all, "detail", commentId, "replies"] as const,
    myBookmarks: (filters: { pageIndex?: number } = {}) =>
        [...articleKeys.all, "bookmarks", filters] as const,
```

---

## 3. `useToggleArticleCommentLike` (new)

`src/modules/articles/presentation/hooks/useToggleArticleCommentLike.ts`

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleArticleCommentLike
 *
 * @description
 * Optimistic like toggle for one comment, wrapping {@link useToggle} over the comment
 * like / unlike use cases. Seeds from the comment's per-viewer `isLiked` and `likeCount`.
 *
 * @param commentId - The comment to (un)like.
 * @param initialCount - The comment's `likeCount` baseline.
 * @param initialLiked - The comment's per-viewer `isLiked` baseline.
 * @returns `{ liked, count, toggle }` for the comment like heart.
 */
export function useToggleArticleCommentLike(
    commentId: string,
    initialCount: number,
    initialLiked: boolean
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.likeArticleCommentUseCase
                    : container.cradle.unlikeArticleCommentUseCase
                ).execute(commentId)
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
```

---

## 4. `useCommentReplies` (new)

`src/modules/articles/presentation/hooks/useCommentReplies.ts`

```ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import {
    ARTICLE_COMMENTS_PAGE_SIZE,
    articleKeys
} from "@/modules/articles/presentation/constants/articleKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useCommentReplies
 *
 * @description
 * Infinite query for a top-level comment's replies, enabled only when the reply thread
 * is expanded. Pages on a zero-based `pageIndex` while the mapped `hasNextPage` is true.
 *
 * @param commentId - The parent comment whose replies to page through.
 * @param enabled - Whether the reply thread is open.
 * @returns The `useInfiniteQuery` result for the replies list.
 */
export function useCommentReplies(commentId: string, enabled: boolean) {
    return useInfiniteQuery<IArticleCommentPage, Failure>({
        queryKey: articleKeys.replies(commentId),
        enabled,
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getCommentRepliesUseCase.execute({
                commentId,
                pageIndex: pageParam as number,
                pageSize: ARTICLE_COMMENTS_PAGE_SIZE
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
```

---

## 5. `useDeleteArticleComment` (new)

`src/modules/articles/presentation/hooks/useDeleteArticleComment.ts`

Soft-delete: tombstones the row in the cache and decrements the article's `commentCount`.

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { articleKeys } from "@/modules/articles/presentation/constants/articleKeys";
import { ArticleCommentNotification } from "@/modules/articles/presentation/utils/notification/articles.comment.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useDeleteArticleComment
 *
 * @description
 * Soft-deletes the user's own comment, tombstoning the cached row (body/author null,
 * `isDeleted` true) and decrementing the cached article's `commentCount`.
 *
 * @param articleId - The article the comment belongs to.
 * @param slug - The article slug keying the detail cache.
 * @returns `{ remove, isPending }` for the delete affordance.
 */
export function useDeleteArticleComment(articleId: string, slug: string) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, string>({
        mutationFn: async (commentId) => {
            const result = await container.cradle.deleteArticleCommentUseCase.execute({
                articleId,
                commentId
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onError: () => showNotification(ArticleCommentNotification.deleteFailed(t))
    });

    const remove = (commentId: string) =>
        mutation.mutate(commentId, {
            onSuccess: () => {
                queryClient.setQueryData<{ pages: IArticleCommentPage[]; pageParams: unknown[] }>(
                    articleKeys.comments(articleId),
                    (current) =>
                        current
                            ? {
                                  ...current,
                                  pages: current.pages.map((page) => ({
                                      ...page,
                                      items: page.items.map((c) =>
                                          c.id === commentId
                                              ? { ...c, isDeleted: true, body: null, author: undefined }
                                              : c
                                      )
                                  }))
                              }
                            : current
                );
                queryClient.setQueryData<IArticleDetailEntity>(articleKeys.detail(slug), (current) =>
                    current ? { ...current, commentCount: Math.max(0, current.commentCount - 1) } : current
                );
            }
        });

    return { remove, isPending: mutation.isPending };
}
```

---

## 6. `useMyArticleBookmarks` (new)

`src/modules/articles/presentation/hooks/useMyArticleBookmarks.ts`

```ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import {
    ARTICLES_PAGE_SIZE,
    articleKeys
} from "@/modules/articles/presentation/constants/articleKeys";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";

/**
 * useMyArticleBookmarks
 *
 * @description
 * Infinite query over the signed-in user's bookmarked articles, paging on a zero-based
 * `pageIndex` while the mapped `hasNextPage` is true. Requires an authenticated session.
 *
 * @returns The `useInfiniteQuery` result for the bookmarks list.
 */
export function useMyArticleBookmarks() {
    return useInfiniteQuery<IArticlePage, Failure>({
        queryKey: articleKeys.myBookmarks(),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getMyArticleBookmarksUseCase.execute({
                pageIndex: pageParam as number,
                pageSize: ARTICLES_PAGE_SIZE
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
```

`useReplyToComment` and `useEditArticleComment` mirror `useAddArticleComment` (auth-gated
mutation, optimistic prepend / inline patch, invalidate) and are detailed in
[05-comments.md](05-comments.md).

---

## Tasks

- [ ] `articleKeys.replies` + `articleKeys.myBookmarks` added.
- [ ] `useToggleArticleCommentLike` over `useToggle`, seeded from the comment flags.
- [ ] `useCommentReplies` infinite query, `enabled` on thread-open.
- [ ] `useDeleteArticleComment` tombstones the cache + decrements `commentCount`.
- [ ] `useMyArticleBookmarks` infinite query.
- [ ] `useReplyToComment` / `useEditArticleComment` per [05](05-comments.md).
- [ ] Shipped hooks unchanged.
- [ ] `tsc` + biome clean.
