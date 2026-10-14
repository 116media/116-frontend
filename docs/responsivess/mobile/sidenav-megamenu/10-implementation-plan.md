# Implementation plan

Ordered so the tree compiles after every step. One file per commit, as usual.

## 1. Tokens and keyframes

- `globals.css`: add `@keyframes sheet-in-left` and `sheet-out-left`
- `theme.css` `@theme`: add `--animate-sheet-in-left`, `--animate-sheet-out-left`
- `theme.css` `@theme`: add `--breakpoint-xs: 26.25rem`
- Confirm the `prefers-reduced-motion` guard exists in `globals.css`

## 2. Shared primitive changes

- `Button`: add the `icon-lg` size to the cva
- `ThemeToggle`: accept an optional `size`, default `icon`
- `LanguageDropdown`: accept an optional `size`, default `icon`
- `MegaMenuRow`: add `onNavigate?: () => void`, add `"use client"`
- `UserAccountControl`: accept an optional `onNavigate`, forwarded to the menu links

Each is additive with a default, so no existing call site changes.

## 3. i18n

- `navigation.ts` in `fr` and `en`: add the `mobileMenu` block from 08
- Both barrels already register `navigation`, nothing to wire

## 4. The compound

In this order, so each file's imports already exist:

1. `MobileMegaMenu/types.ts`
2. `MobileMegaMenu/constants.ts`
3. `MobileMegaMenu/MobileMegaMenu.Section.tsx`
4. `MobileMegaMenu/MobileMegaMenu.Featured.tsx`
5. `MobileMegaMenu/MobileMegaMenu.Tags.tsx`
6. `MobileMegaMenu/MobileMegaMenu.Header.tsx`
7. `MobileMegaMenu/MobileMegaMenu.Footer.tsx`
8. `MobileMegaMenu/index.ts`

## 5. The module panels

- `articles/.../ArticlesMobileMenu/` with its `types.ts` and barrel
- `videos/.../VideosMobileMenu/` with its `types.ts` and barrel

## 6. The root

- `MobileMegaMenu/MobileMegaMenu.tsx`, including the swipe handlers
- Re-export it from `MobileMegaMenu/index.ts`

## 7. Wire-up and removal

- `Header.tsx`: swap the trigger, hide theme/language below `md`
- Delete `layouts/MobileNav/`

## 8. Verify

Run, do not assume:

```bash
npx tsc --noEmit -p tsconfig.json
npx biome check --write src app
```

Then in the browser at 390px, 420px and 768px:

| Check | Expected |
| --- | --- |
| Header below `md` | hamburger, logo, auth only |
| Tap hamburger | panel slides in from the left, not up |
| Tab row | four tabs, News active, indicator under it |
| Switch tabs | panel content slides in the travel direction |
| News panel | "All" row, then every category with its count |
| Featured | 1 column at 390px, 2 at 420px |
| Tags | wrap, capped at 16, each links to `?tagId=` |
| Footer | auth left, theme and language right, language opens upward |
| Tap any row | navigates and the panel is closed on arrival |
| Swipe left > 120px | closes; shorter drag springs back |
| `Escape` | closes, focus back on the hamburger |
| 768px | panel unreachable, `DesktopNav` unchanged |

Contrast, measured not eyeballed, per 07:

- `text-muted-foreground` on `bg-background`, both themes
- `text-primary` on `bg-primary/5` (light)
- `text-secondary` on `bg-secondary/10` (dark)

## Acceptance criteria

1. Every category, promoted card and popular tag reachable on desktop is reachable at 390px.
2. The panel travels on X, both directions, and respects reduced motion.
3. No navigation leaves the panel open over the destination.
4. Every interactive target is at least 44px.
5. All copy switches with the language; no hardcoded strings remain in the surface.
6. `DesktopNav` renders byte-identically at and above `md`.
7. No new network call: `prefetchNavigationUseCase` still runs exactly once per request.

## Optional follow-up

Not in scope, listed so it is not lost:

- `NAV_LINKS` in `layouts/Header/constants.ts` hardcodes its four labels as literals
  rather than i18n keys, so `DesktopNav` does not translate them. Aligning it to the
  `navigation.mobileMenu.*` keys would let both navs share one source.
- A search field in the panel header, once a search route and endpoint exist (02).
- "Les plus lus" / "Tendances" rows from the artboard, once a popular endpoint is
  wired for this surface.
