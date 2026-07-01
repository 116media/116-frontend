# 19 — Open Questions & Decisions

The decisions locked for the detail page, then the real backend gaps that need input or a
later phase — each with the context that forced it and the recommendation. Mirrors
[../articles/15-open-questions.md](../articles/15-open-questions.md).

---

## Decisions (locked)

| # | Question | Decision |
|---|---|---|
| D1 | Route shape | `app/(public)/articles/[slug]/page.tsx`, async RSC: server-fetch the article (SEO + fast paint) → `notFound()` on missing → hydrate a client shell ([04](04-page-composition.md)) |
| D2 | Body HTML safety | Sanitize with **`isomorphic-dompurify`** before render; never raw `dangerouslySetInnerHTML` ([06](06-article-body.md)) |
| D3 | Reading-progress target | The **body element** (not the whole document) drives the progress bar (see Q6) |
| D4 | Popular sidebar source | **`getPromotedArticles`** (≈ "popular"), current article excluded, falling back to `getPublishedArticles` (see Q3) |
| D5 | Popular card | New **`ArticleCard.Horizontal`** variant (`ArticleCard = { Feed, Horizontal }`), mirroring `VideoCard.Horizontal` ([11](11-popular-articles-sidebar.md)) |
| D6 | Category placement | Rendered twice — the shared **`Tag`** above the title **and** overlaid on the cover ([05](05-cover-and-header.md)) |
| D7 | Like / bookmark / share hooks | **Reused** — `useToggleArticleLike` / `useToggleArticleBookmark` unchanged; `useShareArticle` extended with a platform arg ([09](09-interactions.md)) |
| D8 | Comment interaction UI | Detail-page comment button **scrolls to / focuses** the composer (no drawer) ([09](09-interactions.md)) |
| D9 | SEO | `generateMetadata` (OG "article" + canonical) **and** JSON-LD `NewsArticle` structured data ([17](17-seo-and-metadata.md)) |
| D10 | i18n placement | New `article-detail.ts` locale files spread into the `articles` namespace barrel ([16](16-i18n.md), [specs/12](specs/12-i18n.md)) |

---

## Needs backend input

### Q1 — Comment DTO carries only `userId`
`ArticleCommentDto` is `{ id, userId, body?, isDeleted, createdAt, … }` — **no username,
no avatar, no threading, no per-comment likes** (see
[03-backend-api-reference.md](03-backend-api-reference.md)). The comment UI is designed
around an author **projection** (`IArticleCommentEntity.author?: IArticleAuthor`).
**Request:** add an author projection (`author: { userName, avatarUrl }`) to the comment
DTO; **later**, optional threading (`parentId` + a replies count) and per-comment likes.
**Interim UI:** each row shows a neutral placeholder avatar and a short, non-PII user
reference; a freshly-posted comment renders the **current** user optimistically (the one
case where the client knows the author). No reply affordance and no per-comment like button
ship until the DTO grows. See [12](12-comments.md).

### Q2 — No per-user `isLiked` / `isBookmarked` on `ArticleDetailDto`
The detail DTO carries counts but **no per-user interaction state**, so first paint can't
show the correct initial like/bookmark toggle. **Request:** add `isLiked` / `isBookmarked`
to `ArticleDetailDto`, **or** provide a per-user "my interactions for this article"
endpoint. **Interim UI:** toggles start `false` and are optimistic-only, exactly as on the
feed ([09](09-interactions.md)); the backend's `409 Conflict` on a redundant like/bookmark
lets the client reconcile a wrong guess without a hard error.

### Q3 — No "most popular articles" endpoint
There is **no** popularity-sorted endpoint. The sidebar sources from what exists —
`getPromotedArticles` (editorially boosted ≈ "popular"), current article excluded, falling
back to the first page of `getPublishedArticles` (see
[03-backend-api-reference.md](03-backend-api-reference.md), [11](11-popular-articles-sidebar.md)).
**Request:** a popularity-sorted endpoint (by likes/views over a window), so the column
reflects genuine popularity rather than promotion. Until then the source stays
promoted-then-recent and the mapping (`articleSummaryFromDto` → `IArticleSummaryEntity`) is
already what the horizontal card consumes.

### Q4 — Allowed HTML tags in the body
`ArticleDetailDto.Body` is trusted HTML authored by admins (TipTap output: headings,
lists, blockquotes, images, and youtube/social **embeds → `iframe`**). We sanitize it with
`isomorphic-dompurify` anyway — **defense in depth** — since even admin-authored HTML can
carry a pasted script or a hostile embed. **Request:** confirm the exact allowed-tag /
allowed-attribute set with the backend/editor team, in particular the **`iframe`
allow-list** (which embed hosts — YouTube, X, Instagram, TikTok, … — and which attributes)
so the sanitizer config matches what the editor can produce and nothing legitimate is
stripped. See [06](06-article-body.md).

---

## Deferred to a later phase

- **Comment edit / delete UI** — the backend endpoints exist (`publicEditArticleComment` /
  `publicDeleteArticleComment`, owner-only) and are wired in the domain/repo layer, but the
  first cut ships **create + list only**; no edit/delete affordance in the UI yet. See
  [03-backend-api-reference.md](03-backend-api-reference.md), [12](12-comments.md).
- **Comment threading & per-comment likes** — depends on Q1; not in the first cut.
- **True popularity ranking** — depends on Q3; promoted/recent stands in for now.
- **Per-user initial interaction state** — depends on Q2; optimistic-only until then.

---

## Notes

- If Q1 is answered by adding the author projection to the comment DTO, only
  `articleCommentFromDto` changes — `ArticleDetailComment` already reads
  `IArticleCommentEntity.author`.
- If Q2 is answered, `useArticleDetail` seeds the toggles from the entity; the engagement
  components already read the flags.
- If Q3 lands, only `useArticleDetailPopular`'s source swaps; `ArticleCard.Horizontal` and
  the sidebar are unaffected.
- The Q4 allow-list only tunes the sanitizer config; the render path
  ([06](06-article-body.md)) does not change.
