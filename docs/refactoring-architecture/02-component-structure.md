# 02 — Component Structure & Patterns

Covers how component files are split, foldered, named, and internally shaped. Rules are
stated in [01 §3](01-canonical-conventions.md) and [01 §9](01-canonical-conventions.md);
this doc is the evidence + the per-issue fix.

Scope measured: 123 `.tsx` in `modules/*/presentation/components/**` + 70 in
`shared/presentation/components/**`.

---

## C1 — Two components exported from one file 🟢 S

**Rule:** one component per file; private skeletons stay non-exported.

| `path:line` | Problem | Fix |
|---|---|---|
| `src/modules/videos/presentation/components/VideosPopularSidebar/VideosPopularSidebar.Loading.tsx:14` & `:54` | Exports **two** components — `PopularRowSkeleton` (14) and `VideosPopularSidebarLoading` (54). `PopularRowSkeleton` is consumed only within the same file. | Drop `export` from `PopularRowSkeleton`, matching every other `*.Loading.tsx`. |

This is the only genuine two-exported-component file in the tree.

---

## C2 — Component-folder style is 3-way split 🟡 L

Every component lives in a `PascalCase/` folder (good), but the folder's shape varies:

| Style | Count | Meaning |
|---|---|---|
| `Foo/index.tsx` — the component *is* `index.tsx` | 34 | dominant |
| `Foo/Foo.tsx` + `Foo/index.ts` re-export | 22 | second |
| `Foo/` parts-only (`index.ts` re-exports dotted variants, no root `Foo.tsx`) | 7 | compound components |

- **100% `index.tsx`:** all `auth/*` (6), all `settings/*` (12).
- **`Foo.tsx`+barrel:** most of `shared/ui/*` (`Alert`, `Avatar`, `Button`, `Card`, `Carousel`, `Input`, `Tabs`, `ModalForm`, …).
- **Parts-only:** `ArticleCard`, `ArticlePromotionCard`, `ArticlesMegaMenuCard`, `VideoCard`, `VideosMegaMenuCard`, `ui/Dialog`, `ui/Icon`.
- **`articles` and `videos` use all three styles internally** — e.g. `ArticlesGrid/index.tsx` (component) next to `ArticlesToolbar/ArticlesToolbar.tsx` (barrel) next to `ArticleCard/` (parts-only).

**Canonical:** every component is `Foo/Foo.tsx` + `Foo/index.ts` — **no `index.tsx`-as-component**.
Compound components keep their parts as dotted files in one folder with a parts-composing
`index.ts`. Migrate the 34 `index.tsx` components. This is an **L** sweep — module-by-module,
`git mv` + update the barrel, `tsc`/Biome each step.

> The full target structure (kind buckets, container/presentational split, per-file
> placement) is specified in
> **[component-folder-structure/](component-folder-structure/README.md), which is
> authoritative wherever it and this doc differ.** This section covers *why* the folder style
> converges; the target trees live there.

---

## C3 — Dotted vs concatenated sub-component names 🟡 M

The dotted `Foo.Part.tsx` form is near-universal, but several families mix it with
concatenated `FooPart.tsx` **in the same folder**, with no rule:

| Folder | Dotted (correct) | Concatenated (rename) |
|---|---|---|
| `videos/.../VideoDetail/` | `VideoDetail.Header.tsx`, `VideoDetail.Scoreboard.tsx`, `VideoDetailPlayer.Plyr.tsx` | `VideoDetailPlayer.tsx`, `VideoPlaylistModal.tsx`, `VideoRatingModal.tsx`, `VideoShareModal.tsx` |
| `articles/.../ArticleDetail/` | `ArticleDetail.Body.tsx`, `ArticleDetail.Hero.tsx` | `ArticleDetailComment.tsx`, `ArticleDetailCommentComposer.tsx`, `ArticleDetailHeroCover.tsx` |
| `articles/.../ArticlesMegaMenuCard/` | `ArticlesMegaMenuCard.Compact.tsx`, `.FeaturedGradient.tsx` | `ArticlesMegaMenuCardBody.tsx`, `...CardImage.tsx`, `...CardStats.tsx` |
| `videos/.../VideosMegaMenuCard/` | `VideosMegaMenuCard.Compact.tsx`, `.FeaturedSpotlight.tsx` | `VideosMegaMenuCardBody.tsx`, `...CardImage.tsx`, `...CardStats.tsx` |

