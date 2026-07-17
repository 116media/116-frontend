import type { Metadata } from "next";
import { cache } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortDetailContainer } from "@/modules/shorts/presentation/containers/ShortDetailContainer";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Props for the short detail route and its metadata.
 *
 * @interface ShortDetailRouteProps
 * @property {Promise<{ slug: string }>} params - The route params promise carrying the short `slug`.
 */
interface ShortDetailRouteProps {
    params: Promise<{ slug: string }>;
}

/**
 * fetchShort
 *
 * @description
 * Fetches the short by slug through the server cradle, memoized per request with
 * React `cache` so the page render and `generateMetadata` share one backend call.
 * Returns null when the short cannot be fetched.
 *
 * @param slug - The short slug from the route.
 * @returns The resolved short entity, or null.
 */
const fetchShort = cache(async (slug: string): Promise<IShortVideoEntity | null> => {
    const cradle = await createServerCradle();
    const result = await cradle.getShortBySlugUseCase.execute(slug);
    return result.ok ? result.value : null;
});

/**
 * generateMetadata
 *
 * @description
 * Server-side share preview for a shared short: the short's title, its thumbnail as
 * the Open Graph / Twitter image, and the canonical `/shorts/{slug}` URL. Falls back
 * to generic copy when the short cannot be resolved.
 *
 * @param params - The route params promise carrying the short `slug`.
 * @returns The metadata for the short deep-link page.
 */
export async function generateMetadata({ params }: ShortDetailRouteProps): Promise<Metadata> {
    const { slug } = await params;
    const short = await fetchShort(slug);

    if (!short) return { title: "Shorts" };

    const canonical = `/shorts/${short.slug}`;
    const images = short.thumbnailUrl ? [short.thumbnailUrl] : [];

    return {
        title: short.title,
        alternates: { canonical },
        openGraph: {
            type: "video.other",
            title: short.title,
            url: canonical,
            images,
            videos: short.videoUrl ? [short.videoUrl] : undefined
        },
        twitter: {
            card: "player",
            title: short.title,
            images
        }
    };
}

/**
 * ShortDetailPage
 *
 * @description
 * The public by-slug short route (`/shorts/[slug]`). Fetches the short server-side
 * (request-memoized, shared with `generateMetadata`) for the share preview and seeds
 * the client container as `initialData` so the player opens without a refetch.
 *
 * @param params - The route params promise carrying the short `slug`.
 */
export default async function ShortDetailPage({ params }: ShortDetailRouteProps) {
    const { slug } = await params;
    const short = await fetchShort(slug);

    return (
        <ShortDetailContainer
            slug={slug}
            initialData={short ?? undefined}
        />
    );
}
