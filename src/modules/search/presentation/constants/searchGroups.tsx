import type { ReactNode } from "react";

import { ArticleCard } from "@/modules/articles/presentation/components/cards/ArticleCard";
import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import { EContentType } from "@/modules/search/domain/enums/EContentType";
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import type { SearchGridShape } from "@/modules/search/presentation/constants/searchLayout";
import {
    toArticleSummary,
    toShortVideo,
    toVideoSummary
} from "@/modules/search/presentation/utils/search/searchCard.utils";
import { ShortCard } from "@/modules/shorts/presentation/components/cards/ShortCard";
import { VideoCard } from "@/modules/videos/presentation/components/cards/VideoCard";
import { FilmIcon, NewspaperIcon, PlayIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Opens a hit's own surface. A short takes over the viewport instead of following a
 * link, so its card reports the intent and the caller routes it.
 */
export type SearchHitOpener = (hit: ISearchHitEntity) => void;

/**
 * One searchable content type: the scope that narrows to it, how it is labelled and
 * laid out, and the feed card it renders as.
 *
 * @interface SearchGroupDescriptor
 * @property {EContentType} type - The hit type this group collects.
 * @property {ESearchScope} scope - The tab that narrows to it.
 * @property {string} titleKey - The i18n key naming the group.
 * @property {SearchGridShape} shape - The column ladder its cards run on.
 * @property {ReactNode} icon - The icon on its heading.
 * @property {(hit: ISearchHitEntity, open: SearchHitOpener) => ReactNode} render - The
 * card for one hit, carrying its own key.
 */
export interface SearchGroupDescriptor {
    type: EContentType;
    scope: ESearchScope;
    titleKey: string;
    shape: SearchGridShape;
    icon: ReactNode;
    render: (hit: ISearchHitEntity, open: SearchHitOpener) => ReactNode;
}

/**
 * The searchable types, in the order their groups appear. Every surface that groups,
 * labels or stands in for results reads this, so supporting a new type is one entry
 * here rather than an edit to each of them.
 */
export const SEARCH_GROUPS: readonly SearchGroupDescriptor[] = [
    {
        type: EContentType.Article,
        scope: ESearchScope.Articles,
        titleKey: "search.scope.articles",
        shape: "wide",
        icon: <NewspaperIcon />,
        render: (hit) => (
            <ArticleCard.Feed
                key={hit.id}
                article={toArticleSummary(hit)}
            />
        )
    },
    {
        type: EContentType.Video,
        scope: ESearchScope.Videos,
        titleKey: "search.scope.videos",
        shape: "wide",
        icon: <PlayIcon />,
        render: (hit) => (
            <VideoCard.Vertical
                key={hit.id}
                video={toVideoSummary(hit)}
            />
        )
    },
    {
        type: EContentType.Short,
        scope: ESearchScope.Shorts,
        titleKey: "search.scope.shorts",
        shape: "tall",
        icon: <FilmIcon />,
        render: (hit, open) => (
            <ShortCard.Root
                key={hit.id}
                short={toShortVideo(hit)}
                onOpen={() => open(hit)}
            />
        )
    }
];
