import { VideoExclusiveShow } from "@/modules/videos/presentation/components/sections/VideoExclusiveShow";
import { generateDummyExclusiveShow } from "@/modules/videos/presentation/data/exclusive-show.dummy";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Props for the VideoExclusiveShowContainer component.
 *
 * @interface VideoExclusiveShowContainerProps
 * @property {"split" | "hero"} variant - Layout to render: the homepage two-column
 * split or the videos page full-bleed hero.
 */
export interface VideoExclusiveShowContainerProps {
    variant: "split" | "hero";
}

/**
 * VideoExclusiveShowContainer
 *
 * @description
 * Async RSC container for the exclusive show section. Resolves
 * GetVideoExclusiveShowUseCase from the Awilix server cradle and renders the
 * requested layout variant; renders dummy data during development. Designed to
 * be wrapped in `<Suspense>` by the page.
 */
export async function VideoExclusiveShowContainer({ variant }: VideoExclusiveShowContainerProps) {
    const cradle = await createServerCradle();
    await cradle.getVideoExclusiveShowUseCase.execute();

    // TODO: restore the real category once the backend has an exclusive category seeded.
    // const category = result.ok ? result.value : generateDummyExclusiveShow();
    const category = generateDummyExclusiveShow();

    if (variant === "hero") return <VideoExclusiveShow.Hero category={category} />;

    return <VideoExclusiveShow.Split category={category} />;
}
