import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import { VIDEOS_PAGE_SIZE } from "@/modules/videos/presentation/constants/videoKeys";
import { ShowDetailContainer } from "@/modules/videos/presentation/containers/ShowDetailContainer";
import { generateDummyShows } from "@/modules/videos/presentation/data/shows.dummy";
import { dummyVideoPage } from "@/modules/videos/presentation/data/videos-browse.dummy";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Props for the show detail route and its metadata.
 *
 * @interface ShowDetailRouteProps
 * @property {Promise<{ slug: string }>} params - The route params promise carrying the
 * show `slug`.
 */
interface ShowDetailRouteProps {
    params: Promise<{ slug: string }>;
}

/**
 * fetchShow
 *
 * @description
 * Resolves the show by slug through the server cradle, memoized per request
 * with React `cache` so the page render and `generateMetadata` share the
 * calls. The categories endpoint has no by-slug lookup, so the show is found
 * in the active list; its first episodes page backs the hero's watch CTA.
 * While the backend is sparse, dummy shows and episodes keep the page
 * previewable; a truly unknown slug resolves to null.
 *
 * @param slug - The show slug from the route.
 * @returns The resolved show with episodes, or null when it cannot be found.
 */
const fetchShow = cache(async (slug: string): Promise<IVideoExclusiveShowEntity | null> => {
    const cradle = await createServerCradle();

    const result = await cradle.getShowsUseCase.execute();
    const shows = result.ok ? result.value : [];
    const show =
        shows.find((entry) => entry.slug === slug) ??
        generateDummyShows().find((entry) => entry.slug === slug);

    if (!show) return null;

    const page = await cradle.getPublishedVideosUseCase.execute({
        pageIndex: 0,
        pageSize: VIDEOS_PAGE_SIZE,
        categoryId: show.id
    });
    const episodes =
        page.ok && page.value.items.length > 0
            ? page.value.items
            : dummyVideoPage(0, VIDEOS_PAGE_SIZE, { categoryId: show.id }).items;

    return { ...show, episodes };
});

/**
 * generateMetadata
 *
 * @description
 * Server-side SEO for the single-show route: the show name as title, its
 * description, the canonical `/shows/{slug}` URL, and the poster as the
 * Open Graph / Twitter image when available.
 *
 * @param params - The route params promise carrying the show `slug`.
 * @returns The metadata for the show page.
 */
export async function generateMetadata({ params }: ShowDetailRouteProps): Promise<Metadata> {
    const { slug } = await params;
    const show = await fetchShow(slug);

    if (!show) notFound();

    const canonical = `/shows/${show.slug}`;
    const images = show.posterUrl ? [show.posterUrl] : [];

    return {
        title: show.name,
        description: show.description,
        alternates: { canonical },
        openGraph: {
            title: show.name,
            description: show.description,
            url: canonical,
            images
        },
        twitter: {
            card: "summary_large_image",
            title: show.name,
            description: show.description,
            images
        }
    };
}

/**
 * ShowDetailPage
 *
 * @description
 * The public single-show route (`/shows/[slug]`). Awaits the dynamic `slug`,
 * resolves the show server-side (request-memoized, shared with
 * `generateMetadata`), and renders the split hero above the show's infinite
 * episode grid. An unknown slug triggers `notFound()`.
 *
 * @param params - The route params promise carrying the show `slug`.
 */
export default async function ShowDetailPage({ params }: ShowDetailRouteProps) {
    const { slug } = await params;
    const show = await fetchShow(slug);

    if (!show) notFound();

    return <ShowDetailContainer category={show} />;
}
