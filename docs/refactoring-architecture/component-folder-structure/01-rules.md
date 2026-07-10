# 01 — Rules (the contract)

These rules are **binding** for all presentation-layer code (`src/modules/*/presentation/**`
and `src/shared/presentation/components/**`). New code MUST follow them; existing code is
migrated per [specs/](specs/). When a rule and a piece of code disagree, the code is wrong.

The numbering is stable — specs and reviews reference rule IDs (R1, R2, …).

---

## Layering

**R1 — Two kinds of presentation folders.** `containers/` holds **smart** components (they
own server reads and branch state). `components/` holds **presentational** components (props
in, JSX out). Non-component concerns live in their own sibling dirs: `hooks/`, `constants/`,
`data/`, `utils/` (incl. the fixed `utils/notification/` bucket), `i18n/`, `validation/`, `model/`.

**R2 — Container / presentational split.** A **container** owns the primary `useQuery`/
`useInfiniteQuery` for a route or section and chooses which presentational view to render
(loading / error / empty / data). A **presentational** component receives resolved data via
props and renders it; it may hold local UI state (open/hover) and fire actions/mutations,
but must not own the surface's primary data read. See [02](02-container-presentational.md).

**R3 — Island containers are allowed.** An independently-loading region (an infinite list, a
lazy tab panel, a popular sidebar, a per-row action card) MAY own its own query and live in
its presentational bucket. It is marked *island container* in the docs and stays where it is
used — it does **not** move to `containers/`. Only the route/section-level orchestrator goes
in `containers/`.

---

## The folder shape

**R4 — One component, one folder.** Every component gets its own folder named exactly after
the component (`PascalCase/`). No exceptions except compound components (R8).

**R5 — The 2–3-file rule.** A (non-compound) component folder contains **only**:
- `<Component>.tsx` — the component,
- `index.ts` — the barrel,
- `types.ts` — *only when* a type is shared by ≥2 files in the folder (R12),
- state files — `<Component>.Loading.tsx`, `.Error.tsx`, `.Empty.tsx`, `.NotFound.tsx`,
  `.EndOfFeed.tsx` — *when applicable*,
- **(carve-out)** a colocated `constants.ts` / `utils.ts` / `variants.ts` — *only when* the
  content is used solely within this folder **and** is too large to inline cleanly (a big
  `Record<>` style/data map, a set of motion variants). See R13.

Small values stay inline; anything reused **beyond** the folder goes to the module's
`constants/` or `utils/`. No other files.

**R6 — A component folder never contains another component folder.** Grouping folders
(*buckets* — R9) may nest buckets and component folders; a **component folder is a leaf**.
No `header/`, no nested `Scoreboard/`, no `parts/`.

**R7 — State files are flat.** Loading/Error/Empty/NotFound live as dotted sibling files in
the component's own folder. **Never** a `states/` sub-folder. (This is the corrected form of
the earlier `states/` proposal — do not use `states/`.)

**R7a — Private single-use sub-components stay inline.** A helper component used only by one
parent and never exported stays as an unexported function in the parent `.tsx` (e.g.
`ScoreboardColumn`, `RevealOnHover`, `PairColumnCarousel`, private row skeletons). Do **not**
give it its own folder. Only **exported / reused** components get a folder.

---

## The compound exception

**R8 — Compound components keep their parts in one folder.** A *compound component* is
either (a) a component published as a namespace of variants (`VideoCard.Vertical`,
`ArticleCard.Feed`, `ArticlePromotionCard.Hero`), or (b) a self-contained widget whose
sub-parts are intrinsic and never used except by it (`VideoPlayer` + `.Plyr` + `.Poster`;
`ArticlesToolbar` + its controls; a mega-menu + its `.CategoryList`; `SocialLogin` + its
buttons; `LanguageDropdown` + `.Menu`).

A compound folder is **exempt from R4, R5, R6's file/one-per-folder limits**. It contains:
- the parts as dotted files (`<Compound>.<Part>.tsx`),
- `types.ts` (the shared props/family types),
- optionally a colocated `constants.ts` / `variants.ts` / `utils.ts` for content shared
  across the parts,
- `index.ts` — which assembles the namespace (`export const VideoCard = { Vertical, Horizontal }`)
  or re-exports the widget.

A compound folder still **never nests a component sub-folder** — its parts are files, not
folders.

**How to tell compound from "a page and its sections":** a page (VideoDetail) composes
**independent** sections (Header, Tabs, Scoreboard) that are their own components with their
own concerns → each is its own folder (R4). A compound's parts are variants/intrinsic pieces
of **one** component → one folder (R8). If a part is an island container, substantial, or
meaningful on its own, it is a section (own folder), not a compound part.

---

## Kind buckets

**R9 — Group components by kind.** `components/` is organized into buckets so anything is
findable by what it is:

