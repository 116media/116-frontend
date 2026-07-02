/**
 * IVideoLyricsEntity
 *
 * @description
 * Domain entity representing the lyrics linked to a video, rendered inside the
 * detail page's lyrics tab. Maps from LyricsDto — drops the author and SEO
 * fields, which belong to the standalone lyrics page, not this embedded view.
 *
 * @interface IVideoLyricsEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} songTitle - Title of the song the lyrics belong to
 * @property {string} artistName - Performing artist's display name
 * @property {string} lyricsText - Full lyrics body (plain text with line breaks)
 * @property {string} language - Language the lyrics are written in
 */
export interface IVideoLyricsEntity {
    id: string;
    songTitle: string;
    artistName: string;
    lyricsText: string;
    language: string;
}
