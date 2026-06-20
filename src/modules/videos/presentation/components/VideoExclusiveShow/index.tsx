import { createServerCradle } from "@/shared/infrastructure/server.cradle";
import { i18n } from "@/shared/presentation/i18n/config";
import { getServerLanguage } from "@/shared/presentation/utils/getServerLanguage";

import { generateDummyExclusiveShow } from "./dummy-feed";
import { VideoExclusiveShow } from "./VideoExclusiveShow";

/**
 * VideoExclusiveShowContainer
 *
 * @description
 * Container component (async RSC) for the homepage exclusive show section.
 * Resolves GetVideoExclusiveShowUseCase from the Awilix server cradle and
 * delegates rendering to the presentation component. Renders dummy data so the
 * section is always visible during development. Chrome labels are translated
 * server-side against the request language so this streamed section renders as a
 * server component and never mismatches on hydration.
 * Designed to be wrapped in `<Suspense>` by the page.
 */
export async function VideoExclusiveShowContainer() {
    const cradle = await createServerCradle();
    await cradle.getVideoExclusiveShowUseCase.execute();

    // TODO: restore the real category once the backend has an exclusive category seeded.
    // const category = result.ok ? result.value : generateDummyExclusiveShow();
    const category = generateDummyExclusiveShow();

    const language = await getServerLanguage();
    const t = i18n.getFixedT(language);
    const labels = {
        exclusive: t("videos.exclusiveShow.exclusive"),
        episodes: t("videos.exclusiveShow.episodes"),
        watchNow: t("videos.home.watchNow")
    };

    return (
        <VideoExclusiveShow
            category={category}
            labels={labels}
        />
    );
}
