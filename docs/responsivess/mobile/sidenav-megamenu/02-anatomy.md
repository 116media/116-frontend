# Anatomy

## Regions

```text
+-----------------------------------------------+  <- Dialog.Content, fixed inset-0
|  [116]  116                              [X]  |  MobileMegaMenu.Header   (pinned)
+-----------------------------------------------+
|   NEWS   VIDÉOS   ARTISTES   LYRICS           |  TabsList                (pinned)
|   ----                                        |  active indicator
+===============================================+
|                                               |  TabsContent             (scrolls)
|  CATÉGORIES                                   |
|  Tout                                    >    |  MegaMenuRow (no count)
|  Actualités                      [24]    >    |  MegaMenuRow
|  Interviews                      [12]    >    |
|  Focus                            [9]    >    |
|                                               |
|  +-----------------------------------------+  |  MobileMegaMenu.Featured
|  | * À LA UNE                 Tout voir >  |  |  (accent tinted panel)
|  | +-------------+  +-------------+        |  |
|  | | [cover]     |  | [cover]     |        |  |  2 cols >= 420px
|  | | Title       |  | Title       |        |  |  1 col below
|  | | meta        |  | meta        |        |  |
|  | +-------------+  +-------------+        |  |
|  +-----------------------------------------+  |
|                                               |
|  TAGS POPULAIRES                              |
|  (#rumba) (#kinshasa) (#afrobeats) ...        |  Tag, shape="pill"
|                                               |
+===============================================+
|  [ Se connecter ]            [sun]  [FR v]    |  MobileMegaMenu.Footer   (pinned)
+-----------------------------------------------+
```

Three bands. The header and the tab list are pinned, the footer is pinned, and only
the panel between them scrolls. That keeps the tab row reachable at any scroll depth,
which is what the artboard's `LazyVStack(pinnedViews:)` note describes.

## Mapping from the artboard

| Artboard class | Here | Note |
| --- | --- | --- |
| `.fmenu` | `Dialog.Content` | The slide container |
| `.fm-top` | `MobileMegaMenu.Header` | Logo + wordmark + close |
| `.fm-search` | — | Dropped, see "Search" |
| `.fm-tabs` | `TabsList` + `TabsTrigger` | Shared primitive, not bespoke markup |
| `.fm-sec` / `.fm-h h3` | `MobileMegaMenu.Section` | Heading + slot |
| `.fm-link` | `MegaMenuRow` | Already carries label, count, chevron |
| `.fm-sec.fm-feat` | `MobileMegaMenu.Featured` | Accent-tinted panel |
| `.fm-cards` | `ArticlesMegaMenuCard.Compact` grid | Responsive 1/2 columns |
| `.fm-tags` / `.btagchip` | `Tag` `shape="pill"` | Same component as `MegaMenuShell` |
| `.fm-foot` | `MobileMegaMenu.Footer` | Auth + `ThemeToggle` + `LanguageDropdown` |
| `.socials` | — | Already in `TopBar` |

## Section content per tab

| Tab | Categories | Featured | Tags |
| --- | --- | --- | --- |
| News | `articles.categories` + "All" row | `articles.promotedArticles` (4) | `articles.popularTags` |
| Vidéos | "All" row + `videos.categories` + "All shows" row | `videos.promotedVideos` (4) | `videos.popularTags` |
| Artistes | — | — | — |
| Lyrics | — | — | — |

Artistes and Lyrics have no prefetched data. Their panels render a single
`MegaMenuRow` that navigates to the listing page and closes the dialog, which keeps
the four-tab row from the artboard honest rather than faking content.

The "All" and "All shows" rows match what `ArticlesMegaMenu.CategoryList` and
`VideosMegaMenu.CategoryList` already render on desktop, so the two surfaces agree.

## Responsive behaviour inside the panel

The panel itself is full-bleed at every width below `md`. Inside it:

| Element | `< 420px` | `>= 420px` |
| --- | --- | --- |
| À la une cards | 1 column | 2 columns |
| Tag cloud | wraps, no cap | wraps, no cap |
| Category rows | full width | full width |
| Footer | auth button full width, controls below | auth button and controls on one row |

`420px` is chosen over Tailwind's `sm` (640px) because the panel is already
full-screen below `md`; a 640px switch would never fire on a phone. Declare it as a
custom screen (see 06).

## Search

The artboard pins a search field under the header. There is no search endpoint in the
generated client and no search route in `app/`, so shipping the field would be a
control that does nothing — the same defect as `MobileNav`'s current `SearchIcon`
button. It is specified here so it can be added later without relayout:

```tsx
// MobileMegaMenu.Header, once a search route exists
<div className="px-4 pb-2">
    <FloatingField
        type="search"
        id="mobile-menu-search"
        label={t("navigation.mobileMenu.searchLabel")}
    />
</div>
```

Until then the header is logo + close only.
