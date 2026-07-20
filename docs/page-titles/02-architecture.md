# Page Titles — Architecture

## Locked principle

**Only the homepage (`/`) shows the root default title.** Every other route — including a
route that renders because content is *missing* (a 404 boundary, a short that failed to
resolve) — shows a title describing what's actually being displayed, not the site-wide
fallback. A "not found" state is still content: it gets the translated "X not found" string,
never `116 - Musique & Culture Hip-Hop`. This is why the scope below includes the
`not-found.tsx` boundaries and the shorts route's missing-short fallback (spec 06), not just the
routes that render successfully.

## Chosen approach

1. A new shared server util, `getServerTranslation()`, wraps the existing
   `getServerLanguage()` + `createI18nInstance()` into a single per-request `{ language, t }`
   pair, memoized with React `cache()` — mirroring the exact pattern already used by
   `fetchArticle` in `app/(public)/articles/[slug]/page.tsx`.
2. The root layout's static `metadata` becomes an `async function generateMetadata()` that calls
   `getServerTranslation()` and returns the locale-correct `title.default` and `description`,
   read straight from the already-authored `general.metaTitleDefault` / `general.metaDescription`
   keys. `title.template` is the literal `"116 - %s"` — see [03-open-questions.md](03-open-questions.md)
   (decision 2) for the brand-prefix format, and (decision 1) for why the separate
   `metaTitleTemplate` i18n key is removed rather than used for this.
3. Every route that currently has no `title` gets its own `generateMetadata`, returning
   `{ title: t("<key>") }`. Next's inherited `116 - %s` template does the prefixing — no route
   needs to compose the full string itself.
4. Routes that already set other metadata as a static `export const metadata` (the three
   favorites pages, `robots: noindex`) convert to `generateMetadata` so the `title` can be
   resolved from translations, keeping the existing `robots` field alongside it.
5. The four detail routes (`articles/videos/shorts/shows` `[slug]`) are **unchanged** — their
   title already comes from content, and they already benefit from the root template once it is
   fixed.

## Why a shared server-translation util, not `useTranslation()`

`generateMetadata` and the `metadata` export only run in Server Components
(`node_modules/next/dist/docs/.../generate-metadata.md`, "Why `generateMetadata` is Server
Component only") — there is no React tree mounted yet, so the client `useTranslation()` hook
(which reads from `I18nProvider`'s React context) is not reachable. A plain, synchronous
`createI18nInstance(lng).t` is the only thing that works before the tree exists — this is exactly
why `createI18nInstance` already exists as an exported function in `config.ts` rather than being
inlined into `I18nProvider`.

`getServerTranslation()` lives in `src/shared/presentation/utils/i18n/i18n.server.utils.ts` — a
new concern folder, following the `<concern>.server.utils.ts` convention (`AGENTS.md`) for
server-only helpers that must never be co-bundled with client utils. It composes two utils that
already exist and are already used elsewhere:

- `getServerLanguage()` (`utils/language/language.server.utils.ts`) — cookie read + validation.
- `createI18nInstance(lng)` (`i18n/config.ts`) — already used by `I18nProvider` for the server-side
  render pass.

## Why `cache()`, not a fresh instance per call

A route commonly needs the same server translation twice in one request — once in
`generateMetadata`, once in the page/layout component body (for a translated fallback string, an
`aria-label`, etc.). `fetchArticle` in the existing article-detail route already solves this exact
shape of problem (`generateMetadata` and the page component both need the same fetched article)
with React's `cache()`:

```ts
const fetchArticle = cache(async (slug: string): Promise<IArticleDetailEntity | null> => { ... });
```

`getServerTranslation()` uses the same `cache()` wrapper, so both call sites in one request share
one resolved language and one i18next instance instead of re-deriving it.

## Why reuse existing heading keys instead of new `pageTitle` keys

Three of the routes needing a title already have an on-page heading translated for exactly that
purpose:

| Route | Existing key | English value |
| --- | --- | --- |
| `/videos` | `videos.browse.title` | "Explore Video Collections" (renamed from "Explore the collection" — see spec 03) |
| `/shows` | `videos.shows.title` | "All Shows" |
| `/favorites/articles` | `favorites.headings.articles` | "Favorite articles" |
| `/favorites/videos` | `favorites.headings.videos` | "Favorite videos" |
| `/favorites/shorts` | `favorites.headings.shorts` | "Favorite shorts" |
| `/settings/profile` | `settings.nav.profile` | "Profile" |
| `/settings/security` | `settings.nav.security` | "Security" |
| `/settings/account` | `settings.nav.account` | "Account" |

Reusing these keeps the tab title and the on-page heading in sync by construction — renaming a
section renames its title too, with one edit. The one route with no existing equivalent is
`/articles`: the articles listing has no visible page heading (only the promoted feed + filter
toolbar), so it gets one new key, `articles.pageTitle`.

## Why per-module ownership, no new shared namespace

This follows the ownership rule already documented in
`../../../../docs/i18n/frontend/04-message-modules.md`: a string lives in the module that renders
it. `articles.pageTitle` joins the existing `articles` namespace; `videos`/`shows` and
`favorites`/`settings` reuse what's already there. No new shared `pageTitles` namespace is
introduced — there is no cross-module page-title concern to centralize.

## Rendering-mode note

Reading cookies inside `generateMetadata` (via `getServerLanguage()`) marks that route segment as
dynamically rendered per request. The root layout already does this today in its component body,
so this is not a new cost — it moves an existing dynamic dependency into a second function in the
same file, it does not add one. No Cache Components / `dynamicIO` behavior is in play (see
[01-overview.md](01-overview.md)).
