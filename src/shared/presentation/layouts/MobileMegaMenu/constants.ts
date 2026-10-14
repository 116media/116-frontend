import {
    ARTICLES_PATH,
    ARTISTES_PATH,
    LYRICS_PATH,
    VIDEOS_PATH
} from "@/shared/presentation/constants/paths";

/**
 * The mobile menu's four sections, in render order. `label` is an i18n key inside
 * the `navigation` namespace; `href` is where a section with no panel navigates.
 */
export const MOBILE_MENU_TABS = [
    { value: "news", label: "navigation.mobileMenu.news", href: ARTICLES_PATH },
    { value: "videos", label: "navigation.mobileMenu.videos", href: VIDEOS_PATH },
    { value: "artistes", label: "navigation.mobileMenu.artistes", href: ARTISTES_PATH },
    { value: "lyrics", label: "navigation.mobileMenu.lyrics", href: LYRICS_PATH }
] as const;

/**
 * Horizontal travel, in px, past which a drag closes the panel instead of springing
 * back. Roughly a third of a 390px phone.
 */
export const SWIPE_CLOSE_THRESHOLD = 120;
