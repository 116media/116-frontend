# Overview

## The problem

`DesktopNav` carries `hidden items-center gap-1 md:flex`, so below `768px` the two
mega menus are not rendered. What a phone user loses:

- every article and video category, with its published count
- the "À la une" promoted cards
- the popular tag cloud
- the "All" and "All shows" entries added to the menus

`MobileNav` replaces all of that with the four `NAV_LINKS` and a `SearchIcon` button
that has no handler.

## The design source

Canvas **116 iOS App**, artboard `I-Menu.dc.html` ("Menu plein écran"), with
`IS-DarkMenu.dc.html` for the dark treatment. Its own note states the intent:

> Full-screen menu = the web mega menu on mobile. Pinned: logo + close, search field,
> then 4 tabs News · Vidéos · Artistes · Lyrics (no Shorts). Each tab mirrors its
> mega-menu column set: categories / collections with counts, an emphasised ★ À la une
> block of 4 cards, Les plus lus / Tendances, popular tags; account, theme, language
> and socials at the bottom.

The canvas is an **iOS** prototype. It is the layout reference, not the
implementation reference: we keep web primitives and web tokens throughout.

## Scope

In scope:

- a full-screen left-anchored panel, open and close animated, swipe to close
- the hamburger as its only trigger
- the four sections on the shared `Tabs` primitive
- category rows, À la une cards and popular tags reused from the mega menu
- the existing `ThemeToggle` and `LanguageDropdown` in the footer
- trimming the header below `md`

Out of scope:

- the search field (no search endpoint exists; see 02, "Search")
- "Les plus lus" / "Tendances" rows (no popular endpoint wired for this surface)
- the socials row (already in `TopBar`)
- anything at or above `md`, which keeps `DesktopNav` unchanged

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| D1 | One panel for all four sections, not one drawer per nav item | Matches the artboard; a single `Dialog` keeps one focus trap and one open state |
| D2 | Sections ride the shared `Tabs` primitive | Explicit user instruction; `Tabs` already gives the sliding indicator, direction-aware panel transition and Radix roving focus |
| D3 | Artistes and Lyrics are tabs with a link-only panel | They have no mega menu data; a tab that navigates and closes keeps the four-tab row from the artboard without inventing content |
| D4 | Category rows reuse `MegaMenuRow` verbatim | Already extracted this session, already carries the count and chevron |
| D5 | À la une reuses `ArticlesMegaMenuCard.Compact` / `VideosMegaMenuCard.Compact`, not the Featured variants | Featured variants are fixed-height (`grid-rows-[288px]`) and assume a two-column desktop grid |
| D6 | Footer keeps `ThemeToggle` + `LanguageDropdown` as they are | Explicit user instruction, overriding the artboard's segmented controls |
| D7 | New `MobileMegaMenu` lives in `shared/presentation/layouts/` | It composes two modules' menus, as `Header` and `DesktopNav` already do |
| D8 | `MobileNav` is deleted, not extended | Its link list and dead search button are both replaced; keeping it would leave two mobile navs |

## Breakpoint contract

| Range | Navigation |
| --- | --- |
| `< md` (under 768px) | Hamburger opens `MobileMegaMenu`; header shows logo and auth control only |
| `>= md` | `DesktopNav` with hover mega menus, unchanged |

The panel is never mounted at or above `md`: the trigger itself is `md:hidden`, which
keeps the dialog out of the desktop tree entirely.
