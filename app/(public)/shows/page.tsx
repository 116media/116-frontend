import { ShowsGridContainer } from "@/modules/videos/presentation/containers/ShowsGridContainer";

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
