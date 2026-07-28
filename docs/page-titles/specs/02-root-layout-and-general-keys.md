# Spec 02 — Root layout + `general.ts` key cleanup

Wires the already-authored bilingual `metaTitleDefault` / `metaDescription` strings into the root
layout, replacing the hardcoded French default. This is the fallback every route without its own
`title` renders, so it must land before any leaf-route spec.

---

## Root layout

**`app/layout.tsx`** (relevant excerpt — replaces the existing `export const metadata`)

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Site-wide default metadata: the root `title.default` and `description`, resolved from the
 * active server language. Any route below that sets its own `title` is automatically
 * prefixed with `116 - ` via `title.template`; a route with no `title` of its own falls back
 * to `title.default` here.
 *
 * @returns The root metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            template: "116 - %s",
            default: t("general.metaTitleDefault")
        },
        description: t("general.metaDescription")
    };
}
```

Everything else in `app/layout.tsx` — the `RootLayout` component, its own `getServerLanguage()`
call for `<html lang>` / `I18nProvider`, the font setup — is unchanged. `RootLayout` and
`generateMetadata` each call a language-resolving function once; because `getServerTranslation`
wraps `getServerLanguage` in React `cache()`, and `RootLayout` could optionally switch to
`getServerTranslation()` too if it ever needs a translated string in the body — it doesn't today,
so leave its existing direct `getServerLanguage()` call as is.

## `general.ts` key cleanup

Per [../03-open-questions.md](../03-open-questions.md) decision 1 (remove):

**`src/shared/presentation/i18n/locales/fr/general.ts`**

```ts
export const general = {
    follow: "Suivez-Nous: ",
    featured: "À la une",
    viewAll: "Voir tout",
    popularTags: "Tags populaires",
    metaTitleDefault: "116 - Musique & Culture Hip-Hop",
    metaDescription: "Articles, vidéos et paroles de la culture hip-hop en RDC et au-delà."
} as const;
```

**`src/shared/presentation/i18n/locales/en/general.ts`**

```ts
export const general = {
    follow: "Follow Us: ",
    featured: "Featured",
    viewAll: "View all",
    popularTags: "Popular tags",
    metaTitleDefault: "116 - Hip-Hop Music & Culture",
    metaDescription: "Articles, videos and lyrics from hip-hop culture in the DRC and beyond."
} as const;
```

(`metaTitleTemplate` removed from both — the literal `"116 - %s"` in `generateMetadata` above
covers it.)

## Task checklist

- [ ] Replace `export const metadata` with `export async function generateMetadata()` in
  `app/layout.tsx`, per the snippet above.
- [ ] Delete `metaTitleTemplate` from both `general.ts` files.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] With the language cookie unset (or `fr`), load `/` and confirm `<title>` is
  `116 - Musique & Culture Hip-Hop`.
- [ ] Switch language to English, reload `/`, confirm `<title>` is
  `116 - Hip-Hop Music & Culture`.
- [ ] Load `/articles/[slug]` (any existing slug) in both languages and confirm the title is now
  `116 - <article title>` — i.e. the template inheritance still works after this change, in its
  new prefix shape.
