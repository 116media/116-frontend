import { SITE_URL } from "@/shared/infrastructure/constants/common";

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
    return `${SITE_URL}${path}`;
}

/**
 * resolveAbsoluteShareUrl
 *
 * @description
 * Builds the absolute URL of a page from its site-relative path, anchored on the current
 * origin so a link shared from a feed card points at the article rather than the list it
 * was shared from. Falls back to the public site base outside the browser.
 *
 * @param path - The site-relative path to the shared page (e.g. `/articles/{slug}`)
 * @returns The absolute page URL
 */
export function resolveAbsoluteShareUrl(path: string): string {
    const origin = typeof window === "undefined" ? SITE_URL : window.location.origin;
    return `${origin}${path}`;
}

/**
 * copyTextToClipboard
 *
 * @description
 * Copies text to the clipboard, falling back to a hidden selection when the async
 * Clipboard API is missing or refuses. That API only exists in a secure context, so on a
 * phone reaching a dev server over plain HTTP it is undefined and the direct call throws.
 *
 * @param text - The text to place on the clipboard.
 * @returns Whether the text reached the clipboard.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Denied, or an insecure origin that exposes the API but blocks the write.
        }
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    field.style.top = "0";
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, text.length);

    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        field.remove();
    }
}

/**
 * buildShareUrl
 *
 * @description
 * Builds the share-intent URL for one network from an absolute page URL and title. Each
 * network is prefilled with the title — Facebook via `quote`, X via `text`, WhatsApp
 * inline with the URL — while the preview card itself is built by the target from the
 * page's Open Graph tags.
 *
 * @param platform - The target network.
 * @param url - The absolute URL to share (for example `https://host/articles/{slug}`).
 * @param title - The page title, used as the prefilled share message.
 * @returns The fully-qualified share-intent URL to open in a new window.
 */
export function buildShareUrl(platform: SharePlatform, url: string, title: string): string {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        case "x":
            return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        case "whatsapp":
            return `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }
}
