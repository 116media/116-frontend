"use client";

import { useTranslation } from "react-i18next";

import { Tag } from "@/shared/presentation/components/ui/Tag";

import { MobileMegaMenuSection } from "./MobileMegaMenu.Section";
import type { MobileMegaMenuTagsProps } from "./types";

/**
 * MobileMegaMenu.Tags
 *
 * @description
 * The popular tag cloud, same pills and same tag-filter links as the mega menu's
 * right column, at the compact size so a phone shows more of them per row. Renders
 * nothing when the list is empty.
 */
export function MobileMegaMenuTags({ tags, basePath, onNavigate }: MobileMegaMenuTagsProps) {
    const { t } = useTranslation();

    if (tags.length === 0) return null;

    return (
        <MobileMegaMenuSection title={t("general.popularTags")}>
            <div className="flex flex-wrap gap-2">
                {tags.slice(0, 16).map((tag) => (
                    <Tag
                        size="md"
                        prefix="#"
                        shape="pill"
                        key={tag.id}
                        variant="default"
                        onClick={onNavigate}
                        href={`${basePath}?tagId=${tag.id}`}
                    >
                        {tag.name}
                    </Tag>
                ))}
            </div>
        </MobileMegaMenuSection>
    );
}
