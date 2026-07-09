# 01 — Canonical Conventions (the contract)

This is the single source of truth the rest of the audit references. Where a rule already
holds across the codebase, it is marked **(established)**; where the codebase diverges and
must converge, it is marked **(to enforce)** with a pointer to the doc that inventories the
violations. Rules are distilled from `AGENTS.md`, the existing `docs/*/specs/00-index.md`
"Conventions for all snippets" contract, `biome.json`, `tsconfig.json`, and the dominant
in-tree patterns.

## 1. Layers & modules

- Feature code lives in `src/modules/<feature>/{domain,application,infrastructure,presentation}`; cross-cutting code in `src/shared/{domain,application,infrastructure,presentation}`. **(established)**
- `app/` holds **only** routing: each `page.tsx` is a thin shell that renders a presentation container/component from `src/`. **(established)**
- Every module SHOULD expose the same skeleton (see [07](07-module-and-layer-parity.md) for the target layout and the gaps). **(to enforce)**
- **Layer direction is one-way:** `domain ← application ← infrastructure`/`presentation`. Presentation may depend on application/domain; domain depends on nothing framework-specific. Helpers must sit in the layer whose concern they express (see [04](04-utils-and-helpers.md)). **(to enforce)**

## 2. Repositories, use cases, DI

- One `IXxxRepositoryPort` (application) + one `XxxRepositoryImpl implements IXxxRepositoryPort` (infrastructure) per module, constructor-injected with `{ client }` via the Awilix cradle. **(established)**
- Every use case declares a private `interface IXxxUseCase extends IResultUseCase<Req, Res>` and `export class XxxUseCase implements IXxxUseCase`, with a single request-object `execute(input)`. **(to enforce — 2 `Share*UseCase` exceptions, [07](07-module-and-layer-parity.md))**
- Every repository/use case returns `Result<T>`; catches funnel through `ProblemMapper.toFailure`. **(established)**
- Each module registers via `registerXxxDependencies(container)` (repository `.singleton()`, use cases `.transient()`), wired in `service.locator.ts` and typed in `Cradle`. **(established)**

## 3. Files: one responsibility per file

- **One React component per file.** A file may contain the component plus *private* skeleton/wrapper closures used only within it, but never two peer/exported components, and never a reusable sub-component that other files import. **(to enforce, [02](02-component-structure.md))**
- **Hooks, React contexts, and `cva` variant maps live in their own sibling files** (`useX.ts`, `xContext.ts`, `xVariants.ts`), barrelled — not inlined into a component file. **(to enforce — `Carousel`, `Tabs`, [02](02-component-structure.md))**
- **One component folder per component**, always `Foo/Foo.tsx` + `Foo/index.ts`. **Never** `Foo/index.tsx`-as-component; a component folder never nests another component folder. **(authoritative: [component-folder-structure/01-rules.md](component-folder-structure/01-rules.md) R4–R6)**
- **Independent sub-components get their own folder;** only **compound** parts (`Foo.Feed`, `Foo.Horizontal`) and **state files** (`Foo.Loading.tsx`) are dotted siblings in one folder. Never concatenated (`FooPart.tsx`). Private single-use sub-components stay inline. **(authoritative: [component-folder-structure/01-rules.md](component-folder-structure/01-rules.md) R7a/R8)**
- **State variants are dotted sibling files:** `Foo.Loading.tsx`, `Foo.Error.tsx`, `Foo.Empty.tsx`, `Foo.NotFound.tsx`. Trivial one-`<Skeleton>` placeholders may stay inline. **(established convention, unevenly applied — [02](02-component-structure.md))**

## 4. Constants

- Module/feature-scoped **config data** — option/menu lists, size/icon/variant *data* maps, sanitizer configs, player configs, API limits, and any magic number reused across files — lives in `presentation/constants/` (or `infrastructure/constants/`), **not** at the top of a component/hook. **(to enforce, [03](03-constants.md))**
- Genuinely single-file primitives (a local threshold, skeleton-row count, a local sentinel tuple) may stay inline. **(established)**
- `cva()` variant definitions stay **inline** with their component (shadcn idiom); only *data* maps get extracted. **(established)**
- Constant files are named for their **content**, one convention: query-key factories `<feature>Keys.ts`; everything else `<topic>.ts` (`paths.ts`, `colors.ts`). Avoid the `.constants.ts` suffix drift. **(to enforce, [06](06-naming-and-imports.md))**
- Constant **comments** are one concise line stating the non-obvious *why*. No per-field `@property` catalogs on self-evident maps, no restating the literal value, no decorative separators. **(to enforce, [03](03-constants.md)/[05](05-jsdoc-and-comments.md))**

## 5. Utils & helpers

Where a helper lives is decided by *what concern it expresses*, not where it's first used:

