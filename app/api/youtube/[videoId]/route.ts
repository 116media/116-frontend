/**
 * The all-null stats shape. Returned whenever the statistics cannot be
 * resolved — missing API key, implausible id, upstream error — so the page's
 * chips hide instead of erroring. Null means hidden/unavailable, never 0.
 */
const NULL_STATS = { viewCount: null, likeCount: null, commentCount: null };

/**
 * Seconds the Google response is cached per video id. One YouTube Data API
 * call costs 1 quota unit against the 10k/day default, so a 5-minute window
 * keeps the page far from the quota under any realistic traffic.
 */
const REVALIDATE_SECONDS = 300;

/**
 * isPlausibleYoutubeId
 *
 * @description
 * Guards the Google URL interpolation: only the canonical 11-character
 * YouTube id alphabet (letters, digits, `-`, `_`) passes, so arbitrary route
 * input never reaches the upstream query string.
 *
 * @param videoId - The raw route param.
 * @returns Whether the value looks like a YouTube video id.
 */
function isPlausibleYoutubeId(videoId: string): boolean {
    return /^[\w-]{11}$/.test(videoId);
}

/**
 * toCount
 *
 * @description
 * Parses one of Google's string numerals into a number. Missing or
 * non-numeric values become null (the statistic is hidden upstream), which is
 * distinct from a real count of 0.
 *
 * @param value - The raw statistics field from the YouTube Data API.
 * @returns The parsed count, or null when hidden/unavailable.
 */
function toCount(value: unknown): number | null {
    if (typeof value !== "string" && typeof value !== "number") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

/**
 * GET /api/youtube/[videoId]
 *
 * @description
 * Proxies the YouTube Data API v3 `videos?part=statistics` call for one video
 * id, keeping `YOUTUBE_API_KEY` server-side. Always responds 200 with the
 * stats shape `{ viewCount, likeCount, commentCount }` — a missing key, an
 * implausible id, or any upstream problem resolves to the all-null shape so
 * upstream failures never become page errors. The Google response is cached
 * for five minutes per id.
 *
 * @param _request - The incoming request (unused).
 * @param context - The route context whose `params` promise carries `videoId`.
 * @returns A JSON response with the stats shape.
 */
export async function GET(
    _request: Request,
    context: { params: Promise<{ videoId: string }> }
): Promise<Response> {
    const { videoId } = await context.params;
    const key = process.env.YOUTUBE_API_KEY;

    if (!key || !isPlausibleYoutubeId(videoId)) return Response.json(NULL_STATS);

    try {
        const url =
            "https://www.googleapis.com/youtube/v3/videos" +
            `?part=statistics&id=${videoId}&key=${key}`;
        const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
        if (!response.ok) return Response.json(NULL_STATS);

        const payload = (await response.json()) as {
            items?: { statistics?: Record<string, unknown> }[];
        };
        const statistics = payload?.items?.[0]?.statistics;

        return Response.json({
            viewCount: toCount(statistics?.viewCount),
            likeCount: toCount(statistics?.likeCount),
            commentCount: toCount(statistics?.commentCount)
        });
    } catch {
        return Response.json(NULL_STATS);
    }
}
