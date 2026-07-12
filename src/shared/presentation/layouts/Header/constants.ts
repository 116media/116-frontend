import {
    ARTICLES_PATH,
    ARTISTES_PATH,
    LYRICS_PATH,
    VIDEOS_PATH
} from "@/shared/presentation/constants/paths";

/**
 * Primary Header navigation items; entries with `hasMegaMenu` open a mega menu on hover.
 */
export const NAV_LINKS = [
    { label: "NEWS", href: ARTICLES_PATH, hasMegaMenu: true },
    { label: "VIDEOS", href: VIDEOS_PATH, hasMegaMenu: true },
    { label: "LYRICS", href: LYRICS_PATH, hasMegaMenu: false },
    { label: "ARTISTES", href: ARTISTES_PATH, hasMegaMenu: false }
] as const;
