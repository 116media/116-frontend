"use client";

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ShortsStrip } from "@/modules/shorts/presentation/components/sections/ShortsStrip";
import { useShortsFeed } from "@/modules/shorts/presentation/hooks/useShortsFeed";
import { FeedHeading } from "@/shared/presentation/components/ui/FeedHeading";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { SHORTS_PATH } from "@/shared/presentation/constants/paths";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";
import { ShortsFeedSectionContainerLoading } from "./ShortsFeedSectionContainer.Loading";

/**
 * ShortsFeedSectionContainer
 *
 * @description
 * Homepage shorts section: owns the randomized feed query the strip renders. Tapping a
 * short navigates to its own route, which the `@modal` slot intercepts into the overlay
 * player over this page — so the address bar, Back, and a refresh all describe the same
 * short. Shows a skeleton while the first page loads and renders nothing on error or an
 * empty feed, so the homepage simply skips the section.
 */
export function ShortsFeedSectionContainer() {
    const { t } = useTranslation();
    const router = useProgressRouter();
    const { data, isPending, isError } = useShortsFeed();

    const shorts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    const openPlayer = useCallback(
        (index: number) => {
            const short = shorts[index];
            if (short) router.push(`${SHORTS_PATH}/${short.slug}`);
        },
        [router, shorts]
    );

    return (
        <StateRenderer
            data={shorts}
            error={isError}
            loading={isPending}
            skeleton={<ShortsFeedSectionContainerLoading />}
            render={(items) => (
                <section
                    className="flex flex-col gap-3"
                    aria-label={t("shorts.section.title")}
                >
                    <FeedHeading title={t("shorts.section.title")} />

                    <ShortsStrip
                        shorts={items}
                        onOpen={openPlayer}
                    />
                </section>
            )}
        />
    );
}
