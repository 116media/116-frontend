# Theming and Design Tokens

## Overview

The frontend uses Tailwind CSS 4 with CSS custom properties (variables) as design tokens. shadcn/ui components consume these tokens, making the entire UI themeable from a single source of truth.

## Design Token Architecture

All design tokens live in CSS variables defined in `src/shared/presentation/styles/globals.css`. Components never use hardcoded colors or spacing. Everything references tokens.

```css
/* globals.css */
@import "tailwindcss";

@layer base {
    :root {
        /* Brand Colors */
        --brand-primary: 73 15 210;       /* #490fd2 - Purple */
        --brand-secondary: 255 116 212;   /* #ff74d4 - Pink */

        /* Neutral Scale */
        --neutral-50: 250 250 250;
        --neutral-100: 245 245 245;
        --neutral-200: 229 229 229;
        --neutral-300: 212 212 212;
        --neutral-400: 163 163 163;
        --neutral-500: 115 115 115;
        --neutral-600: 82 82 82;
        --neutral-700: 64 64 64;
        --neutral-800: 38 38 38;
        --neutral-900: 23 23 23;
        --neutral-950: 10 10 10;

        /* Semantic Colors */
        --success: 29 211 176;            /* #1dd3b0 */
        --error: 239 71 111;             /* #ef476f */
        --warning: 240 127 52;           /* #f07f34 */
        --info: 59 130 246;              /* #3b82f6 */

        /* Surface Colors */
        --background: 255 255 255;
        --foreground: 23 23 23;
        --card: 255 255 255;
        --card-foreground: 23 23 23;
        --muted: 245 245 245;
        --muted-foreground: 115 115 115;
        --border: 229 229 229;
        --input: 229 229 229;
        --ring: 73 15 210;

        /* Typography */
        --font-sans: "Outfit", system-ui, sans-serif;
        --font-mono: "JetBrains Mono", monospace;

        /* Spacing Scale */
        --radius-sm: 0.25rem;
        --radius-md: 0.375rem;
        --radius-lg: 0.5rem;
        --radius-xl: 0.75rem;
        --radius-2xl: 1rem;
        --radius-full: 9999px;

        /* Shadows */
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    }

    .dark {
        --background: 10 10 10;
        --foreground: 250 250 250;
        --card: 23 23 23;
        --card-foreground: 250 250 250;
        --muted: 38 38 38;
        --muted-foreground: 163 163 163;
        --border: 38 38 38;
        --input: 38 38 38;
        --ring: 168 85 247;
    }
}
```

## Why RGB Triplets

The tokens use raw RGB values (`73 15 210`) instead of hex (`#490fd2`) so Tailwind can apply opacity modifiers:

```html
<!-- This works because the token is an RGB triplet -->
<div class="bg-brand-primary/10">
    Semi-transparent brand background
</div>
```

If the token were a hex value, Tailwind could not decompose it to apply `/10` opacity.

## Tailwind Integration

Map the CSS variables to Tailwind utility classes in the CSS file using `@theme`:

```css
@theme {
    --color-brand-primary: rgb(var(--brand-primary));
    --color-brand-secondary: rgb(var(--brand-secondary));
    --color-success: rgb(var(--success));
    --color-error: rgb(var(--error));
    --color-warning: rgb(var(--warning));
    --color-info: rgb(var(--info));
    --color-background: rgb(var(--background));
    --color-foreground: rgb(var(--foreground));
    --color-card: rgb(var(--card));
    --color-card-foreground: rgb(var(--card-foreground));
    --color-muted: rgb(var(--muted));
    --color-muted-foreground: rgb(var(--muted-foreground));
    --color-border: rgb(var(--border));
    --color-input: rgb(var(--input));
    --color-ring: rgb(var(--ring));
    --font-family-sans: var(--font-sans);
    --font-family-mono: var(--font-mono);
    --radius-sm: var(--radius-sm);
    --radius-md: var(--radius-md);
    --radius-lg: var(--radius-lg);
}
```

Then use in components:

```html
<button class="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-lg">
    Watch Now
</button>

<p class="text-muted-foreground text-sm">
    Published 3 days ago
</p>
```

## Matching the Dashboard

The brand colors match the dashboard exactly:

| Token | Dashboard (SCSS) | Frontend (CSS var) | Hex |
| --- | --- | --- | --- |
| Brand Primary | `$brand-primary` | `--brand-primary` | `#490fd2` |
| Brand Secondary | `$brand-secondary` | `--brand-secondary` | `#ff74d4` |
| Success | `$success` | `--success` | `#1dd3b0` |
| Error | `$error` | `--error` | `#ef476f` |
| Warning | `$warning` | `--warning` | `#f07f34` |

The dashboard uses SCSS variables because it is built with Ant Design and Vite. The frontend uses CSS custom properties because Tailwind v4 and shadcn/ui are built around them. The actual color values are identical.

## shadcn/ui Token Mapping

shadcn/ui expects specific token names. The globals.css already defines them (`--background`, `--foreground`, `--card`, `--muted`, `--border`, `--ring`, etc.). When you install a shadcn component, it just works because the tokens are already in place.

## Overriding Per-Section

You can scope theme overrides to specific sections of the page:

```html
<!-- Dark section in a light page -->
<section class="dark bg-background text-foreground">
    <h2 class="text-foreground">Featured Videos</h2>
    <p class="text-muted-foreground">This section has dark styling</p>
</section>
```

The `.dark` class flips the CSS variables, and all child elements automatically adapt.
