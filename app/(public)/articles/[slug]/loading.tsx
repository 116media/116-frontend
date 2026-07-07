import { ArticleDetailLoading } from "@/modules/articles/presentation/components/ArticleDetail/ArticleDetail.Loading";

/**
 * Loading
 *
 * @description
 * The streaming fallback for the article detail route, shown while the async page fetches
 * the article server-side. Renders the full-page article skeleton so the shell appears
 * instantly and real content drops in with no layout shift.
 */
export default function Loading() {
    return <ArticleDetailLoading />;
}
