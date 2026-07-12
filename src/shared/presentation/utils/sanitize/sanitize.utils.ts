import DOMPurify from "isomorphic-dompurify";

/**
 * DOMPurify configuration for editor-emitted rich-text HTML.
 *
 * @description
 * Allows the formatting tags the editor emits plus img/iframe for embedded media, and the
 * attributes those require. Everything else — script tags, on* event handlers, javascript:
 * URLs, style attributes — is stripped by DOMPurify's defaults.
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
 * sanitizeHtml
 *
 * @description
 * Sanitizes rich-text HTML with the shared allow-list before it is rendered via
 * dangerouslySetInnerHTML. The single entry point for both the article body and the
 * video description, so a fix to the allow-list propagates to every surface.
 *
 * @param html - The raw rich-text HTML from the entity
 * @returns The sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}
