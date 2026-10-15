import { VideosMegaMenu as VideosMegaMenuRoot } from "./VideosMegaMenu";
import { VideosMegaMenuCategoryList } from "./VideosMegaMenu.CategoryList";

export type { VideosMegaMenuProps } from "./types";

/**
 * VideosMegaMenu
 *
 * @description
 * The videos mega menu: the root composes the shell, `.CategoryList` the category column.
 */
export const VideosMegaMenu = {
    Root: VideosMegaMenuRoot,
    CategoryList: VideosMegaMenuCategoryList
} as const;
