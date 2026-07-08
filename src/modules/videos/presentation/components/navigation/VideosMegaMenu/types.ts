import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";

/**
 * VideosMegaMenuProps
 *
 * @description
 * Props for the videos mega menu panel.
 * Data is prefetched server-side in PublicLayout and passed down
 * through Header → DesktopNav → VideosMegaMenu.
 */
export interface VideosMegaMenuProps {
    categories: IVideoCategoryEntity[];
    promotedVideos: IVideoSummaryEntity[];
    popularTags: IVideoTagEntity[];
}

/**
 * VideosMegaMenuCategoryListProps
 *
 * @description
 * Props for the category list column inside the videos mega menu.
 */
export interface VideosMegaMenuCategoryListProps {
    categories: IVideoCategoryEntity[];
}
