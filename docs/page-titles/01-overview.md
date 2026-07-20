# Page Titles — Overview

## Current state

### The root layout

**`app/layout.tsx`** exports a static `metadata` object:

```ts
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        template: "%s | 116",
        default: "116 - Musique & Culture Hip-Hop"
    },
    description: "Articles, vidéos et paroles de la culture hip-hop en RDC et au-delà."
};
```

This is evaluated once, at build/module-load time — it cannot read the visitor's language cookie,
because it isn't a function. Every route that doesn't set its own `title` falls back to
`"116 - Musique & Culture Hip-Hop"`, in French, regardless of the active language.

The layout **already resolves the server language** for other purposes, one line below the
metadata export:

```ts
export default async function RootLayout({ children }) {
    const language = await getServerLanguage();
    // ...used for <html lang> and I18nProvider, never for metadata
```

So the information needed to localize the title is already available in this exact file — it is
simply never passed to `metadata`.

### The bilingual strings already exist, unused

**`src/shared/presentation/i18n/locales/{fr,en}/general.ts`** already carries three keys that
look purpose-built for this:

```ts
// fr
metaTitleTemplate: "{{page}} | 116",
metaTitleDefault: "116 - Musique & Culture Hip-Hop",
metaDescription: "Articles, vidéos et paroles de la culture hip-hop en RDC et au-delà."

// en
metaTitleTemplate: "{{page}} | 116",
metaTitleDefault: "116 - Hip-Hop Music & Culture",
metaDescription: "Articles, videos and lyrics from hip-hop culture in the DRC and beyond."
```

Nothing in the codebase reads `general.metaTitleTemplate`, `general.metaTitleDefault`, or
`general.metaDescription` today (confirmed by search) — they were scaffolded alongside the rest
of the i18n catalog but never wired into the layout that owns metadata. `metaTitleDefault` and
`metaDescription` are exactly what the root layout's hardcoded French strings should read from.
`metaTitleTemplate` is a separate case — see [03-open-questions.md](03-open-questions.md).

### Route-by-route audit

| Route | Metadata today | `<title>` shown |
| --- | --- | --- |
| `/` (home) | none | `116 - Musique & Culture Hip-Hop` (root default) |
| `/articles` | none | root default |
| `/articles/[slug]` | `generateMetadata` — title from the article entity (`metaTitle` ?? `title`) | article's own title, `\| 116` suffix inherited from root template (becomes a `116 -` prefix — see decision 2) |
| `/videos` | none | root default |
| `/videos/[slug]` | `generateMetadata` — title from the video entity | video's own title, `\| 116` suffix (becomes a `116 -` prefix) |
| `/shows` | none | root default |
| `/shows/[slug]` | `generateMetadata` — title from the show entity | show's own title, `\| 116` suffix (becomes a `116 -` prefix) |
| `/shorts/[slug]` | `generateMetadata` — title from the short entity | short's own title, `\| 116` suffix (becomes a `116 -` prefix) |
| `/favorites` | redirects to `/favorites/articles` | n/a |
| `/favorites/articles` | `robots: noindex` only | root default |
| `/favorites/videos` | `robots: noindex` only | root default |
| `/favorites/shorts` | `robots: noindex` only | root default |
| `/settings` | redirects to `/settings/profile` | n/a |
| `/settings/profile` | none | root default |
| `/settings/security` | none | root default |
| `/settings/account` | none | root default |

The four detail routes are the only ones that already vary — and only because their `title` is
literally the content's own headline, sourced from the CMS entity, not from the UI language. Every
listing and every private route shows the exact same string.

### What already works and must not regress

- `title: { template: "%s | 116", default: "..." }` in the root layout is Next's built-in
  [title templating](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template)
  — any child route that sets a plain `title: string` is automatically combined with the parent's
  template. This is why the four detail routes already render a suffixed title today. The
  **mechanism** (a child `title: string` merging into a parent template) is kept; the **literal
  template string** changes from `"%s | 116"` to `"116 - %s"` per decision 2 in
  [03-open-questions.md](03-open-questions.md) — so the four detail routes' own code is
  unchanged, but their rendered title shape flips from a suffix to a prefix (see
  [02-architecture.md](02-architecture.md)).
- The layout already reads `getServerLanguage()` (cookie-backed, validated, falls back to `fr`)
  before this metadata is ever generated — the app is already dynamically rendered per request at
  the root on account of that call. Converting the static `metadata` export to `generateMetadata`
  does not introduce new dynamic behavior; it reads the same cookie the layout already reads.
- `next.config.ts` does not enable Cache Components (`cacheComponents` is absent), so the stricter
  static/dynamic split documented for that mode
  (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`,
  "With Cache Components") does not apply here — no dynamic marker component is needed.
