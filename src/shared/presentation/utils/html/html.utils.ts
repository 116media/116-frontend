/**
 * htmlToPlainText
 *
 * @description
 * Reduces rich-text HTML to a single line of plain text for metadata (og/twitter
 * descriptions and other share previews): tags become spaces, the common editor entities
 * are decoded, and whitespace is collapsed. Lossy by design and never rendered — for the
 * rendered body use `sanitizeHtml` instead.
 *
 * @param html - The raw rich-text HTML from the entity.
 * @returns The collapsed plain-text string.
 */
export function htmlToPlainText(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#0*39;|&apos;/gi, "'")
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, " ")
        .trim();
}
