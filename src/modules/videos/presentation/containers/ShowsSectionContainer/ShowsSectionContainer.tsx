"use client";

import { useEffect, useState } from "react";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowsSection } from "@/modules/videos/presentation/components/sections/ShowsSection";
import { ShowsSectionLoading } from "@/modules/videos/presentation/components/sections/ShowsSection/ShowsSection.Loading";
import { generateDummyShows } from "@/modules/videos/presentation/data/shows.dummy";
import container from "@/shared/infrastructure/service.locator";

/**
 * ShowsSectionContainer
 *
 * @description
 * Client container for the homepage shows section. Fetches shows after mount
 * via `getShowsUseCase` from the DI container, rendering the skeleton while
 * loading; a failed or empty response falls back to dummy shows.
 */
export function ShowsSectionContainer() {
    const [shows, setShows] = useState<IShowEntity[] | null>(null);

    useEffect(() => {
        let active = true;

        async function loadShows() {
            const result = await container.cradle.getShowsUseCase.execute();

            if (!active) return;

            const resolved =
                result.ok && result.value.length > 0 ? result.value : generateDummyShows();
            setShows(resolved);
        }

        loadShows();

        return () => {
            active = false;
        };
    }, []);

    if (!shows) return <ShowsSectionLoading />;

    return <ShowsSection shows={shows} />;
}