`containers/` · `pages/` · `sections/` · `cards/` · `carousels/` · `media/` · `modals/` ·
`navigation/` · `forms/` · `fields/` · `lists/` · `social/` · `feedback/`

Only create a bucket a module actually needs. Definitions in
[03](03-buckets-and-anatomy.md#buckets).

**R10 — Reusable units live in their kind bucket, never inside a page.** A reusable piece
(a player, a card, a modal, a state view) belongs in its kind bucket, not buried in the page
that first used it. Placement follows the **promotion ladder**:

> inline (R7a) → own folder in the module kind-bucket → `shared/presentation/components/…`
> (only once a **second module** imports it).

Promote a component to `shared/` when a second module imports it (proven cross-feature).
Until then it stays in its module bucket.

**R10a — Declared shared libraries live in `shared/` from the start.** When the team
explicitly designates a component a *shared library* — a general-purpose primitive built for
cross-feature reuse — it lives in `shared/presentation/components/**` immediately, even
before a second importer exists. The player (`VideoPlayer`) is such a case: it is
entity-agnostic (URL / thumbnail / title only) and intended for shorts, ads, and home
previews, so it is a shared `media` library, **not** a videos-module component. Use R10a
sparingly and only by explicit decision — the default remains R10 (earn `shared/` by a second
importer); R10a is the deliberate exception for components designed up-front as shared
infrastructure.

---

## Naming

**R11 — Names.** Folder = file = export name (PascalCase). Compound parts are dotted
`Compound.Part.tsx`. Barrels are `index.ts`. Containers are `<Surface>Container`. Hooks are
`useCamelCase.ts`. Full detail in [04](04-naming-conventions.md).

---

## Types, constants, helpers — the "promote when shared" ladder

**R12 — Types.** Default: `export interface XxxProps` inline, directly above the component,
documented with `@property`. Extract to a folder `types.ts` **only** when a type is used by
≥2 files in that folder (a compound family, or a component + its state file). Never a
`types.ts` for a single-consumer type. Props interfaces are `XxxProps` (never `IXxxProps` —
the `I` prefix is for domain entities only). **Domain entities never live in a component
`types.ts`** — they belong in `domain/entities/`.

**R13 — Constants & helpers (the carve-out).** A colocated `constants.ts` / `utils.ts` /
`variants.ts` is allowed in **any** component folder (strict or compound) **only** for
folder-local content too large to inline — e.g. a variant/style `Record<>` map (`TYPE_STYLES`),
motion variants, a player-options object. Small values stay inline. Anything reused **beyond**
one component folder goes to the module's `constants/` or `utils/` dir. Duplication across
files/modules is a defect — hoist it (see [10](10-cleanups-and-debt.md)). Layout folders
(`layouts/*`) get the same carve-out.

**R14 — The unifying idea.** Components, types, constants, and helpers all follow **one**
ladder: *local/inline until a second file needs it, then extracted to the nearest shared
place.* Component → its own folder; magic value → `constants.ts`/module `constants/`; helper
→ `utils.ts`/module `utils/`; shared props → `types.ts`.

---

## Imports & barrels

**R15 — Barrels.** Every component folder has an `index.ts` that re-exports the component and
its public types. Consumers import from the folder (`@/…/cards/VideoCard`), never a deep file
path.

**R16 — Import paths.** Use the `@/` alias for anything outside the current folder; reserve
relative `./` for same-folder siblings only. No import contains `../`. (Enforced project-wide
— see [../06-naming-and-imports.md](../06-naming-and-imports.md).)

---

## What NOT to do (anti-patterns, banned)

- ❌ A flat pile of `Foo.*.tsx` for an *independent* page's sections in one folder (that's
  what R4/R6 fix — sections are separate folders).
- ❌ A `states/` sub-folder (R7).
- ❌ A component folder containing a component sub-folder (R6).
- ❌ Exploding a **compound** family into one-folder-per-part (R8).
- ❌ A reusable widget parked inside a page folder (R10).
- ❌ `types.ts` for a single-consumer type, or `IXxxProps`, or entities in a component
  `types.ts` (R12).
- ❌ `../` imports (R16).

---

## Quick self-check before adding a component

1. Is it smart (owns the surface's primary read)? → `containers/` as `XxxContainer`.
   Independently-loading island? → its bucket, marked island container (R2/R3).
2. What kind is it? → the matching bucket (R9).
3. Is it a compound (variants / intrinsic parts)? → one folder, dotted parts (R8).
   Otherwise → its own folder, ≤3 files + state files (R4/R5).
4. Reusable? → kind bucket now; `shared/` only when a 2nd module imports it (R10).
5. Shared prop type across the folder's files? → `types.ts`; else inline (R12).
6. Private single-use helper component? → inline, unexported (R7a).
