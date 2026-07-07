import { ArticleDetailHeroCover } from "@/modules/articles/presentation/components/sections/ArticleDetailHeroCover";

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
 * Article header: the cover band with its category chip, followed by the title. The
 * byline, headline, and meta bar are composed after the hero by the assembler.
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
