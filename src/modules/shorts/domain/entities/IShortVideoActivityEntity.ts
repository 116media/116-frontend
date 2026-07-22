import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * IShortVideoActivityEntity
 *
 * @description
 * A single short video the signed-in user has interacted with (liked, saved, or
 * shared), paired with the interaction metadata used to order and label the
 * favorites lists.
 *
 * @interface IShortVideoActivityEntity
 *
 * @property {IShortVideoEntity} shortVideo - The short the activity refers to.
 * @property {string} lastInteractedAt - ISO timestamp of the most recent interaction.
 * @property {number} interactionCount - How many times the user interacted with this short.
 */
export interface IShortVideoActivityEntity {
    lastInteractedAt: string;
    interactionCount: number;
    shortVideo: IShortVideoEntity;
}
