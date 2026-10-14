import { MobileMegaMenu as MobileMegaMenuRoot } from "./MobileMegaMenu";
import { MobileMegaMenuArtists } from "./MobileMegaMenu.Artists";
import { MobileMegaMenuChips } from "./MobileMegaMenu.Chips";
import { MobileMegaMenuFeatured } from "./MobileMegaMenu.Featured";
import { MobileMegaMenuFooter } from "./MobileMegaMenu.Footer";
import { MobileMegaMenuHeader } from "./MobileMegaMenu.Header";
import { MobileMegaMenuList } from "./MobileMegaMenu.List";
import { MobileMegaMenuLyrics } from "./MobileMegaMenu.Lyrics";
import { MobileMegaMenuSection } from "./MobileMegaMenu.Section";
import { MobileMegaMenuTags } from "./MobileMegaMenu.Tags";

export type {
    MobileMegaMenuChipItem,
    MobileMegaMenuChipsProps,
    MobileMegaMenuFeaturedProps,
    MobileMegaMenuFooterProps,
    MobileMegaMenuListItem,
    MobileMegaMenuListProps,
    MobileMegaMenuProps,
    MobileMegaMenuSectionProps,
    MobileMegaMenuTagsProps
} from "./types";

/**
 * MobileMegaMenu
 *
 * @description
 * The full-screen navigation panel below `lg`: the root owns the sheet and its tabs, with
 * `.Header`, `.Footer`, `.Section`, `.List`, `.Chips`, `.Tags`, `.Featured`, `.Artists` and
 * `.Lyrics` as the regions each module's panel composes.
 */
export const MobileMegaMenu = {
    Root: MobileMegaMenuRoot,
    Artists: MobileMegaMenuArtists,
    Chips: MobileMegaMenuChips,
    Featured: MobileMegaMenuFeatured,
    Footer: MobileMegaMenuFooter,
    Header: MobileMegaMenuHeader,
    List: MobileMegaMenuList,
    Lyrics: MobileMegaMenuLyrics,
    Section: MobileMegaMenuSection,
    Tags: MobileMegaMenuTags
} as const;
