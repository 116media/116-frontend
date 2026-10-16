/**
 * articles (fr)
 *
 * @description
 * French strings for the article card, feed grid, and filter toolbar surfaces. Spread by
 * the locale barrel so keys resolve as `t("articles.card.<key>")` and siblings; `readTime`
 * uses i18next plural suffixes. Must hold the exact same keys as the English mirror.
 */
export const articles = {
    pageTitle: "Articles",
    card: {
        read: "Lire l'article",
        readTime_one: "{{count}} min de lecture",
        readTime_other: "{{count}} min de lecture",
        share: "Partager",
        bookmark: "Enregistrer",
        like: "J'aime",
        comments: "Commentaires"
    },
    grid: {
        empty: {
            title: "Aucun article pour le moment",
            body: "Revenez bientôt pour de nouveaux articles."
        },
        noResults: {
            title: "Aucun article ne correspond à vos filtres",
            body: "Essayez une autre recherche, catégorie ou tag."
        },
        error: {
            title: "Impossible de charger les articles",
            retry: "Réessayer"
        },
        end: "Vous êtes à jour"
    },
    browse: {
        title: "Explorer les articles"
    },
    filters: {
        all: "Tous",
        searchPlaceholder: "Filtrer dans les articles…",
        clearSearch: "Effacer la recherche",
        allCategories: "Toutes les catégories",
        category: "Catégorie",
        allTags: "Tous les tags",
        tagsTrigger: "Tags",
        tagSearch: "Rechercher…",
        tagsClose: "Fermer les tags",
        tagsEmpty: "Aucun tag ne correspond à votre recherche",
        clear: "Effacer les filtres"
    }
} as const;
