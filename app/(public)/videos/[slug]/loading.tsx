import { VideoDetailLoading } from "@/modules/videos/presentation/components/VideoDetail/VideoDetail.Loading";

/**
 * Loading
 *
 * @description
 * The streaming fallback for the video detail route, shown while the async
 * page fetches the video server-side. Renders the full-page video skeleton so
 * the shell appears instantly and real content drops in with no layout shift.
 */
export default function Loading() {
    return <VideoDetailLoading />;
}
