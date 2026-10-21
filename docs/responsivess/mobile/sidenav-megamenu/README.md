# Mobile side nav — the mega menu below `md`

The desktop mega menu has no mobile equivalent. `MobileNav` today renders four
flat links and a dead search button, so every category, promoted card and popular
tag that `DesktopNav` exposes is unreachable on a phone. This folder specifies the
replacement: a full-screen panel that slides in from the left, carrying the whole
mega menu content on the shared `Tabs` primitive.

| Doc | What it covers |
| --- | --- |
| [01-overview.md](01-overview.md) | Problem, scope, the design source, decisions taken |
| [02-anatomy.md](02-anatomy.md) | Region-by-region layout and the artboard mapping |
| [03-components.md](03-components.md) | Every component, its folder, props and source |
| [04-data-and-state.md](04-data-and-state.md) | Where the data comes from, what state exists |
| [05-motion-and-gestures.md](05-motion-and-gestures.md) | Slide in/out, swipe to close, tokens |
| [06-tokens-and-styling.md](06-tokens-and-styling.md) | Colors, spacing, type, the token additions |
| [07-accessibility.md](07-accessibility.md) | Dialog semantics, focus, targets, contrast |
| [08-i18n.md](08-i18n.md) | Catalog additions, both locales |
| [09-mobile-header.md](09-mobile-header.md) | Trimming the header below `md` |
| [10-implementation-plan.md](10-implementation-plan.md) | Ordered steps and acceptance criteria |

## The rule this closes

`AGENTS.md`, design system section:

> `md` (768px) is the layout switch. Anything hidden below it needs a mobile
> equivalent; navigation that only exists in `DesktopNav` is unreachable on phones.

`ArticlesMegaMenu` and `VideosMegaMenu` are rendered only by `DesktopNav`, which is
`hidden items-center gap-1 md:flex`. Below `md` their content does not exist in the
DOM at all.
