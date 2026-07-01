# Comments

The comments section sits at the bottom of the reading column: a heading with the live
comment count, a **composer** at the top, then the **list**. It is entirely client-side —
an infinite query for the list, a mutation for posting, and an auth gate on the composer.

The one hard constraint shapes the whole design: **a comment carries only a `userId`** —
no display name, no avatar, no threading, no per-comment likes (see
[03](03-backend-api-reference.md) §2). Everything below is built around that gap.

---

## The components

| Component | Role |
|---|---|
| `Textarea` (shared primitive) | A themed multiline text field — none exists (`Input` is single-line) |
| `ArticleDetail.Comments` | The section: heading + count, composer, list, states, anchor |
| `ArticleDetailComment` | One comment row: avatar + name + date + body |
| `ArticleDetailCommentComposer` | Textarea + submit, auth-gated, optimistic post |

---

## `Textarea` — the missing primitive

There is no multiline text primitive in `shared/presentation/components/ui/`; `Input`
covers single-line only. The composer needs one, so we define a `Textarea` that **mirrors
`Input`'s tokens exactly** so the two feel like one family:

- transparent surface (`dark:bg-input/30` in dark), `border-input` border, `rounded-lg`
  corners;
- the shadcn focus ring (`focus-visible:ring-3 ring-ring/20` + `focus-visible:border-ring`);
- the disabled + `aria-invalid` states, light and dark;
- an **auto min-height** (a few rows) with vertical resize, `placeholder:text-muted-foreground`.

It is a thin `forwardRef` wrapper over `<textarea>` — the textarea sibling of `Input` —
and lives at `shared/presentation/components/ui/Textarea/`. Because it uses only theme
tokens, light/dark is automatic and it composes with any `className` override (later
utilities win, via `cn`). Full source in [specs/10-comments.md](specs/10-comments.md).

---

## `ArticleDetail.Comments` — the section

Given the `articleId` and the baseline `commentCount`, the section renders:

1. **Heading + count** — `t("articles.comments.title", { count })` so the label
   pluralizes per locale ("1 comment" / "12 comments"). The count starts from the entity
   and is kept live by the mutation's optimistic bump.
2. **Composer at the top** (just under the heading) — `ArticleDetailCommentComposer`, so a
   reader posts without scrolling past the whole thread.
3. **The list** — driven by `useArticleComments(articleId)` (a `useInfiniteQuery`, defined
   in [specs/03-hooks-and-keys.md](specs/03-hooks-and-keys.md)), flattened into one
   `IArticleCommentEntity[]` and mapped to `ArticleDetailComment` rows.
4. **Load more** — a sentinel observed by `useIntersectionObserver` that calls
   `fetchNextPage` as it enters the viewport (the same pattern as the articles feed,
   `ArticlesFeedContainer`), with an explicit "load more" `Button` fallback for
   no-JS / keyboard users. Guard the double-fetch exactly as the feed does:

   ```tsx
   useEffect(() => {
       if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
   }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);
   ```
