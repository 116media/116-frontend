import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";

import { generateDummyVideoFeed } from "../components/VideoFeedSection/dummy-feed";

/**
 * A real, publicly available YouTube video (Blender Foundation's Big Buck
 * Bunny, an open movie) so the dummy detail page exercises the actual Plyr
 * embed and the YouTube stats chips end to end.
 */
const DUMMY_YOUTUBE_URL = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";

/**
 * Rotation pool of tag sets for the dummy video's tag block.
 */
const TAGS: IVideoTagEntity[] = [
    { id: "dummy-tag-music-video", name: "Music Video", slug: "music-video" },
    { id: "dummy-tag-afrobeat", name: "Afrobeat", slug: "afrobeat" },
    { id: "dummy-tag-kinshasa", name: "Kinshasa", slug: "kinshasa" },
    { id: "dummy-tag-live-session", name: "Live Session", slug: "live-session" }
];

/**
 * buildDummyDescription
 *
 * @description
 * Builds the ~500-character plain-text description for a dummy video, woven
 * around its title, so the description tab previews with a realistic long
 * paragraph. Deterministic, so SSR and client render identically.
 *
 * @param title - The video title, woven into the opening line.
 * @returns The description text.
 */
function buildDummyDescription(title: string): string {
    return (
        `${title} — filmed over three nights between a packed rehearsal room and the city's ` +
        "loudest rooftop, this session captures an artist at the exact moment a sound stops " +
        "being an experiment and becomes a signature. The arrangement folds classic rhumba " +
        "guitar lines into hard-edged 808s, and the crowd you hear in the final chorus is not " +
        "an overdub: it is the block itself, singing back. Shot and mixed by the 116 crew, " +
        "with live percussion, two takes, and no autotune anywhere near the vocal booth."
    );
}

/**
 * dummyVideoDetail
 *
 * @description
 * Dummy-data phase: a fully-populated `IVideoDetailEntity` for the detail-page
 * preview while the backend has no published content. Reuses the shared feed
 * dummies (`generateDummyVideoFeed`) so the card a visitor clicked and the
 * video they land on agree on title, thumbnail, and counts. Index-seeded from
 * the slug (no Math.random / Date.now) so SSR and client render identically.
 * Carries a real YouTube URL so the player and the stats chips work, four
 * tags, and `hasLyrics: true` so the lyrics tab is previewable.
 *
 * @param slug - The requested slug; matched against the feed dummies, falling back to the first.
 * @returns The dummy video detail entity.
 */
export function dummyVideoDetail(slug: string): IVideoDetailEntity {
    const { videos } = generateDummyVideoFeed();
    const summary = videos.find((video) => video.slug === slug) ?? videos[0];

    return {
        id: summary.id,
        categoryId: summary.categoryId,
        categoryName: summary.categoryName,
        title: summary.title,
        slug: summary.slug,
        description: buildDummyDescription(summary.title),
        thumbnailUrl: summary.thumbnailUrl,
        youtubeVideoUrl: DUMMY_YOUTUBE_URL,
        hasLyrics: true,
        tags: TAGS,
        shareCount: summary.shareCount,
        ratingAverage: summary.ratingAverage,
        ratingCount: summary.ratingCount,
        publishedAt: summary.publishedAt,
        metaTitle: summary.title,
        metaDescription: buildDummyDescription(summary.title).slice(0, 160)
    };
}

/**
 * dummyVideoLyrics
 *
 * @description
 * Dummy-data phase: lyrics for the lyrics-tab preview while the backend has no
 * linked lyrics. Deterministic stanzas keyed to the dummy video.
 *
 * @param videoId - The video the lyrics are presented for (used for the id only).
 * @returns The dummy lyrics entity.
 */
export function dummyVideoLyrics(videoId: string): IVideoLyricsEntity {
    return {
        id: `${videoId}-lyrics`,
        songTitle: "Eloko Oyo",
        artistName: "Fally Ipupa",
        language: "Lingala",
        lyricsText: [
            "Eloko oyo, eloko oyo",
            "Nalingi yo, motema na ngai",
            "Butu na moyi, nazali kokanisa yo",
            "Eloko oyo, eloko oyo",
            "",
            "Soki mokolo moko okeyi",
            "Motema na ngai ekolela",
            "Nalingi yo, nalingi yo",
            "Kitoko na yo, eloko oyo",
            "",
            "Mama, mama, eloko oyo",
            "Nazali awa mpo na yo",
            "Bolingo na biso ekosila te",
            "Eloko oyo, eloko oyo"
        ].join("\n")
    };
}

/**
 * dummyYoutubeStats
 *
 * @description
 * Dummy-data phase: YouTube stat-chip numbers for the detail-page preview
 * while no `YOUTUBE_API_KEY` is configured (the internal route then returns
 * the all-null shape and the chips would hide). Seeded from the YouTube id's
 * character codes (no Math.random / Date.now) so SSR and client render
 * identically and different videos show different numbers.
 *
 * @param youtubeId - The YouTube id the stats are presented for.
 * @returns The dummy stats entity.
 */
export function dummyYoutubeStats(youtubeId: string): IYoutubeVideoStats {
    const seed = [...youtubeId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return {
        viewCount: 1_200_000 + seed * 1_337,
        likeCount: 24_000 + seed * 41,
        commentCount: 1_300 + seed * 7
    };
}

/**
 * dummyPlaylists
 *
 * @description
 * Dummy-data phase: three playlists for the add-to-playlist modal preview
 * while the backend has no account data to serve. Deterministic ids and
 * counts.
 *
 * @returns Three dummy playlists.
 */
export function dummyPlaylists(): IPlaylistEntity[] {
    return [
        { id: "dummy-playlist-favorites", name: "Favorites", videoCount: 12 },
        { id: "dummy-playlist-late-night", name: "Late Night Drive", videoCount: 7 },
        { id: "dummy-playlist-workout", name: "Workout Energy", videoCount: 23 }
    ];
}

/**
 * dummyPopularVideos
 *
 * @description
 * Dummy-data phase: a short list of video summaries for the popular-sidebar
 * preview, each carrying a thumbnail, sourced from the shared feed dummies and
 * excluding the video currently open.
 *
 * @param excludeId - The open video's id, excluded from the list.
 * @param limit - Maximum number of rows to return (default 5).
 * @returns Up to `limit` video summaries, each with a thumbnail.
 */
export function dummyPopularVideos(excludeId: string, limit = 5): IVideoSummaryEntity[] {
    return generateDummyVideoFeed()
        .videos.filter((video) => video.id !== excludeId && video.thumbnailUrl)
        .slice(0, limit);
}

/**
 * dummySimilarVideos
 *
 * @description
 * Dummy-data phase: the similar-tab preview grid, sourced from the shared feed
 * dummies with the video currently open excluded. Offset into the pool so the
 * similar grid and the popular sidebar do not show the same three videos.
 *
 * @param excludeId - The open video's id, excluded from the list.
 * @param limit - Maximum number of cards to return (default 3).
 * @returns Up to `limit` video summaries.
 */
export function dummySimilarVideos(excludeId: string, limit = 3): IVideoSummaryEntity[] {
    const pool = generateDummyVideoFeed().videos.filter((video) => video.id !== excludeId);
    return [...pool.slice(limit), ...pool.slice(0, limit)].slice(0, limit);
}
