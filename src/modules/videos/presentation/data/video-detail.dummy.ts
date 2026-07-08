import type { IPlaylistEntity } from "@/modules/videos/domain/entities/IPlaylistEntity";
import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import type { IVideoLyricsEntity } from "@/modules/videos/domain/entities/IVideoLyricsEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IYoutubeVideoStats } from "@/modules/videos/domain/entities/IYoutubeVideoStats";
import {
    POPULAR_VIDEOS_LIMIT,
    SIMILAR_VIDEOS_PAGE_SIZE
} from "@/modules/videos/presentation/constants/videoKeys";
import { generateDummyVideoFeed } from "./video-feed.dummy";

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
 * Builds a rich-text HTML description for a dummy video so the description tab
 * previews the sanitized-HTML path. Deterministic, so SSR and client render
 * identically.
 *
 * @param title - The video title, woven into the heading and opening line.
 * @returns The description HTML.
 */
function buildDummyDescription(title: string): string {
    return (
        `<p>🎙️ ${title}</p>` +
        "<p>Filmed over three nights between a packed rehearsal room and the city's loudest " +
        "rooftop, this session captures an artist at the exact moment a sound stops being an " +
        "experiment and becomes a signature. The arrangement folds classic <strong>rhumba</strong> " +
        "guitar lines into hard-edged 808s, and the crowd you hear in the final chorus is not an " +
        "overdub — it is the block itself, singing back.</p>" +
        '<p>🌍 Website: <a target="_blank" rel="noopener noreferrer nofollow" href="https://mutombo.dev">mutombo.dev</a></p>' +
        "<p>📲 Follow for more interviews, beat breakdowns, and behind-the-scenes stories.</p>" +
        "<p>#116 #CoolBeatz #HipHop #Afrobeat #Rhumba #Producer #Beatmaker</p>"
    );
}

/**
 * Titles for the dedicated ten-item dummy popular pool — distinct from the
 * feed titles so the sidebar reads as its own set of videos. Ten matches the
 * popular endpoint's fixed size.
 */
const POPULAR_TITLES = [
    "Rumba Nights: The Full Session",
    "Kinshasa After Dark",
    "The Rooftop Cypher, Uncut",
    "Amapiano Meets Ndombolo",
    "Live at the Zénith: Encore",
    "Studio Diaries: Building the Hook",
    "One Take, No Autotune",
    "The Block Party Tape",
    "Brass, Bass and Everything Between",
    "Sunday Choir to Saturday Club"
];

/**
 * Known-good concert/music thumbnails (shared with the feed dummies), cycled
 * across the popular pool so every dummy row has artwork.
 */
const POPULAR_THUMBNAILS = [
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=600"
];

/**
 * generateDummyPopularVideos
 *
 * @description
 * Dummy-data phase: a dedicated pool of ten popular-video summaries, distinct
 * from the homepage feed dummies. Deterministic (index-seeded) so SSR and
 * client render identically; share counts skew high to read as "popular".
 *
 * @returns Ten dummy video summaries, each with a thumbnail.
 */
function generateDummyPopularVideos(): IVideoSummaryEntity[] {
    return POPULAR_TITLES.map((title, index) => {
        const isUnrated = index % 5 === 4;
        return {
            id: `dummy-popular-${index + 1}`,
            categoryId: "video-popular",
            categoryName: "Music Videos",
            title,
            slug: title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            thumbnailUrl: POPULAR_THUMBNAILS[index % POPULAR_THUMBNAILS.length],
            youtubeVideoUrl: null,
            isPromoted: index < 2,
            publishedAt: new Date(2026, 5, 15 - index).toISOString(),
            shareCount: 820 + index * 260,
            ratingAverage: isUnrated ? 0 : Math.max(3.6, 4.9 - index * 0.12),
            ratingCount: isUnrated ? 0 : 150 + index * 55
        };
    });
}

/**
 * dummyVideoDetail
 *
 * @description
 * Dummy-data phase: a fully-populated `IVideoDetailEntity` for the detail-page
 * preview. Resolves the slug against the feed and popular pools so a clicked
 * card and its landing page agree; deterministic, with a real YouTube URL.
 *
 * @param slug - The requested slug; matched against the dummy pools, falling back to the first.
 * @returns The dummy video detail entity.
 */
