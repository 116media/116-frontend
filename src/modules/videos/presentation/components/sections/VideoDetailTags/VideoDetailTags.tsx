"use client";

import { useTranslation } from "react-i18next";

import type { IVideoTagEntity } from "@/modules/videos/domain/entities/IVideoTagEntity";
import { Tag } from "@/shared/presentation/components/ui/Tag";

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
 * The tag block under the header: a "Tags:" label followed by hashtag-style
 * Tag pills. Pills render as plain spans — the published videos endpoint has
 * no tag filter to deep-link to yet. Renders nothing when there are no tags.
 */
export function VideoDetailTags({ tags }: VideoDetailTagsProps) {
    const { t } = useTranslation();

    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 border-border border-t pt-4">
            <span className="mr-2 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                {t("videos.detail.tags.label")}:
            </span>
            {tags.map((tag) => (
                <Tag
                    as="span"
                    prefix="#"
                    key={tag.id}
                    variant="default"
                    className="border-transparent bg-muted text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:hover:border-secondary dark:hover:bg-secondary dark:hover:text-secondary-foreground"
                >
                    {tag.name}
                </Tag>
            ))}
        </div>
    );
}
