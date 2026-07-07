# 18 — Implementation Plan

Phased build order for the detail page. Each phase is independently verifiable
(`npx tsc --noEmit` + biome clean, behavior confirmed) before the next, and maps to one or
more specs in [specs/00-index.md](specs/00-index.md). The order follows dependencies:
domain → data → hooks → primitives → UI (bottom-up per sub-composer) → route → i18n →
polish.

---

## Dependencies

- **`isomorphic-dompurify`** for sanitizing the HTML body (SSR + client safe). Run
  `npm show isomorphic-dompurify dist-tags.latest` before pinning. Used in Phase 3 /
  Phase 4. See [06-article-body.md](06-article-body.md).
- **`@icons-pack/react-simple-icons`** (already a dependency) for the Facebook / X /
  WhatsApp brand marks in the share rail — no install needed.
- No other new runtime deps; `useQuery` / `useInfiniteQuery` / `useMutation` ship with the
  installed TanStack Query v5.

## Phases

### Phase 1 — Data layer: domain + mappers, repository + use cases + DI
- Add `IArticleDetailEntity`, `IArticleImage`, `IArticleCommentEntity`,
  `IArticleCommentPage`; extend `ArticlesMapper` with `articleDetailFromDto`,
  `articleImageFromDto`, `articleCommentFromDto`, `articleCommentPageFromDto`.
- Extend `IArticlesRepositoryPort` + impl with `getArticleBySlug`, `getArticleComments`,
  `addArticleComment` (and the deferred `editArticleComment` / `deleteArticleComment`);
  add the `GetArticleBySlug` / `GetArticleComments` / `AddArticleComment` use cases; register
  in `articles.dependencies.ts` + the `Cradle` type.
- Verify: a throwaway call returns a mapped `IArticleDetailEntity` and an
  `IArticleCommentPage`; DI resolves each use case.
- Specs: [specs/01-domain-and-mappers.md](specs/01-domain-and-mappers.md),
  [specs/02-repository-and-usecases.md](specs/02-repository-and-usecases.md).

### Phase 2 — Hooks + query keys
- Extend `articleKeys` with `detail(slug)` and `comments(articleId)`; add
  `useArticleDetail` (`useQuery`), `useArticleComments` (`useInfiniteQuery`),
  `useAddArticleComment` (`useMutation`, optimistic prepend + count bump).
- Verify: hooks type-check against the entities; query keys are stable.
- Spec: [specs/03-hooks-and-keys.md](specs/03-hooks-and-keys.md).

### Phase 3 — Shared primitives
- Add `Prose` (typographic container for sanitized body HTML), `Progress` (slim themed
  bar), and `Textarea` (themed multi-line input) under
  `shared/presentation/components/ui/`; add `useReadingProgress` under
  `shared/presentation/hooks/`.
- Verify: each renders in isolation, light/dark, tokens only; tsc + biome clean.
- Specs: [specs/05-article-body.md](specs/05-article-body.md),
  [specs/06-reading-progress.md](specs/06-reading-progress.md),
  [specs/10-comments.md](specs/10-comments.md).

### Phase 4 — Hero + body + tags
- Add `ArticleDetail.Hero` (cover + category overlay + author + title `Tag` + title +
  headline + meta), `ArticleDetail.Body` (sanitize with `isomorphic-dompurify` → `Prose`),
  `ArticleDetail.Tags`.
- Verify: renders a fixture article; body HTML is sanitized; read time reuses
  `articles.card.readTime`.
- Specs: [specs/04-cover-and-header.md](specs/04-cover-and-header.md),
  [specs/05-article-body.md](specs/05-article-body.md).

### Phase 5 — Reading progress + share + interactions
- Add `ArticleDetail.ReadingProgress` (sticky bar wired to `useReadingProgress` on the body
  element), `ArticleDetail.ShareRail` (Facebook / X / WhatsApp + copy-link, Web Share API
  first, `useShareArticle` extended with a platform arg), `ArticleDetail.Engagement` (like /
  comment / bookmark reusing `useToggleArticleLike` / `useToggleArticleBookmark`).
- Verify: progress fills 0→100 % over the body; share opens the right target and copy-link
  toasts; like/bookmark toggle optimistically, guests gated to auth.
- Specs: [specs/06-reading-progress.md](specs/06-reading-progress.md),
  [specs/07-share-rail.md](specs/07-share-rail.md),
  [specs/08-interactions.md](specs/08-interactions.md).