**Fix:** the target structure (component-folder-structure) supersedes the naming details here —
follow **its** bucket placement, which is stronger than a flat dotted rename. Concatenated
**card parts** become dotted compound files (`ArticlesMegaMenuCardStats.tsx` →
`ArticlesMegaMenuCard.Stats.tsx`); **modals** move to the `modals/` bucket as their own folders
(`VideoShareModal/`, not `VideoDetail.ShareModal.tsx`); **independent sections** become their own
folders (`ArticleDetailComment/`, `ArticleDetailHeroCover/`). Note the interaction with C2 — do C3 and C2 in
the same per-folder pass to avoid touching files twice.

---

## C4 — Non-trivial loading UI inline instead of `X.Loading.tsx` 🟡 M

The dotted state-file convention is established (16 files: `.Loading` ×10, `.Error` ×3,
`.Empty`/`.EndOfFeed`, `.NotFound` ×2 — `ArticlesGrid` is the canonical full set). These
render a substantial skeleton inline behind an `isLoading`/`isPending` branch instead:

| `path` | Fix |
|---|---|
| `src/modules/settings/presentation/components/SessionsList/index.tsx:18` (`SessionsListSkeleton`) | Extract `SessionsList.Loading.tsx` |
| `src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.Comments.tsx` | Extract `ArticleDetail.Comments.Loading.tsx` (or local private skeleton) |
| `src/modules/videos/presentation/components/VideoDetail/VideoDetail.Lyrics.tsx` | Extract loading part |
| `src/modules/videos/presentation/components/VideoDetail/VideoDetail.Scoreboard.tsx` | Extract loading part (interacts with C6) |
| `src/modules/videos/presentation/components/VideoDetail/VideoPlaylistModal.tsx` | Extract loading part |
| `src/modules/videos/presentation/components/VideoDetail/VideoDetail.Similar.tsx:47` (`SimilarCardSkeleton`) | Acceptable if kept private; split only if reused |

Trivial one-`<Skeleton>` placeholders (e.g. `UserAccountControl`) may stay inline.

---

## C5 — Component + hook + context + cva in one file 🟡 M

| `path` | Mixed contents | Fix |
|---|---|---|
| `src/shared/presentation/components/ui/Tabs/Tabs.tsx` | component `Tabs` + **4 exported contexts** + 2 `cva` consts + `TAB_SPRING` (170 lines) | Move contexts → `Tabs/tabsContext.ts`, variants → `Tabs/tabsVariants.ts`; keep `Tabs.tsx` to the component |
| `src/shared/presentation/components/ui/Carousel/Carousel.tsx` | component `Carousel` + `CarouselContext` + exported hook `useCarousel` | Move context + `useCarousel` → `Carousel/useCarousel.ts` |

`cva` maps that belong to a *single* primitive (`Button`, `Card`, `Badge`, `Tag`,
`ButtonGroup`) stay inline — that is the shadcn idiom ([01 §4](01-canonical-conventions.md)).
The issue is specifically Tabs/Carousel co-locating **hooks and contexts**, which other
files import.

---

## C6 — Private single-use sub-components (keep inline) 🟢

The deep per-file read re-classified these as **private, single-use** sub-components (each
used only by its parent), not reusable. Per
[component-folder-structure/01-rules.md](component-folder-structure/01-rules.md) **R7a they
stay inline** (unexported) — extracting them to their own file/folder would violate the
flat-folder rule and add noise. C6 only applies to genuinely **reusable** sub-components
(imported by another file); the audit found none.

