# Component Structure — Migration Specs

Checkbox-driven migration from today's tree to the target
([../06](../06-target-videos.md)–[09](../09-target-shared.md)). Ticked `- [x]` **only after**
the move lands and `tsc` + Biome are clean and behavior is unchanged.

This is a **move / rename / delete** migration — **no runtime behavior changes**. Do it with
`git mv` (preserves history), one component (or one bucket) per commit, updating the barrel
and imports each step. The `@/` alias means most imports resolve automatically once each
barrel is updated; watch for the few `../` relative imports (fix them to `@/` per R16).

## Order (low-risk → high-churn)

1. **[04 — shared & cleanups](04-shared-and-cleanups.md)** first: lift `VideoPlayer` to
   shared (R10a), delete dead files (D1/D2), extract the shared utils (DUP1/2/6/7/8),
   promote `useToggle`. These unblock the module moves.
2. **[01 — videos](01-videos.md)** — establish `containers/` + kind buckets; decompose the
   `VideoDetail` page.
3. **[02 — articles](02-articles.md)** — same shape; decompose `ArticleDetail`; normalize the
   comments naming.
4. **[03 — auth & settings](03-auth-settings.md)** — buckets, `SocialLogin` compound, new
   `settings/constants/`.

## Ground rules for every move

- One component/bucket per commit; message `refactor(<scope>): move X into <bucket>` (no colon
  unless it has a bulleted body — follow the repo commit style).
- After each: `yarn lint:types` + `yarn biome check` clean; the affected page renders
  identically.
- Update the folder's `index.ts` and every importer; convert any `../` import to `@/` (R16).

## Progress

- [x] Phase 1 — shared & cleanups
- [x] Phase 2 — videos
- [x] Phase 3 — articles
- [x] Phase 4 — auth & settings
- [x] Tooling — `noRestrictedImports` (ban `../`), AGENTS rule block (already added)
- [x] Final — full `yarn lint:types` + `yarn biome check` + `yarn build` clean (all routes compile)
