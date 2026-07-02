# Spec 10 — Assembler, Container, Route & SEO

Design ref: [../04-page-composition.md](../04-page-composition.md),
[../16-seo-and-metadata.md](../16-seo-and-metadata.md). Read the current page /
`params` / metadata docs in `node_modules/next/dist/docs/` first — `params` is a
Promise in this Next.

## 1. `VideoDetail/VideoDetail.tsx` (assembler)

The only holder of `IVideoDetailEntity`. Owns the share/playlist modal `open` states.

```tsx
<div className="flex flex-col gap-6">
    <div className="lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:gap-6">
        <div className="flex min-w-0 flex-col gap-6">
            <VideoDetailPlayer youtubeVideoUrl thumbnailUrl title />
            <VideoDetailHeader … onShare={() => setShareOpen(true)}
                               onAddToPlaylist={() => requireAuth(() => setPlaylistOpen(true))} />
            <VideoDetailTags tags={video.tags} />
            <VideoDetailTabs videoId categoryId description hasLyrics … />
        </div>
        <aside className="mt-10 lg:mt-0">
            <VideosPopularSidebar currentVideoId={video.id} />
        </aside>
    </div>
    <VideoShareModal open… videoId slug title />
    <VideoPlaylistModal open… videoId />
</div>
```

## 2. `VideoDetail/index.tsx` (container)

`"use client"`; `useVideoDetail(slug, { initialData })`; `isLoading` →
`VideoDetailLoading`; `isError || !data` → `VideoDetailError onRetry={refetch}`; else
`VideoDetail`. Identical shape to `ArticleDetailContainer`.

## 3. `VideoDetail.Loading.tsx` / `VideoDetail.Error.tsx` / `VideoDetail.NotFound.tsx`

Per [../14-loading-empty-error.md](../14-loading-empty-error.md): full-page skeleton
(player block, header lines, chip row, tab bar, description lines, sidebar block with
`SectionHeader`-shaped header), retryable `EmptyState` error, and the not-found view
with the `VIDEOS_PATH` back link (`videos.detail.notFound.*` /
`videos.detail.backToVideos`).

## 4. Route — `app/(public)/videos/[slug]/`

`page.tsx`:

```tsx
const fetchVideo = cache(async (slug: string) => {
    const cradle = await createServerCradle();
    const result = await cradle.getVideoBySlugUseCase.execute(slug);
    return result.ok ? result.value : dummyVideoDetail(slug);   /** dummy phase */
});

export async function generateMetadata({ params }): Promise<Metadata> { /* §5 */ }

export default async function VideoDetailPage({ params }) {
    const { slug } = await params;
    const video = await fetchVideo(slug);
    if (!video) notFound();
    return (<>
        <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd(video)) }} />
        <VideoDetailContainer slug={slug} initialData={video} />
    </>);
}
```

`params` typed `Promise<{ slug: string }>` and awaited. `loading.tsx` →
`VideoDetailLoading`; `not-found.tsx` → the not-found view. Dummy phase note: the dummy
fallback keeps `notFound()` dormant, exactly like the articles route.

## 5. Metadata + JSON-LD

Per the [../16-seo-and-metadata.md](../16-seo-and-metadata.md) tables: title/description
fallbacks, canonical `/videos/{slug}`, OG `video.other` +
thumbnail + `openGraph.videos`, twitter `player`/`summary_large_image`.
`videoJsonLd(video)` in `VideoDetail/videoJsonLd.ts`: VideoObject with omitted-not-null
fields and `aggregateRating` only when `ratingCount > 0`; `embedUrl` from
`extractYoutubeId`.

## Tasks

- [ ] Assembler distributes scoped props; modals mount once at the root.
- [ ] Container hydrates from `initialData` (no refetch flash); error view retries.
- [ ] Route + loading + not-found; `await params`; JSON-LD server-rendered.
- [ ] Metadata verified (`view-source`: OG/twitter/canonical, JSON-LD present,
      `aggregateRating` absent when count is 0).
- [ ] `yarn build` passes; direct `/videos/{slug}` SSRs header/tags/description.
- [ ] `tsc` + biome clean.
