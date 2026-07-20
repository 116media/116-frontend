import type { Metadata } from "next";
import { ShowsGridContainer } from "@/modules/videos/presentation/containers/ShowsGridContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the shows listing's title from the active server language, reusing the same string
 * rendered as the page's on-page heading.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("videos.shows.title") };
}

/**
 * ShowsPage
 *
 * @description
 * The public shows listing (`/shows`): the "All Shows" title above an
 * incrementally revealed grid of every active show (video category), one
 * poster tile per show.
 */
export default function ShowsPage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <ShowsGridContainer />
        </div>
    );
}
