import { VideosMegaMenuCard } from "@/modules/videos/presentation/components/cards/VideosMegaMenuCard";
import { DUMMY_VIDEOS } from "@/modules/videos/presentation/data/mega-menu.dummy";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { MegaMenuShell } from "@/shared/presentation/layouts/MegaMenuShell";
import type { VideosMegaMenuProps } from "./types";
import { VideosMegaMenuCategoryList } from "./VideosMegaMenu.CategoryList";

/**
 * VideosMegaMenu
 *
 * @description
 * Mega menu panel for the VIDEOS nav item, laid out with MegaMenuShell. Data
 * is prefetched server-side and received as props — no client-side fetching
 * or loading state. Dummy placeholders cover an empty promoted list.
 */
export function VideosMegaMenu({ categories, promotedVideos, popularTags }: VideosMegaMenuProps) {
    const cards = promotedVideos.length > 0 ? promotedVideos.slice(0, 4) : DUMMY_VIDEOS;
    const featured = cards.slice(0, 2);
    const compact = cards.slice(2, 4);

    return (
        <MegaMenuShell.Root
            popularTags={popularTags}
            tagsBasePath={VIDEOS_PATH}
        >
            <MegaMenuShell.Categories>
                <VideosMegaMenuCategoryList categories={categories} />
            </MegaMenuShell.Categories>

            <MegaMenuShell.Cards viewAllHref={VIDEOS_PATH}>
                <div className="grid grid-cols-2 gap-2 grid-rows-[288px] lg:grid-rows-[320px]">
                    {featured[0] && <VideosMegaMenuCard.FeaturedFullBleed video={featured[0]} />}
                    {featured[1] && <VideosMegaMenuCard.FeaturedSpotlight video={featured[1]} />}
                </div>
                <div className="grid grid-cols-2 gap-2 grid-rows-[168px] lg:grid-rows-[180px]">
                    {compact.map((video) => (
                        <VideosMegaMenuCard.Compact
                            key={video.id}
                            video={video}
                        />
                    ))}
                </div>
            </MegaMenuShell.Cards>
        </MegaMenuShell.Root>
    );
}
