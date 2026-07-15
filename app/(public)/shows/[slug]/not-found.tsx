import { ShowDetailNotFound } from "@/modules/videos/presentation/components/pages/ShowDetail/ShowDetail.NotFound";

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
