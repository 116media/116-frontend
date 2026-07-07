import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { ArticleDetailContainer } from "@/modules/articles/presentation/components/ArticleDetail";
import { articleJsonLd } from "@/modules/articles/presentation/components/ArticleDetail/articleJsonLd";
import { dummyArticleDetail } from "@/modules/articles/presentation/data/article-detail.dummy";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * Props for the article detail route and its metadata.
 *
 * @interface ArticleDetailRouteProps
 * @property {Promise<{ slug: string }>} params - The route params promise carrying the
 * article `slug`.
 */
interface ArticleDetailRouteProps {
    params: Promise<{ slug: string }>;
}

/**
 * fetchArticle
 *
 * @description
 * Fetches the article by slug through the server cradle, memoized per request with React
 * `cache` so the page render and `generateMetadata` share a single backend call. Returns
 * null when the article is missing or unpublished so both callers can gate through
 * `notFound()`.
 *
 * Dummy-data phase: while the backend has no published content, a failed fetch falls back
 * to a fully-populated dummy article so the detail page is previewable; the value never
 * resolves to null, so `notFound()` stays dormant until the backend is wired.
 *
 * @param slug - The article slug from the route.
 * @returns The resolved article entity, or null when it cannot be fetched.
 */
const fetchArticle = cache(async (slug: string): Promise<IArticleDetailEntity | null> => {
    const cradle = await createServerCradle();
    const result = await cradle.getArticleBySlugUseCase.execute(slug);
    return result.ok ? result.value : dummyArticleDetail(slug);
});

/**
 * generateMetadata
 *
 * @description
 * Server-side SEO for the single-article route. Awaits the `slug` and fetches the article
 * through the request-memoized fetch; a missing article triggers `notFound()`. Returns the
 * title (`metaTitle` first, else the article title), description (`metaDescription`
 * first, else the headline), the canonical `/articles/{slug}` URL, an Open Graph
 * "article" object (cover image, published time, author, section, per-tag `article:tag`),
 * and a matching large-image Twitter card. Image entries are omitted when there is no
 * cover so a share preview is never broken.
 *
 * @param params - The route params promise carrying the article `slug`.
 * @returns The metadata for the article page.
 */
export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticle(slug);

    if (!article) notFound();

    const title = article.metaTitle ?? article.title;
    const description = article.metaDescription ?? article.headline;
    const canonical = `/articles/${article.slug}`;
    const images = article.coverImageUrl ? [article.coverImageUrl] : [];

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: "article",
            title,
            description,
            url: canonical,
            images,
            publishedTime: article.publishedAt ?? undefined,
            authors: article.author ? [article.author.userName] : undefined,
            section: article.categoryName,
            tags: article.tags.map((tag) => tag.name)
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images
        }
    };
}

/**
 * ArticleDetailPage
 *
 * @description
 * The public single-article route (`/articles/[slug]`). Awaits the dynamic `slug` and
 * fetches the article server-side (request-memoized, shared with `generateMetadata`) for
 * SEO and a fast first paint. A missing or unpublished article triggers `notFound()`. The
 * resolved entity seeds the client `ArticleDetailContainer` as `initialData` so the
 * client query hydrates without a refetch, and the schema.org `NewsArticle` JSON-LD is
 * rendered server-side so crawlers get it on first paint.
 *
 * @param params - The route params promise carrying the article `slug`.
 */
export default async function ArticleDetailPage({ params }: ArticleDetailRouteProps) {
    const { slug } = await params;
    const article = await fetchArticle(slug);

    if (!article) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON built from mapped entity data, not user HTML
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
            />
            <ArticleDetailContainer
                slug={slug}
                initialData={article}
            />
        </>
    );
}
