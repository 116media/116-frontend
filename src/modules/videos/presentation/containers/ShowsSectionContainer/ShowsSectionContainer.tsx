"use client";

import { ShowsSection } from "@/modules/videos/presentation/components/sections/ShowsSection";
import { ShowsSectionLoading } from "@/modules/videos/presentation/components/sections/ShowsSection/ShowsSection.Loading";
import { useShows } from "@/modules/videos/presentation/hooks/useShows";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * ShowsSectionContainer
 *
 * @description
 * Client container for the homepage shows section. Reads the shared shows query, which
 * pads the backend's shows with demo ones while the catalogue is short, so the carousel
 * always has a full window to swipe through. Renders nothing on error or an empty
 * response, so the homepage simply skips the section.
 */
export function ShowsSectionContainer() {
    const { data: shows, isPending, isError } = useShows();

    return (
        <StateRenderer
            data={shows}
            error={isError}
            loading={isPending}
            skeleton={<ShowsSectionLoading />}
            render={(items) => <ShowsSection shows={items} />}
        />
    );
}
