# Spec 05 — Lyrics detail page

`/lyrics/[slug]`: the standalone SEO page, a single dynamic segment (per
[../05-open-questions.md](../05-open-questions.md) question 1). Mirrors
`app/(public)/articles/[slug]/page.tsx`'s shape closely — `cache()`-memoized fetch shared between
`generateMetadata` and the page, `notFound()` on a miss, JSON-LD server-rendered inline.

No dummy-data fallback — unlike the article-detail route's current dummy-data phase, lyrics
already have real admin-authored content via the existing dashboard CRUD; a missing lookup is a
genuine 404, not a preview gap.

---

## Route

**`app/(public)/lyrics/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { ILyricsDetailEntity } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";
import { LyricsDetailContainer } from "@/modules/lyrics/presentation/containers/LyricsDetailContainer";
import { lyricsJsonLd } from "@/modules/lyrics/presentation/utils/json-ld/lyrics-json-ld.utils";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Props for the lyrics detail route and its metadata.
 *
 * @interface LyricsDetailRouteProps
 * @property {Promise<{ slug: string }>} params - The route params promise carrying the
 * lyrics page's unique `slug`.
 */
interface LyricsDetailRouteProps {
    params: Promise<{ slug: string }>;
}

/**
 * fetchLyrics
 *
 * @description
 * Fetches the lyrics page by slug through the server cradle, memoized per request with
 * React `cache` so the page render and `generateMetadata` share a single backend call.
 * The linked video's slug (when present) is resolved server-side in the same call — see
 * spec 01 — so no second fetch is needed for the video cross-link.
 *
 * @param slug - The lyrics page's unique slug from the route.
 * @returns The resolved lyrics entity, or null when it cannot be found.
 */
const fetchLyrics = cache(async (slug: string): Promise<ILyricsDetailEntity | null> => {
    const cradle = await createServerCradle();
    const result = await cradle.getLyricsBySlugUseCase.execute(slug);
    return result.ok ? result.value : null;
});

/**
 * generateMetadata
 *
 * @description
 * Server-side SEO for the standalone lyrics route. Awaits the `slug` and fetches the
 * lyrics through the request-memoized fetch; a missing match triggers `notFound()`.
 * Returns the title (`metaTitle` first, else "{songTitle} — {artistName}"), description
 * (`metaDescription` when present), and the canonical URL.
 *
 * @param params - The route params promise carrying the lyrics page's `slug`.
 * @returns The metadata for the lyrics page.
 */
export async function generateMetadata({ params }: LyricsDetailRouteProps): Promise<Metadata> {
    const { slug } = await params;
    const lyrics = await fetchLyrics(slug);

    if (!lyrics) notFound();

    const title = lyrics.metaTitle ?? `${lyrics.songTitle} — ${lyrics.artistName}`;

    return {
        title,
        description: lyrics.metaDescription ?? undefined,
        alternates: { canonical: `/lyrics/${lyrics.slug}` }
    };
}

/**
 * LyricsDetailPage
 *
 * @description
 * The public standalone lyrics route (`/lyrics/[slug]`). Fetches the lyrics server-side
 * (request-memoized, shared with `generateMetadata`) for SEO and a fast first paint. A
 * missing match triggers `notFound()`. The resolved entity seeds the client
 * `LyricsDetailContainer` as `initialData`, and the schema.org `MusicComposition` JSON-LD
 * is rendered server-side so crawlers get it on first paint.
 *
 * @param params - The route params promise carrying the lyrics page's `slug`.
 */
export default async function LyricsDetailPage({ params }: LyricsDetailRouteProps) {
    const { slug } = await params;
    const lyrics = await fetchLyrics(slug);

    if (!lyrics) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON built from mapped entity data, not user HTML
                dangerouslySetInnerHTML={{ __html: JSON.stringify(lyricsJsonLd(lyrics)) }}
            />
            <LyricsDetailContainer
                slug={slug}
                initialData={lyrics}
            />
        </>
    );
}
```

