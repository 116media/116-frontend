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
        like: "Aimer ce commentaire",
        unlike: "Retirer le j'aime de ce commentaire",
        reply: "Répondre",
        replyPlaceholder: "Écrire une réponse…",
        replySubmit: "Publier la réponse",
        replyCancel: "Annuler",
        viewReplies_one: "Voir {{count}} réponse",
        viewReplies_other: "Voir {{count}} réponses",
        hideReplies: "Masquer les réponses",
        loadMoreReplies: "Charger plus de réponses",
        repliesError: {
            title: "Impossible de charger les réponses",
            retry: "Réessayer"
        },
        edit: "Modifier",
        editSave: "Enregistrer",
        editCancel: "Annuler",
        delete: "Supprimer",
        deleteConfirmTitle: "Supprimer ce commentaire ?",
        deleteConfirmBody: "Ses réponses restent visibles. Cette action est irréversible.",
        deleteConfirm: "Supprimer le commentaire",
        deleteCancel: "Garder le commentaire",
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
        },
        replyError: {
            title: "Réponse non publiée",
            description: "Une erreur est survenue. Votre texte est conservé — réessayez."
        },
        editError: {
            title: "Modifications non enregistrées",
            description: "Une erreur est survenue. Votre modification est conservée — réessayez."
        },
        deleteError: {
            title: "Commentaire non supprimé",
            description: "Une erreur est survenue. Réessayez."
        }
    },
    sidebar: {
        popular: "Articles populaires"
    }
} as const;
