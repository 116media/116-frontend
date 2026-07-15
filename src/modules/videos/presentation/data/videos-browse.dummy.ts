import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoPage } from "@/modules/videos/domain/entities/IVideoPage";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import type { IVideoFeedFilters } from "@/modules/videos/presentation/constants/videoKeys";

/**
 * Fixed epoch the dummy dates count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-07-01T09:00:00Z");

/**
 * One day in milliseconds.
 */
const DAY_MS = 86_400_000;

/**
 * Total number of videos in the dummy browse pool.
 */
const POOL_SIZE = 100;

/**
 * Rotation pool of category names for the dummy browse videos and chips. More
 * entries than the chip limit so the "browse all shows" modal has overflow.
 */
const CATEGORIES = [
    { name: "Flagship Shows", description: "Our signature productions, every week" },
    { name: "Music Videos", description: "Fresh clips from the scene" },
    { name: "Interviews", description: "Raw conversations with the artists" },
    { name: "Live Sessions", description: "Captured on stage, unfiltered" },
    { name: "Documentaries", description: "The stories behind the sound" },
    { name: "Freestyles", description: "Bars only, no second takes" },
    { name: "Culture & Lifestyle", description: "Beyond the music" },
    { name: "Concerts", description: "Full shows, front row" },
    { name: "Behind The Scenes", description: "Before the cameras roll" },
    { name: "Dance", description: "Moves that set the trends" },
    { name: "Comedy & Sketches", description: "The lighter side of the culture" },
    { name: "Fashion", description: "Style, drops, and streetwear" },
    { name: "Gaming", description: "Controllers meet the culture" },
    { name: "Events & Specials", description: "One-off moments that matter" }
] as const;

/**
 * Rotation pool of video titles for the dummy browse videos.
 */
const TITLES = [
    "Kinshasa by Night — Opening the Season in Style",
    "Studio Session: Recording the Anthem of the Summer",
    "The Rumba Revival Nobody Saw Coming",
    "Freestyle Fridays: The Cypher That Broke the Internet",
    "On Tour: 48 Hours Between Two Capitals",
    "The Producer's Desk: Anatomy of a Hit",
    "Dance Battle: The Final Nobody Expected",
    "Voices of the Diaspora: Paris Meets Kinshasa",
    "Unplugged: An Acoustic Evening With the Band",
    "The Comeback Interview, One Year Later",
    "Backstage at the Zénith: The Untold Story",
    "Street Sounds: Recording the City Itself",
    "Mixtape Season: The Tracks Everyone Is Trading",
    "From Matonge to the Main Stage: A Rise in Three Acts",
    "The Choir Sessions: Gospel Voices of the New School",
    "Sneakers & Soukous: A Culture Conversation",
    "One Take: The Live Performance Filmed in a Single Shot",
    "Behind the Poster: Designing a Tour Identity",
    "The Beatmakers' Roundtable: Five Producers, One Loop",
    "Femmes de Force: Women Leading the New Wave",
    "Open Mic Nights: Where Tomorrow's Stars Warm Up",
    "The Vinyl Diggers: Hunting the Golden Era Records",
    "Rooftop Session: Sunset Over the River",
    "The Label Story: Building an Independent Empire"
] as const;

/**
 * Rotation pool of thumbnail URLs for the dummy browse videos.
 */
const THUMBNAILS = [
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2372945/pexels-photo-2372945.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4427610/pexels-photo-4427610.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/6953876/pexels-photo-6953876.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800"
] as const;

/**
 * Pool of tags for the dummy strip, popover, and per-video tag filtering.
 */
const TAGS = [
    "rumba",
    "ndombolo",
    "afrobeats",
    "freestyle",
    "live",
    "interview",
    "kinshasa",
    "diaspora",
    "acoustic",
    "producer",
    "dance",
    "concert"
] as const;

/**
 * slugify
 *
 * @description
 * Converts a display name to the URL-safe slug shape used across dummies.
 *
 * @param value - The display name.
 * @returns The slug.
 */
function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

/**
 * generateDummyVideoCategories
 *
 * @description
 * Deterministic list of video categories (shows) backing the browse chips and
 * the "browse all shows" modal while the backend has no seeded categories.
 * Larger than the chip limit so the modal overflow is exercised.
 *
 * @returns The dummy video categories.
 */
export function generateDummyVideoCategories(): IVideoCategoryEntity[] {
    return CATEGORIES.map((category, index) => ({
        id: `dummy-category-${index + 1}`,
        name: category.name,
        slug: slugify(category.name),
        description: category.description,
        isFree: index % 3 !== 0
    }));
}

/**
 * generateDummyVideoTags
 *
 * @description
 * Deterministic list of video tags backing the tag strip and the "All tags"
 * popover while the backend has no seeded tags.
 *
 * @param search - Optional search term to filter the pool, mirroring the API.
 * @returns The matching dummy tags.
 */
export function generateDummyVideoTags(search?: string): IVideoTagEntity[] {
    const tags = TAGS.map((tag, index) => ({
        id: `dummy-tag-${index + 1}`,
        name: tag,
        slug: tag
    }));

    if (!search) return tags;
    const term = search.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(term));
}

/**
 * dummyTagsForVideo
 *
 * @description
 * Deterministic pair of tag slugs assigned to a dummy pool video, so the tag
 * filter narrows the dummy feed the way the backend join would.
 *
 * @param index - The video's index in the pool.
 * @returns The video's tag slugs.
 */
