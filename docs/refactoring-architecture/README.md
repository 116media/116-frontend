# Refactoring Architecture

Two complementary bodies of work for bringing the frontend to a consistent, reusable
architecture. Read this first — it says which doc owns which decision.

## The two parts

| Part | Scope | Authoritative for |
|------|-------|-------------------|
| **Root audit** (`00`–`08` + [`specs/`](specs/)) | cross-cutting inconsistencies found by a codebase-wide audit | JSDoc, constants, utils/helpers, naming & imports, module/layer parity, and the remediation roadmap |
| **[`component-folder-structure/`](component-folder-structure/)** | the presentation-layer component & folder structure | **component/folder structure** — containers vs presentational, kind buckets, the per-file rules, the target trees, the migration |

Start points:
- New to this? → [`00-index.md`](00-index.md) (the audit's master inventory) and
  [`component-folder-structure/README.md`](component-folder-structure/README.md).
- Adding/moving a component? → [`component-folder-structure/01-rules.md`](component-folder-structure/01-rules.md)
  (also summarized in `apps/frontend/AGENTS.md`, auto-loaded each session).

## Precedence (resolves any overlap)

Where the two parts touch the same subject, **`component-folder-structure/` wins for anything
about component/folder structure**; the root audit wins for the cross-cutting conventions
(JSDoc, constants placement, utils, imports, module parity). The docs have been reconciled so
they agree — the notable reconciliations:

| Topic | Earlier (root audit) | Unified decision |
|-------|----------------------|------------------|
| `containers/` layer | root `07` M6 left it undecided (leaned "drop it") | **Adopted** — explicit `containers/` bucket with *island containers* (`component-folder-structure`) |
| Private single-use sub-components | root `02` C6 said "extract to files" | **Keep inline** (R7a); C6 only covers genuinely reusable ones — the audit found none |
| Folder style | root `01`/`02` allowed `Foo/index.tsx`-as-component | **Always `Foo/Foo.tsx` + `index.ts`**, never `index.tsx`-as-component |
| Sub-part files | root `01` said "sub-components are dotted files" | **Independent** sub-components get their own folder; only **compound** parts + **state files** are dotted |
| `VideoPlayer` home | (n/a) | **Shared library from the start** (R10a) — `shared/…/common/VideoPlayer/`, not the videos module |
| State views | an earlier draft used a `states/` sub-folder | **Flat dotted state files** in the component's own folder — never `states/` (R7) |

## ID namespaces (they don't collide by accident)

The two parts number findings independently — cite with the doc:
- **Root audit:** `C*` (component structure), `K*` (constants), `U*` (utils), `J*` (JSDoc),
  `N*` (naming/imports), `M*` (module parity — incl. `M6`, the adopted `containers/` layer).
- **component-folder-structure:** `R*` (rules), `D*` (dead code), `DUP*` (duplication),
  `X1–X9` (inline/move items in `10-cleanups`).

The old `X1` collision is gone — the root containers item was renamed **M6**. A `DUP↔U/K`
crosswalk (with the crossed DUP1↔U2 / DUP2↔U1) lives at the top of `10-cleanups`.

## Specs — no double work

Two spec sets exist and **overlap deliberately on a few items**; do each once:
- Shared utils extraction (`sanitize`, `resolveShareUrl`, sentinel/star constants),
  `useToggle` promotion, and dead-code deletion appear in **both** the root
  [`specs/00-index.md`](specs/00-index.md) and
  [`component-folder-structure/specs/`](component-folder-structure/specs/). Execute them under
  the **component-folder-structure Phase 1** ([`specs/04-shared-and-cleanups.md`](component-folder-structure/specs/04-shared-and-cleanups.md))
  and check the corresponding root boxes as done.
- The root spec owns the pure-convention sweeps (JSDoc trim, constant-comment cleanup,
  `noRestrictedImports`); the component-folder-structure specs own the moves/renames.

## Rules that stick

The binding, always-loaded summary lives in `apps/frontend/AGENTS.md`
(`component-structure-rules` + `jsdoc-rules` blocks), pointing back here. New code follows it
without anyone re-explaining the structure.
