# Responsive Design

## Breakpoints

Use Tailwind's default breakpoints. The 116 audience is primarily mobile (70%+ traffic comes from mobile in the DR and Africa).

| Breakpoint | Min Width | Target |
| --- | --- | --- |
| Default | 0px | Mobile phones (portrait) |
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

## Mobile-First Approach

Always design for mobile first, then add breakpoints for larger screens. Never the other way around.

```html
<!-- Mobile: single column, Tablet: 2 columns, Desktop: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
    ))}
</div>
```

## Layout Patterns

### Content Width

Cap content width to keep text readable. Long lines are hard to read.

```html
<!-- Article body: narrow for readability -->
<article class="max-w-prose mx-auto px-4">
    {body}
</article>

<!-- Grid pages: wider for cards -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {grid}
</section>

<!-- Full-width sections: hero, promoted -->
<section class="w-full">
    {hero}
</section>
```

### Navigation

- **Mobile**: Hamburger icon opens a slide-in drawer from the left with accordion sections for categories and promoted content previews
- **Tablet**: Same drawer pattern as mobile, triggered by hamburger icon
- **Desktop**: Horizontal navbar with mega menu dropdowns on "Articles" and "Vidéos" showing category columns, promoted content thumbnails, and trending tags

See the full navigation documentation in [Layout System](../components/04-layout-system.md).

### Cards

- **Mobile**: Full-width cards stacked vertically, horizontal scroll for promoted
- **Tablet**: 2-column grid
- **Desktop**: 3 or 4 column grid

### Video Player

- **Mobile**: Full-width, 16:9 aspect ratio
- **Desktop**: Centered with sidebar for related content

```html
<div class="aspect-video w-full max-w-4xl mx-auto">
    <iframe src={youtubeUrl} class="w-full h-full rounded-lg" />
</div>
```

## Touch Targets

All interactive elements must be at least 44x44 pixels on mobile. This is an accessibility requirement (WCAG 2.5.8).

```html
<!-- Good: large touch target -->
<button class="min-h-[44px] min-w-[44px] px-4 py-3">
    Like
</button>

<!-- Bad: tiny touch target -->
<button class="px-1 py-0.5 text-xs">
    Like
</button>
```

## Images

Use `next/image` for all images. It handles:

- Lazy loading
- Responsive sizing with `sizes` prop
- WebP/AVIF format negotiation
- Blur placeholder during load

```typescript
import Image from "next/image";

<Image
    src={article.coverImageUrl}
    alt={article.title}
    width={800}
    height={450}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="rounded-lg object-cover"
    priority={isAboveFold}
/>
```

The `sizes` prop tells the browser which size to request based on the viewport. This prevents downloading a 1200px image on a 375px phone.

## Testing Responsive

Test on these real device widths:

- 375px (iPhone SE, most common phone in target market)
- 390px (iPhone 14)
- 768px (iPad Mini)
- 1024px (iPad Pro, small laptops)
- 1440px (standard desktop)

Use Chrome DevTools device toolbar, not just dragging the browser window.
