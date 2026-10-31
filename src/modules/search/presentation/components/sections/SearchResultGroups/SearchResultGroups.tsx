"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ArticleCard } from "@/modules/articles/presentation/components/cards/ArticleCard";
import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import { EContentType } from "@/modules/search/domain/enums/EContentType";
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SEARCH_GRIDS } from "@/modules/search/presentation/constants/searchLayout";
import {
    toArticleSummary,
    toShortVideo,
    toVideoSummary
} from "@/modules/search/presentation/utils/search/searchCard.utils";
import { ShortCard } from "@/modules/shorts/presentation/components/cards/ShortCard";
import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { FilmIcon, NewspaperIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";
import { SHORTS_PATH } from "@/shared/presentation/constants/paths";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";

/**
 * Props for the SearchResultGroups component.
 *
 * @interface SearchResultGroupsProps
 * @property {ISearchHitEntity[]} hits - The ranked hits for the active page.
 * @property {() => void} [onNavigate] - Called when a card is followed, so a panel can close.
 * @property {Record<ESearchScope, number>} [counts] - What each type matched in total. A
 * surface that previews only part of a group passes this, so its heading agrees with the
 * scope tabs instead of counting the slice on screen.
 */
export interface SearchResultGroupsProps {
    hits: ISearchHitEntity[];
    onNavigate?: () => void;
    counts?: Record<ESearchScope, number>;
}

/**
 * Props for one group of results.
 *
 * @interface SearchResultSectionProps
 * @property {ReactNode} icon - The type's icon.
 * @property {string} title - The type's name.
 * @property {string} subtitle - How many of this type matched.
 * @property {string} grid - The column ladder for this type's cards.
 * @property {ReactNode} children - The cards.
 */
interface SearchResultSectionProps {
    icon: ReactNode;
    title: string;
    subtitle: string;
    grid: string;
    children: ReactNode;
}

/**
 * One group: the shared section header above its own grid. The header is the boundary —
 * boxed, iconned and counted — so a reader always knows which type the card under their
 * cursor belongs to, without reading the card itself.
 */
function SearchResultSection({ icon, title, subtitle, grid, children }: SearchResultSectionProps) {
    return (
        <section className="flex flex-col gap-4">
            <SectionHeader
                size="sm"
                icon={icon}
                title={title}
                subtitle={subtitle}
            />
            <div className={grid}>{children}</div>
        </section>
    );
}

/**
 * SearchResultGroups
 *
 * @description
 * The results, grouped by content type and rendered with each type's own feed card, so a
 * result looks exactly like the same item does on its listing. Ranking is preserved
 * inside a group; across groups the order is fixed, because mixing three card shapes in
 * one grid leaves ragged rows at every width.
 */
export function SearchResultGroups({ hits, counts, onNavigate }: SearchResultGroupsProps) {
    const { t } = useTranslation();
    const router = useProgressRouter();

    const articles = hits.filter((hit) => hit.type === EContentType.Article);
    const videos = hits.filter((hit) => hit.type === EContentType.Video);
    const shorts = hits.filter((hit) => hit.type === EContentType.Short);

    /**
     * How many of a type to report: its true total where the caller knows it, otherwise
     * what is on screen.
     *
     * @param scope - The type's scope.
     * @param shown - How many of it this surface is rendering.
     * @returns {number} The count for the heading.
     */
    const totalFor = (scope: ESearchScope, shown: number) => counts?.[scope] ?? shown;

    const openShort = (slug: string) => {
        onNavigate?.();
        router.push(`${SHORTS_PATH}/${slug}`);
    };

    return (
        <div className="flex flex-col gap-12">
            {articles.length > 0 && (
                <SearchResultSection
                    grid={SEARCH_GRIDS.wide}
                    icon={<NewspaperIcon />}
                    title={t("search.scope.articles")}
                    subtitle={t("search.results.count", {
                        count: totalFor(ESearchScope.Articles, articles.length)
                    })}
                >
                    {articles.map((hit) => (
                        <ArticleCard.Feed
                            key={hit.id}
                            article={toArticleSummary(hit)}
                        />
                    ))}
                </SearchResultSection>
            )}

            {videos.length > 0 && (
                <SearchResultSection
                    icon={<PlayIcon />}
                    grid={SEARCH_GRIDS.wide}
                    title={t("search.scope.videos")}
                    subtitle={t("search.results.count", {
                        count: totalFor(ESearchScope.Videos, videos.length)
                    })}
                >
                    {videos.map((hit) => (
                        <VideoCard.Vertical
                            key={hit.id}
                            video={toVideoSummary(hit)}
                        />
                    ))}
                </SearchResultSection>
            )}

            {shorts.length > 0 && (
                <SearchResultSection
                    icon={<FilmIcon />}
                    grid={SEARCH_GRIDS.tall}
                    title={t("search.scope.shorts")}
                    subtitle={t("search.results.count", {
                        count: totalFor(ESearchScope.Shorts, shorts.length)
                    })}
                >
                    {shorts.map((hit) => (
                        <ShortCard.Root
                            key={hit.id}
                            short={toShortVideo(hit)}
                            onOpen={() => openShort(hit.slug)}
                        />
                    ))}
                </SearchResultSection>
            )}
        </div>
    );
}
