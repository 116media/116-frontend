"use client";

import { useEffect, useState } from "react";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import container from "@/shared/infrastructure/service.locator";

import { generateDummyShows } from "./dummy-shows";
import { ShowsSection } from "./ShowsSection";
import { ShowsSectionLoading } from "./ShowsSection.Loading";

/**
 * ShowsSectionContainer
 *
 * @description
 * Client container for the homepage shows section. After mount it issues the
 * request on the client through the videos data layer
 * (`getShowsUseCase` resolved from the DI container, which uses the browser API
 * client), rendering the skeleton while it loads. If the request fails or
 * returns no shows it falls back to ten dummy shows, so the section is always
 * populated during development.
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
