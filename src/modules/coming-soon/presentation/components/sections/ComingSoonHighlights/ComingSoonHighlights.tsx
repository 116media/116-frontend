"use client";

import { useTranslation } from "react-i18next";
import { COMING_SOON_GRID } from "@/modules/coming-soon/presentation/constants/comingSoon";
import type { IComingSoonHighlight } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { LayoutGridIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";

/**
 * Props for the ComingSoonHighlights component.
 *
 * @interface ComingSoonHighlightsProps
 * @property {IComingSoonHighlight[]} highlights - The tiles to render, in order.
 */
export interface ComingSoonHighlightsProps {
    highlights: IComingSoonHighlight[];
}

/**
 * ComingSoonHighlights
 *
 * @description
 * What a surface opens with, as one tile per promise under the shared section header.
 * Read before anyone can try the feature, so each tile states a capability rather than
 * selling it.
 */
export function ComingSoonHighlights({ highlights }: ComingSoonHighlightsProps) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <SectionHeader
                size="base"
                icon={<LayoutGridIcon />}
                title={t("comingSoon.feature.highlights.title")}
            />

            <div className={COMING_SOON_GRID}>
                {highlights.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-lg border border-foreground/5 bg-surface-raised p-5"
                    >
                        <span className="flex size-10 items-center justify-center rounded-md bg-muted text-primary dark:text-secondary [&_svg]:size-5">
                            {item.icon}
                        </span>
                        <h3 className="font-semibold text-base text-foreground">
                            {t(item.titleKey)}
                        </h3>
                        <p className="text-muted-foreground text-sm">{t(item.bodyKey)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
