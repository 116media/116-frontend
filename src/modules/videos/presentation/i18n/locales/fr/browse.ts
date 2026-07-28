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
        searchPlaceholder: "Rechercher des vidéos…",
        clearSearch: "Effacer la recherche",
        browseAllShows: "Toutes les émissions",
        allTags: "Toutes les étiquettes",
        tagSearch: "Trouver une étiquette…",
        clear: "Effacer les filtres"
    },
    modal: {
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
            body: "Essayez une autre recherche, catégorie ou étiquette."
        },
        error: {
            title: "Impossible de charger les vidéos",
            retry: "Réessayer"
        },
        end: "Vous êtes à jour"
    }
} as const;