### Phase 6 — Popular sidebar
- Add `ArticleCard.Horizontal` (new variant → `ArticleCard = { Feed, Horizontal }`),
  `useArticleDetailPopular` (promoted → recent fallback, current article excluded), and
  `ArticleDetail.PopularSidebar` with its loading/empty states (see
  [15-loading-empty-error.md](15-loading-empty-error.md)).
- Verify: sidebar lists horizontal cards; loading skeleton + empty collapse behave.
- Spec: [specs/09-popular-sidebar.md](specs/09-popular-sidebar.md).

### Phase 7 — Comments
- Add `ArticleDetail.Comments` (list + composer wrapper), `ArticleDetailComment` (one row,
  neutral avatar until the author projection lands), `ArticleDetailCommentComposer`
  (`Textarea` + submit); wire `useArticleComments` pagination + `useAddArticleComment`
  optimistic post, plus the loading/empty/error states.
- Verify: list paginates; posting prepends optimistically + bumps the count; empty/error
  states render; guest sees the login prompt.
- Spec: [specs/10-comments.md](specs/10-comments.md).

### Phase 8 — Page + layout + metadata
- Add `ArticleDetailContainer` (client shell) and `ArticleDetail` (assembler); add
  `app/(public)/articles/[slug]/page.tsx` (async RSC: server fetch → `notFound()` on
  missing → hydrate) with `generateMetadata`, plus `loading.tsx` and `not-found.tsx`.
- Verify: the route renders end-to-end from a real slug; an unknown slug 404s to the
  not-found boundary; the skeleton streams first.
- Spec: [specs/11-page-and-layout.md](specs/11-page-and-layout.md).

### Phase 9 — i18n
- Add the `article-detail.ts` locale files (en + fr) with `articles.detail` /
  `articles.share` / `articles.comments` / `articles.sidebar`; spread them into the two
  locale barrels next to `articles`.
- Verify: every detail string resolves via `t(…)`; language toggle translates all copy;
  en/fr key structures identical.
- Spec: [specs/12-i18n.md](specs/12-i18n.md).

### Phase 10 — SEO & states polish
- Add the JSON-LD `NewsArticle` script to the page and finalize `generateMetadata` (Open
  Graph "article", canonical, per-tag `article:tag`, Twitter card — see
  [17-seo-and-metadata.md](17-seo-and-metadata.md)); confirm all loading/empty/error/
  not-found states across the page and sub-sections (see
  [15-loading-empty-error.md](15-loading-empty-error.md)).
- Verify: OG/Twitter tags render; JSON-LD validates in the Rich Results test; every
  non-happy state is reachable and translated.
- Specs: [specs/11-page-and-layout.md](specs/11-page-and-layout.md),
  [17-seo-and-metadata.md](17-seo-and-metadata.md),
  [15-loading-empty-error.md](15-loading-empty-error.md).

---

## Verification checklist

- [ ] Domain entities + mappers derive the detail, image, comment, and comment-page
      shapes; `getArticleBySlug` returns a mapped `IArticleDetailEntity`; DI resolves each
      use case.
- [ ] `useArticleDetail` / `useArticleComments` / `useAddArticleComment` type-check; query
      keys are stable and collision-free with the feed keys.
- [ ] `Prose`, `Progress`, `Textarea`, `useReadingProgress` land and lint clean, tokens
      only.
- [ ] Hero renders cover + category overlay + title `Tag` + author + meta; body HTML is
      **sanitized** (no unsanitized `dangerouslySetInnerHTML`); tags block renders.
- [ ] Reading progress tracks the **body element** 0→100 %; share opens the right platform
      target, copy-link toasts; like/bookmark optimistic, guests gated.
- [ ] `ArticleCard.Horizontal` matches the `VideoCard.Horizontal` layout; popular sidebar
      lists cards, skeletons on load, collapses when empty.
- [ ] Comments paginate; optimistic post prepends + bumps count; empty/error/login states
      render; a deleted comment shows the "removed" copy.
- [ ] Route 404s to `not-found.tsx` on an unknown slug; `loading.tsx` skeleton streams;
      transient errors show the retryable `ArticleDetailError`.
- [ ] `generateMetadata` emits title/description fallbacks, canonical, OG "article", and
      per-tag `article:tag`; JSON-LD `NewsArticle` validates.
- [ ] en/fr `article-detail` key structures identical; language toggle translates all copy.
- [ ] `npx tsc --noEmit` and biome clean across the module.
