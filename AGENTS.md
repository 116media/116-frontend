<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<!-- BEGIN:component-structure-rules -->
## Presentation component & folder structure (MUST follow)

Full contract + rationale + target trees: `docs/refactoring-architecture/component-folder-structure/`
(start with `01-rules.md`). Read it before adding or moving any component. The rules below are
the non-negotiable summary.

- **Smart vs dumb.** Route/section components that own the primary `useQuery`/`useInfiniteQuery`
  live in `containers/` as `<Surface>Container`. Everything else is presentational in
  `components/`. An independently-loading region (infinite list, lazy tab, popular sidebar) MAY
  own its own query as an *island container* and stay in its bucket.
- **One component per folder, 2–3 files.** A component folder contains only: `<Component>.tsx`,
  `index.ts`, an optional `types.ts` (only when a type is shared by ≥2 files in the folder), and
  optional flat state files `<Component>.Loading.tsx` / `.Error.tsx` / `.Empty.tsx` /
  `.NotFound.tsx` / `.EndOfFeed.tsx`. A colocated `constants.ts` / `variants.ts` is allowed only
  as an R13 carve-out (folder-local content too large to inline, e.g. a big `Record<>`/variant
  map); otherwise shared constants/helpers live in the module's `constants/` / `utils/`.
- **No nesting.** A component folder NEVER contains another component folder. No `states/`
  sub-folder — state files are flat. Grouping *buckets* may nest; component folders are leaves.
- **Private single-use sub-components stay inline** (unexported) in the parent `.tsx`. Only
  exported/reused components get a folder.
- **Compound exception.** A compound component — a namespace of variants (`VideoCard.Vertical`)
  or a widget with intrinsic sub-parts (player, mega-menu, toolbar, `SocialLogin`,
  `LanguageDropdown`) — keeps its parts as dotted files in ONE folder (`<Compound>.<Part>.tsx`)
  plus `types.ts` + `index.ts` (which assembles the namespace). It still never nests a component
  sub-folder.
- **Kind buckets.** Group components by what they are: `containers/ pages/ sections/ cards/
  carousels/ media/ modals/ navigation/ forms/ fields/ lists/ social/ feedback/`. Buckets are
  lowercase; component folders are PascalCase.
- **Reuse ladder.** Keep a component in its module bucket until a 2nd module imports it, then
  promote to `shared/presentation/components/**`. Exception: a component explicitly designed as a
  shared library (e.g. the entity-agnostic `VideoPlayer`) goes to `shared/` from the start.
- **Types.** `export interface XxxProps` inline by default; promote to `types.ts` only when ≥2
  files in the folder share it. Never `IXxxProps` (the `I` prefix is for domain entities, which
  never live in a component `types.ts`).
- **Imports.** `@/` alias for anything outside the current folder; `./` only for same-folder
  siblings. No `../`.
- **Naming.** folder = file = export (PascalCase). Barrel is `index.ts`. Sub-parts and state
  files are dotted. Containers are `<Surface>Container`.
- **Utils** (dashboard-style — full detail:
  `docs/refactoring-architecture/04-utils-and-helpers.md`). Group by **concern into a folder**:
  `presentation/utils/<concern>/<concern>.utils.ts` — **not** one function per file; a
  `<concern>.utils.ts` holds the 1–N related fns. `.utils.tsx` when returning JSX. No barrel in
  utils dirs. Every module has its own `presentation/utils/`, plus `shared/presentation/utils/`.
  Next SSR: keep server-only helpers (`next/headers`) in `<concern>.server.utils.ts`, never
  co-bundled with client utils. **Notification configs live in the fixed bucket
  `presentation/utils/notification/<module>[.<concern>].notification.ts` (dashboard-style,
  module prefix in the filename). Validation schemas keep their own `presentation/validation/`
  dir.**

When unsure, use the decision guide in
`docs/refactoring-architecture/component-folder-structure/05-decision-guide.md`.
<!-- END:component-structure-rules -->
<!-- BEGIN:jsdoc-rules -->
## JSDoc & comments (MUST follow)

Full detail: `docs/refactoring-architecture/05-jsdoc-and-comments.md`.

- **Developer-to-developer voice — never AI-to-user.** Write JSDoc the way an engineer
  documents code for teammates: state what the file/symbol *is and does*. Never explain *why
  you generated it*, never address the reader ("as you can see", "we", "here we…", "note
  that…"), never justify the change or restate the request. No tutorial or marketing tone.
- **≤ 3 lines.** The description is at most 3 short lines. If it needs more, the code is too
  complex or the prose belongs in a `docs/` note — not in the comment.
- **No filler.** Don't restate the symbol name, don't narrate step-by-step runtime behavior,
  don't describe layout/animation in prose. State the essential intent, then stop.
- **Still document every export** with a block `/** … */` (multi-line; `@param` / `@returns` /
  `@property` as needed) — just concise. No inline `//` narration, no decorative separators,
  no per-field notes beside interface properties (use `@property`).
<!-- END:jsdoc-rules -->

