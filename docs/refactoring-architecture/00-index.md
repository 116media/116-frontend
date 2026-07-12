# Frontend Architecture — Consistency Audit & Remediation

This folder documents the **structural and stylistic inconsistencies** in
`apps/frontend/src` (and `app/`), and the canonical conventions the codebase should
converge on. It is a *design* deliverable: the *why* and the *what*. The executable,
checkbox-driven *how* lives in [`specs/`](specs/) (added after these docs are signed off).

## How this was produced

Seven parallel read-only audits swept the codebase along one dimension each — component
file structure, constants, utils/helpers, JSDoc, naming & imports, cross-module/layer
parity, and component internal patterns. Every finding below is backed by concrete
`path:line` evidence in its per-dimension doc. Nothing here was inferred from memory; it
was measured against the tree (558 TS/TSX files, 5 feature modules, `shared/`).

## The headline

The codebase is **well-built and already highly consistent in its runtime patterns** —
`"use client"` placement, `cn()` className merging, theme-token usage, named exports,
`Result<T>`, DI registration, port/impl uniformity, and Biome-enforced import ordering
are all effectively 100% clean. The inconsistencies are concentrated in a few
**organizational** seams that grew as the app scaled: where things *live* (constants,
helpers, sub-components), how files are *named and split*, how *doc comments* are sized,
and where a few modules *diverge from the clean-architecture template*.

## Documents

| # | Doc | Covers |
|---|-----|--------|
| 01 | [Canonical conventions](01-canonical-conventions.md) | The north-star rules every other doc references |
| 02 | [Component structure & patterns](02-component-structure.md) | One component per file, folder style, dotted sub-files, loading/error splits, props export, forwardRef |
| 03 | [Constants](03-constants.md) | What belongs in `constants/`, killing verbose constant comments, cva/data maps |
| 04 | [Utils & helpers](04-utils-and-helpers.md) | Where each kind of helper lives, duplication, layer leakage |
| 05 | [JSDoc & comments](05-jsdoc-and-comments.md) | Description length, no prop double-documentation, `@param` style |
| 06 | [Naming & imports](06-naming-and-imports.md) | File/symbol casing drift, `@/` vs relative, notification export shape |
| 07 | [Module & layer parity](07-module-and-layer-parity.md) | The missing `containers/` layer, cross-module coupling, folder matrix |
| 08 | [Remediation roadmap](08-remediation-roadmap.md) | Sequenced plan, risk, effort, and what NOT to touch |

Read **01 first** — it is the contract. The rest are evidence + rules per dimension.

## Severity & effort legend

