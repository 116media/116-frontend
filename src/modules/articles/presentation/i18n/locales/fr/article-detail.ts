/**
 * articleDetail (fr)
 *
 * @description
 * French strings for the single-article page: engagement labels, error/not-found states,
 * share rail, comments section, and popular sidebar. Spread by the locale barrel next to
 * the `articles` bundle. Must stay key-aligned with the English mirror.
 */
export const articleDetail = {
    detail: {
        like: "J'aime",
        bookmark: "Enregistrer",
        comment: "Commenter",
        share: "Partager",
        tags: "Tags",
        writtenBy: "Écrit par",
        backToArticles: "Retour aux articles",
        notFound: {
            title: "Article introuvable",
            subtitle: "Cet article a peut-être été supprimé ou le lien est erroné."
        },
        error: {
            title: "Impossible de charger cet article",
            subtitle: "Une erreur est survenue. Vérifiez votre connexion et réessayez.",
            retry: "Réessayer"
        }
    },
    share: {
        facebook: "Partager sur Facebook",
        x: "Partager sur X",
        whatsapp: "Partager sur WhatsApp",
        copy: "Copier le lien",
        copied: {
            title: "Lien copié",
            description: "Le lien de l'article est dans votre presse-papiers."
        }
    },
    comments: {
        title_one: "{{count}} commentaire",
        title_other: "{{count}} commentaires",
        placeholder: "Ajouter un commentaire…",
        composerLabel: "Écrire un commentaire",
        submit: "Publier le commentaire",
        anonymousUser: "Lecteur",
        loginPrompt: "Connectez-vous pour rejoindre la conversation.",
        loginCta: "Se connecter pour commenter",
        removed: "Ce commentaire a été supprimé",
        loadMore: "Charger plus de commentaires",
        empty: {
            title: "Aucun commentaire pour le moment",
            body: "Soyez le premier à donner votre avis."
        },
        error: {
            title: "Impossible de charger les commentaires",
            retry: "Réessayer"
        },
        postError: {
            title: "Commentaire non publié",
            description: "Une erreur est survenue. Votre texte est conservé — réessayez."
        }
    },
    sidebar: {
        popular: "Articles populaires"
    }
} as const;
