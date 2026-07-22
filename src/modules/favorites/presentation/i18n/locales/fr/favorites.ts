/**
 * favorites (fr)
 *
 * @description
 * French strings for the favorites area, the default and fallback locale. Mirror of the
 * English catalog; must hold the exact same keys.
 */
export const favorites = {
    navigation: {
        articles: "Articles",
        videos: "Vidéos",
        shorts: "Shorts"
    },
    headings: {
        articles: "Articles favoris",
        videos: "Vidéos favorites",
        shorts: "Shorts favoris"
    },
    subtitles: {
        articles: "Tout ce que vous avez enregistré, commenté, aimé ou partagé.",
        videos: "Vos playlists et les vidéos que vous avez notées ou partagées.",
        shorts: "Les shorts que vous avez aimés, enregistrés ou partagés."
    },
    collections: {
        bookmarked: "Enregistrés",
        commented: "Commentés",
        liked: "Aimés",
        shared: "Partagés",
        playlists: "Playlists",
        rated: "Notées",
        saved: "Enregistrés"
    },
    activity: {
        bookmarkedAt: "Enregistré {{date}}",
        savedAt: "Enregistré {{date}}",
        sharedAt: "Partagé {{date}}",
        likedAt: "Aimé {{date}}",
        ratedAt: "Noté {{date}}",
        latestComment: "Votre dernier commentaire",
        commentCount_one: "{{count}} commentaire",
        commentCount_other: "{{count}} commentaires",
        shareCount_one: "{{count}} partage",
        shareCount_other: "{{count}} partages",
        yourRating: "Votre note"
    },
    comments: {
        viewComments: "Voir les commentaires",
        viewArticle: "Voir l'article",
        edit: "Modifier",
        delete: "Supprimer",
        save: "Enregistrer",
        cancel: "Annuler",
        drawerTitle: "Vos commentaires",
        drawerSubtitle: "Les commentaires que vous avez laissés sur cet article.",
        empty: "Vous n'avez pas encore commenté cet article.",
        confirmDeleteTitle: "Supprimer ce commentaire ?",
        confirmDeleteBody: "Ce commentaire sera supprimé. Cette action est irréversible.",
        confirmDelete: "Supprimer"
    },
    playlist: {
        open: "Ouvrir",
        rename: "Renommer",
        delete: "Supprimer",
        removeVideo: "Retirer",
        back: "Retour aux playlists",
        emptySlot: "Emplacement de playlist vide",
        videoCount_one: "{{count}} vidéo",
        videoCount_other: "{{count}} vidéos",
        renameTitle: "Renommer la playlist",
        renameSubtitle: "Donnez un nouveau nom à votre playlist.",
        renamePlaceholder: "Nom de la playlist",
        nameLabel: "Nom de la playlist",
        save: "Enregistrer",
        cancel: "Annuler",
        confirmDeleteTitle: "Supprimer cette playlist ?",
        confirmDeleteBody:
            "« {{name}} » sera supprimée. Les vidéos restent disponibles dans votre bibliothèque.",
        confirmDelete: "Supprimer",
        confirmRemoveTitle: "Retirer cette vidéo ?",
        confirmRemoveBody: "Cette vidéo sera retirée de « {{name}} ».",
        confirmRemove: "Retirer",
        emptyVideos: "Cette playlist ne contient aucune vidéo."
    },
    videos: {
        rateAgain: "Noter à nouveau"
    },
    states: {
        loading: "Chargement…",
        error: "Une erreur est survenue.",
        retry: "Réessayer",
        endOfResults: "Vous avez atteint la fin.",
        authentication: {
            title: "Connectez-vous pour voir vos favoris.",
            cta: "Se connecter"
        },
        empty: {
            bookmarkedArticles: {
                title: "Aucun article enregistré",
                body: "Touchez l'icône de signet sur un article pour l'enregistrer ici."
            },
            commentedArticles: {
                title: "Aucun commentaire",
                body: "Les articles que vous commentez apparaissent ici."
            },
            likedArticles: {
                title: "Aucun article aimé",
                body: "Les articles que vous aimez apparaissent ici."
            },
            sharedArticles: {
                title: "Aucun article partagé",
                body: "Les articles que vous partagez apparaissent ici."
            },
            playlists: {
                title: "Aucune playlist",
                body: "Créez une playlist depuis une vidéo pour la voir ici."
            },
            ratedVideos: {
                title: "Aucune vidéo notée",
                body: "Les vidéos que vous notez apparaissent ici."
            },
            sharedVideos: {
                title: "Aucune vidéo partagée",
                body: "Les vidéos que vous partagez apparaissent ici."
            },
            likedShorts: {
                title: "Aucun short aimé",
                body: "Les shorts que vous aimez apparaissent ici."
            },
            savedShorts: {
                title: "Aucun short enregistré",
                body: "Les shorts que vous enregistrez apparaissent ici."
            },
            sharedShorts: {
                title: "Aucun short partagé",
                body: "Les shorts que vous partagez apparaissent ici."
            }
        }
    }
} as const;
