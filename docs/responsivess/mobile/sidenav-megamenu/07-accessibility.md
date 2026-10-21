# Accessibility

## Dialog semantics

Radix `Dialog` supplies `role="dialog"`, `aria-modal="true"`, the focus trap, focus
restore to the trigger on close, `Escape` handling and inert background content. Two
things it does not supply and we must:

```tsx
<DialogPrimitive.Title className="sr-only">
    {t("navigation.mobileMenu.title")}
</DialogPrimitive.Title>
```

A `Dialog` with no accessible name is announced as "dialog" and nothing else. The
title is visually hidden because the header already shows the brand mark, and a
second visible heading would be redundant for sighted users.

```tsx
<DialogPrimitive.Content aria-describedby={undefined}>
```

Without this Radix logs a development warning for the missing `Description`. The
panel has no descriptive paragraph by design, so the correct fix is to opt out, not
to invent copy.

## Tabs

`Tabs` is Radix-backed, so `role="tablist"`, `role="tab"`, `aria-selected`,
`aria-controls`, `role="tabpanel"` and roving-tabindex arrow-key movement all come for
free. The `TabsList` needs a label, since "News / Vidéos / Artistes / Lyrics" is one
of several possible tab groups on the page:

```tsx
<TabsList aria-label={t("navigation.mobileMenu.sections")} ... >
```

## Touch targets

`AGENTS.md` requires 44px. Audited against the real class strings:

| Control | Before | After | Fix |
| --- | --- | --- | --- |
| Hamburger trigger | 36px | 44px | `size="icon-lg"` |
| Close button | 36px | 44px | `size="icon-lg"` |
| Tab trigger | 30px | 44px | `min-h-11` |
| Category row | 52px | 52px | none needed |
| Featured card | > 44px | — | none needed |
| "Tout voir" link | 16px | 44px | `min-h-11 items-center` |
| Tag pill | 28px | 44px | `min-h-11 px-3` |
| Theme toggle | 36px | 44px | `size="icon-lg"` |
| Language dropdown | 36px | 44px | `size="icon-lg"` |

`ThemeToggle` and `LanguageDropdown` hardcode `size="icon"` internally. Rather than
forking them, give each an optional `size` prop defaulting to `icon`, so the header
keeps its compact control and the mobile footer opts into the larger target. That is a
variant on the component, which is what `AGENTS.md` asks for.

## Contrast

Every pairing uses tokens that already meet AA, with one to verify:

| Pair | Where | Status |
| --- | --- | --- |
| `text-foreground` on `bg-background` | row labels | passes, measured 14.8:1 |
| `text-muted-foreground` on `bg-background` | headings, counts | **verify** |
| `text-primary` on `bg-primary/5` | featured heading, light | **verify** |
| `text-secondary` on `bg-secondary/10` | featured heading, dark | **verify** |

`AGENTS.md` warns that the light palette already fails on `description` and
`text-muted` and says not to add to that set. The featured block is a new pairing, so
measure it before shipping. The method used elsewhere in this repo: screenshot the
element with Playwright, decode the PNG, sample the composited pixels, compute the
ratio. Do not eyeball it.

If `text-primary` on `bg-primary/5` falls short, the fix is to darken the text, not to
lighten the tint, since the tint also sits behind card surfaces.

## Keyboard

| Key | Result |
| --- | --- |
| `Tab` | Close, then tab list, then panel content, then footer |
| `Arrow Left` / `Right` | Move between tabs (Radix roving focus) |
| `Enter` / `Space` on a tab | Activate the panel |
| `Escape` | Close, focus returns to the hamburger |

The drag handlers must not swallow keyboard events: they are bound to pointer events
only, and `pointerType === "mouse"` is ignored, so keyboard and assistive-tech
interaction is untouched.

## Screen reader pass

The panel should read as: dialog name, then "tab list, News selected, 1 of 4", then
the panel's section headings as `h3`, then each row as a link with its label and count.
`MegaMenuRow` renders the count inside the same `Link`, so "Actualités 24" is
announced as one name, which is correct.

Icons: every decorative `svg` in the snippets in 03 carries `aria-hidden="true"`, and
every icon-only button carries `aria-label`.
