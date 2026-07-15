# Spec 09 — i18n & Notifications

Design ref: [../12-i18n-and-notifications.md](../12-i18n-and-notifications.md). Shipped keys
are documented; the deferred comment/bookmark keys and comment mutation toasts are new. en
and fr must stay key-for-key identical.

---

## 1. Comment strings (extend)

`src/modules/articles/presentation/i18n/locales/{en,fr}/articles.ts` (or the article-detail
locale module), under `comments`. Shipped keys plus the deferred additions.

```ts
    comments: {
        title: "Comments",
        empty: { title: "No comments yet", body: "Be the first to comment." },
        error: { title: "Couldn't load comments", retry: "Try again" },
        end: "You're all caught up",
        loadMore: "Load more",
        reply: "Reply",
        edit: "Edit",
        delete: "Delete",
        deleted: "This comment was deleted",
        save: "Save",
        cancel: "Cancel",
        replies: "{{count}} replies",
        replies_one: "{{count}} reply",
        viewReplies: "View replies",
        hideReplies: "Hide replies",
        deleteConfirm: {
            title: "Delete comment?",
            body: "This can't be undone."
        }
    }
```

French mirror (same keys):

```ts
    comments: {
        title: "Commentaires",
        empty: { title: "Aucun commentaire pour le moment", body: "Soyez le premier à commenter." },
        error: { title: "Impossible de charger les commentaires", retry: "Réessayer" },
        end: "Vous êtes à jour",
        loadMore: "Voir plus",
        reply: "Répondre",
        edit: "Modifier",
        delete: "Supprimer",
        deleted: "Ce commentaire a été supprimé",
        save: "Enregistrer",
        cancel: "Annuler",
        replies: "{{count}} réponses",
        replies_one: "{{count}} réponse",
        viewReplies: "Voir les réponses",
        hideReplies: "Masquer les réponses",
        deleteConfirm: {
            title: "Supprimer le commentaire ?",
            body: "Cette action est irréversible."
        }
    }
```

---

## 2. Bookmarks page strings (new)

Under `articles`, a new `bookmarks` namespace:

```ts
    bookmarks: {
        title: "Saved articles",
        browse: "Browse articles",
        empty: {
            title: "Nothing saved yet",
            body: "Bookmark an article to find it here later."
        }
    }
```

French:

```ts
    bookmarks: {
        title: "Articles enregistrés",
        browse: "Parcourir les articles",
        empty: {
            title: "Rien d'enregistré pour l'instant",
            body: "Enregistrez un article pour le retrouver ici."
        }
    }
```

---

## 3. Comment notifications (extend)

`src/modules/articles/presentation/utils/notification/articles.comment.notification.ts`

Add `editFailed`, `deleteFailed`, `replyFailed` beside the shipped `postFailed`.

```ts
import type { TFunction } from "i18next";

import type { NotificationOptions } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * ArticleCommentNotification
 *
 * @description
 * Toast copy for article comment mutations. Only failures notify — successful posts,
 * edits, deletes, and replies are reflected by the optimistic cache update, not a toast.
 */
export const ArticleCommentNotification = {
    /**
     * Toast for a failed comment post.
     *
     * @param t - The active translation function.
     * @returns The error notification options.
     */
    postFailed: (t: TFunction): NotificationOptions => ({
        type: "error",
        message: t("articles.comments.error.title")
    }),

    /**
     * Toast for a failed comment edit.
     *
     * @param t - The active translation function.
     * @returns The error notification options.
     */
    editFailed: (t: TFunction): NotificationOptions => ({
        type: "error",
        message: t("articles.comments.error.title")
    }),

    /**
     * Toast for a failed comment delete.
     *
     * @param t - The active translation function.
     * @returns The error notification options.
     */
    deleteFailed: (t: TFunction): NotificationOptions => ({
        type: "error",
        message: t("articles.comments.error.title")
    }),

    /**
     * Toast for a failed reply post.
     *
     * @param t - The active translation function.
     * @returns The error notification options.
     */
    replyFailed: (t: TFunction): NotificationOptions => ({
        type: "error",
        message: t("articles.comments.error.title")
    })
};
```

---

## Rules

- **en/fr parity** — every added key exists in both; the i18n key-parity check fails otherwise.
- **Plurals** via i18next suffixes (`replies` / `replies_one`).
- **No like/bookmark/share success toast** — those interactions stay silent.
- **Copy never inline** — labels via `t(...)`, toasts via the notification config.

---

## Tasks

- [ ] Comment strings extended (reply/edit/delete/deleted/save/cancel/replies/confirm) in en + fr.
- [ ] `articles.bookmarks.*` added in en + fr.
- [ ] `editFailed` / `deleteFailed` / `replyFailed` added to the comment notification config.
- [ ] Plurals use i18next suffixes; en/fr key trees identical.
- [ ] No success toast added to like / bookmark / share.
- [ ] `tsc` + biome clean.
