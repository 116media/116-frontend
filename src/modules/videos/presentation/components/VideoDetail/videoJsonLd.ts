import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { extractYoutubeId } from "@/shared/presentation/utils/youtube";

/**
 * videoJsonLd
 *
 * @description
 * Builds the schema.org `VideoObject` JSON-LD for the detail page from the
 * video entity: `name` (title), `description`, `thumbnailUrl`, `uploadDate`
 * (publishedAt), `embedUrl` (the YouTube embed URL derived via
 * `extractYoutubeId`), `genre` (category), `keywords` (tag names),
 * `publisher` (Organization), and `aggregateRating` — included only when
 * `ratingCount > 0`, since Google rejects zero-count ratings. Fields with no
 * data are omitted rather than emitted null. YouTube's own view/like/comment
 * stats are intentionally not embedded (they are fetched client-side and
 * would drift); the structured data stays server-truthful. Injected via a
 * single `<script type="application/ld+json">` in the server-rendered page so
 * crawlers get it on first paint with no client work.
 *
 * @param video - The resolved video detail entity.
 * @returns The JSON-LD object stringified into the script tag.
 */
export function videoJsonLd(video: IVideoDetailEntity): Record<string, unknown> {
    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title,
        description: video.metaDescription ?? video.description,
        genre: video.categoryName,
        publisher: { "@type": "Organization", name: "116" },
        mainEntityOfPage: { "@type": "WebPage", "@id": `/videos/${video.slug}` }
    };

    const youtubeId = extractYoutubeId(video.youtubeVideoUrl);

    if (video.thumbnailUrl) jsonLd.thumbnailUrl = [video.thumbnailUrl];
    if (video.publishedAt) jsonLd.uploadDate = video.publishedAt;
    if (youtubeId) jsonLd.embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
    if (video.tags.length > 0) jsonLd.keywords = video.tags.map((tag) => tag.name);
    if (video.ratingCount > 0) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: video.ratingAverage,
            ratingCount: video.ratingCount,
            bestRating: 5,
            worstRating: 1
        };
    }

    return jsonLd;
}