`getLyricsBySlugUseCase` needs registering under that cradle key — confirm it matches the DI
registration key from spec 03 (`getLyricsBySlugUseCase`, per `lyrics.dependencies.ts`).

`LyricsDetailContainer` (and the `useLyricsDetail` hook it owns) renders the "watch the video" link
when `lyrics.videoSlug` is non-null, pointing to `/videos/{videoSlug}` — the resolved-server-side
value from spec 01, no client fetch needed. Uses the `lyricsDetail.detail.watchVideo` i18n key
(spec 07).

## Page composition

The detail page, top to bottom:

1. **Cover hero** — `lyrics.coverImageUrl` (or a muted fallback with `MusicIcon`, same pattern as
   the list card), song title, artist name.
2. **Song info card** — the requested credit fields, rendered only when present (a field with no
   data is omitted entirely, not shown as "—" or blank).
3. **Engagement bar** — view count (read-only), like button + count, share button + count.
4. **Lyrics body** — the full text, whitespace-preserved.
5. **"Watch the video"** link, when `videoSlug` is present (unchanged from above).
6. **Similar lyrics section** — up to 10 `LyricsCard`s, reusing spec 04's card exactly.

### Song info card

**`src/modules/lyrics/presentation/components/sections/LyricsDetailBody/LyricsDetailBody.Credits.tsx`**

```tsx
import { useTranslation } from "react-i18next";
import type { ILyricsCredits } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";

/**
 * Props for LyricsDetailBodyCredits.
 *
 * @interface LyricsDetailBodyCreditsProps
 * @property {ILyricsCredits} credits - The song's credit fields, any of which may be absent.
 */
export interface LyricsDetailBodyCreditsProps {
    credits: ILyricsCredits;
}

/**
 * LyricsDetailBody.Credits
 *
 * @description
 * The song info card: album, release year, label, songwriter, and producer — each row
 * rendered only when its value is present. Renders nothing at all when every field is
 * absent, rather than an empty card shell.
 */
export function LyricsDetailBodyCredits({ credits }: LyricsDetailBodyCreditsProps) {
    const { t } = useTranslation();
    const rows: Array<[string, string | number]> = [
        credits.album && [t("lyrics.detail.credits.album"), credits.album],
        credits.releaseYear && [t("lyrics.detail.credits.releaseYear"), credits.releaseYear],
        credits.label && [t("lyrics.detail.credits.label"), credits.label],
        credits.songwriter && [t("lyrics.detail.credits.songwriter"), credits.songwriter],
        credits.producer && [t("lyrics.detail.credits.producer"), credits.producer]
    ].filter((row): row is [string, string | number] => Boolean(row));

    if (rows.length === 0) return null;

    return (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border bg-sidebar p-4 sm:grid-cols-3">
            {rows.map(([label, value]) => (
                <div key={label}>
                    <dt className="text-muted-foreground text-xs">{label}</dt>
                    <dd className="font-medium text-foreground text-sm">{value}</dd>
                </div>
            ))}
        </dl>
    );
}
```

### Engagement bar

**`src/modules/lyrics/presentation/hooks/useToggleLyricsLike.ts`** — mirrors
`useToggleShortLike` exactly (see `../03-frontend-module.md` and the shorts module precedent),
substituting the lyrics like/unlike use cases:

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleLyricsLike
 *
 * @description
 * Optimistic like toggle for one lyrics page, wrapping useToggle over the like/unlike
 * use cases. `initialLiked` seeds the heart from the entity's per-viewer `isLiked` flag.
 *
 * @param lyricsId - The lyrics page to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 * @param initialLiked - The entity's per-viewer `isLiked` baseline.
 * @returns `{ liked, count, toggle }` for the like button.
 */
