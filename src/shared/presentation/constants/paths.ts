/**
 * Application route path constants.
 *
 * @description
 * Centralized route paths for consistent navigation throughout the application.
 * Use these constants instead of hardcoded strings to avoid typos and ease refactoring.
 *
 * **Public Routes:**
 * - Home: Landing page with the content feed
 * - Articles: Article listing and detail pages
 * - Videos: Video listing and detail pages
 * - Lyrics: Lyrics listing and detail pages
 * - Artistes: Artist profile listing and detail pages
 *
 * **User Routes:**
 * - Profile: Authenticated user profile page
 * - Bookmarks: Saved content
 * - Playlists: User playlists
 * - Settings: User preferences
 */

export const HOME_PATH = "/";

export const ARTICLES_PATH = "/articles";
export const ARTICLE_DETAIL_PATH = "/articles/:slug";

export const VIDEOS_PATH = "/videos";
export const VIDEO_DETAIL_PATH = "/videos/:slug";

export const SHOWS_PATH = "/shows";

export const LYRICS_PATH = "/lyrics";
export const LYRICS_DETAIL_PATH = "/lyrics/:slug";

export const ARTISTES_PATH = "/artistes";
export const ARTISTE_DETAIL_PATH = "/artistes/:slug";

export const PROFILE_PATH = "/profile";
export const BOOKMARKS_PATH = "/profile/bookmarks";
export const PLAYLISTS_PATH = "/profile/playlists";
export const SETTINGS_PATH = "/profile/settings";
