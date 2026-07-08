import { Prose } from "@/shared/presentation/components/ui/Prose";
import { sanitizeHtml } from "@/shared/presentation/utils/sanitize/sanitize.utils";

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
 * The default tab panel: the video's rich-text HTML description, sanitized with the
 * shared allow-list before being injected into the Prose container — it is never
 * rendered unsanitized.
 */
export function VideoDetailDescription({ description }: VideoDetailDescriptionProps) {
    const clean = sanitizeHtml(description);

    return (
        <Prose
            // biome-ignore lint/security/noDangerouslySetInnerHtml: the HTML is sanitized with the shared DOMPurify allow-list immediately above
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
}
