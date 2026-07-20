# Spec 06 — Content-absence fallback titles

Locked principle (see [../02-architecture.md](../02-architecture.md)): **only the homepage shows
the root default title** — every other route, including a "this content doesn't exist" state,
shows a title describing what's actually on screen. This spec covers the two places that
currently violate that:

1. The `not-found.tsx` boundaries for `articles/videos/shows [slug]` — no `title` at all today,
   so a 404 for `/articles/some-missing-slug` renders `<title>116 - Musique & Culture
   Hip-Hop</title>`, identical to the homepage.
2. The `shorts/[slug]` route's own `generateMetadata` — already handles the missing-short case,
   but with a hardcoded, English-only literal (`{ title: "Shorts" }`) instead of a translated
   string.

No new `not-found.tsx` file is needed for shorts — that route never calls `notFound()`; it
handles a missing short entirely inside its own `generateMetadata`/page body (see below).

---

## Articles / videos / shows — `not-found.tsx`

Each already delegates to a shared `*NotFound` view whose on-page heading is exactly the string
this title should show — reuse it, no new key.

**`app/(public)/articles/[slug]/not-found.tsx`** (add `generateMetadata` above the existing
`NotFound` component)

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the not-found boundary's title from the active server language, reusing the same
 * string rendered as the empty-state heading.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("articles.detail.notFound.title") };
}
```

Mirror for the other two, changing only the key:

- **`app/(public)/videos/[slug]/not-found.tsx`** → `t("videos.detail.notFound.title")`
- **`app/(public)/shows/[slug]/not-found.tsx`** → `t("videos.shows.notFound.title")`

## Shorts — localize the missing-short fallback

No `not-found.tsx` exists for this route; the fallback lives directly in the route's
`generateMetadata`. No existing key covers it — `shorts` has no `notFound` string anywhere — so
this adds one, in the `player` namespace (the surface that actually renders when a short can't be
resolved).

**`src/modules/shorts/presentation/i18n/locales/en/player.ts`** (add to the existing object)

```ts
export const player = {
    notFound: "Short not found",
    close: "Close",
    // ...unchanged
} as const;
```

**`src/modules/shorts/presentation/i18n/locales/fr/player.ts`** (add to the existing object)

```ts
export const player = {
    notFound: "Réel introuvable",
    close: "Fermer",
    // ...unchanged
} as const;
```

**`app/(public)/shorts/[slug]/page.tsx`** (replaces the existing hardcoded fallback line only)

```tsx
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

export async function generateMetadata({ params }: ShortDetailRouteProps): Promise<Metadata> {
    const { slug } = await params;
    const [short, { t }] = await Promise.all([fetchShort(slug), getServerTranslation()]);

    if (!short) return { title: t("shorts.player.notFound") };

    // ...unchanged from here (title/openGraph/twitter built from `short`)
}
```

## Task checklist

- [ ] Add `generateMetadata` to the three `not-found.tsx` boundaries, reusing each detail
  namespace's existing `notFound.title` key.
- [ ] Add `notFound` to both `shorts` `player.ts` locale files.
- [ ] Replace the hardcoded `{ title: "Shorts" }` fallback in
  `app/(public)/shorts/[slug]/page.tsx` with the translated version, fetching the translation
  alongside the short (`Promise.all`) so the no-short path doesn't pay for a second sequential
  await.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] In both languages: visit a non-existent slug under `/articles`, `/videos`, `/shows`, and
  `/shorts`, and confirm each `<title>` names the missing content (e.g.
  `116 - Article not found` / `116 - Article introuvable`), never the root default.
