# Page Titles — Design & Implementation Docs

Design and implementation documentation for making the browser tab `<title>` **dynamic per
route** and **i18n-aware** across the 116 frontend. Today every route — home, the article/video/
shows listings, favorites, settings — renders the exact same static, French-only title:
`116 - Musique & Culture Hip-Hop`. Only the four content detail routes (`/articles/[slug]`,
`/videos/[slug]`, `/shorts/[slug]`, `/shows/[slug]`) already compute their own title, from the
entity content, and even those inherit a French-only suffix from the root layout.

These docs mirror the structure of [`../short-videos/`](../short-videos/): numbered design docs
(the *why* and the *what*) and a `specs/` folder of implementation-ready, JSDoc'd,
checklist-tracked specs (the *how*).

This is **documentation only** — no code is written into the codebase from these files. The
`specs/` snippets are the contract an implementer copies from once the go-ahead is given.

---

## The problem, in one sentence

The root layout's `metadata` export is a **static, hardcoded, French-only object**, no route
below it ever overrides the `title`, and the i18n system that already has bilingual strings for
the default title (`general.metaTitleDefault`) has never been wired into it.

## The fix, in one sentence

Turn the root layout's static `metadata` into a `generateMetadata` that reads the same
already-resolved server language and returns the matching locale's default title, and give every
route that currently has none its own `title` — reusing an existing on-page heading string
(`videos.browse.title`, `videos.shows.title`, `favorites.headings.*`, `settings.nav.*`) wherever
one already exists, adding a new key only where it doesn't (the articles listing).

No new i18n architecture, no URL locale routing, no new module — this slots into the system
documented in [`../../../../docs/i18n/frontend/`](../../../../docs/i18n/frontend/).

---

## Design docs

| File | What it covers |
| --- | --- |
| [01-overview.md](01-overview.md) | Full route-by-route audit of today's `<title>` behavior, and the i18n foundation already in place but unused |
| [02-architecture.md](02-architecture.md) | The chosen approach: `generateMetadata` everywhere, a shared server-translation util, the reuse-existing-heading rule, the `116 - %s` template |
| [03-open-questions.md](03-open-questions.md) | Decisions (resolved): the `metaTitleTemplate` key removed, the `116 - <Page>` title format, settings `robots` left untouched |

## Specs

Implementation-ready, in [specs/](specs/) — start at [specs/00-index.md](specs/00-index.md).

## Reference material

The i18n foundation this feature builds on is fully documented in
[`../../../../docs/i18n/frontend/`](../../../../docs/i18n/frontend/) (see especially
[03-i18n-config.md](../../../../docs/i18n/frontend/03-i18n-config.md) for `createI18nInstance`
and [10-api-header.md](../../../../docs/i18n/frontend/10-api-header.md) for the existing
server/client language-resolution split). The article-detail route
(`app/(public)/articles/[slug]/page.tsx`) is the existing reference for a route-level
`generateMetadata` and for the `cache()`-memoized per-request fetch pattern this feature reuses
for translations.
