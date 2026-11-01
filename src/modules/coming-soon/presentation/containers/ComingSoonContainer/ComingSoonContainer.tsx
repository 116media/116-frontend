"use client";

import { useTranslation } from "react-i18next";

import { ComingSoonHighlights } from "@/modules/coming-soon/presentation/components/sections/ComingSoonHighlights";
import { ComingSoonSocials } from "@/modules/coming-soon/presentation/components/sections/ComingSoonSocials";
import { LaunchCountdown } from "@/modules/coming-soon/presentation/components/sections/LaunchCountdown";
import { LAUNCH_HIGHLIGHTS } from "@/modules/coming-soon/presentation/constants/comingSoonFeatures";
import { NewsletterCard } from "@/modules/newsletter/presentation/components/cards/NewsletterCard";
import { LanguageDropdown } from "@/shared/presentation/components/common/LanguageDropdown";
import { ThemeToggle } from "@/shared/presentation/components/common/ThemeToggle";
import { Logo } from "@/shared/presentation/components/ui/Logo";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { Footer } from "@/shared/presentation/layouts/Footer";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";
import { TopBar } from "@/shared/presentation/layouts/TopBar";

/**
 * ComingSoonContainer
 *
 * @description
 * Client container for the pre-launch route: the whole site before it opens, so it carries no navigation of
 * its own. It keeps the pieces that point outward rather than inward: the follow banner,
 * the reader's own theme and language, and the footer band. Below those the page runs in
 * one order: what is coming, leave an address, follow a channel.
 */
export function ComingSoonContainer() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <TopBar />

            <section className="w-full bg-muted dark:bg-black/50">
                <PageContainer className="flex flex-col gap-8 pt-2 pb-6 lg:pt-4 lg:pb-12">
                    <div className="flex items-center justify-end gap-1">
                        <ThemeToggle />
                        <LanguageDropdown.Root placement="bottom" />
                    </div>

                    <header className="flex flex-col items-center gap-6 text-center">
                        <Logo
                            priority
                            className="size-16"
                        />

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
                            {t("comingSoon.launch.badge")}
                        </Tag>

                        <h1 className="animate-headline-pulse max-w-3xl text-balance font-bold text-3xl text-foreground sm:text-4xl lg:text-5xl">
                            {t("comingSoon.launch.title")}
                        </h1>

                        <LaunchCountdown />
                    </header>
                </PageContainer>
            </section>

            <PageContainer className="flex flex-1 flex-col gap-16 py-8 lg:gap-20 lg:py-4">
                <ComingSoonSocials
                    title={t("comingSoon.launch.socials.title")}
                    subtitle={t("comingSoon.launch.socials.subtitle")}
                />

                <NewsletterCard
                    className="mx-auto w-full max-w-2xl"
                    title={t("comingSoon.launch.notify.title")}
                    subtitle={t("comingSoon.launch.notify.subtitle")}
                    submitLabel={t("comingSoon.launch.notify.submit")}
                />

                <ComingSoonHighlights highlights={LAUNCH_HIGHLIGHTS} />
            </PageContainer>

            <Footer minimal />
        </div>
    );
}
