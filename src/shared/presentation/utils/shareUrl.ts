/**
 * SharePlatform
 *
 * @description
 * The social networks a share surface can build a per-platform intent URL for. Copy-link
 * is not a platform here — it writes to the clipboard and has no intent URL.
 */
export type SharePlatform = "facebook" | "x" | "whatsapp";

/**
 * buildShareUrl
 *
 * @description
 * Builds the share-intent URL for one network from an absolute page URL and title.
 * Pure and side-effect free: both inputs are URL-encoded and interpolated into the
 * network's documented share endpoint. Facebook ignores custom text (it scrapes Open
 * Graph); X and WhatsApp carry the title as the message.
 *
 * @param platform - The target network.
 * @param url - The absolute URL to share (for example `https://host/articles/{slug}`).
 * @param title - The page title, used as the share message where the network supports it.
 * @returns The fully-qualified share-intent URL to open in a new window.
 */
export function buildShareUrl(platform: SharePlatform, url: string, title: string): string {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case "x":
            return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        case "whatsapp":
            return `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }
}
