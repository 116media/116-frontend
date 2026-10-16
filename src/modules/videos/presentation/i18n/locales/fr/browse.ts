/**
 * browse (fr)
 *
 * @description
 * French strings for the videos browse surface — the title, filter toolbar,
 * categories modal, and feed grid — referenced as `t("videos.browse.<key>")`.
 * Must hold the exact same keys as the English mirror.
 */
export const browse = {
    title: "Explorez les collections vidéo",
    filters: {
        all: "Tout",
        searchPlaceholder: "Filtrer dans les vidéos…",
        clearSearch: "Effacer la recherche",
        browseAllShows: "Toutes les émissions",
        allTags: "Tous les tags",
        tagsTrigger: "Tags",
        tagSearch: "Rechercher…",
        tagsClose: "Fermer les tags",
        tagsEmpty: "Aucun tag ne correspond à votre recherche",
        clear: "Effacer les filtres"
    },
    modal: {
        close: "Fermer",
        title: "Émissions et catégories",
        searchPlaceholder: "Rechercher une émission ou une catégorie…",
        empty: "Aucune émission ne correspond à votre recherche"
    },
    grid: {
        empty: {
            title: "Aucune vidéo pour le moment",
            body: "Revenez bientôt pour de nouvelles vidéos."
        },
        noResults: {
            title: "Aucune vidéo ne correspond à vos filtres",
            body: "Essayez une autre recherche, catégorie ou tag."
        },
        error: {
            title: "Impossible de charger les vidéos",
            retry: "Réessayer"
        },
        end: "Vous êtes à jour"
    }
} as const;
