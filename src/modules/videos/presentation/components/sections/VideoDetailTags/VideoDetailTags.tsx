"use client";

import { useTranslation } from "react-i18next";

import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for the VideoDetail.Tags component.
 *
 * @interface VideoDetailTagsProps
 * @property {IVideoTagEntity[]} tags - The video's tags.
 */
export interface VideoDetailTagsProps {
    tags: IVideoTagEntity[];
}

/**
 * VideoDetail.Tags
 *
 * @description
 * The tag block under the header: a "Tags:" label followed by hashtag pills
 * linking to the tag-filtered videos feed, matching the article tag block.
 * Renders nothing when there are no tags.
 */
export function VideoDetailTags({ tags }: VideoDetailTagsProps) {
    const { t } = useTranslation();

    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 border-t pt-4">
            <span className="mr-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide lg:text-sm">
                {t("videos.detail.tags.label")}:
            </span>
            {tags.map((tag) => (
                <Tag
                    as="a"
                    size="md"
                    prefix="#"
                    key={tag.id}
                    variant="default"
                    href={`${VIDEOS_PATH}?tagSlug=${tag.slug}`}
                    className="border-transparent bg-muted text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground lg:px-3 lg:py-1 lg:text-sm dark:hover:border-secondary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
                >
                    {tag.name}
                </Tag>
            ))}
        </div>
    );
}
