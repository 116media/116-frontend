import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * mostRecentEpisode
 *
 * @description
 * Picks the episode with the latest `publishedAt`, skipping unpublished ones.
 * Backs the exclusive show watch CTA, which always targets the newest episode.
 *
 * @param episodes - The show's episodes.
 * @returns The most recently published episode, or null when none is published.
 */
export function mostRecentEpisode(episodes: IVideoSummaryEntity[]): IVideoSummaryEntity | null {
    return episodes.reduce<IVideoSummaryEntity | null>((latest, episode) => {
        if (!episode.publishedAt) return latest;
        if (!latest?.publishedAt || episode.publishedAt > latest.publishedAt) return episode;
        return latest;
    }, null);
}

/**
 * newestEpisodes
 *
 * @description
 * The most recently published episodes first, capped to `limit`. Unpublished episodes sort
 * last so a draft never takes the "latest episode" slot.
 *
 * @param episodes - The show's episodes.
 * @param limit - How many to keep.
 * @returns The newest episodes, newest first.
 */
export function newestEpisodes(
    episodes: IVideoSummaryEntity[],
    limit: number
): IVideoSummaryEntity[] {
    return [...episodes]
        .sort((left, right) => (right.publishedAt ?? "").localeCompare(left.publishedAt ?? ""))
        .slice(0, limit);
}
