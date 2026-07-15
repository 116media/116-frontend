import Image from "next/image";

import { VideoExclusiveShowHeading } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/VideoExclusiveShow.Heading";
import { VideoExclusiveShowRoot } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/VideoExclusiveShow.Root";
import { VideoExclusiveShowWatchButton } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/VideoExclusiveShow.WatchButton";
import type { VideoExclusiveShowViewProps } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow/types";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { NoiseBackground } from "@/shared/presentation/components/ui/NoiseBackground";
import { withAlpha } from "@/shared/presentation/utils/color/color.utils";

/**
 * ShowDetailHero
 *
 * @description
 * Banner of the show page: the show poster on the left beside a panel holding
 * the title, description, and the watch CTA targeting the show's most recent
 * episode. The backdrop is the poster itself, blurred and tinted with the
 * show's poster-derived background color; the content panel drives the row
 * height.
 */
export function ShowDetailHero({ category }: VideoExclusiveShowViewProps) {
    const background = category.colors?.background ?? SHOW_FALLBACK_COLORS.background;

    return (
        <VideoExclusiveShowRoot
            category={category}
            className="always-dark dark relative grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border p-4 sm:p-12 lg:h-120 lg:grid-cols-2 lg:gap-6"
        >
            {category.posterUrl && (
                <Image
                    fill
                    aria-hidden
                    alt=""
                    src={category.posterUrl}
                    className="scale-110 object-cover blur-sm"
                    sizes="100vw"
                />
            )}
            <div
                aria-hidden
                className="absolute inset-0"
                style={{ backgroundColor: withAlpha(background, 0.75) }}
            />

            <div className="relative flex aspect-video min-h-0 items-center justify-center lg:aspect-auto">
                {category.posterUrl && (
                    <NoiseBackground>
                        <Image
                            priority
                            width={720}
                            height={405}
                            alt={category.name}
                            src={category.posterUrl}
                            className="h-48 w-auto rounded-lg object-contain sm:h-56 lg:h-64"
                        />
                    </NoiseBackground>
                )}
            </div>

            <div className="relative flex min-h-0 flex-col justify-center gap-4 p-6 sm:p-8 lg:p-12">
                <VideoExclusiveShowHeading clamp={false} />
                <div>
                    <VideoExclusiveShowWatchButton className="px-8 font-semibold" />
                </div>
            </div>
        </VideoExclusiveShowRoot>
    );
}
