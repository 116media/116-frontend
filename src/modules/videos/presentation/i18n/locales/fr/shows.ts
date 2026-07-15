/**
 * shows (fr)
 *
 * @description
 * French strings for the shows page — the title and grid states — referenced
 * as `t("videos.shows.<key>")`. Must hold the exact same keys as the English
 * mirror.
 */
export const shows = {
    title: "Toutes les émissions",
    backToShows: "Retour aux émissions",
    empty: {
        title: "Aucune émission pour le moment",
        body: "Revenez bientôt pour de nouvelles émissions."
    },
    error: {
        title: "Impossible de charger les émissions",
        retry: "Réessayer"
    },
    notFound: {
        title: "Émission introuvable",
        subtitle: "Cette émission a peut-être été supprimée ou n'est plus disponible."
    }
} as const;
