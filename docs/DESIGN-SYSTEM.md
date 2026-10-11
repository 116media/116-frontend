# 116 Frontend Design System

What the product actually renders today, read from the source and from the running app at
1440 / 768 / 390 in both themes. It is a description, not a proposal: where the code and the
rendered UI disagree, that is recorded under [Findings](#findings) rather than smoothed over.

## Source of truth

Tokens live in CSS, not in a config file. Three layers, in dependency order:

| Layer | File | Holds |
| --- | --- | --- |
| Primitive | `styles/colors.css` | Raw hex and the slate ramp. Never referenced from a component. |
| Semantic | `styles/theme.css` | `--background`, `--primary`, `--border` … defined twice: `:root` and `.dark`. |
| Tailwind | `styles/theme.css` `@theme` | Maps each semantic variable to a `--color-*` utility. |

A component uses the Tailwind utility (`bg-card`, `text-muted-foreground`). It never uses a
primitive and never a raw hex, because only the semantic layer is redefined under `.dark` —
reaching past it is how a component ends up light-only.

Dark mode is a class on `<html>`, declared through `@custom-variant dark (&:where(.dark, .dark *))`
and driven by `next-themes`.

## Color

### Brand

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `primary` | `#490fd2` | `#490fd2` | Primary action, focus ring, light-mode links |
| `secondary` | `#ff74d4` | `#ff74d4` | Dark-mode links and accents, secondary CTA |
| `brand-bg-light` / `brand-bg-dark` | `#dce0e5` | `#34384d` | The top-bar gradient and muted surfaces |

Primary and secondary are fixed across themes; what changes is which one carries emphasis.
Several components encode that switch inline (`text-primary dark:text-secondary`), which is the
convention to follow for any new accent.

### Surfaces

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#ffffff` | slate-900 |
| `card` / `popover` | `#ffffff` | slate-800 |
| `dialog` | `#ffffff` | slate-900 |
| `surface-raised` | slate-50 | slate-800 |
| `surface-hover` | slate-200 | slate-700 |
| `mega-menu` / `mega-menu-cards` | slate-50 / slate-100 | slate-800 / slate-900 |
| `sidebar` | slate-50 | slate-800 |
| `border` / `input` | `#eef1f6` | `#222a3b` |

Light mode separates surfaces with borders; dark mode separates them by stepping along the slate
ramp. A surface added to one theme only will look flat in the other.

### Text

| Token | Value | Role |
| --- | --- | --- |
| `foreground` | `#111827` / `#f9fcff` | Body and headings |
| `title` | `#5e6275` | Section labels |
| `description` | `#9295a2` | Card summaries |
| `text-muted` | `#9ca3af` | Timestamps, counters |
| `muted-foreground` | `#9295a2` / `#9ca3af` | Secondary copy inside components |

### Status and social

`success #1dd3b0` · `destructive #ef476f` · `warning #f07f34`, each paired with white foreground.
Seven brand-locked social colors (`social-youtube` … `social-google`) exist so share affordances
keep their platform identity in both themes.

### Contrast

Measured against WCAG AA for body text (4.5:1).

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `foreground` on `background`, light | 17.74 | pass |
| `foreground` on `background`, dark | 17.34 | pass |
| `primary` as link on white | 9.20 | pass |
| `secondary` as link on dark | 7.40 | pass |
| `title` on white | 6.03 | pass |
| white on `primary` | 9.20 | pass |
| `description` on white | **2.98** | fail |
| `text-muted` on white | **2.54** | fail |
| white on `destructive` | **3.62** | large text only |
| white on `warning` | **2.70** | fail |
| white on `secondary` | **2.41** | fail |
| white on `success` | **1.91** | fail |

The dark palette is sound. The light palette fails on every muted text token and on four of the
five filled-badge pairings — `success` and `secondary` are the worst, and both are used behind
white label text today.

## Typography

Three families, loaded through `next/font/local` and exposed as `--font-sans`, `--font-serif`,
`--font-article`:

- **Outfit** (`font-sans`) — all UI: nav, labels, buttons, metadata
- **Playfair Display** (`font-serif`) — article and section headings
- **Merriweather** (`font-article`) — long-form article body

There is no project type scale; sizes come from Tailwind defaults at each call site.

## Shape, space, layout

- Radius derives from one value: `--radius: 0.5rem`, giving `sm` 4px, `md` 8px, `lg` 12px, `xl` 16px
- Spacing is the stock Tailwind 4px scale
- Two layout extensions: `--container-8xl: 96rem` and a `--breakpoint-3xl: 120rem` tier
- Breakpoints are Tailwind defaults; **`md` (768px) is the real layout switch** — it is where the
  primary navigation appears

## Motion

Named animations declared in `@theme`, so they are referenced as utilities rather than re-authored:

| Animation | Duration / easing |
| --- | --- |
| `mega-menu-slide-down` / `-up` | 0.2s ease-out / 0.2s ease-in |
| `dialog-overlay-in` / `-out` | 0.2s ease-out / 0.15s ease-in |
| `dialog-in` | 0.28s `cubic-bezier(0.16, 1, 0.3, 1)` |
| `dialog-out` | 0.2s ease-in |
| `dialog-shake` | 0.4s ease-in-out, for form rejection |
| `short-like-burst` | 0.6s ease-out |

Dialogs are flex-centered rather than transform-centered specifically so `transform` stays free
for the enter slide and the shake.

## Components

**36 UI primitives** (`shared/presentation/components/ui`): Alert, Avatar, Badge, Button,
ButtonGroup, Card, Carousel, CarouselDots, Checkbox, ConfirmDialog, CountrySelect, Dialog,
DropdownMenu, EmptyState, FeedError, FloatingField, Icon, InfiniteScrollFooter, Input,
Md3Carousel, ModalForm, NavigationMenu, NoiseBackground, OtpInput, Progress, Prose, RelativeDate,
SectionHeader, Separator, Skeleton, StarRating, StateRenderer, Tabs, Tag, Textarea, Toaster.

**8 composed common components**: FavoriteCard, LanguageDropdown, ShareModal, SocialShareGroup,
ThemeToggle, UserAccountControl, UserAvatar, VideoPlayer.

**7 layout shells**: AppShell, TopBar, Header, DesktopNav, MegaMenuShell, PageContainer,
FavoriteLayout.

**Module components**: videos 84, articles 78, shorts 22, settings 12, auth 8.

Variants are declared with `cva`, which makes the variant list the component's public API:

| Component | Variants | Sizes |
| --- | --- | --- |
| `Button` | default, destructive, outline, brand-outline, secondary, ghost, link | default (h-9), sm (h-8), lg (h-10), icon (9×9) |
| `Badge` | default, secondary, destructive, outline | — |
| `Tag` | default, outline, primary, secondary, ghost | sm, md, lg · shape: pill, rounded |

Every interactive primitive carries `focus-visible:ring-2 focus-visible:ring-ring`, and `Button`
carries `disabled:opacity-50` with `disabled:cursor-not-allowed`.

## Patterns

- **Feed state** — `StateRenderer` switches between `Skeleton`, `FeedError`, `EmptyState` and
  content; `InfiniteScrollFooter` terminates the list ("Vous êtes à jour")
- **Card anatomy** — media, category `Tag`, `RelativeDate`, title, excerpt, then a metric row of
  comments / likes / shares
- **Mega menu** — `NavigationMenu` trigger opens `MegaMenuShell`: a categories column plus a
  featured grid, on its own surface tokens
- **Dialogs** — `Dialog` → `ModalForm` → `ConfirmDialog`, sharing the overlay and shake animations
- **Theme and language** — `ThemeToggle` and `LanguageDropdown` sit in the header on every
  breakpoint

## Findings

Ordered by severity. Each was observed in the running app.

1. **No mobile navigation.** `DesktopNav` is `hidden … md:flex` and no `MobileNav`, drawer or
   hamburger exists. Below 768px, NEWS / VIDEOS / LYRICS / ARTISTES are unreachable — a probe of
   the header at 390px finds only the theme toggle, the language switch and the sign-in button.
   Search is rendered but `hidden` at that width too.
2. **Light-mode contrast.** `description` (2.98) and `text-muted` (2.54) fail AA for body text,
   and white-on-`success` (1.91), white-on-`secondary` (2.41), white-on-`warning` (2.70) fail for
   badge labels. Darkening the muted pair and using a dark foreground on the pastel status colors
   fixes both groups without touching brand identity.
3. **Authenticated calls run for anonymous visitors.** Every page load fires
   `/public/me/profile` (401) and `/public/sessions/refresh-token` (403). Harmless but constant
   console noise, two wasted round trips per navigation, and it masks real auth failures.
4. **Articles feed renders one card in a four-column grid**, leaving three-quarters of the row
   empty, and that card shows "0 min de lecture" with a placeholder image. The hero and sidebar
   above it are full, so the page reads as broken rather than empty.
5. **Mega menu layout.** The "CATÉGORIES" column renders empty, and the panel stops short of the
   container width, leaving a dead band on the right.
6. **Inconsistent card anatomy inside one grid.** In the mega menu's featured grid, one card puts
   the title under the media and the next puts it above; their CTAs differ too — filled primary
   against outline secondary — so the two read as different levels of importance when they are not.
7. **No type scale.** With three families and no shared scale, heading sizes are chosen per call
   site, which is where drift starts.
