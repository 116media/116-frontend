# Lyrics Page — Routes & Artist Placeholder

## Route tree

```text
app/(public)/lyrics/page.tsx              -> /lyrics
app/(public)/lyrics/[slug]/page.tsx        -> /lyrics/{slug}
app/(public)/lyrics/[slug]/not-found.tsx
app/(public)/artistes/page.tsx             -> /artistes ("coming soon")
```

Both sit under the existing `(public)` route group, alongside `articles`/`videos`/`shows` — no new
layout needed, they inherit the shared header/footer shell.

## The URL shape — a stored `Slug` column

**Resolved in [05-open-questions.md](05-open-questions.md), question 1** — reversing this doc's
original recommendation. The backend's only slug-lookup route today is
`GET /api/v1/public/lyrics/{songTitle}/{artistName}` — two raw path segments, exact-match
(case-insensitive `ILIKE`) against the **as-stored, un-slugified** `SongTitle`/`ArtistName`
strings, **no stored slug field** on `LyricsEntity` at all (unlike articles/videos, which persist a
`Slug` column). That endpoint's own docstring example (`/lyrics/eloko-oyo/fally-ipupa`) is
misleading — see [02-backend-contract.md](../02-backend-contract.md) for why that exact URL
wouldn't actually resolve today.

Reusing that two-segment route as-is (this doc's original recommendation) traded away URL quality
for zero backend work — the wrong tradeoff for a page whose entire purpose (per the entity's own
doc comment) is SEO keyword targeting, and duplicate song titles are routine enough in music
(remixes, live versions, re-releases, generic titles like "Intro" reused across an artist's own
catalog) that `songTitle + artistName` was never a safe uniqueness key either.

**Decision: `LyricsEntity` gains a stored, unique `Slug` column**, mirroring
`ArticleEntity.Slug` / `VideoEntity.Slug` exactly. The route becomes a single segment:
`/lyrics/{slug}` (e.g. `/lyrics/fally-ipupa-mayday-lyrics`), matching Genius's own URL shape
(`genius.com/Fally-ipupa-mayday-lyrics`, lowercased to fit this platform's slug format). Full
backend spec: [specs/01-backend-public-list-endpoint.md](specs/01-backend-public-list-endpoint.md).

The dashboard generates the slug the same way every other slugged content type in this codebase
already does — via the existing `generateSlug(text, { unique: true })` util, no special-cased
collision handling. The only lyrics-specific piece is what text gets slugified: the artist's main
name and the song title combined, with a literal `lyrics` suffix
(`slugify(`${artistName} ${songTitle} lyrics`, { unique: true })`) — the exact
`{artist}-{title}-lyrics` shape Genius uses. Full rationale in
[05-open-questions.md](05-open-questions.md), question 1.

## `/lyrics` — the listing page

`generateMetadata` returns a translated title, per the `page-titles` system already in place
(`getServerTranslation()` → `t("lyrics.pageTitle")`, a new key, since — like the articles listing —
there's no existing on-page heading key to reuse). No `robots` override; this is a fully public,
indexable page.

The page composes `LyricsFeedContainer` (search input + language filter + infinite grid), the same
shape as `app/(public)/articles/page.tsx` — a `<Suspense>`-free server page (no promoted-feed hero
needed here) awaiting optional `?search=` and `?language=` query params and seeding the container's
initial filters from them. The language filter (question 6) is a **searchable** dropdown over the
full ISO 639-1 list — the same list the dashboard already uses to tag lyrics, not a fixed handful
of languages — see [specs/04-lyrics-list-page.md](specs/04-lyrics-list-page.md).

## `/lyrics/[slug]` — the detail page

Mirrors `app/(public)/articles/[slug]/page.tsx`'s shape exactly: a `cache()`-memoized
`fetchLyrics(slug)` shared between `generateMetadata` and the page component, `notFound()` when the
lookup 404s, a `not-found.tsx` boundary with its own `generateMetadata` (per the `page-titles`
content-absence-fallback pattern — `../page-titles/specs/06-content-absence-fallbacks.md`).

`generateMetadata` returns:

```ts
title: lyrics.metaTitle ?? `${lyrics.songTitle} — ${lyrics.artistName}`,
description: lyrics.metaDescription ?? undefined,
alternates: { canonical: `/lyrics/${lyrics.slug}` }
```

Matching the article-detail route's `metaTitle ?? title` fallback pattern exactly.

The page itself composes, top to bottom: a cover-art hero (or a muted fallback), a song-credits
card (album, release year, label, songwriter, producer — each shown only when present), an
engagement bar (view count, like toggle, share), the full lyrics text, the video cross-link when
present, and a similar-lyrics section (up to 10 cards — same video category when linked,
otherwise the 10 latest standalone lyrics). Full composition:
[specs/05-lyrics-detail-page.md](specs/05-lyrics-detail-page.md).

### JSON-LD — schema type decision (still open)

`schema.org` has a purpose-built type for this: **`MusicComposition`**, with a nested `lyrics`
property of type `CreativeWork`. Simplified illustrative shape (the full version, with the
`recordedAs: MusicRecording` nesting for artist/album/label/year, is in
[specs/05-lyrics-detail-page.md](specs/05-lyrics-detail-page.md)):

```json
{
  "@context": "https://schema.org",
  "@type": "MusicComposition",
  "name": "{songTitle}",
  "lyricist": { "@type": "Person", "name": "{credits.songwriter}" },
  "lyrics": { "@type": "CreativeWork", "text": "{lyricsText}" },
  "inLanguage": "{language}",
  "recordedAs": {
    "@type": "MusicRecording",
    "byArtist": { "@type": "MusicGroup", "name": "{artistName}" },
    "producer": { "@type": "Person", "name": "{credits.producer}" },
    "inAlbum": { "@type": "MusicAlbum", "name": "{credits.album}" }
  }
}
```

Note the property names on the JSON-LD side are `schema.org`'s own fixed vocabulary
(`lyricist`, `producer`), not our internal field names — our `credits.songwriter` maps to
schema.org's `lyricist` property (the closest fit on `MusicComposition` for "who wrote the words"),
and `credits.producer` maps to schema.org's own `producer` property, which lives on
`MusicRecording`, not `MusicComposition` — production is a recording-level credit, not a
composition-level one, which is also a more accurate fit than the composition-level `composer`
property this doc set used in an earlier draft.

`LyricsEntity.StructuredData` (a raw JSON-LD string the admin can override) takes precedence over
the computed object when present — same override relationship the entity's own doc comment implies
("Generated automatically or provided manually"). This is the **only** remaining genuinely open
question — confirm before implementing spec 05.

### Cross-link to a linked video — resolved

**Resolved in [05-open-questions.md](../05-open-questions.md), question 4.** The backend resolves
the linked video's slug server-side, in the same by-slug lookup — `IVideoRepository.GetByIdAsync`
already exists and is already used internally by `AdminCreateLyricsHandler`. The detail page's
`ILyricsDetailEntity.videoSlug` arrives with no second fetch; when present, the page renders a
"watch the video" link to `/videos/{videoSlug}`.

### The reverse cross-link — resolved, in scope

**Resolved in [05-open-questions.md](../05-open-questions.md), question 5.** `VideoDetailLyrics`
(the embedded lyrics tab on a video's own detail page) gains a "View full lyrics" link to
`/lyrics/{slug}` — the one place this feature touches the `videos` module. Full spec:
[specs/09-video-cross-link.md](specs/09-video-cross-link.md).

## `/artistes` — coming soon

No backend work, no domain entity, no module. A single server page:

```tsx
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

export async function generateMetadata() {
    const { t } = await getServerTranslation();
    return { title: t("artistes.pageTitle") };
}

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

Reuses the existing `EmptyState` shell (already used for every other "nothing here" state in the
app) rather than inventing a new placeholder component. No new module — two translation keys land
directly in a small shared `artistes` i18n namespace (there's no module to own them since there's
no artist feature yet).

`ARTISTE_DETAIL_PATH = "/artistes/:slug"` stays unused/unrouted — no per-artist page exists or is
scoped here; only the index route is built.