5. **States** — loading skeletons on first load, an `EmptyState` ("Be the first to
   comment") when the thread is empty, and an error state with retry (`refetch`). These
   reuse the shared `EmptyState` shell and the same tokens as the feed states
   ([15](15-loading-empty-error.md)).

### The anchor + ref

The section carries a **stable `id`** (e.g. `id="comments"`) **and** accepts a `ref` from
the `ArticleDetail` assembler. The `Engagement` comment button
([09](09-interactions.md)) scrolls that ref into view and focuses the composer — no
navigation, no drawer. On mount, if the page was opened with `?comments=1` (the flag the
feed card's comment link appends), the section auto-scrolls to the anchor once.

---

## `ArticleDetailComment` — one row

A row is `UserAvatar` + a display name + `RelativeDate(createdAt)` + the body:

```tsx
<div className="flex gap-3">
    <UserAvatar userName={displayName} image={avatarUrl} size={36} />
    <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm">{displayName}</span>
            <span className="text-muted-foreground text-xs">
                <RelativeDate date={createdAt} />
            </span>
        </div>
        <p className="text-foreground text-sm">{body}</p>
    </div>
</div>
```

### Resolving the author gap

`ArticleCommentDto` has **no name or avatar**, only `userId`. The row is designed around
`IArticleCommentEntity.author?` — an **`IArticleAuthor` projection** (`{ userName,
avatarUrl }`, the shape the DTO already exposes for the *article* author) that the
**backend should add** to the comment DTO. This is tracked as a backend gap in
[19-open-questions.md](19-open-questions.md).

Until the projection ships, the row degrades gracefully:

- **`author` present** → real `userName` + `avatarUrl` (the target state).
- **`author` absent** → a **neutral avatar** (`UserAvatar` with a fallback `userName`
  derived from the `userId` — e.g. a short prefix — so `getAvatarColor`/`getInitials`
  still produce a stable, deterministic circle) and a **generic/short user reference**
  (e.g. `t("articles.comments.anonymousUser")` or the `userId` prefix). No layout
  changes when the projection later fills in — only the source of `displayName`/`avatarUrl`.
- **Freshly posted** (the comment returned by the mutation, or its optimistic stand-in) →
  the **current logged-in user** shown optimistically from `useAuth()`
  (`user.userName`, `user.avatar?.url`). The composer supplies this so a just-posted
  comment shows *you* immediately, even though the server round-trip returns only a
  `userId`.

### Deleted comments

A deleted comment has `isDeleted: true` / `body: null`. It renders a **muted placeholder**
instead of the body — `t("articles.comments.removed")` in `text-muted-foreground italic`
— keeping the avatar and date so the thread's shape is preserved.

---

## `ArticleDetailCommentComposer`

`Textarea` + submit `Button`, wired to `useAddArticleComment(articleId)` (defined in
[specs/03-hooks-and-keys.md](specs/03-hooks-and-keys.md)):

- **Optimistic prepend + count bump** — on submit, the new comment is prepended to the
  first page and `commentCount` is bumped, immediately; the field clears on success and
  is disabled while the mutation is pending; a failure rolls back and surfaces an error.
- **Validation** — non-empty (trimmed) and a max length; the submit button is disabled
  until the input is valid.
- **Optimistic author** — the mutation stamps the optimistic row with the current user
  from `useAuth()` so it renders as *you* (see the row's "freshly posted" case above).

### Auth gating (the pattern in this codebase)

Commenting requires auth, and the established codebase pattern is **`useRequireAuth`**
(`modules/auth/presentation/hooks/useRequireAuth.ts`) over `useAuth` + `useAuthModal`.
It returns a guard `(action) => void` that runs the action when authenticated, and
otherwise **opens the auth modal at the login view and resumes the action after a
successful login** (`open("login", { onSuccess: action })`). This is exactly how the feed
card gates like/bookmark (`ArticleCard.Engagement`):

```tsx
const requireAuth = useRequireAuth();
onClick={() => requireAuth(like.toggle)}
```

The composer applies the same guard. Two viable shapes:

- **Gate on submit** — always render the textarea; wrap the submit handler in
  `requireAuth(submit)`, so a guest who tries to post is bounced to the login modal and
  the post resumes after login.
- **Gate the whole composer** — read `isAuthenticated` from `useAuth()`; for a guest,
  replace the composer with a "log in to comment" prompt whose button calls
  `open("login")` (via `useAuthModal`). The freshly-posted-author logic needs the current
  user anyway, so `useAuth()` is already in scope.

Recommended: render the prompt for guests (clearer affordance) **and** keep the
`requireAuth` guard on submit as a safety net. Copy comes from
`t("articles.comments.loginPrompt")` / `t("articles.comments.loginCta")`
([16](16-i18n.md)); never hardcode it.

---

## Data flow

```text
ArticleDetail.Comments (articleId, commentCount, ref, id="comments")
├── heading  t("articles.comments.title", { count })
├── ArticleDetailCommentComposer
│     ├── Textarea + submit Button
│     ├── useAuth() ─────────────── isAuthenticated? → guest prompt | composer
│     ├── useRequireAuth() ──────── gate submit → auth modal (resume on login)
│     └── useAddArticleComment(articleId) → optimistic prepend + count bump
├── useArticleComments(articleId) → useInfiniteQuery → flatMap pages
│     └── ArticleDetailComment × N
│            ├── author? → real name/avatar | userId fallback (neutral)
│            └── isDeleted → "comment removed" placeholder
├── <sentinel ref> → useIntersectionObserver → fetchNextPage()  (+ "load more" Button)
└── states: skeletons (loading) · EmptyState (empty) · error + retry
```

Hooks (`useArticleComments`, `useAddArticleComment`) and the query keys are in
[specs/03-hooks-and-keys.md](specs/03-hooks-and-keys.md); the full JSDoc'd component
source is in [specs/10-comments.md](specs/10-comments.md).
