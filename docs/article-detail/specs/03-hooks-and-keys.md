# Spec 03 — Hooks & Keys

Design ref: [../14-state-management-and-hooks.md](../14-state-management-and-hooks.md).

Extends `articleKeys` with `detail` and `comments`, and adds three hooks to
`articles/presentation/hooks`. `useReadingProgress` is shared and generic — it is specced
in [06-reading-progress.md](06-reading-progress.md), not here.

---

## 1. Keys + page-size constant

`src/modules/articles/presentation/constants/articleKeys.ts` — add two entries to the
existing `articleKeys` factory and one constant. Keep the existing entries.

```ts
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) => [...articleKeys.all, "feed", filters] as const,
    categories: ["articles", "categories"] as const,
    popularTags: ["articles", "tags", "popular"] as const,
    allTags: (search: string) => [...articleKeys.all, "tags", "all", search] as const,
    detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,
    comments: (articleId: string) =>
        [...articleKeys.all, "detail", articleId, "comments"] as const
};

/**
 * Page size for the article comment list.
 */
export const ARTICLE_COMMENTS_PAGE_SIZE = 10;
```

## 2. `useArticleDetail`

`src/modules/articles/presentation/hooks/useArticleDetail.ts` — new.

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { articleKeys } from "../constants/articleKeys";

/**
 * useArticleDetail
 *
 * @description
 * Query for a single article by slug. Calls `getArticleBySlugUseCase`; throws the typed
 * `Failure` on a failed result so `isError` / `error` drive the error and not-found
 * views. Shares the `articleKeys.detail(slug)` cache entry with the server prefetch, so
 * a prefetched article hydrates without a second fetch.
 *
 * @param slug - The article slug from the route.
 * @returns The `useQuery` result for the article detail.
 */