| Severity | Meaning |
|----------|---------|
| 🔴 High | Correctness/security risk, or divergence that actively misleads (e.g. duplicated security config, documented layer that doesn't exist) |
| 🟡 Medium | Real maintainability/consistency cost; the bulk of the work |
| 🟢 Low | Cosmetic or single-instance; cheap to fix opportunistically |

| Effort | Meaning |
|--------|---------|
| S | Single file / mechanical (minutes) |
| M | A handful of files or a small refactor (hours) |
| L | Codebase-wide sweep; do incrementally with a lint guardrail |

## Master inventory

Every issue, its home doc, severity, effort, and rough count. IDs are stable so the
specs can reference them.

| ID | Issue | Doc | Sev | Effort | Count |
|----|-------|-----|-----|--------|-------|
| **C1** | `VideosPopularSidebar.Loading.tsx` exports two components | 02 | 🟢 | S | 1 |
| **C2** | Folder style split: `index.tsx`-as-component vs `Foo.tsx`+barrel vs parts-only | 02 | 🟡 | L | 63 folders |
| **C3** | Dotted `Foo.Part.tsx` vs concatenated `FooPart.tsx` in the same folder | 02 | 🟡 | M | ~11 files |
| **C4** | Non-trivial loading UI inline instead of `X.Loading.tsx` | 02 | 🟡 | M | 6 |
| **C5** | Component + hook + context + cva in one file (`Carousel`, `Tabs`) | 02 | 🟡 | M | 2 |
| **C6** | Real reusable sub-component defined inline | 02 | 🟡 | M | 3 |
| **C7** | Props interface not exported | 02 | 🟢 | M | 18 |
| **C8** | `Prose` breaks the forwardRef + `displayName` pattern | 02 | 🟢 | S | 1 |
| **K1** | `SENTINEL_OPTIONS` triplicated | 03 | 🟡 | S | 3 |
| **K2** | `SANITIZE_CONFIG` (DOMPurify) duplicated — security config | 03/04 | 🔴 | S | 2 |
| **K3** | `STAR_POSITIONS` duplicated | 03 | 🟢 | S | 2 |
| **K4** | Config-like constants inline that should move to `constants/` | 03 | 🟡 | M | ~16 |
| **K5** | `settings` has no `presentation/constants/` despite inline config | 03/07 | 🟡 | S | 1 |
| **K6** | Constants file naming inconsistent (`xxxKeys` vs `.constants` vs bare) | 03/06 | 🟢 | M | — |
| **K7** | Over-verbose / catalog JSDoc on constants (`colors.ts` worst) | 03/05 | 🟡 | M | 6 |
| **U1** | Duplicated `resolve*Url` share-URL resolver | 04 | 🟡 | S | 2 |
| **U3** | Inline YouTube embed-URL string instead of a helper | 04 | 🟢 | S | 1 |
| **U4** | Reusable pure helpers defined inline (`dedupeById`, `isAllNull`, `deriveAuthStatus`) | 04 | 🟡 | M | 3 |
| **U5** | Pure helpers under `components/` not a `utils/` (`orderTags`, `*JsonLd`) | 04 | 🟡 | S | 3 |
| **U6** | Layer leakage (presentation helper over domain entity; presentation util imports infra) | 04 | 🟡 | M | 3 |
| **J1** | Over-long `@description` blocks (> 6 lines) | 05 | 🟡 | L | 135 |
| **J2** | Props double-documented (`@property` **and** `@param`) | 05 | 🟡 | L | 42 files |
| **J3** | Typed `@param {Type}` minority vs untyped majority | 05 | 🟢 | M | 92 |
| **N1** | `@/` alias vs relative `../` import path split (same targets both ways) | 06 | 🟡 | L | 258 relative |
| **N2** | Notification export shape: namespace object vs factory functions | 06 | 🟡 | M | 4 modules |
| **N3** | `refresh-token.usecase.ts` — lone kebab-cased usecase | 06 | 🟢 | S | 1 |
| **N4** | `UseLanguageDropdown.ts` — lone capital-`U` hook filename | 06 | 🟢 | S | 1 |
| **N5** | Dummy-data scheme split (`dummy-x.ts` prefix vs `x.dummy.ts` suffix) | 06 | 🟢 | M | 7 |
| **N8** | `CircleHelp as HelpCircleIcon` alias name mismatch | 06 | 🟢 | S | 1 |
| **N9** | Domain `Entity` suffix applied inconsistently | 06/07 | 🟢 | M | ~20 |
| **M1** | `session` has no `domain/` layer (borrows `auth`'s entities) | 07 | 🟡 | M | 1 |
| **M2** | `settings` reuses `AuthMapper` (cross-module coupling) | 07 | 🟡 | S | 1 |
| **M3** | `Share{Article,Video}UseCase` break the `IResultUseCase` contract | 07 | 🟡 | S | 2 |
| **M4** | Generic `useToggle` trapped in `articles` | 07 | 🟡 | S | 1 |
| **M5** | Per-module folder parity gaps (constants/data/validation/model) | 07 | 🟡 | M | — |
| **M6** | ✅ Resolved — `containers/` layer adopted (see [component-folder-structure/](component-folder-structure/README.md)) | 07 | 🟡 | M | — |

## Guardrails — what NOT to churn

To keep the remediation safe and reviewable:

- **Do not touch** the generated API client (`src/shared/infrastructure/api/generated/116.api.ts`).
- **Do not "fix" the principled exceptions**: `VideoDetailPlayer.Plyr.tsx`'s default export (required by `next/dynamic`), the `ShowCard` hex fallbacks, the backend-derived `style={{}}` palettes, and the i18n `export default`.
- **Do not rewrite runtime behavior.** This is an organizational refactor: moving, renaming, splitting, and trimming comments — not changing what the code does. Every change must leave `tsc` + Biome clean and behavior identical.
- **Land it incrementally.** The 🟡L sweeps (import paths, folder style, JSDoc) should be staged behind lint rules, not done in one giant PR.

Next: the [canonical conventions](01-canonical-conventions.md).
