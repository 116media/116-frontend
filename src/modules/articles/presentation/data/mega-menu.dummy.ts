import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

/**
 * Placeholders for the mega menu's featured column until the API returns promoted
 * articles. Shared by the desktop menu and its mobile panel so both show the same
 * four cards.
 */
export const DUMMY_ARTICLES: IArticleSummaryEntity[] = [
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
