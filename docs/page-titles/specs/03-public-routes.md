# Spec 03 — Public listing routes

Adds `generateMetadata` to the three public listing routes that currently have none:
`/articles`, `/videos`, `/shows`. Each returns a bare `title: string` — Next's inherited
`title.template` from the root layout (spec 02) prepends `116 -`.

---

## `/articles` — new `articles.pageTitle` key

No existing heading string covers this route (the articles listing has no visible H1), so it
gets one new key in the existing `articles` namespace.

**`src/modules/articles/presentation/i18n/locales/en/articles.ts`** (add to the existing object)

```ts
export const articles = {
    pageTitle: "Articles",
    card: {
        // ...unchanged
    },
    // ...unchanged
} as const;
```

**`src/modules/articles/presentation/i18n/locales/fr/articles.ts`** (add to the existing object)

```ts
export const articles = {
    pageTitle: "Articles",
    card: {
        // ...unchanged
    },
    // ...unchanged
} as const;
```

(`"Articles"` is identical in both languages — still declared in both files, per the
key-parity rule.)

**`app/(public)/articles/page.tsx`** (add alongside the existing `ArticlesPageProps` /
`firstParam` / `ArticlesPage`)

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the articles listing's title from the active server language.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("articles.pageTitle") };
}
```

## `/videos` — reuse `videos.browse.title`, renamed

No new key, but `browse.title`'s copy changes in both locales as part of this feature:

| Locale | Before | After |
| --- | --- | --- |
| en | "Explore the collection" | "Explore Video Collections" |
| fr | "Explorez la collection" | "Explorez les collections vidéo" |

**`src/modules/videos/presentation/i18n/locales/en/browse.ts`** (change the `title` value only)

```ts
export const browse = {
    title: "Explore Video Collections",
    // ...unchanged
} as const;
```

**`src/modules/videos/presentation/i18n/locales/fr/browse.ts`** (change the `title` value only)

```ts
export const browse = {
    title: "Explorez les collections vidéo",
    // ...unchanged
} as const;
```

`browse.title` is still rendered as the page's on-page heading, and this spec still reuses it
directly for `<title>` — the rename applies to both surfaces at once, by construction (see
[../02-architecture.md](../02-architecture.md), "Why reuse existing heading keys").

**`app/(public)/videos/page.tsx`** (add alongside the existing `VideosPageProps` / `firstParam` /
`VideosPage`)

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the videos listing's title from the active server language, reusing the same string
 * rendered as the page's on-page heading.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("videos.browse.title") };
}
```

## `/shows` — reuse `videos.shows.title`

No new key. `shows.title` ("All Shows" / "Toutes les émissions") already exists and is rendered
as the page's on-page heading (implied by the `ShowsGridContainer`; confirm exact render site
during implementation if the heading has moved).

**`app/(public)/shows/page.tsx`**

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the shows listing's title from the active server language, reusing the same string
 * rendered as the page's on-page heading.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("videos.shows.title") };
}

/**
 * ShowsPage
 *
 * @description
 * The public shows listing (`/shows`): the "All Shows" title above an
 * incrementally revealed grid of every active show (video category), one
 * poster tile per show.
 */
export default function ShowsPage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <ShowsGridContainer />
        </div>
    );
}
```

(Existing `ShowsPage` body and import shown for placement context — only `generateMetadata` is
new.)

## Task checklist

- [ ] Add `pageTitle` to both `articles` locale files.
- [ ] Rename `browse.title` in both `videos` locale files ("Explore Video Collections" /
  "Explorez les collections vidéo").
- [ ] Add `generateMetadata` to `app/(public)/articles/page.tsx`.
- [ ] Add `generateMetadata` to `app/(public)/videos/page.tsx`.
- [ ] Add `generateMetadata` to `app/(public)/shows/page.tsx`.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] In both languages, load `/articles`, `/videos`, `/shows` and confirm each `<title>` matches
  `116 - <translated page name>`.
