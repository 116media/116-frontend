import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";
import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import type { IArticleImage } from "@/modules/articles/domain/entities/IArticleImage";
import type { IArticleAuthor } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticleTagEntity } from "@/modules/articles/domain/entities/IArticleTagEntity";

import { generateDummyArticles } from "./articles.dummy";

/**
 * Fixed epoch the dummy comment dates count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-06-01T09:00:00Z");

/**
 * One hour in milliseconds.
 */
const HOUR_MS = 3_600_000;

/**
 * The maximum length the backend accepts for an article headline
 * (`ContentConstants.MaxHeadlineLength`). The dummy detail headline is padded to exactly
 * this length so the detail layout can be previewed against the longest allowed headline.
 */
const HEADLINE_MAX_LENGTH = 500;

/**
 * Readable filler appended (and finally sliced) to reach the exact headline max length.
 */
const HEADLINE_FILLER =
    " — and across the wider scene the ripples keep spreading, from late-night studios to" +
    " sold-out venues, as artists, fans, and the people behind them quietly redraw what" +
    " success looks like in an industry that no longer plays by yesterday's rules.";

/**
 * toMaxLengthHeadline
 *
 * @description
 * Extends a base headline with readable filler and slices the result to exactly
 * `HEADLINE_MAX_LENGTH` characters, so the dummy detail headline matches the backend's
 * maximum and the layout can be checked against the worst case. Deterministic (no
 * randomness), so SSR and client render identically.
 *
 * @param base - The seed headline to extend.
 * @returns A headline exactly `HEADLINE_MAX_LENGTH` characters long.
 */
function toMaxLengthHeadline(base: string): string {
    let text = base;
    while (text.length < HEADLINE_MAX_LENGTH) {
        text += HEADLINE_FILLER;
    }
    return text.slice(0, HEADLINE_MAX_LENGTH);
}

/**
 * The three in-body images every dummy article embeds, in order. Cover images come from
 * the shared feed pool (via `generateDummyArticles`); these are the body-only figures.
 */
const BODY_IMAGE_URLS = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80"
];

/**
 * Rotation pool of tag sets for the dummy article's tag block.
 */
const TAGS: IArticleTagEntity[] = [
    { id: "dummy-tag-music", name: "Music", slug: "music" },
    { id: "dummy-tag-culture", name: "Culture", slug: "culture" },
    { id: "dummy-tag-streaming", name: "Streaming", slug: "streaming" },
    { id: "dummy-tag-industry", name: "Industry", slug: "industry" }
];

/**
 * Rotation pool of comment authors (each with an avatar) for the dummy thread.
 */
const COMMENT_AUTHORS: IArticleAuthor[] = [
    { userName: "Nadia Bello", avatarUrl: "https://i.pravatar.cc/80?img=5", role: "Reader" },
    { userName: "Marcus Reed", avatarUrl: "https://i.pravatar.cc/80?img=13", role: "Reader" },
    { userName: "Priya Sharma", avatarUrl: "https://i.pravatar.cc/80?img=47", role: "Reader" },
    { userName: "Diego Alvarez", avatarUrl: "https://i.pravatar.cc/80?img=68", role: "Reader" },
    { userName: "Chloe Martin", avatarUrl: "https://i.pravatar.cc/80?img=24", role: "Reader" }
];

/**
 * Rotation pool of comment bodies for the dummy thread.
 */
const COMMENT_BODIES = [
    "This really captures where the industry is heading. Great read.",
    "Loved the point about direct fan relationships — so true right now.",
    "Been saying this for years. Nice to see it laid out clearly.",
    "The section on streaming economics was eye-opening, thanks for sharing.",
    "Would love a follow-up piece diving deeper into the numbers.",
    "Sharing this with my whole team. Excellent perspective."
];

/**
 * buildDummyBody
 *
 * @description
 * Builds the rich-text HTML body for a dummy article. Contains exactly three embedded
 * images (as `figure`/`img`/`figcaption` blocks) alongside headings, paragraphs, a list,
 * and a blockquote, so the Prose typography and the sanitized-HTML path are both exercised
 * in the preview.
 *
 * @param title - The article title, woven into the intro paragraph.
 * @returns The article body as an HTML string.
 */