export function useToggleLyricsLike(lyricsId: string, initialCount: number, initialLiked = false) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next ? container.cradle.likeLyricsUseCase : container.cradle.unlikeLyricsUseCase).execute(
                    lyricsId
                )
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
```

**`src/modules/lyrics/presentation/hooks/useShareLyrics.ts`** and
**`useRecordLyricsView.ts`** — fire-and-forget, mirroring `useShareShort` (minus the feed-cache
bump, since the detail page has no feed to update — just call `recordLyricsView`/`shareLyrics` and
optimistically bump local state) and `useRecordShortView` respectively. Not reproduced in full —
same one-function-returning shape, substituting the lyrics use cases.

**View recording**: fired once per page view from `LyricsDetailContainer`'s mount effect (an
engagement gate — e.g. only after a few seconds of scroll, mirroring the short-videos view-gating
rationale — is a nice-to-have, not required for v1; a lyrics page is read immediately on load,
unlike an autoplaying video).

### Similar lyrics section

**`src/modules/lyrics/presentation/hooks/useSimilarLyrics.ts`**

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { lyricsKeys } from "@/modules/lyrics/presentation/constants/lyricsKeys";
import container from "@/shared/infrastructure/service.locator";

/**
 * useSimilarLyrics
 *
 * @description
 * Fetches up to 10 lyrics similar to the given one — same video category when linked,
 * otherwise the latest standalone lyrics (resolved server-side, see spec 12).
 *
 * @param lyricsId - The lyrics page currently being viewed.
 * @returns The `useQuery` result: an `ILyricsSummaryEntity[]`, empty when none are found.
 */
export function useSimilarLyrics(lyricsId: string) {
    return useQuery({
        queryKey: lyricsKeys.similar(lyricsId),
        queryFn: async () => {
            const result = await container.cradle.getSimilarLyricsUseCase.execute(lyricsId);
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}
```

(`lyricsKeys.similar(lyricsId)` — a new key factory entry, `[...lyricsKeys.all, "similar", lyricsId] as const`.)

**`src/modules/lyrics/presentation/components/sections/LyricsSimilarSection/LyricsSimilarSection.tsx`**
— a small section rendering the same `LyricsGrid`/`LyricsCard` from spec 04 (reused, not
duplicated), a section heading (`t("lyrics.detail.similar.title")`), and renders nothing at all —
no heading, no empty state — when the list resolves empty, since "no similar lyrics" is a normal,
expected outcome (a new category, a standalone lyrics page in a catalog with few others), not an
error or a gap to call out.

## JSON-LD

**`src/modules/lyrics/presentation/utils/json-ld/lyrics-json-ld.utils.ts`**

```ts
import type { ILyricsDetailEntity } from "@/modules/lyrics/domain/entities/ILyricsDetailEntity";

/**
 * lyricsJsonLd
 *
 * @description
 * Builds the schema.org `MusicComposition` JSON-LD for the detail page from mapped
 * entity data. Fields with no data are omitted rather than emitted null. Injected via a
 * `<script type="application/ld+json">` in the server-rendered page.
 *
 * @param lyrics - The resolved lyrics detail entity.
 * @returns The JSON-LD object stringified into the script tag.
 */
export function lyricsJsonLd(lyrics: ILyricsDetailEntity): Record<string, unknown> {
    const { credits } = lyrics;

    const recordedAs: Record<string, unknown> = {
        "@type": "MusicRecording",
        byArtist: { "@type": "MusicGroup", name: lyrics.artistName }
    };
    if (credits.album) recordedAs.inAlbum = { "@type": "MusicAlbum", name: credits.album };
    if (credits.releaseYear) recordedAs.datePublished = String(credits.releaseYear);
    if (credits.label) recordedAs.recordLabel = { "@type": "Organization", name: credits.label };
    if (credits.producer) recordedAs.producer = { "@type": "Person", name: credits.producer };
    if (lyrics.coverImageUrl) recordedAs.image = lyrics.coverImageUrl;

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "MusicComposition",
        name: lyrics.songTitle,
        lyrics: { "@type": "CreativeWork", text: lyrics.lyricsText },
        inLanguage: lyrics.language,
        recordedAs
    };

    if (credits.songwriter) jsonLd.lyricist = { "@type": "Person", name: credits.songwriter };

    return jsonLd;
}
```

