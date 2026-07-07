import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";

/**
 * articleJsonLd
 *
 * @description
 * Builds the schema.org `NewsArticle` JSON-LD for the detail page from mapped entity data
 * (never the untrusted HTML body). Fields with no data are omitted rather than emitted
 * null. Injected via a `<script type="application/ld+json">` in the server-rendered page.
 *
 * @param article - The resolved article detail entity.
 * @returns The JSON-LD object stringified into the script tag.
 */
export function articleJsonLd(article: IArticleDetailEntity): Record<string, unknown> {
    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.metaDescription ?? article.headline,
        articleSection: article.categoryName,
        publisher: { "@type": "Organization", name: "116" },
        mainEntityOfPage: { "@type": "WebPage", "@id": `/articles/${article.slug}` }
    };

    if (article.coverImageUrl) jsonLd.image = [article.coverImageUrl];
    if (article.publishedAt) jsonLd.datePublished = article.publishedAt;
    if (article.author) jsonLd.author = { "@type": "Person", name: article.author.userName };
    if (article.tags.length > 0) jsonLd.keywords = article.tags.map((tag) => tag.name);

    return jsonLd;
}
