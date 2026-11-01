import { Fragment } from "react";

import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for ComingSoonVideos.Loading.
 *
 * @interface ComingSoonVideosLoadingProps
 * @property {number} [count] - How many placeholder cards to render. Defaults to four.
 */
export interface ComingSoonVideosLoadingProps {
    count?: number;
}

/**
 * ComingSoonVideos.Loading
 *
 * @description
 * Placeholder cards on the vertical card's footprint, rendered inside the caller's grid
 * so the strip holds its row while the videos resolve.
 */
export function ComingSoonVideosLoading({ count = 4 }: ComingSoonVideosLoadingProps) {
    return (
        <Fragment>
            {Array.from({ length: count }, (_, index) => index).map((slot) => (
                <div
                    key={`coming-soon-video-${slot}`}
                    className="flex flex-col gap-2"
                >
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            ))}
        </Fragment>
    );
}
