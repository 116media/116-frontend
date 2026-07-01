import { ArticleDetailHeroCover } from "./ArticleDetailHeroCover";

/**
 * Props for the ArticleDetail.Hero component.
 *
 * @interface ArticleDetailHeroProps
 * @property {string | null} coverImageUrl - The cover image URL, or null for the fallback.
 * @property {string} categoryName - The article category display name (corner chip).
 * @property {string} title - The article title.
 */
export interface ArticleDetailHeroProps {
    coverImageUrl: string | null;
    categoryName: string;
    title: string;
}

/**
 * ArticleDetail.Hero
 *
 * @description
 * The article header. Renders the cover band — with the category chip in its top-left
 * corner — followed by the title directly below it. The byline strip, headline, and meta
 * bar are composed after the hero by the assembler.
 *
 * @param coverImageUrl - The cover image URL, or null for the fallback.
 * @param categoryName - The category display name (corner chip).
 * @param title - The article title.
 */
export function ArticleDetailHero({ coverImageUrl, categoryName, title }: ArticleDetailHeroProps) {
    return (
        <header className="flex flex-col gap-4">
            <ArticleDetailHeroCover
                title={title}
                categoryName={categoryName}
                coverImageUrl={coverImageUrl}
            />
            <h1 className="line-clamp-3 font-serif font-bold text-2xl tracking-tight md:text-3xl mb-1">
                {title}
            </h1>
        </header>
    );
}
