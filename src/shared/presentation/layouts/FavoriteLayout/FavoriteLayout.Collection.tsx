"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";

/**
 * Props for the FavoriteLayout collection frame.
 *
 * @interface FavoriteLayoutCollectionProps
 * @property {ReactNode} icon - The route's leading header icon.
 * @property {string} headingKey - i18n key for the page heading.
 * @property {string} subtitleKey - i18n key for the page subtitle.
 * @property {ReactNode} children - The tabs and active collection.
 */
export interface FavoriteLayoutCollectionProps {
    icon: ReactNode;
    headingKey: string;
    subtitleKey: string;
    children: ReactNode;
}

/**
 * FavoriteLayout.Collection
 *
 * @description
 * Shared presentational heading and content frame for favorites routes. Authentication
 * belongs to the parent private-route boundary rather than this reusable UI component.
 */
export function FavoriteLayoutCollection({
    icon,
    headingKey,
    subtitleKey,
    children
}: FavoriteLayoutCollectionProps) {
    const { t } = useTranslation();

    return (
        <div>
            <SectionHeader
                as="h1"
                icon={icon}
                title={t(headingKey)}
                subtitle={t(subtitleKey)}
            />
            <div className="flex flex-col gap-6 rounded-lg border p-4">{children}</div>
        </div>
    );
}
