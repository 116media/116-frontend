# 04 — Naming Conventions

## Folders & files

| Thing | Rule | Example |
|---|---|---|
| Component folder | `PascalCase/`, = the component name | `VideoDetailHeader/` |
| Component file | `<Component>.tsx`, = folder name | `VideoDetailHeader.tsx` |
| Barrel | `index.ts` | `index.ts` |
| Container | `<Surface>Container/` + `.tsx` | `VideoDetailContainer/VideoDetailContainer.tsx` |
| Compound part | `<Compound>.<Part>.tsx` (dotted) | `VideoCard.Horizontal.tsx` |
| State view | `<Component>.<State>.tsx` (dotted) | `ArticlesGrid.Empty.tsx` |
| Shared props/types | `types.ts` | `VideoCard/types.ts` |
| Folder-local support | `constants.ts` / `variants.ts` / `utils.ts` — carve-out for folder-local content too large to inline (R13) | `ThemeToggle/variants.ts`, `FlashToast/constants.ts` |
| Colocated style | `<kebab>.css` (compound/leaf only) | `video-plyr.css` |
| Hook | `use<PascalCase>.ts` | `useVideoDetail.ts` |

State suffixes (the closed set): `.Loading` · `.Error` · `.Empty` · `.NotFound` · `.EndOfFeed`.

## Exports

| Symbol | Rule | Example |
|---|---|---|
| Component | named `export function <Name>` (or `forwardRef` for shared primitives) | `export function VideoCardMedia` |
| Compound namespace | `export const <Compound> = { <Variant>, … }` in `index.ts` | `export const VideoCard = { Vertical, Horizontal }` |
| Props interface | `export interface <Name>Props` — **never** `I…Props` | `VideoCardProps` |
| Domain entity | `IXxx` / `IXxxEntity` (in `domain/entities/`, not here) | `IVideoSummaryEntity` |
| Container | `<Surface>Container` | `VideoDetailContainer` |
| Default export | banned except a `next/dynamic` target (e.g. the Plyr client component) | — |

## Dotted vs concatenated (fixes existing drift)

Compound parts and state views are **always dotted**. The concatenated stragglers in the
current tree are renamed:

| Now | Target |
|---|---|
| `ArticleDetailComment.tsx` | `ArticleDetailComment/` (own section folder — it's independent) |
| `ArticleDetailHeroCover.tsx` | `ArticleDetailHeroCover/` (own section folder) |
| `VideosMegaMenuCardBody/Image.tsx` | ✗ deleted (dead) |
| `VideosMegaMenuCardStats.tsx` | `VideosMegaMenuCard.Stats.tsx` (compound part) |
| `ArticlesMegaMenuCardStats.tsx` | `ArticlesMegaMenuCard.Stats.tsx` (compound part) |
| `VideoDetailPlayer*.tsx` | `shared/…/common/VideoPlayer/VideoPlayer.{tsx, Plyr.tsx, Poster.tsx}` (lifted to shared — R10a) |

## Page-part prefixes

A page's sections keep the page prefix so they sort together and stay greppable:
`VideoDetailHeader`, `VideoDetailScoreboard`, `VideoDetailTabs`, `ArticleDetailBody`, …. The
prefix is the *page cohesion* mechanism now that parts are separate folders (not nested).

## Buckets are lowercase

Bucket folders are lowercase (`containers/`, `cards/`, `sections/`, `media/`, `navigation/`).
This visually separates **buckets** (lowercase) from **component folders** (PascalCase) at a
glance.