export function dummyVideoDetail(slug: string): IVideoDetailEntity {
    const { videos } = generateDummyVideoFeed();
    const pool = [...videos, ...generateDummyPopularVideos()];
    const summary = pool.find((video) => video.slug === slug) ?? videos[0];

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
 * while no `YOUTUBE_API_KEY` is configured. Seeded from the YouTube id's
 * character codes, so renders are deterministic and vary per video.
 *
 * @param youtubeId - The YouTube id the stats are presented for.
 * @returns The dummy stats entity.
 */
export function dummyYoutubeStats(youtubeId: string): IYoutubeVideoStats {
    const seed = [...youtubeId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return {
        hasStats: true,
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
 * Dummy-data phase: the popular sidebar in one shot — the ten-item popular
 * pool with the open video excluded, capped at `limit`. Not paginated,
 * mirroring the popular endpoint's fixed-size list.
 *
 * @param excludeId - The open video's id, excluded from the pool.
 * @param limit - Maximum rows to return (defaults to the sidebar's ten).
 * @returns Up to `limit` popular video summaries.
 */
export function dummyPopularVideos(
    excludeId: string,
    limit = POPULAR_VIDEOS_LIMIT
): IVideoSummaryEntity[] {
    return generateDummyPopularVideos()
        .filter((video) => video.id !== excludeId && video.thumbnailUrl)
        .slice(0, limit);
}

/**
 * Supplemental similar-only titles, layered on top of the feed and popular
 * pools so the similar grid has more than twenty distinct videos — enough to
 * exercise several pages of infinite scroll.
 */
const SIMILAR_EXTRA_TITLES = [
    "Acoustic Rooftop, Golden Hour",
    "The Remix Nobody Asked For",
    "Backstage at the Festival",
    "Two Guitars and a Drum Machine",
    "Sunrise Set on the River",
    "The Encore That Never Ended"
];

/**
 * generateDummySimilarVideos
 *
 * @description
 * Dummy-data phase: the similar-videos pool — feed dummies plus the popular
 * pool plus a supplemental set (namespaced ids, no collisions). Deterministic
 * (index-seeded) so SSR and client render identically.
 *
 * @returns The full similar pool (feed + popular + supplemental).
 */
function generateDummySimilarVideos(): IVideoSummaryEntity[] {
    const extra = SIMILAR_EXTRA_TITLES.map((title, index) => {
        const isUnrated = index % 4 === 3;
        return {
            id: `dummy-similar-${index + 1}`,
            categoryId: "video-similar",
            categoryName: "Music Videos",
            title,
            slug: title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, ""),
            thumbnailUrl: POPULAR_THUMBNAILS[index % POPULAR_THUMBNAILS.length],
            youtubeVideoUrl: null,
            isPromoted: false,
            publishedAt: new Date(2026, 4, 20 - index).toISOString(),
            shareCount: 180 + index * 90,
            ratingAverage: isUnrated ? 0 : Math.max(3.4, 4.6 - index * 0.1),
            ratingCount: isUnrated ? 0 : 60 + index * 25
        } satisfies IVideoSummaryEntity;
    });
    return [...generateDummyVideoFeed().videos, ...generateDummyPopularVideos(), ...extra];
}

/**
 * dummySimilarVideosPage
 *
 * @description
 * Dummy-data phase: one page of the similar-videos grid, sliced by zero-based
 * `pageIndex` from the similar pool (open video excluded), rotated by one page
 * so the similar grid and the popular sidebar do not open on the same rows.
 *
 * @param excludeId - The open video's id, excluded from the pool.
 * @param pageIndex - Zero-based page to slice.
 * @param pageSize - Cards per page.
 * @returns The page slice (empty once the pool is exhausted).
 */
export function dummySimilarVideosPage(
    excludeId: string,
    pageIndex: number,
    pageSize = SIMILAR_VIDEOS_PAGE_SIZE
): IVideoSummaryEntity[] {
    const pool = generateDummySimilarVideos().filter(
        (video) => video.id !== excludeId && video.thumbnailUrl
    );
    const rotated = [...pool.slice(pageSize), ...pool.slice(0, pageSize)];
    const start = pageIndex * pageSize;
    return rotated.slice(start, start + pageSize);
}
