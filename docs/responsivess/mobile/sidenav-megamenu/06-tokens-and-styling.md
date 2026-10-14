# Tokens and styling

Every colour below is an existing semantic token used through its Tailwind utility.
No new colour is introduced, no hex is written in a component, nothing reaches past
the semantic layer into `--primitive-*`.

## Surfaces

| Region | Utility | Light | Dark |
| --- | --- | --- | --- |
| Overlay | `bg-black/60 backdrop-blur-sm` | black 60% | black 60% |
| Panel | `bg-background` | `--primitive-white` | `--primitive-neutral-900` |
| Tab list underline | `border-outlined` | `--primitive-border-subtle-light` | `--primitive-border-subtle-dark` |
| Row separator | `border-outlined/50` | same at 50% | same at 50% |
| Featured block | `bg-primary/5 dark:bg-secondary/10` | brand violet tint | brand pink tint |
| Footer divider | `border-outlined` | as above | as above |

The featured block follows the accent-switches-by-theme rule from `AGENTS.md`:
primary carries emphasis in light, secondary in dark. It is the same relationship as
`.fm-feat { background: var(--b-accent-soft) }` in the artboard, expressed in tokens.

## Text

| Element | Utility |
| --- | --- |
| Section heading | `font-bold text-muted-foreground text-xs uppercase tracking-wider` |
| Featured heading | `font-bold text-primary text-xs uppercase tracking-wider dark:text-secondary` |
| Category row label | `font-medium text-foreground text-xs lg:text-sm` (from `MegaMenuRow`) |
| Row count | `font-semibold text-muted-foreground text-sm tabular-nums` (from `MegaMenuRow`) |
| Tab trigger | `tabsTriggerVariants({ size: "md" })` + `uppercase tracking-wide` |
| Wordmark | `font-bold text-lg tracking-wide` |

The section heading matches the mega menu's column headings exactly, so the two
surfaces read as the same menu.

## Spacing

| Token | Value | Used for |
| --- | --- | --- |
| `px-4` | 16px | Panel gutter, every region |
| `py-3` | 12px | Header and footer rows |
| `py-4` | 16px | Section vertical rhythm |
| `gap-3` | 12px | Section heading to body, card grid |
| `gap-2` | 8px | Tag cloud |
| `p-4` | 16px | Featured block padding |
| `mx-4` | 16px | Featured block inset, so it reads as a panel inside the gutter |

16px matches `.fm-sec { padding: 16px 16px 4px }` in the artboard and the `px-4` the
rest of the app uses at phone width.

## The `xs` breakpoint

The card grid switches at 420px, below Tailwind's smallest default (`sm` = 640px).
Because the panel is full-screen under `md`, a 640px switch would never fire on a
phone. Register the screen once in `theme.css`:

```css
@theme {
    /* Phone-only switch: the mobile menu is full-screen below `md`, so its
       internal two-column grids need a breakpoint inside phone widths. */
    --breakpoint-xs: 26.25rem; /* 420px */
}
```

Then `grid-cols-1 xs:grid-cols-2` works as written in 03.

If adding a breakpoint is unwanted, the fallback is
`grid-cols-[repeat(auto-fill,minmax(150px,1fr))]`, which needs no token but gives up
control of the exact switch point.

## Touch targets

`AGENTS.md` and the artboard both require 44px minimum. Audit:

| Control | Height | Source |
| --- | --- | --- |
| Hamburger | 36px (`size="icon"` = `h-9 w-9`) | **Fails** |
| Close | 36px | **Fails** |
| Category row | 52px (`p-3` + content) | Passes |
| Tab trigger | 30px (`size="md"` = `py-1.5 text-sm`) | **Fails** |
| Tag pill | 28px (`size="lg"`) | **Fails** |
| Theme toggle | 36px | **Fails** |

Four of six miss. Rather than overriding each call site, add an `icon-lg` size to the
`Button` cva and let the mobile surfaces opt in — a variant on the component, not a
one-off `className`, per `AGENTS.md`:

```ts
size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
    "icon-lg": "h-11 w-11"
}
```

For the tab row and the tag cloud, pad in the panel rather than changing the shared
scale, since both components are tuned for dense desktop columns:

```tsx
<TabsTrigger className="min-h-11 flex-1 uppercase tracking-wide" ... />
<Tag className="min-h-11 px-3" ... />
```

`min-h-11` is 44px. See 07 for the full audit.

## Dark mode

Every utility above is a token that is redefined under `.dark`, so the panel has no
`dark:` overrides except the two accent switches (`dark:bg-secondary/10`,
`dark:text-secondary`), which are the documented accent-by-theme pattern rather than
a theme patch.
