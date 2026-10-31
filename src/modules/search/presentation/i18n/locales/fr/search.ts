/**
 * search (fr)
 *
 * @description
 * French strings for site search: the overlay, the search route and its states. Mirror
 * of the English catalog; must hold the exact same keys.
 */
export const search = {
    meta: {
        title: "Recherche"
    },
    field: {
        label: "Rechercher sur 116",
        placeholder: "Rechercher un article, une vidéo, un short…",
        clear: "Effacer la recherche",
        submit: "Lancer la recherche",
        submitShort: "Rechercher",
        escape: "Échap",
        close: "Fermer la recherche"
    },
    scope: {
        label: "Filtrer par type de contenu",
        all: "Tout",
        articles: "Articles",
        videos: "Vidéos",
        shorts: "Shorts"
    },
    type: {
        article: "Article",
        video: "Vidéo",
        short: "Short",
        lyrics: "Paroles"
    },
    idle: {
        recent: "Recherches récentes",
        clear: "Effacer",
        explore: "Explorer par tag"
    },
    overlay: {
        scroll: "Faites défiler pour voir plus",
        seeAll_one: "Voir le résultat",
        seeAll_other: "Voir les {{count}} résultats"
    },
    results: {
        count_one: "{{count}} résultat",
        count_other: "{{count}} résultats"
    },
    empty: {
        title: "Aucun résultat pour « {{query}} »",
        hint: "Vérifiez l'orthographe ou essayez un terme plus large : un artiste, une émission, un genre."
    },
    prompt: "Saisissez quelque mots pour lancer la recherche.",
    error: "La recherche n'a pas abouti. Réessayez dans un instant."
} as const;
