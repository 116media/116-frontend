# Specs — Index & Conventions

Implementation specs for the video detail page, one per phase of
[../17-implementation-plan.md](../17-implementation-plan.md). Work them in order; each
ends with a task checklist and must leave `tsc` + biome clean. Mark a box `- [x]` only
when that spec's own task list is fully verified (types/lint clean **and** behavior
confirmed).

| Spec | Scope | Status |
|---|---|---|
| [01-domain-and-mappers.md](01-domain-and-mappers.md) | entities + mapper functions | [ ] |
| [02-repository-and-usecases.md](02-repository-and-usecases.md) | port, impl, use cases, DI | [ ] |
| [03-hooks-and-keys.md](03-hooks-and-keys.md) | query keys, hooks, notifications, dummies | [ ] |
| [04-youtube-data.md](04-youtube-data.md) | route handler + stats slice | [ ] |
| [05-player.md](05-player.md) | Plyr player + brand CSS | [ ] |
| [06-header-meta-and-tags.md](06-header-meta-and-tags.md) | header, rating, stat chips, tags | [ ] |
| [07-share-and-playlist-modals.md](07-share-and-playlist-modals.md) | Checkbox, SocialShareGroup, both modals | [ ] |
| [08-tabs-and-panels.md](08-tabs-and-panels.md) | animated Tabs + three panels | [ ] |
| [09-popular-sidebar.md](09-popular-sidebar.md) | VideosPopularSidebar | [ ] |
| [10-page-and-layout.md](10-page-and-layout.md) | assembler, container, route, SEO | [ ] |
| [11-i18n.md](11-i18n.md) | en/fr bundles | [ ] |

## Conventions (binding)

- **JSDoc-only comments** — no `//` notes (lint-suppression directives excepted).
- **Scoped props** — sub-composers receive only the fields they render; only the
  assembler holds `IVideoDetailEntity`.
- **Theme tokens** in every `className`; the social brand backgrounds via the `Colors`
  palette are the single documented exception. All cards `rounded-lg` minimum.
- **`Result<T>`** from every repository method; hooks unwrap per the failure policies in
  [../13-state-management-and-hooks.md](../13-state-management-and-hooks.md).
- **Icons from the barrel** (`@/shared/presentation/components/ui/Icon`) only; new
  glyphs are added to `lucide.ts` first.
- **i18n for every string**; notification copy in `*.notification.ts` configs.
- **`npm show <pkg> dist-tags.latest`** before pinning `plyr-react`, `plyr`,
  `@radix-ui/react-tabs`, `@radix-ui/react-checkbox`.
- **This Next.js is customized** — read the relevant guide under
  `node_modules/next/dist/docs/` before writing route/handler code (`AGENTS.md`).
- **No author rendering** anywhere on the page.
