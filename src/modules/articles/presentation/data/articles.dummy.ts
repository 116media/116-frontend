import type { IArticlePage } from "@/modules/articles/domain/entities/IArticlePage";
import type {
    IArticleAuthor,
    IArticleSummaryEntity
} from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * Fixed epoch the dummy dates count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-06-01T09:00:00Z");

/**
 * One day in milliseconds.
 */
const DAY_MS = 86_400_000;

/**
 * Rotation pool of category names for the dummy articles.
 */
const CATEGORIES = ["Music", "Arts & Culture", "Interviews", "Film", "Fashion", "Tech"];

/**
 * Rotation pool of article titles for the dummy articles.
 */
const TITLES = [
    "How Independent Artists Are Finding Success in the Streaming Era",
    "Inside the Studio: A Day With Rising Producers",
    "The Return of Vinyl and What It Means for Fans",
    "Festival Season: The Acts You Can't Miss",
    "Behind the Lens of a Music Video Director",
    "The New Wave of Afrobeats Crossing Borders"
];

/**
 * Rotation pool of article headlines for the dummy articles.
 */
const HEADLINES = [
    "With traditional labels losing influence, musicians are building direct fan relationships.",
    "A look at the tools and rituals shaping tomorrow's records.",
    "Physical media is thriving in a streaming-first world — here's why.",
    "From headliners to hidden gems, the season's essential line-up.",
    "How a single frame becomes a story audiences remember.",
    "The sound taking global charts by storm, one collaboration at a time."
];

/**
 * Rotation pool of cover image URLs for the dummy articles.
 */
const COVERS = [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80"
];

/**
 * Rotation pool of author bylines for the dummy articles.
 */
const AUTHORS: IArticleAuthor[] = [
    { userName: "Sarah Wilson", avatarUrl: "https://i.pravatar.cc/80?img=1" },
    { userName: "James Carter", avatarUrl: "https://i.pravatar.cc/80?img=12" },
    { userName: "Amara Okafor", avatarUrl: "https://i.pravatar.cc/80?img=45" },
    { userName: "Liam Nguyen", avatarUrl: "https://i.pravatar.cc/80?img=32" }
];

/**
 * isoOffsetFromBase
 *
 * @description
 * Deterministic ISO published date for a dummy article: `DUMMY_BASE_MS` minus `index`
 * days, so newer items sort first and the value never depends on the current time.
 *
 * @param index - The article index.
 * @returns An ISO 8601 date string.
 */
function isoOffsetFromBase(index: number): string {
    return new Date(DUMMY_BASE_MS - index * DAY_MS).toISOString();
}

/**
 * generateDummyArticles
 *
 * @description
 * Deterministic list of fully-populated article summaries for the feed grid while the
 * backend has no published content. Index-seeded (no Math.random / Date.now) so SSR and
 * client render identically. Populates every field the card reads, including the
 * card-only additions (`readTimeInMinutes`, `author`).
 *
 * @param count - How many to generate (default 48).
 * @returns An array of article summaries.
 */
export function generateDummyArticles(count = 48): IArticleSummaryEntity[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `dummy-article-${i}`,
        slug: `dummy-article-${i}`,
        categoryId: `dummy-category-${i % CATEGORIES.length}`,
        categoryName: CATEGORIES[i % CATEGORIES.length],
        title: TITLES[i % TITLES.length],
        headline: HEADLINES[i % HEADLINES.length],
        coverImageUrl: COVERS[i % COVERS.length],
        isPromoted: false,
        publishedAt: isoOffsetFromBase(i),
        readTimeInMinutes: 3 + (i % 10),
        author: AUTHORS[i % AUTHORS.length],
        likeCount: 40 + i * 7,
        commentCount: 5 + i * 2,
        shareCount: 3 + i,
        bookmarkCount: 10 + i
    }));
}

/**
 * dummyArticlePage
 *
 * @description
 * One page of the dummy articles as an `IArticlePage`, so `useArticlesFeed` can page
 * through the 48 items exactly like the backend. `hasNextPage` is derived from the slice
 * against the total, so the scroll sentinel keeps loading until the last page.
 *
 * @param pageIndex - Zero-based page to slice.
 * @param pageSize - Items per page.
 * @returns The dummy page for that index.
 */
export function dummyArticlePage(pageIndex: number, pageSize: number): IArticlePage {
    const all = generateDummyArticles();
    const start = pageIndex * pageSize;
    const items = all.slice(start, start + pageSize);
    return {
        items,
        pageIndex,
        pageSize,
        count: all.length,
        hasNextPage: start + pageSize < all.length
    };
}
