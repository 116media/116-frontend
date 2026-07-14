# 12 — i18n & Notifications

Interaction copy lives in the per-module locale files, and toast copy lives in the
`notification/` configs (never hardcoded at the call site). Both en and fr must hold the
exact same keys.

---

## i18n — shipped keys

### Articles (`i18n/locales/{en,fr}/`)

| Namespace | Keys |
|---|---|
| `articles` | `like`, `bookmark`, `share`, `comments` (card labels) |
| `articles.detail` | `like`, `bookmark`, `comment`, `share` (detail actions) |
| `articles.detail.share` | `facebook`, `x`, `whatsapp` (rail targets) |
| `articles.comments` | `title` (with count), `empty`, `error.title`, `error.retry`, `end`, `loadMore` |

### Videos (`i18n/locales/{en,fr}/video-detail.ts`)

| Namespace | Keys |
|---|---|
| `videos.detail` | `share`, `addToPlaylist`, `save` |
| `videos.detail.ratingModal` | modal title/subtitle |
| `videos.detail.rating` | `label`, `rateAria` |
| `videos.detail.shareModal` | `title`, `subtitle`, `facebook`, `x`, `whatsapp`, `copy`, `copied` |
| `videos.detail.scoreboard` | `note` (Rating), `rate`, review/comment/share plurals |
| `videos.detail.stats` | `views`, `likes`, `comments`, `shares` — *scoreboard (YouTube stats), not native* |

---

## i18n — keys to add (deferred)

For the deferred comment completion and my-bookmarks:

| Namespace | Keys | For |
|---|---|---|
| `articles.comments` | `reply`, `edit`, `delete`, `deleted`, `save`, `cancel` | reply / edit / delete affordances |
| `articles.comments` | `deleteConfirm.title`, `deleteConfirm.body` | delete confirm dialog |
| `articles.comments` | `replies` (with count), `viewReplies`, `hideReplies` | reply thread toggle |
| `articles.bookmarks` | `title`, `empty.title`, `empty.body` | `/bookmarks` page |

Every added key goes into **both** en and fr in the same shape; a mismatch fails the i18n
key-parity check.

---

## Notifications (`presentation/utils/notification/`)

Toast copy is centralized per module. Existing configs:

| Config | Toasts |
|---|---|
| `articles.comment.notification.ts` | `ArticleCommentNotification.postFailed` (error) |
| `articles.share.notification.ts` | share toasts |
| `videos.rating.notification.ts` | `RatingNotification.success` / `.failed` |
| `videos.share.notification.ts` | video share toasts |
| `videos.playlist.notification.ts` | playlist add/create toasts |

**No like / bookmark notification config exists** — toggles are silent by design (the
optimistic flip and rollback are the only feedback). Do not add success/failure toasts to
like or bookmark.

### To add (deferred)

| Config | Toasts | For |
|---|---|---|
| `articles.comment.notification.ts` | `editFailed`, `deleteFailed`, `replyFailed` | comment mutations |

Notification configs are `*.notification.ts` modules exporting a namespace of
`(t) => NotificationOptions` builders; call sites pass the result to `showNotification`. See
the shipped `videos.rating.notification.ts` for the shape to copy.

---

## Rules

- **Copy is never inline.** Action labels resolve through `t(...)`; toast copy through a
  `*.notification.ts` builder.
- **Silent by design where noted.** Like / bookmark / share never toast on success; share
  never toasts on failure.
- **en/fr parity.** Both locales carry identical key trees.
