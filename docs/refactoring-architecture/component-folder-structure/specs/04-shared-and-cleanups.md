# Spec — shared library & cleanups (Phase 1)

Do this **first** — it unblocks the module migrations. Target:
[../09-target-shared.md](../09-target-shared.md), [../10-cleanups-and-debt.md](../10-cleanups-and-debt.md).

## Lift VideoPlayer to shared (R10a)

- [x] Create `shared/presentation/components/common/VideoPlayer/`
- [x] `videos/.../VideoDetail/VideoDetailPlayer.tsx` → `VideoPlayer.tsx` (rename, drop `VideoDetail` prefix)
- [x] `VideoDetailPlayer.Plyr.tsx` → `VideoPlayer.Plyr.tsx` (keep default export — `next/dynamic` target)
- [x] `VideoDetailPlayer.Poster.tsx` → `VideoPlayer.Poster.tsx`
- [x] `video-plyr.css` → into the folder
- [x] add `index.ts` (compound); update `VideoDetail.tsx` to import from `@/shared/…/common/VideoPlayer`
- [x] SSR dynamic import + poster fallback verified via `yarn build` (`/videos/[slug]` compiles)

## shared/common layout (flat)

- [x] `common/` stays **flat** (decision): `SocialShareGroup/`, `UserAvatar/`, `UserAccountControl/`,
  `ThemeToggle/` (keep `variants.ts` — R13 carve-out), `LanguageDropdown/` (compound, + `.Menu.tsx`),
  `VideoPlayer/` — all directly under `common/`, no kind sub-buckets
- [x] update importers (Header/layout)

## Delete dead code

- [x] D1 — delete `VideosMegaMenuCard{Body,Image}.tsx` + their prop types
- [x] D2 — delete `ArticlesMegaMenuCard{Image,Body}.tsx` + their prop types + fix the barrel JSDoc (drop `.Featured` reference)

## Extract shared utils/constants

- [x] DUP1 — `shared/presentation/utils/sanitize/sanitize.utils.ts` (DOMPurify config + `sanitizeHtml`); both bodies use it 🔴 security
- [x] DUP2 — `resolveShareUrl(path)` in `shared/presentation/utils/share/share.utils.ts`; replace `resolveVideoUrl`/`resolveArticleUrl`
- [x] DUP8 — `buildYoutubeEmbedUrl(id)` in `shared/presentation/utils/youtube/youtube.utils.ts`
> All util targets use the dashboard concern-folder form `utils/<concern>/<concern>.utils.ts` (root [../../04-utils-and-helpers.md](../../04-utils-and-helpers.md)).
- [x] DUP6 — one `INFINITE_SCROLL_SENTINEL_OPTIONS` (shared constants); replace 3 `SENTINEL_OPTIONS`
- [x] DUP7 — one `STAR_POSITIONS`; replace 2 copies

## Promote useToggle

- [x] `articles/.../hooks/useToggle.ts` → `shared/presentation/hooks/useToggle.ts`; update importers (articles + videos interactions)

## Tooling & rules

- [x] Add Biome `noRestrictedImports` banning `../`; codemod remaining relative imports to `@/` (R16)
- [x] Confirm the AGENTS.md rule block is present and links here

## Done when

- [x] `yarn lint:types` + `yarn biome check` clean across the repo
- [x] Every route verified via `yarn build` (home, `/articles`, `/articles/[slug]`, `/videos`, `/videos/[slug]`, `/settings/*`, auth modal all compile)
