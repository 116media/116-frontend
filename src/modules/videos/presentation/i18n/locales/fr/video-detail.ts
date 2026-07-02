/**
 * videoDetail (fr)
 *
 * @description
 * French strings for the single video (video detail) page, mirror of the
 * English catalog: the header actions and stat-chip labels, the rating stars
 * and their toasts, the content tabs (description / lyrics / similar), the
 * tag block, the share modal with its copy-link toast, the add-to-playlist
 * modal (list, inline create, pluralized submit, toasts), the popular-videos
 * sidebar, and the not-found / error states. The locale barrel spreads this
 * object so call sites reference the keys as `t("videos.detail.<key>")`.
 * `playlist.addCount` uses i18next plural suffixes and `rating.rateAria`
 * interpolates `{{stars}}`. Must hold the exact same keys as the English
 * mirror.
 */
export const videoDetail = {
    detail: {
        share: "Partager",
        addToPlaylist: "Ajouter à une playlist",
        backToVideos: "Retour aux vidéos",
        stats: {
            views: "Vues",
            likes: "Mentions j'aime",
            comments: "Commentaires",
            shares: "Partages"
        },
        rating: {
            label: "Note",
            rateAria: "Noter {{stars}} sur 5",
            success: {
                title: "Merci pour votre note",
                description: "Votre note a été enregistrée."
            },
            error: {
                title: "Note non enregistrée",
                description: "Une erreur est survenue. Réessayez."
            }
        },
        tabs: {
            description: "Description",
            lyrics: "Paroles",
            similar: "Vidéos similaires"
        },
        lyrics: {
            by: "Par",
            empty: "Aucunes paroles disponibles pour cette vidéo."
        },
        similar: {
            empty: "Pas encore de vidéos similaires."
        },
        tags: {
            label: "Tags"
        },
        shareModal: {
            title: "Partager cette vidéo",
            facebook: "Partager sur Facebook",
            x: "Partager sur X",
            whatsapp: "Partager sur WhatsApp",
            copy: "Copier le lien",
            copied: {
                title: "Lien copié",
                description: "Le lien de la vidéo est dans votre presse-papiers."
            }
        },
        playlist: {
            title: "Ajouter à une playlist",
            empty: "Vous n'avez pas encore de playlist.",
            create: {
                placeholder: "Nom de la nouvelle playlist…",
                submit: "Créer"
            },
            created: {
                title: "Playlist créée"
            },
            addCount_one: "Ajouter à {{count}} playlist",
            addCount_other: "Ajouter à {{count}} playlists",
            added: {
                title: "Vidéo ajoutée",
                description: "La vidéo a été ajoutée à vos playlists."
            },
            error: {
                title: "Impossible d'ajouter la vidéo",
                description: "Une erreur est survenue. Réessayez."
            }
        },
        sidebar: {
            popular: "Vidéos populaires"
        },
        notFound: {
            title: "Vidéo introuvable",
            subtitle: "Cette vidéo a peut-être été supprimée ou le lien est erroné."
        },
        error: {
            title: "Impossible de charger cette vidéo",
            subtitle: "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
            retry: "Réessayer"
        }
    }
} as const;
