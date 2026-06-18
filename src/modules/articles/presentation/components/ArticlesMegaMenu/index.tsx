import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";
import {
    MegaMenuShell,
    MegaMenuShellCards,
    MegaMenuShellCategories
} from "@/shared/presentation/layouts/MegaMenuShell";
import { ArticlesMegaMenuCard } from "../ArticlesMegaMenuCard";
import { ArticlesMegaCategoryList } from "./ArticlesMegaCategoryList";
import type { ArticlesMegaMenuProps } from "./types";

/**
 * Dummy articles used as placeholders in the À la une column
 * until real promoted articles are available from the API.
 * The first two are shown as Featured (vertical) cards,
 * the last two as Compact (horizontal) cards.
 */
const DUMMY_ARTICLES: IArticleSummaryEntity[] = [
    {
        id: "dummy-1",
        categoryId: "cat-1",
        categoryName: "Actualités",
        title: "Le retour triomphal de Phoenix sur scène",
        slug: "retour-triomphal-phoenix",
        headline:
            "Découvrez les coulisses de la tournée mondiale et les secrets de leur nouvelle scénographie.",
        coverImageUrl: "https://i.pravatar.cc/400?img=1",
        isPromoted: true,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likeCount: 312,
        commentCount: 47,
        shareCount: 89
    },
    {
        id: "dummy-2",
        categoryId: "cat-2",
        categoryName: "Interviews",
        title: "IA et Composition : La fin de l'auteur ?",
        slug: "ia-composition-fin-auteur",
        headline:
            "Enquête au cœur des studios qui utilisent désormais l'intelligence artificielle pour créer les tubes.",
        coverImageUrl: "https://i.pravatar.cc/400?img=2",
        isPromoted: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likeCount: 198,
        commentCount: 23,
        shareCount: 61
    },
    {
        id: "dummy-3",
        categoryId: "cat-3",
        categoryName: "Concerts",
        title: "Fally Ipupa annonce une tournée européenne explosive",
        slug: "fally-ipupa-tournee-europeenne",
        headline:
            "Le roi du coupé-décalé revient en force avec 12 dates en Europe pour l'été prochain.",
        coverImageUrl: "https://i.pravatar.cc/400?img=3",
        isPromoted: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        likeCount: 541,
        commentCount: 78,
        shareCount: 134
    },
    {
        id: "dummy-4",
        categoryId: "cat-4",
        categoryName: "Sorties",
        title: "Damso dévoile les premières images de son album visuel",
        slug: "damso-album-visuel-images",
        headline:
            "Une esthétique sombre et cinématographique pour ce projet attendu depuis deux ans.",
        coverImageUrl: "https://i.pravatar.cc/400?img=4",
        isPromoted: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        likeCount: 87,
        commentCount: 12,
        shareCount: 33
    }
];

/**
 * ArticlesMegaMenu
 *
 * @description
 * Mega menu panel for the NEWS nav item.
 * Uses MegaMenuShell for the shared 3-column layout structure.
 * Data is prefetched server-side and received as props — no
 * client-side fetching or loading state.
 * When no promoted articles are available, dummy placeholders are shown.
 */
export function ArticlesMegaMenu({
    categories,
    promotedArticles,
    popularTags
}: ArticlesMegaMenuProps) {
    const cards = promotedArticles.length > 0 ? promotedArticles.slice(0, 4) : DUMMY_ARTICLES;
    const featured = cards.slice(0, 2);
    const compact = cards.slice(2, 4);

    return (
        <MegaMenuShell
            tagsBasePath={ARTICLES_PATH}
            popularTags={popularTags}
        >
            <MegaMenuShellCategories>
                <ArticlesMegaCategoryList categories={categories} />
            </MegaMenuShellCategories>

            <MegaMenuShellCards
                viewAllHref={ARTICLES_PATH}
                label="Voir tout →"
            >
                <div className="grid grid-cols-2 gap-2 grid-rows-[288px] lg:grid-rows-[320px]">
                    <ArticlesMegaMenuCard.FeaturedOverlay article={featured[0]} />
                    <ArticlesMegaMenuCard.FeaturedGradient article={featured[1]} />
                </div>
                <div className="grid grid-cols-2 gap-2 grid-rows-[168px] lg:grid-rows-[180px]">
                    {compact.map((article) => (
                        <ArticlesMegaMenuCard.Compact
                            key={article.id}
                            article={article}
                        />
                    ))}
                </div>
            </MegaMenuShellCards>
        </MegaMenuShell>
    );
}
