# 01 — Overview

## Goal

Build the public **single article page** at `/articles/[slug]`. It is the destination for
every article link in the app (feed cards, promotion feed, mega menu, gossip strip). It
renders the full article — cover, title, headline, rich-text body with images, tags,
author — and lets a reader **like**, **bookmark**, **share**, and **comment**, while a
**reading-progress** indicator tracks how far they've scrolled.

## In scope

- Fetch one article by slug (`getArticleBySlug` → `ArticleDetailDto`) and render it.
- **Hero**: cover image with the category chip overlaid at the bottom and the author
  (avatar + username); a category **`Tag`** (exclusive-tags style) above the title, then
  the title, headline, published date, and read time.
- **Body**: sanitized rich-text **HTML** with embedded images and a typographic prose
  scale.
- **Reading progress**: a sticky top bar that fills 0→100 % as the body scrolls.
- **Share rail**: Facebook, X (Twitter), WhatsApp, and copy-link, with the native Web
  Share API where available; each share pings the backend `shareArticle`.
- **Engagement**: like / comment / bookmark with optimistic counts (the like and bookmark
  hooks are reused verbatim from the feed).
- **Tags**: the article's tags at the end of the body.
- **Popular articles sidebar**: a column of **horizontal** article cards
  (`ArticleCard.Horizontal`, a new variant).
- **Comments**: paginated list + a composer (textarea + submit) for authenticated users.
- **SEO**: `generateMetadata` (title, description, Open Graph, canonical) and JSON-LD
  `Article` structured data.
- Loading / not-found (404) / error states.

## Out of scope (deferred, documented in [19](19-open-questions.md))

- Comment **replies / threading**, comment **likes**, and comment **edit/delete UI** (the
  backend supports edit/delete, but the first cut ships create + list only).
- A true **"most popular" articles** ranking endpoint (none exists; the sidebar sources
  from promoted / recent articles — see [11](11-popular-articles-sidebar.md)).
- **Accurate initial like/bookmark state** per user (the DTO has no `isLiked` /
  `isBookmarked`; state is client-owned and optimistic, as on the feed).

## The three requirements that shape the design

1. **The body is HTML.** `ArticleDetailDto.Body` is *"the full rich-text HTML body"*. It
   is rendered as sanitized HTML inside a prose container — never as raw
   `dangerouslySetInnerHTML` without sanitization (the `kinix_frontend` reference does the
   unsafe thing; we do not). See [06](06-article-body.md).
2. **Reading progress must be visualized as you scroll.** We add a slim sticky progress
   bar under the header, driven by the body element's scroll position. See
   [07](07-reading-progress.md).
3. **Comments carry only a `UserId`.** `ArticleCommentDto` has `Id`, `UserId`, `Body?`,
   `IsDeleted` — **no author name/avatar, no threading, no per-comment likes**. The UI is
   designed around an author **projection** (`author?: IArticleAuthor`) that the backend
   should add; until it does, the list shows a neutral avatar + a short user reference, and
   a freshly-posted comment shows the current user optimistically. See
   [12](12-comments.md) and [19](19-open-questions.md).

## What we improve over the references

| Concern | `kinix_frontend` / `dashboard` | This page |
|---|---|---|
| Body HTML | `dangerouslySetInnerHTML`, unsanitized (XSS risk) | Sanitized HTML in a themed prose container |
| Reading progress | Static "X min read" badge only | Sticky scroll progress bar **and** the read-time figure |
| Share | Opens new windows only | Web Share API first, per-platform URL fallback, copy-link toast |
| Popular column | Text-only related list | **Horizontal cards** with thumbnail + meta |
| SEO | Minimal | `generateMetadata` + Open Graph + JSON-LD |
| Theming | Partial / hardcoded | Theme tokens throughout, dark-mode clean |
| Comments | Drawer, no pagination | Inline section with paginated list + composer |

## Decisions locked

- **Route**: `app/(public)/articles/[slug]/page.tsx`, an async RSC that fetches the
  article server-side (SEO + fast first paint) and hands it to a client container for the
  interactive shell. See [04](04-page-composition.md).
- **Sanitizer**: `isomorphic-dompurify` (SSR + client safe). Run
  `npm show isomorphic-dompurify dist-tags.latest` before pinning. See [06](06-article-body.md).
- **Popular sidebar** uses **`ArticleCard.Horizontal`**, a new variant added to the
  `ArticleCard` compound (`ArticleCard = { Feed, Horizontal }`), mirroring
  `VideoCard.Horizontal`. See [11](11-popular-articles-sidebar.md).
- **Category above the title** renders as the shared **`Tag`** (`variant="primary"`,
  exclusive-tags style), and **also** overlays the bottom of the cover — same category,
  two placements. See [05](05-cover-and-header.md).
- **Like & bookmark** reuse `useToggleArticleLike` / `useToggleArticleBookmark` unchanged.
  **Share** reuses `useShareArticle` (extended to accept a platform). **Comment** on the
  detail page scrolls to / focuses the composer (no drawer). See [09](09-interactions.md).
- **Brand icons** (Facebook, X, WhatsApp) come from `@icons-pack/react-simple-icons`
  (already a dependency); copy-link uses a lucide icon from the barrel. See
  [08](08-share-rail.md).
- **JSDoc-only in generated code.** Every snippet in `specs/` carries block JSDoc only —
  no inline `//` comments — matching the [`../articles`](../articles/) convention.
