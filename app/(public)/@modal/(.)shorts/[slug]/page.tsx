import { cache } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortsOverlayContainer } from "@/modules/shorts/presentation/containers/ShortsOverlayContainer";
import { dummyShortBySlug } from "@/modules/shorts/presentation/data/shorts.dummy";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Props for the intercepted short overlay.
 *
 * @interface ShortOverlayRouteProps
 * @property {Promise<{ slug: string }>} params - The route params promise carrying the short `slug`.
 */
interface ShortOverlayRouteProps {
    params: Promise<{ slug: string }>;
}

/**
 * fetchShort
 *
 * @description
 * Fetches the short by slug through the server cradle, memoized per request, so the
 * overlay has its short even when it was opened by a link rather than from the feed, and
 * falls back to the padded short the slug names.
 *
 * @param slug - The short slug from the route.
 * @returns The resolved short entity, or null.
 */
const fetchShort = cache(async (slug: string): Promise<IShortVideoEntity | null> => {
    const cradle = await createServerCradle();
    const result = await cradle.getShortBySlugUseCase.execute(slug);
    return result.ok ? result.value : dummyShortBySlug(slug);
});

/**
 * ShortOverlayPage
 *
 * @description
 * Intercepts `/shorts/{slug}` reached from inside the app and renders the player over the
 * page that launched it, leaving that page mounted underneath. A refresh or a shared link
 * is not intercepted and renders the standalone route instead.
 *
 * @param params - The route params promise carrying the short `slug`.
 */
export default async function ShortOverlayPage({ params }: ShortOverlayRouteProps) {
    const { slug } = await params;
    const short = await fetchShort(slug);

    return (
        <ShortsOverlayContainer
            slug={slug}
            initialData={short ?? undefined}
        />
    );
}
