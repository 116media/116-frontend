import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * Number of videos shown in a single feed section.
 */
const FEED_SIZE = 8;

const CATEGORY_ID = "video-feed-1";
const CATEGORY_NAME = "Interviews";

const thumbnails = [
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=600"
];

const videoTitles = [
    "Inside the Studio: How Kinshasa's New Wave Is Rewriting Afrobeat",
    "The Cypher That Broke the Internet",
    "From the Streets to the Stage: A Producer's Story",
    "Behind the Mic with the City's Loudest Voice",
    "The Beat Tape Sessions, Vol. 3",
    "Rhumba Meets Trap: An Unlikely Collaboration",
    "Late Nights and Loud Speakers: A Tour Diary",
    "The Comeback Nobody Saw Coming"
];

/**
 * generateDummyVideo
 *
 * @description
 * Creates a single dummy video entity from its index. Uses deterministic IDs,
 * dates, and engagement numbers (no Math.random() / Date.now()) so the section
 * renders identically across server and client renders.
 *
 * @param index - The position of the video in the feed
 * @returns A dummy video summary entity
 */
function generateDummyVideo(index: number): IVideoSummaryEntity {
    const title = videoTitles[index % videoTitles.length];

    // Every third video is left unrated so the unrated rating states are visible
    // in the feed (outlined star + zero count, or five empty stars).
    const isUnrated = index % 3 === 2;

    return {
        id: `feed-video-${index + 1}`,
        categoryId: CATEGORY_ID,
        categoryName: CATEGORY_NAME,
        title,
        slug: title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        thumbnailUrl: thumbnails[index % thumbnails.length],
        youtubeVideoUrl: null,
        isPromoted: index === 0,
        publishedAt: new Date(2026, 5, 16 - index).toISOString(),
        shareCount: 320 + index * 540,
        ratingAverage: isUnrated ? 0 : 4.8 - index * 0.2,
        ratingCount: isUnrated ? 0 : 90 + index * 70
    };
}

/**
 * generateDummyVideoFeed
 *
 * @description
 * Builds a complete dummy video feed section — a category name and its eight
 * latest videos. Returns deterministic data so the feed stays stable across
 * server/client renders.
 *
 * @returns The dummy feed section (title + videos)
 */
export function generateDummyVideoFeed(): { title: string; videos: IVideoSummaryEntity[] } {
    return {
        title: CATEGORY_NAME,
        videos: Array.from({ length: FEED_SIZE }, (_, index) => generateDummyVideo(index))
    };
}
