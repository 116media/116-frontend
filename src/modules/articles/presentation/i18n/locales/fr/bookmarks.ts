/**
 * bookmarks (fr)
 *
 * @description
 * French strings for the "my bookmarks" page: title, auth prompt, and the grid's empty,
 * error, and end-of-list states. Spread by the locale barrel next to the `articles`
 * bundle. Must stay key-aligned with the English mirror.
 */
export const bookmarks = {
    bookmarks: {
        title: "Mes articles enregistrés",
        subtitle: "Les articles que vous avez mis de côté pour plus tard.",
        loginPrompt: "Connectez-vous pour voir les articles que vous avez enregistrés.",
        loginCta: "Se connecter",
        empty: {
            title: "Aucun article enregistré",
            body: "Touchez l'icône d'enregistrement sur un article pour le retrouver ici."
        },
        error: {
            title: "Impossible de charger vos articles enregistrés",
            retry: "Réessayer"
        },
        endOfList: "Vous avez vu tous vos articles enregistrés."
    }
} as const;
