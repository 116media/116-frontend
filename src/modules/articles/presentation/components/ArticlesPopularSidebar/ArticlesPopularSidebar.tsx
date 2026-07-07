"use client";

import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { useArticleDetailPopular } from "@/modules/articles/presentation/hooks/useArticleDetailPopular";
import { FlameIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";

import { ArticleCard } from "../ArticleCard";
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
 * The detail page's popular-articles column: a titled strip of up to five
 * ArticleCard.Horizontal rows — the same horizontal cards, in the same muted block with
 * rule separators, as the homepage gossip strip — sourced from `useArticleDetailPopular`
 * (the backend's engagement-ranked popular endpoint, current article excluded). While
 * loading it shows a matching skeleton block; when the resolved list is empty it renders
 * nothing (no heading, no empty-state box) so an empty column never occupies the layout.
 *
 * @param currentArticleId - The article currently open, excluded from the list.
 */
export function ArticlesPopularSidebar({ currentArticleId }: ArticlesPopularSidebarProps) {
    const { t } = useTranslation();
    const { data, isPending } = useArticleDetailPopular(currentArticleId);

    if (isPending) {
        return (
            <aside className="flex flex-col gap-4">
                <SectionHeader
                    icon={<FlameIcon />}
                    title={t("articles.sidebar.popular")}
                />
                <ArticlesPopularSidebarLoading />
            </aside>
        );
    }

    if (!data || data.length === 0) return null;

    return (
        <aside className="flex flex-col">
            <SectionHeader
                icon={<FlameIcon />}
                title={t("articles.sidebar.popular")}
            />
            <div className="flex flex-col gap-4 rounded-xl bg-muted/30 p-3 sm:p-4 md:p-5 lg:p-3 xl:p-5">
                {data.map((article, index) => (
                    <Fragment key={article.id}>
                        <ArticleCard.Horizontal article={article} />
                        {index < data.length - 1 && <hr />}
                    </Fragment>
                ))}
            </div>
        </aside>
    );
}
