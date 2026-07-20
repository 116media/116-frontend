# Spec 04 — Private routes (favorites + settings)

Adds a `title` to the three `favorites/*` routes (converting their static `metadata` to
`generateMetadata` so `robots` and the translated `title` coexist) and the three `settings/*`
tabs (which currently have no metadata at all).

No new i18n keys — every title reuses an existing key (see the table in
[../02-architecture.md](../02-architecture.md)).

---

## Favorites — `/favorites/articles`, `/favorites/videos`, `/favorites/shorts`

Each currently exports a static `metadata` with only `robots`. Convert to `generateMetadata` and
add `title`, reusing the matching `favorites.headings.*` key.

**`app/(private)/favorites/articles/page.tsx`** (replaces the existing `export const metadata`)

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the favorite-articles page: the translated title (reusing the page's
 * own on-page heading key) plus `robots: noindex`, kept out of search indexes since this is
 * a per-user, auth-gated surface.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return {
        title: t("favorites.headings.articles"),
        robots: { index: false, follow: false }
    };
}
```

Mirror for the other two, changing only the key and the doc comment's subject:

- **`app/(private)/favorites/videos/page.tsx`** → `t("favorites.headings.videos")`
- **`app/(private)/favorites/shorts/page.tsx`** → `t("favorites.headings.shorts")`

## Settings — `/settings/profile`, `/settings/security`, `/settings/account`

None of the three tabs currently export any metadata. Add `generateMetadata` reusing the matching
`settings.nav.*` key — `title` only. Per [../03-open-questions.md](../03-open-questions.md)
decision 3, `robots` is **not** added here — settings' indexing behavior stays exactly as it is
today (no `robots` field at all); only `title` is new.

**`app/(private)/settings/profile/page.tsx`** (add alongside the existing page component)

```tsx
import type { Metadata } from "next";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the profile settings tab: the translated title, reusing the sidebar's
 * own nav-label key.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("settings.nav.profile") };
}
```

Mirror for the other two:

- **`app/(private)/settings/security/page.tsx`** → `t("settings.nav.security")`
- **`app/(private)/settings/account/page.tsx`** → `t("settings.nav.account")`

## Task checklist

- [ ] Convert `favorites/articles`, `favorites/videos`, `favorites/shorts` `page.tsx` from static
  `metadata` to `generateMetadata`, adding `title` and keeping `robots`.
- [ ] Add `generateMetadata` (title only, no `robots`) to `settings/profile`,
  `settings/security`, `settings/account` `page.tsx`.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] Signed in, in both languages: load each of the six routes and confirm `<title>` matches
  `116 - <translated section name>`.
- [ ] Confirm `robots: noindex` is still present (view source / response headers) on the three
  favorites routes, and confirm settings routes are unchanged (no `robots` field, exactly as
  before this feature).
