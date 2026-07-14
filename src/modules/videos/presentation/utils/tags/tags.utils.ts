import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";

/**
 * orderTags
 *
 * @description
 * Orders the tag strip so the active tag is always visible: if the active
 * `value` is not already among the popular tags, a placeholder entry for it is
 * prepended. Otherwise the popular order is kept.
 *
 * @param popular - The popular tags from the API.
 * @param value - The active tag slug, or undefined.
 * @returns The tags to render, active-first when needed.
 */
export function orderTags(
    popular: IVideoTagEntity[],
    value: string | undefined
): IVideoTagEntity[] {
    if (!value || popular.some((tag) => tag.slug === value)) return popular;
    return [{ id: value, name: value, slug: value }, ...popular];
}
