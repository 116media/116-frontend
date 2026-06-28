# Articles Page — Implementation Specs

Implementation-ready specs for the web frontend **articles listing page**. Each spec
contains **full, JSDoc'd code snippets** and a **task checklist** whose boxes are ticked
`- [x]` only **after** the work is implemented and verified (tsc + biome clean, behavior
confirmed).

Read the design docs first ([../README.md](../README.md)) for the *why*; these specs are
the *how*. Decisions are locked in [../15-open-questions.md](../15-open-questions.md).

---

## Specs

| File | What it covers |
|---|---|
| [01-domain-and-mappers.md](01-domain-and-mappers.md) | `IArticlePage`, `IArticleAuthor`, extended `IArticleSummaryEntity`, `articlePageFromDto` |
| [02-repository-and-usecase.md](02-repository-and-usecase.md) | `IPublishedArticlesQuery`, port + impl method, `GetPublishedArticlesUseCase`, DI + `Cradle` |
| [03-infinite-query-hook.md](03-infinite-query-hook.md) | `useIntersectionObserver`, `articleKeys`, `ARTICLES_PAGE_SIZE`, `useArticlesFeed` |
| [04-article-card.md](04-article-card.md) | `Separator` + `BookmarkPlusIcon`, the `ArticleCard` compound + sub-composers |
| [05-grid-and-page.md](05-grid-and-page.md) | `ArticlesGrid` + states, `ArticlesGridContainer`, `app/(public)/articles/page.tsx` |
| [06-interactions-and-dummy-data.md](06-interactions-and-dummy-data.md) | Like/bookmark/share use cases + hooks + engagement bar, `generateDummyArticles` |
| [07-i18n.md](07-i18n.md) | `articles.card` / `articles.grid` keys (en/fr), registration |
| [08-search-and-filters.md](08-search-and-filters.md) | `getAllTags`, category/tag hooks, `ArticlesToolbar`, search, category select, tag strip + popover |

---

## Implementation order

1. **Domain + mappers** (01)
2. **Repository + use case + DI** (02)
3. **Infinite-query hook + observer** (03)
4. **Card + shared primitives** (04)
5. **Grid + states + page** (05)
6. **Interactions + dummy data** (06)
7. **i18n** (07)
8. **Search + filters** (08) — the toolbar, category select, tag strip/popover

Each step is independently verifiable (tsc + biome). Tick a spec's tasks as they land.
See [../14-implementation-plan.md](../14-implementation-plan.md) for the phase mapping.

---

## Conventions for all snippets

- **JSDoc only in the generated code — no inline comments.** The code written into the
  codebase must carry **only** JSDoc block comments (`/** … */`) above declarations. Do
  **not** emit inline `//` comments of any kind: no explanatory notes, no `// ＋ added`
  markers, no per-field annotations beside interface properties, no decorative
  separators. Document interface fields with `@property` inside the block JSDoc, never
  next to the field. **Anything in these doc snippets that is not JSDoc — a `//` note, a
  `/* … */` ellipsis marking omitted code, a "＋ new" marker — is explanatory scaffolding
  for the reader and must not appear in the output.**
- **JSDoc on every exported function, component, hook, interface and constant** —
  multi-line block form only (`@description`, `@param`, `@returns`, `@property`).
- **Scoped props, not the whole entity** — sub-components receive only the fields they
  render (e.g. `ArticleCardMedia({ slug, title, coverImageUrl })`), never
  `article={article}`. Only the card's public entry point (`ArticleCard.Feed`) takes the
  entity and distributes.
- **Theme tokens** in `className` — never hardcoded colors. The brief's
  `bg-blue-500` / `text-red-500` / `bg-white/90` are remapped to tokens.
- **`Result<T>`** out of every repository/use case; `ProblemMapper.toFailure` in
  catches; no thrown errors across layers.
- **Import icons from the barrel** (`components/ui/Icon`), never `lucide-react` directly.
- **`npm show <pkg> dist-tags.latest`** before pinning any new dependency.
- **Deterministic dummy data** — no `Math.random()` / `Date.now()` (SSR-safe).

---

## Global progress

- [x] 01 — Domain & mappers
- [x] 02 — Repository & use case
- [x] 03 — Infinite-query hook & observer
- [x] 04 — Article card & primitives
- [x] 05 — Grid, states & page
- [x] 06 — Interactions & dummy data
- [x] 07 — i18n
- [x] 08 — Search & filters

Mark a box `- [x]` only when that spec's own task list is fully verified.
