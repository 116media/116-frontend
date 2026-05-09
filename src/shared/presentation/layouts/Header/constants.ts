import {
    ARTICLES_PATH,
    ARTISTES_PATH,
    LYRICS_PATH,
    VIDEOS_PATH
} from "@/shared/presentation/constants/paths";

/**
 * NAV_LINKS
 *
 * @description
 * Primary navigation items displayed in the centre of the Header.
 * Articles and Vidéos trigger a mega menu on hover.
 * Lyrics and Artistes are plain links with no sub-menu.
 *
 * @property label - Visible link text
 * @property href - Navigation target sourced from route path constants
 * @property hasMegaMenu - Whether this item opens a mega menu on hover
 */
export const NAV_LINKS = [
    { label: "NEWS", href: ARTICLES_PATH, hasMegaMenu: true },
    { label: "VIDEOS", href: VIDEOS_PATH, hasMegaMenu: true },
    { label: "LYRICS", href: LYRICS_PATH, hasMegaMenu: false },
    { label: "ARTISTES", href: ARTISTES_PATH, hasMegaMenu: false }
] as const;
