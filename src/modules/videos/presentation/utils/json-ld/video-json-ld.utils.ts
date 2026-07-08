import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import {
    buildYoutubeEmbedUrl,
    extractYoutubeId
} from "@/shared/presentation/utils/youtube/youtube.utils";

/**
 * videoJsonLd
 *
 * @description
 * Builds the schema.org `VideoObject` JSON-LD for the detail page from the
 * video entity. Fields with no data are omitted, and `aggregateRating` appears
 * only when `ratingCount > 0`, since Google rejects zero-count ratings.
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
    if (youtubeId) jsonLd.embedUrl = buildYoutubeEmbedUrl(youtubeId);
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
