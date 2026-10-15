"use client";

import { useTranslation } from "react-i18next";

import { Breadcrumb } from "@/shared/presentation/components/ui/Breadcrumb";
import { Tag } from "@/shared/presentation/components/ui/Tag";
import { ARTICLES_PATH, HOME_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for the ArticleDetail.Hero component.
 *
 * @interface ArticleDetailHeroProps
 * @property {string} categoryId - The category UUID, used by the breadcrumb and the tag link.
 * @property {string} categoryName - The article category display name.
 * @property {string} title - The article title.
 */
export interface ArticleDetailHeroProps {
    categoryId: string;
    categoryName: string;
    title: string;
}

/**
 * ArticleDetail.Hero
 *
 * @description
 * Article header: the breadcrumb, then the category tag and the title. The
 * byline, summary, meta bar and cover are composed after the hero by the
 * assembler.
 */
export function ArticleDetailHero({ categoryId, categoryName, title }: ArticleDetailHeroProps) {
    const { t } = useTranslation();

    return (
        <header className="flex flex-col gap-4">
            <Breadcrumb
                items={[
                    { label: t("general.breadcrumbHome"), href: HOME_PATH },
                    { label: t("general.breadcrumbNews"), href: ARTICLES_PATH },
                    { label: categoryName, href: `${ARTICLES_PATH}?categoryId=${categoryId}` }
                ]}
            />

            <div className="flex flex-col gap-2 py-2">
                <span>
                    <Tag
                        size="lg"
                        as="span"
                        variant="ghost"
                        className="bg-foreground/10 text-foreground backdrop-blur-sm"
                        prefix={
                            <span className="hidden size-2 animate-pulse rounded-full bg-secondary sm:block" />
                        }
                    >
                        {categoryName}
                    </Tag>
                </span>

                <h1 className="text-balance font-bold font-serif text-2xl tracking-tight md:text-3xl lg:text-4xl">
                    {title}
                </h1>
            </div>
        </header>
    );
}
