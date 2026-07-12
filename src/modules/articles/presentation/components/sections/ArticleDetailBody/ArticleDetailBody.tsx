import type { RefObject } from "react";

import { ARTICLE_BODY_ID } from "@/modules/articles/presentation/constants/articleBodyId";
import { Prose } from "@/shared/presentation/components/ui/Prose";
import { sanitizeHtml } from "@/shared/presentation/utils/sanitize/sanitize.utils";

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
 * Renders the article's rich-text HTML, sanitized with the shared allow-list before
 * injection into the Prose container. Carries a stable id and the shared ref so the
 * reading-progress hook can measure scroll position.
 */
export function ArticleDetailBody({ body, bodyRef }: ArticleDetailBodyProps) {
    const clean = sanitizeHtml(body);

    return (
        <Prose
            ref={bodyRef}
            id={ARTICLE_BODY_ID}
            className="font-article"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: the HTML is sanitized with the shared DOMPurify allow-list immediately above
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
