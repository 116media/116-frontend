import { VideoDetailNotFound } from "@/modules/videos/presentation/components/pages/VideoDetail/VideoDetail.NotFound";

/**
 * NotFound
 *
 * @description
 * The not-found boundary for the video detail route, rendered when the page
 * calls Next's `notFound()` for a missing or unpublished slug. Delegates to
 * the shared video-detail not-found view (an `EmptyState` with a link back to
 * the videos page) and sets a proper 404 status for crawlers.
 */
export default function NotFound() {
    return <VideoDetailNotFound />;
}
