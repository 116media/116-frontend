"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortsPlayer } from "@/modules/shorts/presentation/components/modals/ShortsPlayer";
import { ShortsStrip } from "@/modules/shorts/presentation/components/sections/ShortsStrip";
import { useShortsFeed } from "@/modules/shorts/presentation/hooks/useShortsFeed";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { SHORTS_PATH } from "@/shared/presentation/constants/paths";

import { ShortsFeedSectionContainerLoading } from "./ShortsFeedSectionContainer.Loading";

/**
 * ShortsFeedSectionContainer
 *
 * @description
 * Homepage shorts section: owns the shared randomized feed query used by the strip
 * and the player, plus the modal open index. Shows a skeleton while the first page
 * loads and renders nothing on error or an empty feed, so the homepage simply skips
 * the section.
 */
export function ShortsFeedSectionContainer() {
    const { t } = useTranslation();
    const { data, isPending, isError, hasNextPage, fetchNextPage } = useShortsFeed();
    const [openAt, setOpenAt] = useState<number | null>(null);
    const returnUrlRef = useRef<string | null>(null);

    const shorts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

    const openPlayer = useCallback((index: number) => {
        returnUrlRef.current = window.location.href;
        setOpenAt(index);
    }, []);

    const syncUrlToShort = useCallback((short: IShortVideoEntity) => {
        window.history.replaceState(window.history.state, "", `${SHORTS_PATH}/${short.slug}`);
    }, []);

    const closePlayer = useCallback(() => {
        if (returnUrlRef.current) {
            window.history.replaceState(window.history.state, "", returnUrlRef.current);
        }
        setOpenAt(null);
    }, []);

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
                    <header>
                        <h2 className="font-bold text-foreground text-lg uppercase sm:text-xl">
                            {t("shorts.section.title")}
                        </h2>
                    </header>

                    <ShortsStrip
                        shorts={items}
                        onOpen={openPlayer}
                    />

                    {openAt !== null && (
                        <ShortsPlayer
                            shorts={items}
                            initialIndex={openAt}
                            hasNextPage={hasNextPage}
                            onActiveShortChange={syncUrlToShort}
                            onClose={closePlayer}
                            onLoadMore={() => {
                                void fetchNextPage();
                            }}
                        />
                    )}
                </section>
            )}
        />
    );
}
