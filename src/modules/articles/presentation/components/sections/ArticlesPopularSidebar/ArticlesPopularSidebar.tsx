"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ArticleCard } from "@/modules/articles/presentation/components/cards/ArticleCard";
import { useArticleDetailPopular } from "@/modules/articles/presentation/hooks/useArticleDetailPopular";
import { FlameIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { ArticlesPopularSidebarLoading } from "./ArticlesPopularSidebar.Loading";

/**
 * Props for ArticlesPopularSidebar.
 *
 * @interface ArticlesPopularSidebarProps
 * @property {string} currentArticleId - The article currently open, excluded from the list.
 */
export interface ArticlesPopularSidebarProps {
    currentArticleId: string;
}

/**
 * ArticlesPopularSidebar
 *
 * @description
 * The detail page's popular-articles column: up to five ArticleCard.Horizontal rows
 * sourced from `useArticleDetailPopular`, with the current article excluded. Shows a
 * matching skeleton while loading and renders nothing when the resolved list is empty.
 */
export function ArticlesPopularSidebar({ currentArticleId }: ArticlesPopularSidebarProps) {
    const { t } = useTranslation();
    const { data, isPending } = useArticleDetailPopular(currentArticleId);

    const header = (
        <SectionHeader
            icon={<FlameIcon />}
            title={t("articles.sidebar.popular")}
        />
    );

    return (
        <StateRenderer
            data={data}
            loading={isPending}
            skeleton={
                <aside className="flex flex-col gap-4">
                    {header}
                    <ArticlesPopularSidebarLoading />
                </aside>
            }
            render={(articles) => (
                <aside className="flex flex-col">
                    {header}
                    <div className="flex flex-col gap-4 rounded-xl bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
                        {articles.map((article, index) => (
                            <Fragment key={article.id}>
                                <ArticleCard.Horizontal article={article} />
                                {index < articles.length - 1 && <hr />}
                            </Fragment>
                        ))}
                    </div>
                </aside>
            )}
        />
    );
}