| `path:line` | Inline component | Fix |
|---|---|---|
| `.../VideoDetail.Scoreboard.tsx:53` | `ScoreboardColumn` | **keep inline** (private, single-use — R7a) |
| `.../PairCarousel.tsx:32` | `PairColumnCarousel` | **keep inline** (R7a) |
| `.../ShowCard.tsx:33` | `RevealOnHover` | **keep inline** (R7a) |

**Acceptable inline (private skeleton/closure, no action):** `SidebarRowSkeleton`
(`ArticleDetail.Loading.tsx:10`), `ArticlesGridCardSkeleton` (`ArticlesGrid.Loading.tsx:22`),
`ScoreboardColumnSkeleton` (`VideoDetail.Loading.tsx:24`), `SimilarCardSkeleton`
(`VideoDetail.Similar.tsx:47`).

---

## C7 — Props interface not exported 🟢 M

104 files `export interface XxxProps`; **18 interfaces across 17 files** keep it file-local
(one file, `PairCarousel.tsx`, has 2). Naming and above-component placement are 100%
consistent — only the `export` keyword drifts.

Non-exported (add `export`): `ui/Carousel/CarouselContent.tsx:18`,
`ui/ConfirmDialog/ConfirmDialog.tsx:27`, `ui/StarRating/index.tsx:6`,
`ui/RelativeDate/index.tsx:7`, `common/UserAccountControl/index.tsx:29`,
`common/UserAvatar/index.tsx:8`, `auth/.../SocialLogin/FacebookLoginButton.tsx:45`,
`auth/.../SocialLogin/GoogleLoginButton.tsx:47`, `articles/.../GossipStrip/GossipStrip.tsx:5`,
`articles/.../HeroCarousel/HeroCarousel.tsx:14`, `articles/.../SideCarousel/SideCarousel.tsx:14`,
`articles/.../PairCarousel/PairCarousel.tsx:15,19`, `videos/.../ShowsCarousel/ShowsCarousel.tsx:10`,
`videos/.../ExclusiveShowPoster/ExclusiveShowPoster.tsx:12`,
`videos/.../ExclusiveShowEpisodes/ExclusiveShowEpisodes.tsx:8`,
`videos/.../ShowCard/ShowCard.tsx:11`, `videos/.../ShowsSection/ShowsSection.tsx:11`.

`export type XxxProps` is correct where it aliases a native attr type (`CardProps`,
`SkeletonProps`, `AvatarProps`, `ProseProps`) — leave those.

---

## C8 — `Prose` breaks the forwardRef pattern 🟢 S

25/26 forwardRef components use an **anonymous** inner fn + explicit `X.displayName = "X"`
(e.g. `Input.displayName = "Input"`).

| `path:line` | Problem | Fix |
|---|---|---|
| `src/shared/presentation/components/ui/Prose/index.tsx:26` | Uses a **named** inner function `forwardRef(function Prose(...))` and sets no `displayName` | Anonymous inner fn + `Prose.displayName = "Prose";` |

---

## Already consistent — do not touch

These dimensions were audited and found effectively 100% clean; they are the model, not a
task:

- **`"use client"`** — 134/193 files, always line 1; zero client components missing it, zero server-safe files needlessly marked.
- **`cn()` className merge** — every `ui` primitive that takes `className` merges it last.
- **Export style** — 163 named `export function`; the lone `export default`
  (`VideoDetailPlayer.Plyr.tsx`) is **required** by its `next/dynamic` import — keep it.
- **Inline styles / colors** — all 9 `style={{}}` are computed/dynamic; the 2 `ShowCard`
  hex values are documented palette fallbacks. Leave them.
- **Event handlers** — inline arrows are the house style (43 vs 1); consistent, no action.

---

## Fix order for this doc

1. **C1, C8** (🟢 S) — mechanical, land immediately.
2. **C7** (🟢 M) — add `export` to the 18 file-local props interfaces (17 files); consider a lint rule.
3. **C5, C6, C4** (🟡 M) — extraction refactors, per component family.
4. **C3 + C2** (🟡 M/L) — the folder/file rename sweep, module-by-module, last.

See the [roadmap](08-remediation-roadmap.md) for sequencing against the other docs.
