import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * IVideoActivityEntity
 *
 * @description
 * One published video the signed-in user has interacted with (rated or shared),
 * carrying the user's own interaction metadata. Maps from UserVideoActivityDto —
 * `ratedStars` is present on the rated feed, `lastShareChannel` on the shared feed.
 *
 * @interface IVideoActivityEntity
 *
 * @property {IVideoSummaryEntity} video - The video the activity is about
 * @property {string} lastInteractedAt - ISO timestamp of the most recent interaction
 * @property {number} interactionCount - Number of times the user interacted with the video
 * @property {number} [ratedStars] - The user's own star rating (1–5), rated feed only
 * @property {string} [lastShareChannel] - The user's most recent share channel, shared feed only
 */
export interface IVideoActivityEntity {
    video: IVideoSummaryEntity;
    lastInteractedAt: string;
    interactionCount: number;
    ratedStars?: number;
    lastShareChannel?: string;
}
