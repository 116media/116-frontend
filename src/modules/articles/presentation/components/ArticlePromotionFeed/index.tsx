import { createServerCradle } from "@/shared/infrastructure/server.cradle";

import { ArticlePromotionFeed } from "./ArticlePromotionFeed";
import { generateDummyFeed } from "./dummy-feed";

/**
 * ArticlePromotionFeedContainer
 *
 * @description
 * Container component (async RSC) for the homepage article promotion grid.
 * Resolves GetArticlePromotionFeedUseCase from the Awilix server cradle,
 * fetches the feed data, and delegates rendering to the presentation
 * component. Falls back to dummy data when the API returns an error
 * so the feed is always visible during development.
 * Designed to be wrapped in `<Suspense>` by the page.
 */
export async function ArticlePromotionFeedContainer() {
    const cradle = await createServerCradle();
    const result = await cradle.getArticlePromotionFeedUseCase.execute();

    const feed = result.ok ? result.value : generateDummyFeed();

    return <ArticlePromotionFeed feed={feed} />;
}