`credits.songwriter` maps to schema.org's own `lyricist` property on `MusicComposition` (the
closest vocabulary fit for "who wrote the words" — schema.org has no dedicated "songwriter"
property). `credits.producer` maps to schema.org's own `producer` property, which lives on
`MusicRecording`, not `MusicComposition` — production is a recording-level credit (mixing,
arranging, the instrumental), not a composition-level one. `byArtist`/`inAlbum`/`recordLabel`/
`datePublished`/`producer` all describe the **recording** (this specific release), nested under
`recordedAs: MusicRecording`; `lyricist`/`lyrics`/`inLanguage` describe the **composition** (the
song as written). `ArtistName` (the performer) was previously miscast as a composition-level credit
in an earlier draft of this file — schema.org models performer and producer as distinct recording
roles, and this codebase now has a real, separate `producer` credit field (spec 10), so the two
must not collapse into one, and neither is a property of `MusicComposition` itself.

Per [../05-open-questions.md](../05-open-questions.md) question 3, confirm the `MusicComposition`
schema choice before implementing this file — it's a fresh choice, not a reuse of
`article-json-ld.utils.ts`'s `NewsArticle` pattern.

## Not-found boundary

**`app/(public)/lyrics/[slug]/not-found.tsx`** — follows the exact `page-titles`
content-absence-fallback pattern (`../../page-titles/specs/06-content-absence-fallbacks.md`): its
own `generateMetadata` reusing the `lyrics.detail.notFound.title` translation key (spec 07),
delegating render to a small `LyricsDetail.NotFound` `EmptyState` wrapper — no full snippet
repeated here since the pattern is identical to the three examples already shipped in the
`page-titles` feature.

## Task checklist

- [ ] Confirm the JSON-LD schema choice (question 3) before implementing (questions 1, 2, 4 are
  resolved — slug-based route, no author, server-resolved `videoSlug`).
- [ ] Add `app/(public)/lyrics/[slug]/page.tsx`.
- [ ] Add `lyrics-json-ld.utils.ts` (with `lyricist` on the composition, `producer` nested under
  `recordedAs: MusicRecording`).
- [ ] Add `not-found.tsx` + `LyricsDetail.NotFound` view + its `generateMetadata`.
- [ ] Add the cover hero, `LyricsDetailBody.Credits` (song info card), the engagement bar
  (`useToggleLyricsLike`, `useShareLyrics`, `useRecordLyricsView`), and `LyricsSimilarSection`
  (`useSimilarLyrics`, reusing spec 04's `LyricsGrid`/`LyricsCard`).
- [ ] Add `LyricsDetailContainer` + `useLyricsDetail` hook (thin, mirrors `useArticleDetail`'s
  shape — not spec'd separately here, same pattern as spec 04's list hook), composing all of the
  above. Renders the "watch the video" link when `videoSlug` is present.
- [ ] `tsc --noEmit` clean.
- [ ] `biome check` clean.
- [ ] Load an existing lyrics page's URL in both languages; confirm title, description, canonical,
  and JSON-LD (view page source) are all correct.
- [ ] Confirm the cover hero renders (or its fallback, for a record with no cover); confirm the
  song info card shows only the credit fields that are actually present, and renders nothing at
  all for a record with none.
- [ ] Confirm the engagement bar: view count increments once per page load (not per re-render);
  the like button toggles optimistically and persists across a reload; the share button records a
  share and bumps the count.
- [ ] Confirm the similar-lyrics section: a video-linked record shows other lyrics from the same
  category (not from a different one); a standalone record shows the 10 latest standalone lyrics;
  a record with no similar matches renders no section at all (no heading, no empty state).
- [ ] Load a lyrics page linked to a video; confirm the "watch the video" link renders and points
  to the correct `/videos/{slug}`. Load a standalone lyrics page; confirm no link renders.
- [ ] Load a nonexistent slug; confirm a real 404 status and the not-found view's translated title
  (`116 - <not-found title>`, per the `page-titles` format).
