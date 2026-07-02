# Spec 04 — YouTube Data Slice

Design ref: [../06-youtube-data.md](../06-youtube-data.md). Read the route-handler guide
in `node_modules/next/dist/docs/` first (customized Next — params are a Promise here
too).

## 1. Env

`.env.example` + local env: `YOUTUBE_API_KEY=` (server-only name — **no**
`NEXT_PUBLIC_` prefix). Absent key → handler returns the null shape; the page hides the
chips.

## 2. `app/api/youtube/[videoId]/route.ts`

```ts
export async function GET(request, { params }) {
    const { videoId } = await params;
    const key = process.env.YOUTUBE_API_KEY;
    if (!key || !isPlausibleYoutubeId(videoId)) return NextResponse.json(NULL_STATS);

    const url = "https://www.googleapis.com/youtube/v3/videos"
        + `?part=statistics&id=${videoId}&key=${key}`;
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return NextResponse.json(NULL_STATS);

    const statistics = (await response.json())?.items?.[0]?.statistics;
    return NextResponse.json({
        viewCount: toCount(statistics?.viewCount),
        likeCount: toCount(statistics?.likeCount),
        commentCount: toCount(statistics?.commentCount)
    });
}
```

- `NULL_STATS = { viewCount: null, likeCount: null, commentCount: null }` — the handler
  **always 200s** with a stats shape; upstream problems must not become page errors.
- `toCount` parses Google's string numerals; missing/NaN → null (hidden ≠ zero).
- `isPlausibleYoutubeId` — `/^[\w-]{11}$/` guard so the handler never interpolates
  arbitrary input into the Google URL.
- `revalidate: 300` caches per id for 5 minutes (quota: 1 unit/call against the 10k/day
  default — comfortable).

## 3. `extractYoutubeId` util

`shared/presentation/utils/youtube.ts` — pure; accepts full watch URLs
(`watch?v=`, short `youtu.be/`, `embed/`, `shorts/`) and bare 11-char ids; returns
`string | null`. Unit-testable table in the JSDoc. Consumed by the player (source), the
stats hook (id), and JSON-LD (`embedUrl`).

## 4. Wiring

Repository `getYoutubeStats` (spec 02) fetches `/api/youtube/{id}` relative in the
browser; `useYoutubeStats` (spec 03) gates and caches. Display integration is spec 06's
stat chips.

## Tasks

- [ ] Env var documented; handler returns 200 + null-shape on every failure path.
- [ ] Id guard + string-numeral parsing + 5-minute revalidate.
- [ ] `extractYoutubeId` handles all five URL forms (verified against the dummy url).
- [ ] `yarn build` passes (route registers); chips appear with a key, hide without.
- [ ] `tsc` + biome clean.
