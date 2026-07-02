/**
 * Props for VideoDetail.Description.
 *
 * @interface VideoDetailDescriptionProps
 * @property {string} description - The video's plain-text description.
 */
export interface VideoDetailDescriptionProps {
    description: string;
}

/**
 * VideoDetail.Description
 *
 * @description
 * The default tab panel: the video's plain-text description in the app's
 * standard face (Outfit), preserving the author's line breaks. Unlike the
 * article body, the video page carries no editorial reading font.
 *
 * @param description - The video's plain-text description.
 */
export function VideoDetailDescription({ description }: VideoDetailDescriptionProps) {
    return (
        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{description}</p>
    );
}
