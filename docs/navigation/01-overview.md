# Mega Menu Overview

## What Is the Mega Menu?

The "NEWS" and "VIDEOS" items in the desktop navigation each open a panel when hovered. This panel displays the active categories for that content type alongside a selection of promoted content — giving users a direct entry point into any category or a highlighted article/video without visiting the listing page first.

"LYRICS" and "ARTISTES" are plain links and have no panel.

## Desktop Layout

### NEWS (Articles) panel

```text
+-------------------------------------------------------------------------+
|  [Logo]  NEWS ▾  VIDEOS ▾  LYRICS  ARTISTES  [🔍]  [🌙] [FR ▾] [👤]  |
+-------------------------------------------------------------------------+
|                                                                         |
|  CATÉGORIES          À LA UNE                     TAGS                  |
|                                                                         |
|  Artist Profile  >   +----------------------+     [Fally Ipupa]        |
|  Chronique Sale  >   | [cover] Article Title |     [Kinshasa]           |
|  Album Review    >   |         Short headline |     [Afrobeats]          |
|  Buzz de la sem. >   +----------------------+     [Rumba]              |
|  À la Une        >                               [Innoss'B]            |
|  Lyrics Page     >   +----------------------+                           |
|                      | [cover] Article Title |     VOIR TOUT →          |
|                      |         Short headline |                          |
|                      +----------------------+                           |
|                                                                         |
|                      +----------------------+                           |
|                      | [cover] Article Title |                          |
|                      |         Short headline |                          |
|                      +----------------------+                           |
|                                                                         |
+-------------------------------------------------------------------------+
```

### VIDEOS panel

```text
+-------------------------------------------------------------------------+
|  [Logo]  NEWS ▾  VIDEOS ▾  LYRICS  ARTISTES  [🔍]  [🌙] [FR ▾] [👤]  |
+-------------------------------------------------------------------------+
|                                                                         |
|  CATÉGORIES          À LA UNE                     TAGS                  |
|                                                                         |
|  Music Video     >   +----------------------+     [Fally Ipupa]        |
|  Interview       >   | [▶ thumb] Video Title |     [Kinshasa]           |
|  FlexBeat        >   |          Category Name |     [Afrobeats]          |
|  Behind the Lyr. >   +----------------------+     [Rumba]              |
|  BTS             >                               [Innoss'B]            |
|  Podcast         >   +----------------------+                           |
|  Documentary     >   | [▶ thumb] Video Title |     VOIR TOUT →          |
|                      |          Category Name |                          |
|                      +----------------------+                           |
|                                                                         |
|                      +----------------------+                           |
|                      | [▶ thumb] Video Title |                          |
|                      |          Category Name |                          |
|                      +----------------------+                           |
|                                                                         |
+-------------------------------------------------------------------------+
```

Three columns:

1. **Categories** (left, ~25% width): All active categories for the content type. Each item links to the filtered content list.
2. **Promoted content** (centre, ~50% width): Up to 4 promoted items, newest first. The backend sorts by `PublishedAt DESC` and returns all promoted items with no server-side limit — the frontend slices to 4, so the panel shows the 4 most recently published promoted items.
3. **Tags** (right, ~25% width): The 10 most-used tags, fetched from `GET /api/v1/public/tags/popular?limit=10&contentType=Article` for the articles panel and `GET /api/v1/public/tags/popular?limit=10&contentType=Video` for the videos panel. Each panel shows tags ranked by usage count for its own content type. Results are cached server-side for 10 minutes. Clicking a tag links to the filtered articles list (e.g. `/articles?tagSlug=kinshasa`). The videos listing page does not yet support tag filtering, so video tag chips link to the videos listing page directly. A "Voir tout" link at the bottom navigates to the articles or videos listing page respectively.

## Behavior

- Opens on hover over the trigger link
- Stays open while the cursor is anywhere inside the panel
- Closes when the cursor leaves the panel or the user clicks a link
- Built on `@radix-ui/react-navigation-menu` — hover triggers, keyboard navigation, and ARIA roles are handled by the primitive
- Animation: fade-in + slide-down (handled by Radix data attributes + Tailwind `animate-in`/`animate-out`)

## Module Ownership

Each content type is fully self-contained inside its own module. The articles module owns article categories and promoted articles; the videos module owns video categories and promoted videos. Neither module shares category types with the other.

Popular tags are fetched independently per panel. Each module owns its own `IPopularTagEntity` interface and mapper — articles fetches tags filtered by `contentType=Article`, videos fetches tags filtered by `contentType=Video`. The two lists are different and are not shared.

```text
modules/
  articles/             ← owns article categories, promoted articles, article popular tags
    domain/
    infrastructure/
    presentation/
      components/ArticlesMegaMenu/   ← purely presentational, receives props

  videos/               ← owns video categories, promoted videos, video popular tags
    domain/
    infrastructure/
    presentation/
      components/VideosMegaMenu/     ← purely presentational, receives props
```

There are no client-side data fetching hooks in either module. All data is prefetched server-side in the root layout on every request and flows down as props.

## Related Documentation

- [Backend Gap — Public Content Types Endpoint](02-backend-content-types-endpoint.md)
- [API Client Setup](03-api-client-setup.md)
- [Articles Module](04-articles-module.md)
- [Videos Module](05-videos-module.md)
- [NavigationMenu UI Primitive](06-navigation-menu-primitive.md)
- [Mega Menu Components](07-mega-menu-components.md)
- [DesktopNav Refactor](08-desktop-nav-refactor.md)
- [Server Prefetch](09-server-prefetch.md)
