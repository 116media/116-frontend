# 09 — i18n & Notifications

Strings live under a `shorts.` namespace (en/fr), following the videos module's i18n
structure; share feedback goes through a notification config, never hardcoded at the call
site.

---

## i18n

`src/modules/shorts/presentation/i18n/index.ts` exports `shortsMessages = { en, fr }`, each
locale a folder of per-surface files re-exported by `locales/<lang>/index.ts`. Keys resolve
under the `shorts.` namespace (e.g. `t("shorts.player.next")`).

Proposed keys:

| Key | en | fr |
|---|---|---|
| `shorts.section.title` | Shorts | Réels |
| `shorts.section.subtitle` | Quick clips to watch | Clips à regarder |
| `shorts.player.close` | Close | Fermer |
| `shorts.player.previous` | Previous short | Réel précédent |
| `shorts.player.next` | Next short | Réel suivant |
| `shorts.player.play` | Play | Lire |
| `shorts.player.pause` | Pause | Pause |
| `shorts.player.mute` | Mute | Couper le son |
| `shorts.player.unmute` | Unmute | Activer le son |
| `shorts.player.endOfFeed` | You're all caught up | Vous êtes à jour |
| `shorts.actions.like` | Like | J'aime |
| `shorts.actions.share` | Share | Partager |
| `shorts.actions.views` | `{{count}} views` | `{{count}} vues` |
| `shorts.strip.empty` | (section omitted — no string) | — |

Counts render through `formatCount`; the `views` label takes the formatted number as
`{{count}}`.

---

## Notifications

Share is the only interaction that surfaces a toast (like/view are silent). Copy lives in a
notification config, dashboard-style filename:

`presentation/utils/notification/shorts.share.notification.ts`

```ts
export const ShortShareNotification = {
    linkCopied: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("shorts.share.copied.title"),
        description: t("shorts.share.copied.description")
    })
} as const;
```

Call site: `showNotification(ShortShareNotification.linkCopied(t))` — never inline copy.
Like and view never toast (the optimistic flip / silent record is the feedback), matching
the content-interactions convention.

Share notification keys:

| Key | en | fr |
|---|---|---|
| `shorts.share.copied.title` | Link copied | Lien copié |
| `shorts.share.copied.description` | The short's link is on your clipboard | Le lien du réel est copié |

New cspell words if any (`webshare` already added for the share refactor) — none expected
beyond existing entries.
</content>
