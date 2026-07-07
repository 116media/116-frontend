import { ArticlePromotionFeed } from "@/modules/articles/presentation/components/sections/ArticlePromotionFeed";
import { generateDummyFeed } from "@/modules/articles/presentation/data/promotion-feed.dummy";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * ArticlePromotionFeedContainer
 *
 * @description
 * Async RSC container for the homepage article promotion grid. Fetches the feed via
 * GetArticlePromotionFeedUseCase from the Awilix server cradle and delegates rendering
 * to ArticlePromotionFeed, falling back to dummy data on API error. Wrapped in `<Suspense>`.
 */
export async function ArticlePromotionFeedContainer() {
    const cradle = await createServerCradle();
    await cradle.getArticlePromotionFeedUseCase.execute();

    // TODO: restore real feed once the backend has promoted content.
    // const feed = result.ok ? result.value : generateDummyFeed();
    const feed = generateDummyFeed();

    return <ArticlePromotionFeed feed={feed} />;
}
