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
 * Extracts the 11-character YouTube video id from any of the URL shapes the
 * backend may store, or from a bare id. Pure and null-safe, so callers can
 * feed it the entity's nullable `youtubeVideoUrl` directly. Consumed by the
 * detail player (Plyr source), the stats hook (route param), and the
 * video JSON-LD (`embedUrl`).
 *
 * | Input | Result |
 * |---|---|
 * | `https://www.youtube.com/watch?v=aqz-KE-bpKQ` | `aqz-KE-bpKQ` |
 * | `https://youtu.be/aqz-KE-bpKQ` | `aqz-KE-bpKQ` |
 * | `https://www.youtube.com/embed/aqz-KE-bpKQ` | `aqz-KE-bpKQ` |
 * | `https://www.youtube.com/shorts/aqz-KE-bpKQ` | `aqz-KE-bpKQ` |
 * | `aqz-KE-bpKQ` | `aqz-KE-bpKQ` |
 * | `null` / anything else | `null` |
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
