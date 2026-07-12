/**
 * SharePlatform
 *
 * @description
 * The social networks a share surface can build a per-platform intent URL for. Copy-link
 * is not a platform here — it writes to the clipboard and has no intent URL.
 */
export type SharePlatform = "facebook" | "x" | "whatsapp";

/**
 * resolveShareUrl
 *
 * @description
 * Resolves the absolute URL of the page being shared. Prefers `window.location.href` in
 * the browser; falls back to the public site base plus the given path so the value is
 * defined outside the browser.
 *
 * @param path - The site-relative path to the shared page (e.g. `/videos/{slug}`)
 * @returns The absolute page URL
 */
export function resolveShareUrl(path: string): string {
    if (typeof window !== "undefined") return window.location.href;
    return `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${path}`;
}

/**
 * buildShareUrl
 *
 * @description
 * Builds the share-intent URL for one network from an absolute page URL and title.
 * Facebook ignores custom text (it scrapes Open Graph); X and WhatsApp carry the
 * title as the message.
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
