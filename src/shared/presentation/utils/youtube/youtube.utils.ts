/**
 * Matches the canonical 11-character YouTube video id alphabet.
 */
const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

/**
 * URL path/query shapes that carry the video id, tried in order.
 */
const YOUTUBE_URL_PATTERNS = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/
];

/**
 * extractYoutubeId
 *
 * @description
 * Extracts the 11-character YouTube video id from any URL shape the backend may
 * store (watch, youtu.be, embed, shorts) or from a bare id. Pure and null-safe,
 * so callers can feed it a nullable `youtubeVideoUrl` directly.
 *
 * @param url - A YouTube URL, a bare video id, or null.
 * @returns The 11-character video id, or null when none can be extracted.
 */
export function extractYoutubeId(url: string | null | undefined): string | null {
    if (!url) return null;

    const trimmed = url.trim();
    if (YOUTUBE_ID_PATTERN.test(trimmed)) return trimmed;

    for (const pattern of YOUTUBE_URL_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * buildYoutubeEmbedUrl
 *
 * @description
 * Builds the canonical YouTube embed URL for a video id — the single place the
 * `youtube.com/embed` string is assembled.
 *
 * @param id - The 11-character YouTube video id
 * @returns The absolute embed URL
 */
export function buildYoutubeEmbedUrl(id: string): string {
    return `https://www.youtube.com/embed/${id}`;
}
