/**
 * IPlaylistEntity
 *
 * @description
 * Domain entity representing one playlist owned by the signed-in user, as
 * listed in the add-to-playlist modal. Maps 1:1 from PlaylistDto.
 *
 * @interface IPlaylistEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - User-chosen playlist name
 * @property {number} videoCount - Number of videos currently in the playlist
 */
export interface IPlaylistEntity {
    id: string;
    name: string;
    videoCount: number;
}
