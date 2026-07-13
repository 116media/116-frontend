import { ShowDetailLoading } from "@/modules/videos/presentation/components/pages/ShowDetail/ShowDetail.Loading";

/**
 * Loading
 *
 * @description
 * The streaming fallback for the show detail route, shown while the async page
 * resolves the show server-side. Renders the full-page show skeleton so the
 * shell appears instantly and real content drops in with no layout shift.
 */
export default function Loading() {
    return <ShowDetailLoading />;
}
