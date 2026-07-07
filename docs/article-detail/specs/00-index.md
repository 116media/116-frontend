# Article Detail Page — Implementation Specs

Implementation-ready specs for the web frontend **single article page**. Each spec
contains **full, JSDoc'd code snippets** and a **task checklist** whose boxes are ticked
`- [x]` only **after** the work is implemented and verified (`tsc` + biome clean, behavior
confirmed).

Read the design docs first ([../README.md](../README.md)) for the *why*; these specs are
the *how*. Decisions are locked in [../19-open-questions.md](../19-open-questions.md).

---

## Specs

| File | What it covers |
|---|---|
| [01-domain-and-mappers.md](01-domain-and-mappers.md) | `IArticleDetailEntity`, `IArticleImage`, `IArticleCommentEntity`, `IArticleCommentPage`, mappers |
| [02-repository-and-usecases.md](02-repository-and-usecases.md) | Port + impl for `getArticleBySlug` / comments, use cases, DI + cradle |
| [03-hooks-and-keys.md](03-hooks-and-keys.md) | `articleKeys.detail/comments`, `useArticleDetail`, `useArticleComments`, `useAddArticleComment`, `useReadingProgress` |
| [04-cover-and-header.md](04-cover-and-header.md) | `ArticleDetail.Hero` + sub-composers (cover, category overlay, author, title `Tag`, meta) |
| [05-article-body.md](05-article-body.md) | `Prose` container, `isomorphic-dompurify` sanitize, `ArticleDetail.Body` |
| [06-reading-progress.md](06-reading-progress.md) | `Progress` primitive, `useReadingProgress`, `ArticleDetail.ReadingProgress` |
| [07-share-rail.md](07-share-rail.md) | `ArticleDetail.ShareRail`, per-platform share, Web Share API, copy-link |
| [08-interactions.md](08-interactions.md) | `ArticleDetail.Engagement` (reuses like/bookmark/share hooks) |
| [09-popular-sidebar.md](09-popular-sidebar.md) | `ArticleCard.Horizontal`, `useArticleDetailPopular`, `ArticleDetail.PopularSidebar` |
| [10-comments.md](10-comments.md) | `Textarea` primitive, `ArticleDetail.Comments`, `ArticleDetailComment`, `ArticleDetailCommentComposer` |
| [11-page-and-layout.md](11-page-and-layout.md) | `ArticleDetailContainer`, `ArticleDetail`, `app/(public)/articles/[slug]/page.tsx`, `generateMetadata` |
| [12-i18n.md](12-i18n.md) | `articles.detail` / `articles.comments` / `articles.share` / `articles.sidebar` keys (en/fr) |

---

## Implementation order

1. **Domain + mappers** (01)
2. **Repository + use cases + DI** (02)
3. **Hooks + keys** (03) — plus the shared `useReadingProgress`
4. **Shared primitives** — `Prose`, `Progress`, `Textarea` (in 05 / 06 / 10)
5. **Hero + body + tags** (04, 05)
6. **Reading progress + share + interactions** (06, 07, 08)
7. **Popular sidebar** (09) — including `ArticleCard.Horizontal`
8. **Comments** (10)
9. **Page + layout + metadata** (11)
10. **i18n** (12)

Each step is independently verifiable (`tsc` + biome). Tick a spec's tasks as they land.
See [../18-implementation-plan.md](../18-implementation-plan.md) for the phase mapping.

---

## Conventions for all snippets

- **JSDoc only in the generated code — no inline comments.** Only block JSDoc (`/** … */`)
  above declarations. No `//` notes of any kind, no per-field annotations beside interface
  properties (document fields with `@property` inside the block), no decorative separators.
  Anything in these snippets that is not JSDoc (a `//` note, a `/* … */` ellipsis, a "＋ new"
  marker) is scaffolding for the reader and must not appear in the output.
- **JSDoc on every export** — multi-line block form (`@description`, `@param`, `@returns`,
  `@property`), neutral team-to-team voice.
- **Scoped props, not the whole entity** — sub-composers receive only the fields they
  render. Only the `ArticleDetail` assembler holds `IArticleDetailEntity`.
- **Theme tokens** in `className` — never hardcoded colors.
- **`Result<T>`** out of every repository/use case; `ProblemMapper.toFailure` in catches.
- **Import icons from the barrel**; brand icons from `@icons-pack/react-simple-icons`.
- **`npm show <pkg> dist-tags.latest`** before pinning any new dependency
  (`isomorphic-dompurify`).
- **Sanitize before render** — the HTML body is never injected unsanitized.

---

## Global progress

- [ ] 01 — Domain & mappers
- [ ] 02 — Repository & use cases
- [ ] 03 — Hooks & keys
- [ ] 04 — Cover & header
- [ ] 05 — Article body
- [ ] 06 — Reading progress
- [ ] 07 — Share rail
- [ ] 08 — Interactions
- [ ] 09 — Popular sidebar
- [ ] 10 — Comments
- [ ] 11 — Page & layout
- [ ] 12 — i18n

Mark a box `- [x]` only when that spec's own task list is fully verified.
