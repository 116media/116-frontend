import DOMPurify from "isomorphic-dompurify";

import { Prose } from "@/shared/presentation/components/ui/Prose";

/**
 * DOMPurify configuration for the video description.
 *
 * @description
 * Allows the formatting tags the editor emits plus img/iframe for embedded
 * media, and the attributes those require. Everything else — script tags, on*
 * event handlers, javascript: URLs, style attributes — is stripped by
 * DOMPurify's defaults.
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
 * Props for VideoDetail.Description.
 *
 * @interface VideoDetailDescriptionProps
 * @property {string} description - The video's rich-text HTML description.
 */
export interface VideoDetailDescriptionProps {
    description: string;
}

/**
 * VideoDetail.Description
 *
 * @description
 * The default tab panel: the video's rich-text HTML description. The raw markup
 * is sanitized with isomorphic-dompurify (allowing common formatting plus
 * img/iframe, stripping scripts and on* handlers) and only then injected into
 * the Prose container via dangerouslySetInnerHTML — it is never rendered
 * unsanitized. Rendered in the app's standard face (Outfit); unlike the article
 * body, the video page carries no editorial reading font.
 *
 * @param description - The video's rich-text HTML description.
 */
export function VideoDetailDescription({ description }: VideoDetailDescriptionProps) {
    const clean = DOMPurify.sanitize(description, SANITIZE_CONFIG);

    return (
        <Prose
            // biome-ignore lint/security/noDangerouslySetInnerHtml: the HTML is sanitized with DOMPurify immediately above
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
