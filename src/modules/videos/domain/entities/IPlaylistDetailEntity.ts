import type { IPlaylistVideoEntity } from "@/modules/videos/domain/entities/IPlaylistVideoEntity";

/**
 * IPlaylistDetailEntity
 *
 * @description
 * One playlist together with its ordered videos, for the playlist detail view.
 * Maps from PlaylistDetailDto.
 *
 * @interface IPlaylistDetailEntity
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - User-chosen playlist name
 * @property {IPlaylistVideoEntity[]} videos - The playlist's videos in playlist order
 */
export interface IPlaylistDetailEntity {
    id: string;
    name: string;
    videos: IPlaylistVideoEntity[];
}
