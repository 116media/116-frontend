# Article Detail Page — Design & Implementation Docs

Design and implementation documentation for the web frontend **single article (article
detail) page** at `/articles/[slug]`. Every article surface in the app — the feed grid,
the promotion feed, the mega menu, the gossip strip — links here.

These docs mirror the structure of [`../articles/`](../articles/): numbered design docs
(the *why* and the *what*), a `specs/` folder of implementation-ready, JSDoc'd,
checklist-tracked specs (the *how*), and a locked set of decisions.

This is **documentation only** — no code is written into the codebase from these files.
The `specs/` snippets are the contract an implementer copies from.

---

## The page at a glance

A reader opens `/articles/{slug}` and sees, top to bottom:

1. **Reading-progress bar** — a slim sticky bar under the header that fills as the body
   is scrolled (see [07](07-reading-progress.md)).
2. **Hero / cover** — the cover image with the **category** chip overlaid at the bottom
   and the **author** (avatar + username); above the title sits the category as an
   exclusive-style **`Tag`**, then the **title**, the **headline**, and a meta line with
   the **published date** and **read time** ([05](05-cover-and-header.md)).
3. **Two-column body** — on wide screens: a left **popular-articles** column of
   **horizontal cards** ([11](11-popular-articles-sidebar.md)) and a **sticky share rail**
   (Facebook · X · WhatsApp · copy link — [08](08-share-rail.md)); the main column holds
   the **HTML body** with embedded images ([06](06-article-body.md)).
4. **Engagement** — **like**, **comment**, **bookmark** with live counts
   ([09](09-interactions.md)).
5. **Tags** — the article's tags at the end of the body ([10](10-tags.md)).
6. **Comments** — the comment count, the list, and a composer (textarea + submit)
   ([12](12-comments.md)).

---

## Design docs

| File | What it covers |
|---|---|
| [01-overview.md](01-overview.md) | Goals, scope, and the decisions locked for this page |
| [02-architecture.md](02-architecture.md) | Clean-architecture layering, folder layout, the reuse map, every new file |
| [03-backend-api-reference.md](03-backend-api-reference.md) | `getArticleBySlug`, `ArticleDetailDto`, comments, interactions, the DTO gaps |
| [04-page-composition.md](04-page-composition.md) | The route, RSC vs client split, server prefetch, the two-column shell |
| [05-cover-and-header.md](05-cover-and-header.md) | Cover image, category overlay, title + `Tag`, headline, author, read time |
| [06-article-body.md](06-article-body.md) | Rendering the HTML body: sanitization, prose typography, embedded images |
| [07-reading-progress.md](07-reading-progress.md) | The scroll reading-progress indicator (UX + mechanics) |
| [08-share-rail.md](08-share-rail.md) | Facebook / X / WhatsApp / copy-link, Web Share API + fallback |
| [09-interactions.md](09-interactions.md) | Like / comment / bookmark on the detail page (reusing the feed hooks) |
| [10-tags.md](10-tags.md) | The article tags block at the end of the body |
| [11-popular-articles-sidebar.md](11-popular-articles-sidebar.md) | `ArticleCard.Horizontal` and the popular-articles column |
| [12-comments.md](12-comments.md) | Comment list, pagination, and the composer |
| [13-domain-entities-and-mappers.md](13-domain-entities-and-mappers.md) | `IArticleDetailEntity`, `IArticleCommentEntity`, mappers |
| [14-state-management-and-hooks.md](14-state-management-and-hooks.md) | `useArticleDetail`, comments query, reading-progress hook, query keys |
| [15-loading-empty-error.md](15-loading-empty-error.md) | Skeletons, 404 / not-found, error and empty states |
| [16-i18n.md](16-i18n.md) | `articles.detail` / `articles.comments` / `articles.share` keys (en/fr) |
| [17-seo-and-metadata.md](17-seo-and-metadata.md) | `generateMetadata`, Open Graph, JSON-LD structured data |
| [18-implementation-plan.md](18-implementation-plan.md) | Phased build order and checklists |
| [19-open-questions.md](19-open-questions.md) | Decisions locked, backend gaps, assumptions |

---

## Specs

Implementation-ready, in [specs/](specs/) — start at [specs/00-index.md](specs/00-index.md).

---

## Reference material

The design improves on two existing implementations (see [01](01-overview.md) for the
delta): the public reader in `kinix_frontend` (three-column layout, HTML body, share
sidebar, comments drawer) and the admin preview in `apps/dashboard` (TipTap read-only
body, serif reading typography). Backend contract lives in `apps/backend`
(`Content` module).