| Kind | Home |
|------|------|
| UI formatting / browser / DOM (`formatCount`, `cn`, `withAlpha`, `shareUrl`) | `shared/presentation/utils/<concern>/<concern>.utils.ts` (dashboard-style concern folders — see [04](04-utils-and-helpers.md)) |
| JSX-returning helper | `<concern>.utils.tsx` in the concern folder |
| DTO ↔ entity | `infrastructure/mappers/` (`<feature>.mapper.ts`, grouped object) |
| Entity predicate / derivation (`isAllNull`, `deriveAuthStatus`) | the owning `domain/` |
| Module-specific presentation helper (`orderTags`, `*JsonLd`) | `modules/<m>/presentation/utils/<concern>/<concern>.utils.ts` |
| Single-caller, trivial closure | inline is fine |

Anything duplicated across files must be hoisted to the correct shared location. **(to enforce, [04](04-utils-and-helpers.md))**

## 6. JSDoc & comments

- **JSDoc on every export**, block form, multi-line, neutral team-to-team voice. **(established)**
- **Only block JSDoc.** No `//` inline notes, no per-field annotations beside interface properties (document fields with `@property`), no decorative separators. **(established)**
- **`@description` ≤ 3 lines** (developer-to-developer voice, never AI-to-user) — say what the symbol is and why it exists. Do not narrate layout, animation, or step-by-step runtime behavior in prose; put that at the relevant code or in a `docs/` note. **(matches `AGENTS.md`; ≥ 135 offenders — the count measured at > 6 lines, [05](05-jsdoc-and-comments.md))**
- **Document props once.** Use `@property` on the exported `XxxProps` interface; the component's own block gets `@description` only (no mirrored `@param` for props). `@param` is for non-prop function args. **(to enforce — 42 files double-doc, [05](05-jsdoc-and-comments.md))**
- **`@param` is untyped** (`@param name - desc`); TypeScript is the type source. `@returns` on hooks/pure fns with a non-obvious return; omit on components. **(to enforce, [05](05-jsdoc-and-comments.md))**

## 7. Naming

- Components `PascalCase.tsx`. **Independent** sub-components get their own folder; only **compound** parts and **state files** are dotted `Foo.Part.tsx` (private single-use sub-components stay inline). Hooks `useCamelCase.ts`. **(structure authoritative in [component-folder-structure/01-rules.md](component-folder-structure/01-rules.md) R4/R7a/R8; casing drift in [06](06-naming-and-imports.md))**
- Non-component TS files: `<feature>.repository.port.ts`, `.repository.impl.ts`, `.mapper.ts`, `.dependencies.ts`, `*.notification.ts`, `*.schema.ts`; use cases `<verb-noun>.usecase.ts`; dummies `*.dummy.ts` under `presentation/data/`. Pick one word-separator style and apply it (the tree is mostly all-lowercase with one kebab straggler). **(to enforce, [06](06-naming-and-imports.md))**
- Symbols: components exported named; Props interfaces `XxxProps` (no `I` prefix); domain interfaces `IXxx` (+ `Entity` suffix rule, [07](07-module-and-layer-parity.md)); enums `EXxx`; use cases `XxxUseCase`/`IXxxUseCase`; icons re-exported through the `Icon` barrel as `<Same> as <Same>Icon`. **(mostly established; drifts in [06](06-naming-and-imports.md))**
- **Notifications** export one shape across all modules (recommend the `XxxNotification` namespace object). **(to enforce, [06](06-naming-and-imports.md))**

## 8. Imports

- **Import ordering is Biome's job** (`organizeImports: on`): external → `@/` alias (alphabetized) → relative, blank line between groups. Never hand-order. **(established)**
- **Path style:** relative `./` **only** for same-directory siblings and colocated `types.ts`/`constants.ts`; `@/` for everything else. No import should contain `../`. Enforce with a `noRestrictedImports` rule. **(to enforce — 258 relative imports, [06](06-naming-and-imports.md))**
- Icons from the `Icon` barrel; brand icons from `@icons-pack/react-simple-icons`. **(established)**

## 9. Presentation & styling

- `"use client"` on line 1 for any file using hooks/handlers/browser APIs; omit for server-safe presentational files. **(established — 100% clean)**
- Shared UI primitives accept `className` and merge it **last** via `cn()`. **(established — 100% clean)**
- Theme tokens in `className`; never hardcoded colors. `style={{}}` only for computed/dynamic values (geometry, backend-derived palettes). **(established — 2 documented hex fallbacks aside)**
- `forwardRef` components use an anonymous inner fn + explicit `X.displayName = "X"`. **(to enforce — 1 exception `Prose`, [02](02-component-structure.md))**
- Props interfaces are **exported** (`export interface XxxProps`). **(to enforce — 18 file-local, [02](02-component-structure.md))**

## 10. Dependencies & security

- `npm show <pkg> dist-tags.latest` before pinning any new dependency. **(established policy)**
- HTML is **sanitized before render** (DOMPurify), from a **single shared config** — never inline-duplicated. **(to enforce — duplicated config, [03](03-constants.md)/[04](04-utils-and-helpers.md))**

---

When these docs say "canonical," they mean *this file*. When a spec ticks a box, it is
making a violation listed in one of docs 02–07 conform to a rule stated here.
