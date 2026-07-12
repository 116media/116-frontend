import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { VideoDetailContainer } from "@/modules/videos/presentation/containers/VideoDetailContainer";
import { dummyVideoDetail } from "@/modules/videos/presentation/data/video-detail.dummy";
import { videoJsonLd } from "@/modules/videos/presentation/utils/json-ld/video-json-ld.utils";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Length the meta description is truncated to when derived from the raw
 * description text.
 */
const META_DESCRIPTION_LENGTH = 160;

/**
 * Props for the video detail route and its metadata.
 *
 * @interface VideoDetailRouteProps
 * @property {Promise<{ slug: string }>} params - The route params promise carrying the
 * video `slug`.
 */
interface VideoDetailRouteProps {
    params: Promise<{ slug: string }>;
}

/**
 * fetchVideo
 *
 * @description
 * Fetches the video by slug through the server cradle, memoized per request
 * with React `cache` so the page render and `generateMetadata` share a single
 * backend call. Returns null when the video is missing or unpublished so both
 * callers can gate through `notFound()`.
 *
 * Dummy-data phase: while the backend has no published content, a failed
 * fetch falls back to a fully-populated dummy video so the detail page is
 * previewable; the value never resolves to null, so `notFound()` stays
 * dormant until the backend is wired.
 *
 * @param slug - The video slug from the route.
 * @returns The resolved video entity, or null when it cannot be fetched.
 */
const fetchVideo = cache(async (slug: string): Promise<IVideoDetailEntity | null> => {
    const cradle = await createServerCradle();
    const result = await cradle.getVideoBySlugUseCase.execute(slug);
    return result.ok ? result.value : dummyVideoDetail(slug);
});

/**
 * generateMetadata
 *
 * @description
 * Server-side SEO for the single-video route. Awaits the `slug` and fetches
 * the video through the request-memoized fetch; a missing video triggers
 * `notFound()`. Returns the title (`metaTitle` first, else the video title),
 * description (`metaDescription` first, else the description truncated to
 * ~160 chars), the canonical `/videos/{slug}` URL, an Open Graph
 * "video.other" object (thumbnail plus the YouTube URL), and a Twitter
 * card — `player` when a YouTube URL exists, else the large-image
 * summary. Image entries are omitted when there is no thumbnail so a share
 * preview is never broken.
 *
 * @param params - The route params promise carrying the video `slug`.
 * @returns The metadata for the video page.
 */
export async function generateMetadata({ params }: VideoDetailRouteProps): Promise<Metadata> {
    const { slug } = await params;
    const video = await fetchVideo(slug);

    if (!video) notFound();

    const title = video.metaTitle ?? video.title;
    const description =
        video.metaDescription ?? video.description.slice(0, META_DESCRIPTION_LENGTH);
    const canonical = `/videos/${video.slug}`;
    const images = video.thumbnailUrl ? [video.thumbnailUrl] : [];

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: "video.other",
            title,
            description,
            url: canonical,
            images,
            videos: video.youtubeVideoUrl ? [video.youtubeVideoUrl] : undefined
        },
        twitter: {
            card: video.youtubeVideoUrl ? "player" : "summary_large_image",
            title,
            description,
            images
        }
    };
}

/**
 * VideoDetailPage
 *
 * @description
 * The public single-video route (`/videos/[slug]`). Awaits the dynamic `slug`
 * and fetches the video server-side (request-memoized, shared with
 * `generateMetadata`) for SEO and a fast first paint. A missing or
 * unpublished video triggers `notFound()`. The resolved entity seeds the
 * client `VideoDetailContainer` as `initialData` so the client query hydrates
 * without a refetch, and the schema.org `VideoObject` JSON-LD is rendered
 * server-side so crawlers get it on first paint.
 *
 * @param params - The route params promise carrying the video `slug`.
 */
export default async function VideoDetailPage({ params }: VideoDetailRouteProps) {
    const { slug } = await params;
    const video = await fetchVideo(slug);

    if (!video) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON built from mapped entity data, not user HTML
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd(video)) }}
            />
            <VideoDetailContainer
                slug={slug}
                initialData={video}
            />
        </>
    );
}
