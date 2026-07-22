/**
 * IPlaylistEntity
 *
 * @description
 * Domain entity representing one playlist owned by the signed-in user, as listed
 * in the add-to-playlist modal and the favorites playlists grid. Maps from
 * PlaylistDto — `thumbnailUrls` holds up to four ordered slots (a null slot marks
 * a video without artwork) used to render the playlist cover collage.
 *
 * @interface IPlaylistEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - User-chosen playlist name
 * @property {number} videoCount - Number of videos currently in the playlist
 * @property {Array<string | null>} thumbnailUrls - Up to four ordered cover slots (null when the video has no thumbnail)
 */
export interface IPlaylistEntity {
    id: string;
    name: string;
    videoCount: number;
    thumbnailUrls: Array<string | null>;
}
