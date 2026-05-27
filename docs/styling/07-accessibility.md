# Accessibility

## Why It Matters

The 116 audience includes users across the DR and Africa with varying devices, connection speeds, and abilities. Accessibility is not optional. It also directly impacts SEO: Google uses Core Web Vitals and accessibility signals in rankings.

## WCAG 2.1 AA Targets

The frontend should meet WCAG 2.1 Level AA. The most impactful requirements for this project:

### Color Contrast

- **Normal text**: Minimum 4.5:1 contrast ratio against background
- **Large text** (18px+ or 14px+ bold): Minimum 3:1 contrast ratio
- **UI components** (buttons, inputs, icons): Minimum 3:1 contrast ratio

The brand primary `#490fd2` on white has a 7.2:1 ratio (passes AAA). The muted-foreground `#737373` on white has a 4.6:1 ratio (passes AA). These were chosen deliberately.

Test contrast with: https://webaim.org/resources/contrastchecker/

### Keyboard Navigation

Every interactive element must be reachable and operable with keyboard only:

- `Tab` moves focus forward
- `Shift+Tab` moves focus backward
- `Enter` or `Space` activates buttons and links
- `Escape` closes modals, dropdowns, and menus
- Arrow keys navigate within menus, tabs, and carousels

shadcn/ui components (built on Radix UI) handle most keyboard interactions out of the box. Do not override them.

### Focus Indicators

Always show a visible focus ring on keyboard navigation. Never remove outlines globally.

```css
/* Good: visible focus ring using brand color */
:focus-visible {
    outline: 2px solid rgb(var(--ring));
    outline-offset: 2px;
}

/* Bad: removes focus for everyone */
*:focus {
    outline: none;
}
```

Tailwind handles this with `focus-visible:ring-2 focus-visible:ring-ring`.

### Semantic HTML

Use the right elements:

```html
<!-- Good -->
<nav aria-label="Navigation principale">
<main>
<article>
<aside>
<footer>
<button type="button">
<a href="/articles">

<!-- Bad -->
<div onClick={...}>  <!-- Not a button -->
<div class="nav">    <!-- Not semantic -->
<span role="link">   <!-- Just use <a> -->
```

### Images

Every `<img>` and `next/image` must have meaningful alt text:

```typescript
// Informative image
<Image src={article.coverImageUrl} alt={`Photo de couverture: ${article.title}`} />

// Decorative image (adds no information)
<Image src="/pattern.svg" alt="" aria-hidden="true" />

// Avatar
<Image src={author.avatarUrl} alt={`Photo de profil de ${author.userName}`} />
```

### ARIA Labels

Add labels to interactive elements that lack visible text:

```html
<!-- Icon-only button -->
<button aria-label="Aimer cet article">
    <HeartIcon />
</button>

<!-- Search input -->
<input type="search" aria-label="Rechercher des articles" placeholder="Rechercher..." />

<!-- Navigation sections -->
<nav aria-label="Navigation principale">
<nav aria-label="Pagination">
<nav aria-label="Fil d'Ariane">
```

### Skip Navigation

Add a skip link as the first focusable element on every page:

```typescript
// In the root layout or header
<a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:rounded-lg focus:ring-2"
>
    Aller au contenu principal
</a>

// On the main content area
<main id="main-content">
```

### Reduced Motion

Respect users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

In Tailwind, use the `motion-reduce:` prefix:

```html
<div class="transition-transform duration-300 motion-reduce:transition-none">
```

## Testing Accessibility

### Manual Testing

1. Navigate the entire site using only the keyboard
2. Use a screen reader (VoiceOver on Mac: `Cmd+F5`)
3. Zoom to 200% and verify nothing breaks
4. Test with high contrast mode enabled

### Automated Testing

- **axe DevTools** browser extension for runtime checks
- **Lighthouse** accessibility audit in Chrome DevTools
- **eslint-plugin-jsx-a11y** for catching issues at lint time (if using ESLint alongside Biome)

### Target Score

Lighthouse Accessibility: 95+ on every public page.
