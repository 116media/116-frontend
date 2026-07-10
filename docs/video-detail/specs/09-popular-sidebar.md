# Spec 09 — Popular Videos Sidebar

Design ref: [../10-popular-videos-sidebar.md](../10-popular-videos-sidebar.md). Own
folder beside `VideoDetail/`, mirroring `ArticlesPopularSidebar` file-for-file.

## 1. `VideosPopularSidebar/VideosPopularSidebar.tsx`

Props: `{ currentVideoId: string }`.

```tsx
<aside className="flex flex-col">
    <SectionHeader icon={<FlameIcon />} title={t("videos.detail.sidebar.popular")} />
    <div className="flex flex-col gap-4 rounded-xl bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
        {data.map((video, index) => (
            <Fragment key={video.id}>
                <VideoCard.Horizontal video={video} />
                {index < data.length - 1 && <hr />}
            </Fragment>
        ))}
    </div>
</aside>
```

- **`VideoCard.Horizontal` reused untouched** — it already renders thumbnail (play
  overlay), two-line title, star rating, relative date, and share count.
- The block is the **gossip-strip surface** (`rounded-xl bg-muted/30` + the responsive
  padding scale + `<hr>` separators) so the column is the visual twin of the articles
  popular sidebar.
- `isPending` → header + `VideosPopularSidebarLoading`; resolved empty → the whole
  component returns `null`.

## 2. `VideosPopularSidebar.Loading.tsx`

Five placeholder rows in the same muted block, `<hr>`-separated, from the shared
`Skeleton`: thumbnail block (`min-h-18 w-28` responsive widths matching the card) +
title line + rating line + date/share line. Same shape as
`ArticlesPopularSidebarLoading` with one extra meta line for the rating.

## 3. `index.ts`

```ts
export { VideosPopularSidebar } from "./VideosPopularSidebar";
export type { VideosPopularSidebarProps } from "./VideosPopularSidebar";
```

## 4. Data

`useVideoDetailPopular(currentVideoId)` from spec 03 (promoted → published fallback,
exclude current, cap `POPULAR_VIDEOS_LIMIT`, quiet `[]` degradation, dummy slice in
dummy phase).

## Tasks

- [ ] Folder + three files per the `ArticlesPopularSidebar` standard.
- [ ] Rows are untouched `VideoCard.Horizontal` in the gossip block with `<hr>`s.
- [ ] `SectionHeader` + Flame icon; loading block matches footprint; empty → null.
- [ ] `tsc` + biome clean.
