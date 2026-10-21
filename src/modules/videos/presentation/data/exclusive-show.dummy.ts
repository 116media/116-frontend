import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

const SHOW_ID = "exclusive-show-1";
const SHOW_NAME = "Le Focus";

const posterUrl =
    "https://www.revolt.tv/media_1666bf448c4d3919ae96ffd19634aa836b3e7ce4c.png?width=750&format=webp&optimize=high";

const thumbnails = [
    "https://images.pexels.com/photos/4427610/pexels-photo-4427610.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4778611/pexels-photo-4778611.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/6953876/pexels-photo-6953876.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/4087991/pexels-photo-4087991.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=600"
];

const episodeTitles = [
    "The Kinshasa Sessions: An Unfiltered Look Inside the City's Most Secretive Recording Studios",
    "Behind the Beat",
    "Studio Confessions and the Late-Night Tapes That Started It All",
    "The Rivalry",
    "Going Platinum: How a Single Mixtape Rewrote the Rules of the Entire Industry Overnight",
    "The Comeback"
];

/**
 * generateDummyEpisode
 *
 * @description
 * Creates a single dummy episode entity from its index. Uses deterministic IDs,
 * dates, and engagement numbers so the section renders identically across
 * server and client renders.
 */
function generateDummyEpisode(index: number): IVideoSummaryEntity {
    const title = episodeTitles[index % episodeTitles.length];

    return {
        id: `episode-${index + 1}`,
        categoryId: SHOW_ID,
        categoryName: SHOW_NAME,
        title,
        slug: title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        thumbnailUrl: thumbnails[index % thumbnails.length],
        youtubeVideoUrl: null,
        isPromoted: index === 0,
        publishedAt: new Date(2026, 5, 16 - index).toISOString(),
        shareCount: 40 + index * 35,
        ratingAverage: 4.5 - index * 0.2,
        ratingCount: 120 + index * 60
    };
}

/**
 * generateDummyExclusiveShow
 *
 * @description
 * Builds a complete dummy exclusive show with a poster and episodes.
 * Deterministic, so the section stays stable across server/client renders.
 * Remove this file once real API data is flowing.
 */
export function generateDummyExclusiveShow(): IVideoExclusiveShowEntity {
    const episodes = Array.from({ length: 5 }, (_, index) => generateDummyEpisode(index));

    return {
        id: SHOW_ID,
        name: SHOW_NAME,
        slug: "le-focus",
        description:
            "Long-form interviews that put one artist and one story under the spotlight for a full hour, tracing the work back through the rooms, the setbacks and the people who shaped it.",
        posterUrl,
        colors: { background: "#C33332", foreground: "#FFFFFF" },
        episodeCount: episodes.length,
        episodes
    };
}
