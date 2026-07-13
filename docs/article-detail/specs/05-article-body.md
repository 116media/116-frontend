# Spec 05 — Article Body

Design ref: [../06-article-body.md](../06-article-body.md).

The shared `Prose` container, the `isomorphic-dompurify` sanitizer, and
`ArticleDetail.Body`. The body is **sanitized on every render, server and client**, then
injected into `Prose` via `dangerouslySetInnerHTML` — never the raw string. JSDoc-only,
theme tokens only.

---

## 1. `isomorphic-dompurify` dependency

Not yet a dependency. **Run `npm show isomorphic-dompurify dist-tags.latest` and pin the
reported version** (verified `3.18.0` at time of writing). It is chosen over the
browser-only `dompurify` because this page server-renders for SEO — the sanitizer must run
in Node during the RSC render, and `isomorphic-dompurify` provides that parity with the
same DOMPurify API on both sides.

```ts
import DOMPurify from "isomorphic-dompurify";
```

---

## 2. `Prose` primitive

`src/shared/presentation/components/ui/Prose/index.tsx` — none exists. No
`@tailwindcss/typography` plugin is installed, so styling is an explicit curated set of
descendant classes (not a `prose` utility). Forwards its `ref` so the body element can be
measured by the reading-progress hook.

```tsx
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the Prose component.
 *
 * @interface ProseProps
 * @augments HTMLAttributes<HTMLDivElement>
 */
export type ProseProps = HTMLAttributes<HTMLDivElement>;

/**
 * Prose
 *
 * @description
 * A typographic container for rendered rich-text HTML. Applies a curated set of descendant
 * styles (headings, paragraphs, links, images, blockquotes, lists, embeds, rules) using
 * theme tokens so content reads consistently in light and dark mode. Images are
 * full-width, auto-height and rounded; iframes are responsive. Forwards its ref to the
 * underlying div so the content element can be measured for reading progress. No global
 * typography plugin is required.
 *
 * @param className - Extra classes merged onto the container.
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
    { className, children, ...props },
    ref
) {
    return (
        <div
            ref={ref}
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
});
```

---

## 3. `ArticleDetail.Body.tsx`

Sanitizes the HTML, then injects it into `Prose`. Carries a stable id and forwards the
shared body ref so [reading progress](../07-reading-progress.md) measures the same element.

```tsx
import type { RefObject } from "react";

import DOMPurify from "isomorphic-dompurify";

import { Prose } from "@/shared/presentation/components/ui/Prose";

/**
 * Stable DOM id of the rendered article body, used as the reading-progress scroll target.
 */
export const ARTICLE_BODY_ID = "article-detail-body";

/**
 * DOMPurify configuration for the article body.
 *
 * @description
 * Allows the formatting tags the editor emits plus img/iframe for embedded media, and the
 * attributes those require. Everything else — script tags, on* event handlers,
 * javascript: URLs, style attributes — is stripped by DOMPurify's defaults.
 */
const SANITIZE_CONFIG = {
    ALLOWED_TAGS: [
        "p", "h2", "h3", "strong", "em", "a", "ul", "ol", "li",
        "blockquote", "hr", "br", "figure", "figcaption", "img", "iframe"
    ],
    ALLOWED_ATTR: [
        "href", "src", "alt", "title", "target", "rel",
        "width", "height", "allow", "allowfullscreen", "loading", "class"
    ]
} as const;

/**
 * Props for the ArticleDetail.Body component.
 *
 * @interface ArticleDetailBodyProps
 * @property {string} body - The raw rich-text HTML body from the article entity.
 * @property {RefObject<HTMLDivElement | null>} bodyRef - Ref attached to the rendered body,
 * shared with the reading-progress bar so both measure the same element.
 */
export interface ArticleDetailBodyProps {
    body: string;
    bodyRef: RefObject<HTMLDivElement | null>;
}

/**
 * ArticleDetail.Body
 *
 * @description
 * Renders the article's rich-text HTML. The raw body is sanitized with isomorphic-dompurify
 * (allowing common formatting plus img/iframe, stripping scripts and on* handlers) and only
 * then injected into the Prose container via dangerouslySetInnerHTML. The body is never
 * rendered unsanitized. The Prose wrapper carries a stable id and the shared ref so the
 * reading-progress hook can measure its scroll position.
 *
 * @param body - The raw rich-text HTML body.
 * @param bodyRef - Ref attached to the rendered body element.
 */
export function ArticleDetailBody({ body, bodyRef }: ArticleDetailBodyProps) {
    const clean = DOMPurify.sanitize(body, SANITIZE_CONFIG);

    return (
        <Prose
            ref={bodyRef}
            id={ARTICLE_BODY_ID}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
```

---

## Tasks

- [ ] `npm show isomorphic-dompurify dist-tags.latest` run; the reported version pinned in
      `package.json`.
- [ ] `Prose` primitive created — explicit descendant typography (no `prose` plugin), theme
      tokens, images `w-full h-auto rounded`, iframes responsive, forwards `ref`.
- [ ] `Prose` verified clean in light + dark mode with sample body HTML.
- [ ] `ArticleDetail.Body` sanitizes with `isomorphic-dompurify` before rendering; the raw
      body is never passed to `dangerouslySetInnerHTML`.
- [ ] `SANITIZE_CONFIG` allows img/iframe + common formatting; a `<script>` / `onerror`
      probe in the body is confirmed stripped.
- [ ] `ARTICLE_BODY_ID` set and the shared `bodyRef` forwarded to the `Prose` wrapper.
- [ ] `tsc` + biome clean.
