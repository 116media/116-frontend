import type { Metadata } from "next";
import { ArticleDetailNotFound } from "@/modules/articles/presentation/components/pages/ArticleDetail/ArticleDetail.NotFound";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Sets the not-found boundary's title from the active server language, reusing the same
 * string rendered as the empty-state heading.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("articles.detail.notFound.title") };
}

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
