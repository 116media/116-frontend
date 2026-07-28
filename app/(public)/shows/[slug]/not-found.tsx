import type { Metadata } from "next";
import { ShowDetailNotFound } from "@/modules/videos/presentation/components/pages/ShowDetail/ShowDetail.NotFound";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the not-found boundary's title from the active server language, reusing the same
 * string rendered as the empty-state heading.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("videos.shows.notFound.title") };
}

/**
 * NotFound
 *
 * @description
 * The not-found boundary for the show detail route, rendered when the page
 * calls Next's `notFound()` for a slug matching no show. Delegates to the
 * shared show-detail not-found view (an `EmptyState` with a link back to the
 * shows page) and sets a proper 404 status for crawlers.
 */
export default function NotFound() {
    return <ShowDetailNotFound />;
}
