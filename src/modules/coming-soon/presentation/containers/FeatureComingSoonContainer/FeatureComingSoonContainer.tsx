"use client";

import { useTranslation } from "react-i18next";

import { ComingSoonHighlights } from "@/modules/coming-soon/presentation/components/sections/ComingSoonHighlights";
import { ComingSoonSocials } from "@/modules/coming-soon/presentation/components/sections/ComingSoonSocials";
import { ComingSoonVideos } from "@/modules/coming-soon/presentation/components/sections/ComingSoonVideos";
import type { IComingSoonFeature } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { NewsletterCard } from "@/modules/newsletter/presentation/components/cards/NewsletterCard";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CheckIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

/**
 * Props for the FeatureComingSoonContainer component.
 *
 * @interface FeatureComingSoonContainerProps
 * @property {IComingSoonFeature} feature - The feature being announced.
 */
export interface FeatureComingSoonContainerProps {
    feature: IComingSoonFeature;
}

/**
 * FeatureComingSoonContainer
 *
 * @description
 * Client container for one announced but unopened feature, inside the normal site chrome. The page
 * says it is not open yet before it says what it is, so a reader who followed a link
 * knows within a glance; what it will do, where it stands and somewhere to go in the
 * meantime follow under it.
 */
export function FeatureComingSoonContainer({ feature }: FeatureComingSoonContainerProps) {
    const { t } = useTranslation();
    const router = useProgressRouter();
    const name = t(feature.nameKey);

    return (
        <div className="flex flex-col pb-6">
            <section className="-mt-4 relative left-1/2 mb-12 w-screen -translate-x-1/2 bg-muted dark:bg-black/50">
                <PageContainer>
                    <header className="flex flex-col items-center gap-4 py-10 text-center">
                        <Tag
                            as="span"
                            size="lg"
                            variant="brand"
                            prefix={
                                <span
                                    aria-hidden
                                    className="relative flex size-2"
                                >
                                    <span className="absolute inline-flex size-full animate-status-ping rounded-full bg-primary-foreground dark:bg-secondary-foreground" />
                                    <span className="relative inline-flex size-2 rounded-full bg-primary-foreground dark:bg-secondary-foreground" />
                                </span>
                            }
                        >
                            {t("comingSoon.feature.badge")}
                        </Tag>

                        <p className="font-semibold text-primary text-sm uppercase tracking-[0.2em] dark:text-secondary">
                            {name}
                        </p>

                        <h1 className="animate-headline-pulse text-balance font-bold text-5xl text-foreground sm:text-6xl lg:text-7xl">
                            {t("comingSoon.feature.heading")}
                        </h1>

                        <p className="max-w-2xl text-balance text-muted-foreground">
                            {t(feature.descriptionKey)}
                        </p>

                        <ul className="flex flex-col gap-3 text-left">
                            {feature.pointKeys.map((pointKey) => (
                                <li
                                    key={pointKey}
                                    className="flex items-start gap-3 text-foreground text-sm"
                                >
                                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary dark:text-secondary" />
                                    <span>{t(pointKey)}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant="brand-outline"
                            onClick={() => router.push(VIDEOS_PATH)}
                        >
                            <PlayIcon />
                            {t("comingSoon.feature.explore")}
                        </Button>
                    </header>
                </PageContainer>
            </section>

            <div className="flex flex-col gap-16">
                <NewsletterCard
                    className="mx-auto w-full max-w-2xl"
                    title={t("comingSoon.feature.notify.title")}
                    subtitle={t("comingSoon.feature.notify.subtitle")}
                    submitLabel={t("comingSoon.feature.notify.submit")}
                />

                <ComingSoonHighlights highlights={feature.highlights} />

                <ComingSoonVideos />

                <ComingSoonSocials
                    title={t("comingSoon.feature.socials.title")}
                    subtitle={t("comingSoon.feature.socials.subtitle", { feature: name })}
                />
            </div>
        </div>
    );
}
