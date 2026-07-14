# Content Interactions — Implementation Specs

Implementation-ready specs for the web frontend's **content-interaction features** (likes,
comments, bookmarks, shares, ratings). Each spec contains **full, JSDoc'd code snippets** and
a **task checklist** whose boxes are ticked `- [x]` only **after** the work is implemented and
verified (`tsc` + biome clean, behavior confirmed).

Read the design docs first ([../README.md](../README.md)) for the *why*; these specs are the
*how*. Decisions are locked in [../14-open-questions.md](../14-open-questions.md).

Most interactions are **already shipped** — those specs *document the existing code verbatim*
so the contract is captured. Deferred items (comment reply/edit/delete/like, my-bookmarks)
are specced as new work.

---

## Specs

| File | What it covers | Status |
|---|---|---|
| [01-domain-and-mappers.md](01-domain-and-mappers.md) | `IArticleCommentEntity` (+ deferred fields), `IArticleCommentPage`, interaction flags, mappers | shipped + extend |
| [02-repository-and-usecases.md](02-repository-and-usecases.md) | Interaction port methods, impls, use cases, DI + cradle | shipped + extend |
| [03-hooks-and-keys.md](03-hooks-and-keys.md) | `useToggle`, query keys, the per-interaction hooks | shipped + extend |
| [04-likes.md](04-likes.md) | `useToggleArticleLike`, the engagement like button | shipped |
| [05-comments.md](05-comments.md) | Thread, composer, and the deferred reply/edit/delete/like | shipped + new |
| [06-bookmarks.md](06-bookmarks.md) | `useToggleArticleBookmark`, my-bookmarks list + `/bookmarks` route | shipped + new |
| [07-shares.md](07-shares.md) | `useShareArticle`, `useShareVideo`, share rail / modal | shipped |
| [08-ratings.md](08-ratings.md) | `useRateVideo`, the rating modal + star input | shipped |
| [09-i18n-and-notifications.md](09-i18n-and-notifications.md) | Interaction strings + notification configs (en/fr) | shipped + extend |

---

## Implementation order

For the **deferred** work only (shipped specs are documentation):

1. **Comment entity + mapper extension** (01) — `parentCommentId`, `replyCount`, `likeCount`, `isLiked`.
2. **Interaction port/use cases** (02) — comment like/reply/edit/delete, my-bookmarks.
3. **Hooks + keys** (03) — the deferred hooks + `replies` / `myBookmarks` keys.
4. **Comment completion UI** (05) — like heart, reply thread, edit form, delete confirm.
5. **My bookmarks** (06) — hook + `/bookmarks` route reusing `ArticlesGrid`.
6. **i18n + notifications** (09) — the new keys and toasts.

Each step is independently verifiable (`tsc` + biome). See
[../13-implementation-plan.md](../13-implementation-plan.md) for the phase mapping.

---

## Conventions for all snippets

- **JSDoc only in the generated code — no inline comments.** Only block JSDoc (`/** … */`)
  above declarations. No `//` notes, no per-field annotations beside interface properties
  (document fields with `@property`), no decorative separators. Anything in these snippets
  that is not JSDoc (a `//` note, a `/* … */` ellipsis, a "＋ new" marker) is scaffolding for
  the reader and must not appear in the output.
- **JSDoc on every export** — multi-line block form (`@description`, `@param`, `@returns`,
  `@property`), neutral team-to-team voice.
- **Optimistic toggles via `useToggle`** — like and bookmark (and comment-like) never toast;
  they flip and roll back.
- **Auth-gate every write except share** — through `useRequireAuth`.
- **Theme tokens** in `className` — never hardcoded colors; active states `fill-destructive`
  (like), `fill-primary` (bookmark).
- **`Result<T>`** out of every repository/use case; `ProblemMapper.toFailure` in catches;
  `runInteraction` bridges `Result<boolean>` to the throw-based mutation.
- **Mappers own list mapping** (`xxxListFromDto`); call sites never `.map(Mapper.x)`.
- **Import icons from the barrel**; brand icons from `@icons-pack/react-simple-icons`.
- **Notification copy** lives in `*.notification.ts` configs, never hardcoded at the call site.

---

## Global progress

- [ ] 01 — Domain & mappers *(shipped documented; deferred fields pending)*
- [ ] 02 — Repository & use cases *(shipped documented; deferred methods pending)*
- [ ] 03 — Hooks & keys *(shipped documented; deferred hooks pending)*
- [ ] 04 — Likes *(shipped documented)*
- [ ] 05 — Comments *(create+list documented; reply/edit/delete/like pending)*
- [ ] 06 — Bookmarks *(toggle documented; my-bookmarks pending)*
- [ ] 07 — Shares *(shipped documented)*
- [ ] 08 — Ratings *(shipped documented)*
- [ ] 09 — i18n & notifications *(shipped documented; deferred keys pending)*

Mark a box `- [x]` only when that spec's own task list is fully verified.
