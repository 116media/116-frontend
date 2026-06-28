# Open Questions & Decisions

Resolved decisions and the handful of items needing backend input or a later phase.

---

## Decisions (locked)

| # | Question | Decision |
|---|---|---|
| D1 | Promoted section on the articles page | **Reuse** the homepage `ArticlePromotionFeedContainer` verbatim |
| D2 | Grid layout | The homepage **video-feed** grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `gap-x-4 gap-y-8`) **without** section title or view-all |
| D3 | Card family | New `ArticleCard` compound (`{ Feed }`) in the `articles` slice, sub-composed like `ArticlesMegaMenuCard` |
| D4 | Image category badge | **Removed** — category moves to the meta row |
| D5 | Meta row | `Tag` (category) · date · reading time, above the title, with vertical `Separator`s |
| D6 | Category chip | The shared **`Tag`** component (not `Badge`), `variant="outline"` |
| D7 | Paging | `useInfiniteQuery` + `IntersectionObserver` sentinel (no "load more" button) |
| D8 | Colors | **Theme tokens only** — the brief's `bg-blue-500` / `text-red-500` / `bg-white/90` are remapped |
| D9 | Dummy data | Deterministic dummy articles until real content, matching the promotion feed |
| D10 | Filtering | In scope: toolbar with category dropdown (left) + search (right) + tag pill strip / searchable all-tags popover; all server-side, single-select |
| D11 | Comment button | Opens the article with a `?comments=1` intent; the comments **drawer** (left on tablet, bottom on mobile) is deferred detail-page work |

---

## Needs backend input

### Q1 — Reading time on the summary DTO
`ArticleCard` shows "N min read", but `ReadTimeInMinutes` is only on
`ArticleDetailDto`, not `ArticleSummaryDto`. **Request:** add `ReadTimeInMinutes` to
`ArticleSummaryDto` (it is already computed for the detail). Until then the field is
optional on the entity and supplied by the dummy generator.

### Q2 — Author on the summary DTO
The card byline needs `{ userName, avatarUrl }`; the summary DTO carries only
`authorId`. **Request:** add a denormalized `Author` (or `authorName` + `authorAvatar`)
to `ArticleSummaryDto`. Until then: optional entity field + dummy author.

### Q3 — Per-user interaction flags
Neither `isLiked` nor `isBookmarked` is on any list DTO, so the card can't show the
correct initial toggle state on first paint. **Request:** either add `isLiked` /
`isBookmarked` to `ArticleSummaryDto`, or provide a batch "my interactions for these
ids" endpoint. Until then, toggles start `false` and are optimistic-only (see
[10-interactions.md](10-interactions.md)).

---

## Needs backend input (filtering)

### Q4 — Multi-select category / tag
The list endpoint takes a **single** `categoryId` and a **single** `tagSlug`, so the
filter UI is single-select. **Request (future):** accept arrays (`categoryIds`,
`tagSlugs`) if multi-select filtering is wanted.

### Q5 — Per-tag article count
`TagDto` is `{ id, name, slug }` — no count. **Request (optional):** a count per tag so
the strip/popover can show "(42)". Until then, tags render without counts.

### Q6 — Sort order
No sort param on the list endpoint (results come back in the backend's default order).
**Request (future):** a `sort` param (newest / most-liked) to power a sort control.

---

## Deferred to a later phase

- **Article detail page** (`/articles/[slug]`) — body, tags, images, comments. The
  backend endpoint (`getArticleBySlug` → `ArticleDetailDto`) is ready; only the listing
  ships now.
- **Comments drawer** — the comment button opens the article with a `?comments=1` intent;
  the drawer that flag opens (**left on tablet, bottom sheet on mobile**, auto-scrolled to
  the composer) plus posting/editing comments are detail-page work. Needs a shared
  `Drawer`/`Sheet` primitive (side variants) that does not exist yet. See
  [10-interactions.md](10-interactions.md).
- **Multi-select filters & sort** — see Q4 / Q6; single-select ships now.
- **SSR prefetch of page 1** — hydrate the first (unfiltered) infinite page on the server
  for faster first paint (the grid is client-fetched for the first cut). A
  `dehydrate`/`hydrate` boundary can be added without touching the hook's contract.
- **A dedicated `--like` color token** — if a non-destructive red is wanted for the
  liked heart instead of `--destructive`.

---

## Notes

- When real content lands, removing the dummy import + the empty-branch is the only
  change; the entity contract (with the optional fields Q1–Q3 fill) does not move.
- If Q1–Q3 are answered by adding fields to `ArticleSummaryDto`, only
  `ArticlesMapper.articleSummaryFromDto` changes — components already read the entity
  fields.