export function useArticleDetail(slug: string) {
    return useQuery<IArticleDetailEntity, Failure>({
        queryKey: articleKeys.detail(slug),
        queryFn: async () => {
            const result = await container.cradle.getArticleBySlugUseCase.execute(slug);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
```

## 3. `useArticleComments`

`src/modules/articles/presentation/hooks/useArticleComments.ts` — new. Mirrors
`useArticlesFeed`.

```tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { ARTICLE_COMMENTS_PAGE_SIZE, articleKeys } from "../constants/articleKeys";

/**
 * useArticleComments
 *
 * @description
 * Infinite query for an article's comments. Each page calls `getArticleCommentsUseCase`
 * with the next zero-based `pageIndex`; pages accumulate in the TanStack cache.
 * `getNextPageParam` returns the next index while the mapped `hasNextPage` is true, else
 * `undefined` (which sets the query's `hasNextPage` false). Errors surface as the typed
 * `Failure`.
 *
 * @param articleId - The article whose comments to page through.
 * @returns The `useInfiniteQuery` result for the comment list.
 */
export function useArticleComments(articleId: string) {
    return useInfiniteQuery<IArticleCommentPage, Failure>({
        queryKey: articleKeys.comments(articleId),
        initialPageParam: 0,
        queryFn: async ({ pageParam }) => {
            const result = await container.cradle.getArticleCommentsUseCase.execute({
                articleId,
                pageIndex: pageParam as number,
                pageSize: ARTICLE_COMMENTS_PAGE_SIZE
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined
    });
}
```

## 4. `useAddArticleComment`

`src/modules/articles/presentation/hooks/useAddArticleComment.ts` — new. Auth-gated with
`useRequireAuth` (matching `ArticleCard.Engagement`), optimistic on success. The cache
helpers stay local to the file.

```tsx
"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";

import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { articleKeys } from "../constants/articleKeys";

/**
 * Builds an IArticleAuthor from the authenticated user for a just-posted comment, so the
 * optimistic row shows a byline the comment DTO does not carry.
 *
 * @param user - The authenticated user from the auth context, if any.
 * @returns The author projection, or undefined when no user is present.
 */
function authorFromUser(
    user: { userName: string; avatarUrl: string | null } | null
): IArticleAuthor | undefined {
    if (!user) return undefined;
    return { userName: user.userName, avatarUrl: user.avatarUrl };
}

/**
 * Prepends a comment to the first cached comment page and bumps its `count`, so a new
 * comment appears immediately at the top of the list.
 *
 * @param queryClient - The active query client.
 * @param articleId - The article whose comment cache to update.
 * @param comment - The comment to prepend.
 */
function prependComment(
    queryClient: QueryClient,
    articleId: string,
    comment: IArticleCommentEntity
): void {
    queryClient.setQueryData<{ pages: IArticleCommentPage[]; pageParams: unknown[] }>(
        articleKeys.comments(articleId),
        (current) => {
            if (!current) return current;
            const [first, ...rest] = current.pages;
            if (!first) return current;
            const nextFirst: IArticleCommentPage = {
                ...first,
                items: [comment, ...first.items],
                count: first.count + 1
            };
            return { ...current, pages: [nextFirst, ...rest] };
        }
    );
}

/**
 * Adjusts the cached detail entity's `commentCount` by a delta, keeping the header count
 * in step with an optimistic comment insert.
 *
 * @param queryClient - The active query client.
 * @param slug - The article slug keying the detail cache.
 * @param delta - The amount to add to `commentCount`.
 */
function bumpCommentCount(queryClient: QueryClient, slug: string, delta: number): void {
    queryClient.setQueryData<IArticleDetailEntity>(articleKeys.detail(slug), (current) =>
        current ? { ...current, commentCount: current.commentCount + delta } : current
    );
}

/**
 * useAddArticleComment
 *
 * @description
 * Auth-gated mutation that posts a comment on an article. `submit` runs behind
 * `useRequireAuth`, so a guest is prompted to log in and the post resumes afterward. On
 * success it optimistically prepends the new comment (with the current user as its
 * author) to the first cached page, bumps the cached article's `commentCount`, and
 * invalidates the comments query to reconcile with the server.
 *
 * @param articleId - The article to comment on.
 * @param slug - The article slug, to bump `commentCount` on the cached detail entity.
 * @returns `{ submit, isPending }` for the composer.
 */
export function useAddArticleComment(articleId: string, slug: string) {
    const requireAuth = useRequireAuth();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const mutation = useMutation<IArticleCommentEntity, Failure, string>({
        mutationFn: async (body) => {
            const result = await container.cradle.addArticleCommentUseCase.execute({
                articleId,
                body
            });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: (comment) => {
            prependComment(queryClient, articleId, {
                ...comment,
                author: authorFromUser(user)
            });
            bumpCommentCount(queryClient, slug, 1);
            queryClient.invalidateQueries({ queryKey: articleKeys.comments(articleId) });
        }
    });

    const submit = (body: string) => requireAuth(() => mutation.mutate(body));

    return { submit, isPending: mutation.isPending };
}
```

> The `useAuth().user` shape (`userName`, `avatarUrl`) is read only to build the optimistic
> byline; adjust `authorFromUser` to the auth context's real user type when wiring. The
> mapper never fabricates an author ([01-domain-and-mappers.md](01-domain-and-mappers.md)).

## 5. `useReadingProgress` — referenced, not defined here

`useReadingProgress` lives in `shared/presentation/hooks` because it is generic (scroll
position of a target element → `0..1`). It is specced in
[06-reading-progress.md](06-reading-progress.md); the detail hooks above do not depend on
it.

---

## Tasks

- [ ] `articleKeys.detail(slug)` and `articleKeys.comments(articleId)` added; existing keys
      untouched.
- [ ] `ARTICLE_COMMENTS_PAGE_SIZE` constant added.
- [ ] `useArticleDetail` created; throws `Failure` on `!ok`; keyed `detail(slug)`.
- [ ] `useArticleComments` created; `initialPageParam: 0`; `getNextPageParam` reads
      `hasNextPage`; keyed `comments(articleId)`.
- [ ] `useAddArticleComment` created; `submit` gated by `useRequireAuth`; on success
      prepends optimistically, bumps `commentCount`, invalidates the comments query.
- [ ] Optimistic comment carries the current user as `author`; mapper output unchanged.
- [ ] `useReadingProgress` left to spec 06 (referenced only).
- [ ] `npx tsc --noEmit` + biome clean.