function dummyTagsForVideo(index: number): string[] {
    return [TAGS[index % TAGS.length], TAGS[(index + 5) % TAGS.length]];
}

/**
 * generateDummyBrowseVideo
 *
 * @description
 * Creates one dummy browse video from its index: deterministic ids, dates, and
 * engagement so SSR and client render identically; every 4th video is left
 * unrated to exercise the unrated card state.
 *
 * @param index - The video's index in the pool.
 * @returns The dummy video summary.
 */
function generateDummyBrowseVideo(index: number): IVideoSummaryEntity {
    const title = TITLES[index % TITLES.length];
    const categoryIndex = index % CATEGORIES.length;

    return {
        id: `dummy-browse-video-${index + 1}`,
        categoryId: `dummy-category-${categoryIndex + 1}`,
        categoryName: CATEGORIES[categoryIndex].name,
        title,
        slug: `${slugify(title)}-${index + 1}`,
        thumbnailUrl: THUMBNAILS[index % THUMBNAILS.length],
        youtubeVideoUrl: null,
        isPromoted: index % 9 === 0,
        publishedAt: new Date(DUMMY_BASE_MS - index * DAY_MS).toISOString(),
        shareCount: 25 + index * 13,
        ratingAverage: index % 4 === 3 ? 0 : 3 + ((index * 7) % 20) / 10,
        ratingCount: index % 4 === 3 ? 0 : 40 + index * 9
    };
}

/**
 * normalizeDummyCategoryId
 *
 * @description
 * Dummy-phase shim: maps any category id that is not part of the dummy pool
 * (dummy show ids, real backend UUIDs) onto a deterministic dummy category, so
 * every show page and category filter stays previewable. Removed with the
 * dummy data once the backend is seeded.
 *
 * @param categoryId - The requested category filter.
 * @returns A category id present in the dummy pool.
 */
function normalizeDummyCategoryId(categoryId: string): string {
    if (/^dummy-category-\d+$/.test(categoryId)) return categoryId;
    let hash = 0;
    for (const char of categoryId) hash = (hash + char.charCodeAt(0)) % CATEGORIES.length;
    return `dummy-category-${hash + 1}`;
}

/**
 * matchesFilters
 *
 * @description
 * Applies the feed filters to one dummy pool video, mirroring the backend's
 * category, tag, and search behavior.
 *
 * @param video - The pool video.
 * @param index - Its pool index (drives the deterministic tag pair).
 * @param filters - The active feed filters.
 * @returns Whether the video survives the filters.
 */
function matchesFilters(
    video: IVideoSummaryEntity,
    index: number,
    filters: IVideoFeedFilters
): boolean {
    if (filters.categoryId && video.categoryId !== normalizeDummyCategoryId(filters.categoryId)) {
        return false;
    }
    if (filters.tagSlug && !dummyTagsForVideo(index).includes(filters.tagSlug)) return false;
    if (filters.search && !video.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
    }
    return true;
}

/**
 * filteredPoolIndices
 *
 * @description
 * Pool indices of the dummy videos surviving the active filters, in feed order.
 *
 * @param filters - The active feed filters.
 * @returns The matching pool indices.
 */
function filteredPoolIndices(filters: IVideoFeedFilters): number[] {
    return Array.from({ length: POOL_SIZE }, (_, index) => index).filter((index) =>
        matchesFilters(generateDummyBrowseVideo(index), index, filters)
    );
}

/**
 * dummyVideoPage
 *
 * @description
 * One filtered page of the dummy browse pool as an `IVideoPage`, so
 * `useVideosFeed` can page and filter exactly like the backend while it has no
 * published content. `hasNextPage` is derived from the filtered total.
 *
 * @param pageIndex - Zero-based page to slice.
 * @param pageSize - Items per page.
 * @param filters - The active feed filters.
 * @returns The dummy page for that index.
 */
export function dummyVideoPage(
    pageIndex: number,
    pageSize: number,
    filters: IVideoFeedFilters = {}
): IVideoPage {
    const pool = filteredPoolIndices(filters);
    const start = pageIndex * pageSize;
    const items = pool.slice(start, start + pageSize).map(generateDummyBrowseVideo);

    return {
        items,
        pageIndex,
        pageSize,
        count: pool.length,
        hasNextPage: start + pageSize < pool.length
    };
}

/**
 * paddedVideoPage
 *
 * @description
 * Extends a sparse backend page with the dummy pool: the real items stay
 * first, dummies fill the remainder, and later pages continue through the pool
 * with pagination derived from the combined total. Keeps the browse feed
 * previewable while the backend holds only a handful of published videos.
 *
 * @param page - The real (sparse) page from the backend.
 * @param filters - The active feed filters.
 * @returns The combined page for that index.
 */
export function paddedVideoPage(page: IVideoPage, filters: IVideoFeedFilters = {}): IVideoPage {
    const pool = filteredPoolIndices(filters);
    const total = page.count + pool.length;
    const start = page.pageIndex * page.pageSize;

    const dummyStart = Math.max(0, start - page.count);
    const remaining = page.pageSize - page.items.length;
    const dummies = pool
        .slice(dummyStart, dummyStart + remaining)
        .map(generateDummyBrowseVideo);

    return {
        items: [...page.items, ...dummies],
        pageIndex: page.pageIndex,
        pageSize: page.pageSize,
        count: total,
        hasNextPage: start + page.pageSize < total
    };
}
