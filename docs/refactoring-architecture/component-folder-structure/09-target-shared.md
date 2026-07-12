# 09 — Target Structure: shared

`shared/presentation/components/` holds the cross-feature library. `ui/` carries the
primitives; `common/` holds the composed shared components as a **flat** list of component
folders (few enough that kind sub-buckets would add noise, not navigability).

```
shared/presentation/components/
├── ui/                     # shadcn primitives — each already its own flat/compound folder
│   ├── Button/  Input/  Dialog/  Tabs/  Card/  Badge/  Tag/  Skeleton/  Prose/
│   ├── StarRating/  RelativeDate/  EmptyState/  SectionHeader/  Progress/  Separator/
│   ├── Checkbox/  Textarea/  OtpInput/  FloatingField/  ModalForm/  ConfirmDialog/
│   ├── CountrySelect/  DropdownMenu/  NavigationMenu/  Carousel/  CarouselDots/  Md3Carousel/
│   ├── Alert/  Avatar/  Toaster/  Icon/  ButtonGroup/
│   └── …  (Tabs / Carousel: extract their context + hook + cva to sibling files — see architecture C5)
├── common/
│   ├── VideoPlayer/                                      ← SHARED LIBRARY (R10a), COMPOUND
│   │   ├── VideoPlayer.tsx
│   │   ├── VideoPlayer.Plyr.tsx
│   │   ├── VideoPlayer.Poster.tsx
│   │   ├── video-plyr.css
│   │   └── index.ts
│   ├── SocialShareGroup/        { SocialShareGroup.tsx · types.ts · index.ts }
│   ├── UserAvatar/              { UserAvatar.tsx · index.ts }
│   ├── UserAccountControl/      { UserAccountControl.tsx · index.ts }
│   ├── ThemeToggle/             { ThemeToggle.tsx · variants.ts · index.ts }   (variants.ts = R13 carve-out)
│   └── LanguageDropdown/                                 ← COMPOUND
│       ├── LanguageDropdown.tsx
│       ├── LanguageDropdown.Menu.tsx
│       ├── types.ts
│       └── index.ts
├── layouts/                # Header, Footer, Navigation (DesktopNav, MegaMenuShell), sidebars
├── providers/  hooks/  styles/  utils/  constants/  i18n/
```

## VideoPlayer is a shared library — placed now (R10a)

`VideoPlayer` (+ `.Plyr` + `.Poster` + `video-plyr.css`) lives in
`shared/presentation/components/common/VideoPlayer/` **from the start**, not in the
videos module. Rationale:

- It is **entity-agnostic** — its props are `youtubeVideoUrl` / `thumbnailUrl` / `title`
  only; it knows nothing about a "video detail" entity.
- It is **designed for cross-feature reuse** — shorts playback, promoted-ad video previews,
  home/feed embeds all consume the same player.
- Naming drops the `VideoDetail` prefix that was hiding it: it is `VideoPlayer`, a media
  primitive, and it stays a **compound** folder (the Plyr embed and poster fallback are its
  intrinsic parts).

Consumers import it from `@/shared/presentation/components/common/VideoPlayer`. The
`VideoDetail` assembler composes it like any other shared primitive.

## Promotion candidates (still module-local until a 2nd importer — R10)

These are generic today but imported by only one module, so they stay put until a second
module needs them; listed here so the target home is known:

| Component | Current | Target on promotion |
|---|---|---|
| `SettingsCard` | `settings/cards/` | `shared/common/…/cards/` |
| `AccountActionCard` | `settings/cards/` | `shared/common/…/cards/` |
| `DetailField` | `settings/fields/` | `shared/common/…/fields/` |

## `useToggle` promotion (done as part of this work)

`useToggle` (a generic optimistic-toggle hook, its own JSDoc calls it "Shared") moves from
`modules/articles/presentation/hooks/` to `shared/presentation/hooks/` (architecture M4).

## `common/` layout

`common/` stays a **flat** list of PascalCase component folders — six components don't need
kind sub-buckets. If it grows past the point of easy scanning, revisit bucketing then.
