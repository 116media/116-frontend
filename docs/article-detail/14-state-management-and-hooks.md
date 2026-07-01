# State Management & Hooks

The detail page runs on **TanStack Query**: one `useQuery` for the article by slug, one
`useInfiniteQuery` for its comments, and one `useMutation` for posting a comment. State
lives in the query cache; the container derives what it renders from it. Like, bookmark,
and share reuse the feed's hooks unchanged ([09-interactions.md](09-interactions.md)), and
the reading-progress hook is generic and lives in shared ([07-reading-progress.md](07-reading-progress.md)).

---

## Query keys

`articleKeys` ([`articles/presentation/constants/articleKeys.ts`](../../src/modules/articles/presentation/constants/articleKeys.ts))
gains two entries under the existing `all: ["articles"]` root, so the detail and comment
caches sit beside the feed cache and are invalidated together when needed:

```ts
export const articleKeys = {
    all: ["articles"] as const,
    feed: (filters: IArticleFeedFilters = {}) => [...articleKeys.all, "feed", filters] as const,
    categories: ["articles", "categories"] as const,
    popularTags: ["articles", "tags", "popular"] as const,
    allTags: (search: string) => [...articleKeys.all, "tags", "all", search] as const,
    detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,
    comments: (articleId: string) => [...articleKeys.all, "detail", articleId, "comments"] as const
};
```

- **`detail`** is keyed by **slug** — the route param — so the RSC prefetch and the client
  query share one cache entry.
- **`comments`** is keyed by **article id** — the interaction/comment endpoints are keyed
  by id, and the id is known once the article resolves.

---

## `useArticleDetail`

A plain `useQuery` over `getArticleBySlugUseCase`. The article rarely changes within a
session, so it inherits the app's `staleTime`; errors surface as the typed `Failure`
(a 404 becomes a not-found `Failure` the container maps to the not-found view — see
[15-loading-empty-error.md](15-loading-empty-error.md)).

```tsx
/**
 * useArticleDetail
 *
 * @description
 * Query for a single article by slug. Calls `getArticleBySlugUseCase`; throws the typed
 * `Failure` on a failed result so `isError` / `error` drive the error and not-found views.
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

The RSC prefetches the same key server-side so first paint is populated; the client query
hydrates from the dehydrated cache without a second fetch (see
[04-page-composition.md](04-page-composition.md)).

---

## `useArticleComments`

A `useInfiniteQuery` mirroring `useArticlesFeed`: each page calls
`getArticleCommentsUseCase` with the next zero-based `pageIndex`, pages accumulate, and
`getNextPageParam` reads the mapper-derived `hasNextPage`.

```tsx
/**
 * useArticleComments
 *
 * @description
 * Infinite query for an article's comments. Each page calls `getArticleCommentsUseCase`
 * with the next zero-based `pageIndex`; pages accumulate in the cache. `getNextPageParam`
 * returns the next index while the mapped `hasNextPage` is true, else `undefined`.
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
        getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined)
    });
}
```

- **`ARTICLE_COMMENTS_PAGE_SIZE`** (e.g. `10`) is a module constant so the "load more"
  batch and the skeleton count agree.
- The container flattens with `data.pages.flatMap((p) => p.items)` and reads
  `data.pages[0]?.count` for the header count.

---

## `useAddArticleComment`

A `useMutation` over `addArticleCommentUseCase`, **auth-gated** and **optimistic**. It
mirrors the like/bookmark pattern: the feed gates the action with `useRequireAuth` at the
call site ([`ArticleCard.Engagement`](../../src/modules/articles/presentation/components/ArticleCard/ArticleCard.Engagement.tsx)),
so the composer wraps its submit in the same guard — a guest tapping "Post" opens the auth
modal and the submit resumes after login.

On success the hook:

1. **Optimistically prepends** the new comment to the first cached comment page and bumps
   the cached article's `commentCount`.
2. Sets the new row's `author` to the **current user** (from the auth context) so the byline
   shows immediately, covering the DTO author gap ([13-domain-entities-and-mappers.md](13-domain-entities-and-mappers.md)).
3. **Invalidates** `articleKeys.comments(articleId)` so the list reconciles with the server
   (and the placeholder id is replaced by the real one).

```tsx
/**
 * useAddArticleComment
 *
 * @description
 * Auth-gated mutation that posts a comment on an article. On success it optimistically
 * prepends the new comment to the first cached page and bumps the cached article's
 * `commentCount`, then invalidates the comments query to reconcile with the server. The
 * optimistic row carries the current user as its `author` (the DTO does not project one).
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
            prependComment(queryClient, articleId, { ...comment, author: authorFromUser(user) });
            bumpCommentCount(queryClient, slug, 1);
            queryClient.invalidateQueries({ queryKey: articleKeys.comments(articleId) });
        }
    });

    const submit = (body: string) => requireAuth(() => mutation.mutate(body));

    return { submit, isPending: mutation.isPending };
}
```

`prependComment`, `bumpCommentCount`, and `authorFromUser` are small local helpers in the
hook file — the [spec](specs/03-hooks-and-keys.md) gives their exact bodies.

> **Why gate at the hook, not the button.** The like/bookmark toggles gate at the button
> with `useRequireAuth` because the toggle mutation runs immediately. The composer has a
> submit step, so gating inside `submit` keeps the textarea usable for a guest (they can
> type), and only the post action opens the modal — matching the feed's auth UX.

---

## `useReadingProgress` (shared, referenced only)

The reading-progress hook is **generic** (scroll position of a target element → `0..1`)
and lives in shared hooks, not the articles module. It is defined and specced in
[07-reading-progress.md](07-reading-progress.md) / [specs/06-reading-progress.md](specs/06-reading-progress.md);
this document only references it. The detail hooks above do not depend on it.

---

## Caching & lifecycle

- All queries run under the app `QueryProvider` (`staleTime: 60_000`, `retry: false`,
  `refetchOnWindowFocus: false`).
- Like / bookmark reuse `useToggleArticleLike` / `useToggleArticleBookmark` with the
  detail entity's counts as their baselines — client-owned optimistic state, since the DTO
  has no per-user `isLiked` / `isBookmarked` ([09-interactions.md](09-interactions.md)).
- Posting a comment optimistically updates two cache entries (the comment page and the
  detail entity's `commentCount`) and then invalidates the comment list to reconcile.

See [specs/03-hooks-and-keys.md](specs/03-hooks-and-keys.md) for the implementation-ready
hooks and the key additions.
