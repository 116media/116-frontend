import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";

/**
 * Props for VideosGrid.
 *
 * @interface VideosGridProps
 * @property {IVideoSummaryEntity[]} videos - The accumulated video summaries to render.
 */
export interface VideosGridProps {
    videos: IVideoSummaryEntity[];
}

/**
 * VideosGrid
 *
 * @description
 * The responsive grid of vertical video cards for the browse feed (2/3/4
 * columns by breakpoint). Purely presentational; the container owns data and
 * paging.
 */
export function VideosGrid({ videos }: VideosGridProps) {
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
                <VideoCard.Vertical
                    key={video.id}
                    video={video}
                />
            ))}
        </div>
    );
}
