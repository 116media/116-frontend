# 08 — Remediation Roadmap

How to land the fixes safely. Everything here is an **organizational** change — moving,
renaming, splitting, extracting, trimming comments — with **zero runtime behavior change**.
Every step must leave `tsc` + Biome clean and behavior identical.

## Principles

1. **Enforce, then sweep.** For the codebase-wide issues (import paths, folder style,
   JSDoc), land the lint rule / convention *first*, then bring existing code into line — so
   new code can't regress while the backlog is worked down.
2. **One dimension per PR** (or per module within a dimension). Never mix a rename sweep with
   a behavior change — it makes review impossible.
3. **Piggyback the L sweeps.** The JSDoc trim (J1/J2) and the folder/file renames (C2/C3)
   are best done to a file *while you're already touching it* for another reason, rather than
   as a giant standalone diff. Track them as "definition of done when a file is edited."
4. **Guardrails from [00](00-index.md) apply** — don't touch the generated client, the
   principled exceptions, or runtime logic.

## Sequenced phases

Ordered by value ÷ risk. Earlier phases are cheap, mechanical, and unblock the rest.

### Phase 1 — Quick wins (🟢 S, hours)
Mechanical, isolated, immediately shippable.
- **C1** un-export `PopularRowSkeleton`.
- **C8** fix `Prose` forwardRef + `displayName`.
- **N4** rename `UseLanguageDropdown.ts` → `useLanguageDropdown.ts`.
- **N3** rename the lone kebab usecase (or decide the kebab-everywhere rule — see Phase 5).
- **N8** `CircleHelp as CircleHelpIcon`.
- **K6** rename `storage.constants.ts` → `storage.ts`.

### Phase 2 — De-duplicate (🔴/🟡 S–M)
Removes real hazards (security config drift) and prep for the utils home.
- **K2/U2** extract shared `utils/sanitize/sanitize.utils.ts` (DOMPurify config + `sanitizeHtml`).
  **Do first — it's the only 🔴.**
- **U1** extract `resolveShareUrl(path)` into `utils/share/share.utils.ts`.
- **U3** add `buildYoutubeEmbedUrl` to `utils/youtube/youtube.utils.ts`.
- **K1** extract `INFINITE_SCROLL_SENTINEL_OPTIONS`; **K3** shared `STAR_POSITIONS`.

### Phase 3 — Structure & placement (🟡 M)
Create the homes, move the strays.
- **K5 / M5** create `settings/presentation/constants/`, `articles|videos/presentation/utils/`.
- **K4** move config constants into their `constants/` files.
- **U4/U5/U6** relocate `dedupeById`, `isAllNull`, `deriveAuthStatus`, `orderTags`,
  `*JsonLd`; fix the layer leaks.
- **C4** split non-trivial inline loading UI into `X.Loading.tsx`.
- **C5** extract Tabs/Carousel contexts + hooks + variants.
- **C6** — no work: `ScoreboardColumn`/`PairColumnCarousel`/`RevealOnHover` are private
  single-use → **keep inline** (R7a); the audit found no reusable ones.
- **C7** `export` the file-local Props interfaces (18 interfaces across 17 files).

### Phase 4 — Module parity (🟡 S–M)
Break the cross-module couplings and conform the outliers.
- **M2** hoist user shape + `userFromDto` to `shared`; drop `settings`→`auth` reach-in.
- **M3** give the two `Share*UseCase` their `IResultUseCase` interface + request object.
- **M4** promote `useToggle` to `shared/presentation/hooks`.
- **M1** decide `session`'s domain (own `domain/entities` vs reclassify as shared infra).
- **M6** ✅ resolved — `containers/` layer adopted; docs already reconciled (see
  [component-folder-structure/](component-folder-structure/README.md)). No further doc work.
- **N2** unify the notification export shape across the 4 modules.

### Phase 5 — Enforce-then-sweep (🟡 L)
Land a rule, then codemod. Highest churn — do last, incrementally.
- **N1** add `noRestrictedImports` banning `../`; codemod the 258 relative imports.
- **N5** unify dummy-data scheme (`*.dummy.ts` under `data/`); move the 4 `dummy-*.ts`.
- **C2 + C3** the folder-style + dotted-sub-file rename sweep, module-by-module.
- **J1 + J2 + J3** JSDoc trim (≤4-line descriptions, kill prop double-doc, untyped `@param`)
  — piggybacked onto every file the above phases touch, then a cleanup pass for the rest.
- **N9 / entity-suffix** ✅ applied — aggregates suffixed (`IAuthUserEntity`, `ISessionEntity`); response/support types stay bare.

## Tooling to add (makes the rules self-enforcing)

- **`noRestrictedImports`** — ban `../` (N1). The single highest-leverage guardrail.
- A short **`CONTRIBUTING`/AGENTS** note pointing at [01](01-canonical-conventions.md) so new
  code starts compliant.

## Definition of done (per file touched)

When you edit a file for any reason, bring it fully to [01](01-canonical-conventions.md):
one component per file, props interface exported, `@description` ≤ 3 lines, props documented
once, no `../` imports, constants/helpers in their proper home. This "boy-scout rule" clears
the L backlog without a mega-PR.

## What this is NOT

Not a rewrite, not a behavior change, not a dependency bump, not a redesign. If a change
alters what renders or how data flows, it does not belong in this remediation — it's a
separate feature/fix.

---

Next: the [`specs/`](specs/) index carries the phase checklist; the per-file spec files
(`01-quick-wins.md`…`05-enforce-and-sweep.md`) are scaffolded and still to be authored. The
component-structure migration already has its per-file specs under
[`component-folder-structure/specs/`](component-folder-structure/specs/).
