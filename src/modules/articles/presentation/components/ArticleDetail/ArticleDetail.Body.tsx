import DOMPurify from "isomorphic-dompurify";
import type { RefObject } from "react";

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
        "p",
        "h2",
        "h3",
        "strong",
        "em",
        "a",
        "ul",
        "ol",
        "li",
        "blockquote",
        "hr",
        "br",
        "figure",
        "figcaption",
        "img",
        "iframe"
    ],
    ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "title",
        "target",
        "rel",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "loading",
        "class"
    ]
};

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
            className="font-article"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: the HTML is sanitized with DOMPurify immediately above
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
