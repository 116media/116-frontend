"use client";

import { ShowsSection } from "@/modules/videos/presentation/components/sections/ShowsSection";
import { ShowsSectionLoading } from "@/modules/videos/presentation/components/sections/ShowsSection/ShowsSection.Loading";
import { useShows } from "@/modules/videos/presentation/hooks/useShows";

/**
 * ShowsSectionContainer
 *
 * @description
 * Client container for the homepage shows section. Reads the shared shows query, which
 * pads the backend's shows with demo ones while the catalogue is short, so the carousel
 * always has a full window to swipe through.
 */
export function ShowsSectionContainer() {
    const { data: shows, isPending } = useShows();

    if (isPending || !shows) return <ShowsSectionLoading />;

    return <ShowsSection shows={shows} />;
}
