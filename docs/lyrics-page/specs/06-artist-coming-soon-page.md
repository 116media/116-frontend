# Spec 06 — Artist coming-soon page

`/artistes`: a real route replacing the current 404, showing a "coming soon" placeholder. No
backend work, no domain entity, no new module — entirely independent of specs 01–05.

---

## Route

**`app/(public)/artistes/page.tsx`**

```tsx
import type { Metadata } from "next";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the artistes page's title from the active server language.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("artistes.pageTitle") };
}

/**
 * ArtistesPage
 *
 * @description
 * The public artistes route (`/artistes`): a "coming soon" placeholder. No artist
 * profile system exists on the backend yet — this route exists so the already-wired
 * header nav link ("ARTISTES") resolves to a real page instead of a 404.
 */
export default async function ArtistesPage() {
    const { t } = await getServerTranslation();

    return (
        <EmptyState
            context="artistes-coming-soon"
            icon={<UserRoundIcon className="size-10" />}
            title={t("artistes.comingSoon.title")}
            subtitle={t("artistes.comingSoon.subtitle")}
        />
    );
}
```

Reuses the existing `EmptyState` shell — no new placeholder component. `ARTISTE_DETAIL_PATH`
(`/artistes/:slug`) stays unrouted; only the index page is built.

## Task checklist

- [ ] Add `app/(public)/artistes/page.tsx`.
- [ ] Add the two `artistes.*` i18n keys (spec 07).
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] Click "ARTISTES" in the header nav in both languages; confirm it resolves to a real page
  (not a 404) showing the translated "coming soon" copy, and the tab title reads
  `116 - <translated artistes title>`.
