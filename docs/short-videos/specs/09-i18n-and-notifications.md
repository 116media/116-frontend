# Spec 09 — i18n & Notifications

Design ref: [../09-i18n-and-notifications.md](../09-i18n-and-notifications.md). The `shorts.`
message namespace (en/fr) and the share notification config. Mirrors the videos module's
i18n + `presentation/utils/notification/` conventions.

---

## 1. i18n structure

`src/modules/shorts/presentation/i18n/index.ts`

```ts
import { en } from "./locales/en";
import { fr } from "./locales/fr";

/**
 * shortsMessages
 *
 * @description
 * The shorts feature's translation bundles, merged under the `shorts.` namespace
 * by the app's i18n setup.
 */
export const shortsMessages = { en, fr } as const;
```

`locales/<lang>/index.ts` re-exports per-surface files (`section.ts`, `player.ts`,
`actions.ts`, `share.ts`) into one object. Keys resolve under `shorts.` (e.g.
`t("shorts.player.next")`).

`locales/en/player.ts` (fr mirrors):

```ts
/**
 * English strings for the shorts player surface.
 */
export const player = {
    close: "Close",
    previous: "Previous short",
    next: "Next short",
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    endOfFeed: "You're all caught up"
} as const;
```

Full key set:

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
| `shorts.share.copied.title` | Link copied | Lien copié |
| `shorts.share.copied.description` | The short's link is on your clipboard | Le lien du réel est copié |

Register `shortsMessages` where the other modules' bundles are merged (alongside
`videosMessages`).

## 2. Share notification config

`src/modules/shorts/presentation/utils/notification/shorts.share.notification.ts`

```ts
import type { TFunction } from "i18next";

import type { INotificationConfig } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * ShortShareNotification
 *
 * @description
 * Notification configs for the short share flow. Only the clipboard copy surfaces
 * a toast; other channels are silent.
 */
export const ShortShareNotification = {
    /**
     * Success toast shown when the short's link is copied to the clipboard.
     *
     * @param t - The i18next translator.
     * @returns {INotificationConfig} The copied-link notification config.
     */
    linkCopied: (t: TFunction): INotificationConfig => ({
        type: "success",
        title: t("shorts.share.copied.title"),
        description: t("shorts.share.copied.description")
    })
} as const;
```

Call site (share sheet): `showNotification(ShortShareNotification.linkCopied(t))` on the
clipboard channel only. Like and view never toast.

---

## Tasks

- [ ] `shortsMessages` bundle created; en + fr per-surface files under `locales/`.
- [ ] All keys present in both locales; `shorts.actions.views` interpolates `{{count}}`.
- [ ] `shortsMessages` registered alongside the other module bundles.
- [ ] `ShortShareNotification.linkCopied` config; no inline copy at call sites.
- [ ] Clipboard share toasts; other channels + like + view silent.
- [ ] `tsc` + biome clean.
</content>
