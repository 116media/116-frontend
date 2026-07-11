import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * IVideoExclusiveShowEntity
 *
 * @description
 * Domain entity for the "exclusive show" — the single category flagged as
 * exclusive, extending the show shape with its episodes. Maps from the public
 * exclusive-category response, exposing the category's videos as episodes.
 *
 * @interface IVideoExclusiveShowEntity
 * @augments IShowEntity
 *
 * @property {IVideoSummaryEntity[]} episodes - The show's episodes for the current page
 */
export interface IVideoExclusiveShowEntity extends IShowEntity {
    episodes: IVideoSummaryEntity[];
}
