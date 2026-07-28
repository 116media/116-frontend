# Page Titles — Implementation Specs

Implementation-ready specs for making the frontend's `<title>` dynamic per route and i18n-aware.
Each spec contains **full, JSDoc'd code snippets** and a task checklist whose boxes are ticked
`- [x]` only **after** the work is implemented and verified (`tsc` + biome clean, behavior
confirmed in the browser).

Read the design docs first ([../README.md](../README.md)) for the *why*; these specs are the
*how*. Decisions are resolved in [../03-open-questions.md](../03-open-questions.md).

---

## Specs

| File | What it covers |
| --- | --- |
| [01-server-translation-util.md](01-server-translation-util.md) | `getServerTranslation()` — the new shared server util every other spec calls |
| [02-root-layout-and-general-keys.md](02-root-layout-and-general-keys.md) | `app/layout.tsx` static `metadata` → `generateMetadata`; `general.ts` key cleanup |
| [03-public-routes.md](03-public-routes.md) | `title` for `/articles`, `/videos`, `/shows`; new `articles.pageTitle` key |
| [04-private-routes.md](04-private-routes.md) | `title` for the three `favorites/*` and three `settings/*` routes |
| [06-content-absence-fallbacks.md](06-content-absence-fallbacks.md) | `title` for the three `not-found.tsx` boundaries + the shorts missing-short fallback |
| [07-language-switch-refresh.md](07-language-switch-refresh.md) | `router.refresh()` in `useLanguageDropdown` so the title updates instantly on language toggle |
| [05-verification.md](05-verification.md) | Manual per-locale, per-route checklist + automated checks |

---

## Implementation order

1. **Server translation util** (01) — no callers yet, verifiable in isolation.
2. **Root layout** (02) — the fallback every other route relies on; do this before any leaf route
   so there's a correct baseline to compare against.
3. **Public listing routes** (03) — `/articles`, `/videos`, `/shows`.
4. **Private routes** (04) — favorites + settings.
5. **Content-absence fallbacks** (06) — not-found boundaries + the shorts missing-short case.
6. **Language-switch refresh** (07) — `router.refresh()` follow-up, once every route has a title
   to refresh into.
7. **Verification** (05) — full sweep, both locales.

Each step is independently verifiable. Steps 3, 4, and 06 have no ordering dependency on each
other and can be done in any order (or in parallel) once step 2 lands. Step 07 depends on 02–06
already being in place (otherwise there's nothing route-specific for the refresh to reveal).

---

## Conventions for all snippets

- **JSDoc only — no inline comments.** Block `/** … */` above every export (multi-line, `@param`
  / `@returns`, neutral team-to-team voice, ≤ 3 description lines). No `//` narration, no
  decorative separators.
- **`.server.utils.ts` suffix** for any util touching `next/headers` — never co-bundled with
  client utils (`AGENTS.md`).
- **`cache()` from `react`** to memoize a per-request server call reused by both
  `generateMetadata` and the page/layout component — the same pattern `fetchArticle` already
  uses in `app/(public)/articles/[slug]/page.tsx`.
- **Reuse existing translation keys** for a route's title wherever an on-page heading key already
  exists for that route (see the table in `../02-architecture.md`); add a new key only when none
  exists.
- **`fr` and `en` must hold the exact same keys** — every new/changed key gets both mirrors in the
  same commit, per the existing i18n type-safety rule
  (`../../../../docs/i18n/frontend/11-type-safety.md`).
- **Next 16 is customized** — the relevant API reference already checked for this feature is
  `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`; recheck
  it if a spec needs a metadata field not covered there.

---

## Global progress

- [x] 01 — Server translation util
- [x] 02 — Root layout + `general.ts` key cleanup
- [x] 03 — Public listing routes
- [x] 04 — Private routes (favorites + settings)
- [x] 06 — Content-absence fallbacks (not-found boundaries + shorts)
- [ ] 07 — Language-switch refresh (code done, browser verification pending)
- [ ] 05 — Verification

Mark a box `- [x]` only when that spec's own task list is fully verified.
