import { ArticleDetailNotFound } from "@/modules/articles/presentation/components/ArticleDetail/ArticleDetail.NotFound";

/**
 * NotFound
 *
 * @description
 * The not-found boundary for the article detail route, rendered when the page calls
 * Next's `notFound()` for a missing or unpublished slug. Delegates to the shared
 * article-detail not-found view (an `EmptyState` with a link back to the article feed)
 * and sets a proper 404 status for crawlers.
 */
export default function NotFound() {
    return <ArticleDetailNotFound />;
}