function buildDummyBody(title: string): string {
    return `
        <p>${title}. What was once a fringe conversation has become the defining story of the
        modern music business — and the people living it have plenty to say.</p>

        <h2>A shifting landscape</h2>
        <p>For the first time, independent creators command the tools that were once locked
        behind major labels: distribution, analytics, and a direct line to their audience.</p>

        <figure>
            <img src="${BODY_IMAGE_URLS[0]}" alt="Artist performing on stage" />
            <figcaption>Independent artists are selling out venues on their own terms.</figcaption>
        </figure>

        <p>The economics are unfamiliar, but the incentives are clearer than ever. A handful
        of superfans can now matter more than a million passive listeners.</p>

        <blockquote>The middle is disappearing. You either build something people love, or you
        disappear into the feed.</blockquote>

        <h2>Inside the studio</h2>
        <p>Behind every release is a ritual — late nights, small rooms, and an obsessive
        attention to the details most listeners never consciously notice.</p>

        <figure>
            <img src="${BODY_IMAGE_URLS[1]}" alt="Producer working at a mixing desk" />
            <figcaption>The modern studio is smaller, cheaper, and more capable than ever.</figcaption>
        </figure>

        <ul>
            <li>Ownership of masters is becoming the norm, not the exception.</li>
            <li>Community is the new radio — playlists follow the fans, not the other way around.</li>
            <li>Data closes the loop between a release and the people it reaches.</li>
        </ul>

        <h2>What comes next</h2>
        <p>The next decade belongs to the artists who treat their careers as a direct
        relationship rather than a lottery ticket.</p>

        <figure>
            <img src="${BODY_IMAGE_URLS[2]}" alt="Crowd at a live music festival" />
            <figcaption>The audience has never been closer — or more decisive.</figcaption>
        </figure>

        <p>Whatever happens, the gatekeepers of yesterday no longer hold the only keys.</p>
    `.trim();
}

/**
 * dummyArticleDetail
 *
 * @description
 * A fully-populated `IArticleDetailEntity` for the detail-page preview while the backend
 * has no published content. Reuses the shared feed dummies (`generateDummyArticles`) so the
 * card a reader clicked and the article they land on agree on title, cover, author, and
 * counts. Index-seeded from the slug (no Math.random / Date.now) so SSR and client render
 * identically. The body embeds three images; the `images` array carries the cover plus the
 * three body figures.
 *
 * @param slug - The requested slug; matched against the feed dummies, falling back to the first.
 * @returns The dummy article detail entity.
 */
export function dummyArticleDetail(slug: string): IArticleDetailEntity {
    const summaries = generateDummyArticles();
    const summary = summaries.find((article) => article.slug === slug) ?? summaries[0];

    const bodyImages: IArticleImage[] = BODY_IMAGE_URLS.map((url, index) => ({
        id: `${summary.id}-body-image-${index}`,
        url,
        type: "body"
    }));
    const images: IArticleImage[] = summary.coverImageUrl
        ? [{ id: `${summary.id}-cover`, url: summary.coverImageUrl, type: "cover" }, ...bodyImages]
        : bodyImages;

    return {
        id: summary.id,
        categoryId: summary.categoryId,
        categoryName: summary.categoryName,
        title: summary.title,
        slug: summary.slug,
        headline: toMaxLengthHeadline(summary.headline),
        body: buildDummyBody(summary.title),
        coverImageUrl: summary.coverImageUrl,
        author: summary.author ?? null,
        tags: TAGS,
        images,
        readTimeInMinutes: summary.readTimeInMinutes ?? 5,
        likeCount: summary.likeCount,
        commentCount: summary.commentCount,
        shareCount: summary.shareCount,
        bookmarkCount: summary.bookmarkCount ?? 0,
        isLiked: false,
        isBookmarked: false,
        publishedAt: summary.publishedAt,
        metaTitle: summary.title,
        metaDescription: summary.headline
    };
}

/**
 * generateDummyComments
 *
 * @description
 * Deterministic list of dummy comments, each with an avatar-bearing author, for the
 * comments-section preview. Index-seeded (no Math.random / Date.now) so SSR and client
 * render identically; dates count back one hour per comment so newer items sort first.
 *
 * @param count - How many comments to generate (default 8).
 * @returns An array of dummy comments.
 */
export function generateDummyComments(count = 8): IArticleCommentEntity[] {
    return Array.from({ length: count }, (_, index) => {
        const author = COMMENT_AUTHORS[index % COMMENT_AUTHORS.length];
        return {
            id: `dummy-comment-${index}`,
            userId: `dummy-user-${index}`,
            body: COMMENT_BODIES[index % COMMENT_BODIES.length],
            isDeleted: false,
            createdAt: new Date(DUMMY_BASE_MS - index * HOUR_MS).toISOString(),
            author
        };
    });
}

/**
 * dummyArticleCommentPage
 *
 * @description
 * One page of the dummy comments as an `IArticleCommentPage`, so `useArticleComments` can
 * page through them exactly like the backend. `hasNextPage` is derived from the slice
 * against the total so the load-more sentinel keeps loading until the last page.
 *
 * @param pageIndex - Zero-based page to slice.
 * @param pageSize - Items per page.
 * @returns The dummy comment page for that index.
 */
export function dummyArticleCommentPage(pageIndex: number, pageSize: number): IArticleCommentPage {
    const all = generateDummyComments();
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

/**
 * dummyPopularArticles
 *
 * @description
 * A short list of article summaries for the popular-sidebar preview, each carrying a single
 * cover image, sourced from the shared feed dummies and excluding the article currently
 * open.
 *
 * @param currentArticleId - The open article's id, excluded from the list.
 * @param limit - Maximum number of rows to return (default 5).
 * @returns Up to `limit` article summaries, each with a cover image.
 */
export function dummyPopularArticles(currentArticleId: string, limit = 5) {
    return generateDummyArticles()
        .filter((article) => article.id !== currentArticleId && article.coverImageUrl)
        .slice(0, limit);
}
