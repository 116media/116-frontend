import { createServerCradle } from "@/shared/infrastructure/server.cradle";

import { generateDummyExclusiveShow } from "./dummy-feed";
import { VideoExclusiveShow } from "./VideoExclusiveShow";

/**
 * VideoExclusiveShowContainer
 *
 * @description
 * Container component (async RSC) for the homepage exclusive show section.
 * Resolves GetVideoExclusiveShowUseCase from the Awilix server cradle and
 * delegates rendering to the presentation component. Renders dummy data so the
 * section is always visible during development.
 * Designed to be wrapped in `<Suspense>` by the page.
 */
export async function VideoExclusiveShowContainer() {
    const cradle = await createServerCradle();
    await cradle.getVideoExclusiveShowUseCase.execute();

    // TODO: restore the real category once the backend has an exclusive category seeded.
    // const category = result.ok ? result.value : generateDummyExclusiveShow();
    const category = generateDummyExclusiveShow();

    return <VideoExclusiveShow category={category} />;
}
