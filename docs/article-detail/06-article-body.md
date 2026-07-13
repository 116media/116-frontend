# The Article Body

`ArticleDetailDto.body` is *"the full rich-text HTML body"* — a string of markup produced
by the editor (headings, paragraphs, images, blockquotes, lists, links, embeds). Rendering
it safely and beautifully is two concerns, split into two pieces:

1. A **shared `Prose` container** — the typographic wrapper that styles whatever HTML
   lands inside it.
2. **`ArticleDetail.Body`** — sanitizes the HTML, then injects it into `Prose`.

The `kinix_frontend` reference injects the body with a raw `dangerouslySetInnerHTML` and no
sanitization — an XSS hole. **We never do that.** The body is sanitized on every render,
server and client.

---

## The `Prose` container

`src/shared/presentation/components/ui/Prose/` — none exists. It is a typographic wrapper
that gives child HTML a consistent reading scale in both light and dark mode, using theme
tokens throughout.

> **No `@tailwindcss/typography` plugin is installed** (checked: `globals.css` imports only
> `tailwindcss`, `fonts.css`, `theme.css` — no `@plugin`, no `prose` utility). So `Prose`
> **cannot** lean on a `prose` class; it declares an **explicit curated set** of
> descendant typographic classes with Tailwind's arbitrary-variant selectors
> (`[&_h2]:…`, `[&_p]:…`, `[&_img]:…`). If the typography plugin is added later, this
> container can collapse to the `prose` utility — but the contract (a single wrapper) stays
> the same.

What `Prose` styles:

| Element | Treatment |
|---|---|
| `h2` / `h3` | `font-bold`, stepped sizes, `text-foreground`, top margin for rhythm |
| `p` | `leading-relaxed`, `text-foreground`, paragraph spacing |
| `a` | `text-primary underline underline-offset-4 hover:text-primary/80` |
| `img` | `w-full h-auto rounded-lg my-6` — responsive, rounded, never overflowing |
| `blockquote` | left `border-l-4 `, `pl-4 italic text-muted-foreground` |
| `ul` / `ol` | list markers, `pl-6`, item spacing |
| `iframe` / embeds | `w-full aspect-video rounded-lg` — responsive video/embeds |
| `hr` | `` |

```tsx
/**
 * Prose
 *
 * @description
 * A typographic container for rendered rich-text HTML. Applies a curated set of
 * descendant styles (headings, paragraphs, links, images, blockquotes, lists, embeds)
 * using theme tokens so the content reads consistently in light and dark mode. Images
 * are full-width, auto-height and rounded; iframes are responsive. No global prose
 * plugin is required.
 */
export function Prose({ className, children, ...props }: ProseProps) {
    return (
        <div
            className={cn(
                "max-w-none text-foreground",
                "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-bold [&_h2]:text-2xl",
                "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-bold [&_h3]:text-xl",
                "[&_p]:my-4 [&_p]:leading-relaxed",
                "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
                "[&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg",
                "[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-lg",
                "[&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
                "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
                "[&_hr]:my-8 ",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
```

`Prose` is content-agnostic — it will also style the comment body or any other server HTML,
so it lives in `shared`, not the `articles` slice.

---

## `ArticleDetail.Body` — sanitize, then render

The body is:

1. **Sanitized** with **`isomorphic-dompurify`** (chosen for SSR + client parity — the
   article page is server-rendered for SEO, so the sanitizer must run in Node too; a
   browser-only DOMPurify would throw during the RSC render). Run
   `npm show isomorphic-dompurify dist-tags.latest` before pinning — noted in the spec's
   tasks.
2. **Injected** into `Prose` via `dangerouslySetInnerHTML` — **only after** sanitization,
   never the raw string.

### Sanitizer configuration

DOMPurify is configured to **allow** the tags the editor emits and **strip** anything that
can execute:

- **Allowed tags** — common text/structure (`p`, `h2`, `h3`, `strong`, `em`, `a`,
  `ul`, `ol`, `li`, `blockquote`, `hr`, `br`, `figure`, `figcaption`) **plus `img` and
  `iframe`** (the body embeds images and video).
- **Allowed attributes** — `href`, `src`, `alt`, `title`, `target`, `rel`, and the sizing
  attributes for embeds; `class` is allowed so editor-emitted classes survive.
- **Stripped** — all `<script>`, all `on*` event handlers (`onclick`, `onerror`, …),
  `javascript:` URLs, `style` attributes that could smuggle `expression()`.

```tsx
/**
 * ArticleDetail.Body
 *
 * @description
 * Renders the article's rich-text HTML. The raw body is sanitized with
 * isomorphic-dompurify (allowing common formatting plus img/iframe, stripping scripts and
 * on* handlers) and only then injected into the Prose container. The body is never
 * rendered unsanitized. The wrapper carries a stable id and ref so the reading-progress
 * hook can measure its scroll position.
 */
export const ARTICLE_BODY_ID = "article-detail-body";

export function ArticleDetailBody({ body, bodyRef }: ArticleDetailBodyProps) {
    const clean = DOMPurify.sanitize(body, {
        ALLOWED_TAGS: [
            "p", "h2", "h3", "strong", "em", "a", "ul", "ol", "li",
            "blockquote", "hr", "br", "figure", "figcaption", "img", "iframe"
        ],
        ALLOWED_ATTR: [
            "href", "src", "alt", "title", "target", "rel",
            "width", "height", "allow", "allowfullscreen", "loading", "class"
        ]
    });

    return (
        <Prose
            id={ARTICLE_BODY_ID}
            ref={bodyRef}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
```

> **The body is the scroll target for reading progress.** It carries a stable `id`
> (`ARTICLE_BODY_ID`) and forwards a `ref` so
> [`useReadingProgress`](07-reading-progress.md) can measure the element's top and height.
> `Prose` therefore forwards its `ref` to the underlying `<div>`.

---

## Reused / new pieces

| Piece | Status | Notes |
|---|---|---|
| `Prose` (`shared/presentation/components/ui/Prose`) | **new** | Typographic wrapper; forwards `ref` |
| `isomorphic-dompurify` | **new dependency** | SSR-safe sanitizer; verify latest before pinning |
| `ArticleDetail.Body` | **new** | Sanitize + inject into `Prose` |

No new icon is needed. The one hard rule: **never inject unsanitized HTML**, and the
sanitizer must be `isomorphic-dompurify` (not the browser-only `dompurify`) because this
page server-renders.

Full JSDoc'd snippets, the exact DOMPurify config, and the checklist are in
[specs/05-article-body.md](specs/05-article-body.md).
