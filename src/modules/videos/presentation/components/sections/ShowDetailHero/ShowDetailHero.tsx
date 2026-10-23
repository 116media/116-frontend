import { VideoExclusiveShow } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow";
import type { VideoExclusiveShowViewProps } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/types";
import { SHOW_EPISODES_GROUND } from "@/modules/videos/presentation/constants/showColors";

/**
 * ShowDetailHero
 *
 * @description
 * Banner of the show page: the poster holds the left column with the newest episode
 * resting at its foot, narrowed on desktop so the artwork keeps breathing room, and the
 * right column carries the show itself — tag, title, meta, description and the watch CTA.
 */
export function ShowDetailHero({ category }: VideoExclusiveShowViewProps) {
    return (
        <VideoExclusiveShow.Root
            category={category}
            className="always-dark dark grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 lg:grid-cols-[1.2fr_1fr]"
        >
            <div className="relative flex min-h-112 flex-col justify-end overflow-hidden lg:min-h-130 lg:border-r">
                <VideoExclusiveShow.Poster />
                <VideoExclusiveShow.Scrim direction="panel" />

                <div className="relative lg:w-4/5">
                    <VideoExclusiveShow.Episodes
                        layout="stack"
                        limit={1}
                    />
                </div>
            </div>

            <div
                style={{ backgroundColor: SHOW_EPISODES_GROUND }}
                className="flex flex-col items-start justify-center gap-3 p-4 sm:p-6 lg:p-10"
            >
                <VideoExclusiveShow.Tag />
                <VideoExclusiveShow.Heading />
                <VideoExclusiveShow.Meta />
                <VideoExclusiveShow.WatchButton className="mt-2 h-13 w-full px-10 font-semibold text-base sm:w-auto" />
            </div>
        </VideoExclusiveShow.Root>
    );
}
