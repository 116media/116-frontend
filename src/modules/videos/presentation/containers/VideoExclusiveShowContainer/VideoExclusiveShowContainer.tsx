import { VideoExclusiveShow } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow";

import { generateDummyExclusiveShow } from "@/modules/videos/presentation/data/exclusive-show.dummy";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * VideoExclusiveShowContainer
 *
 * @description
 * Async RSC container for the homepage exclusive show section. Resolves
 * GetVideoExclusiveShowUseCase from the Awilix server cradle; renders dummy
 * data during development. Designed to be wrapped in `<Suspense>` by the page.
 */
export async function VideoExclusiveShowContainer() {
    const cradle = await createServerCradle();
    await cradle.getVideoExclusiveShowUseCase.execute();

    // TODO: restore the real category once the backend has an exclusive category seeded.
    // const category = result.ok ? result.value : generateDummyExclusiveShow();
    const category = generateDummyExclusiveShow();

    return <VideoExclusiveShow category={category} />;
}
