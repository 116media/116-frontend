# 08 — Shares

A **share** records an outbound share event and bumps a running count. It is the only
interaction that works **anonymously**, and the only one that is deliberately
**fire-and-forget** — telemetry must never block the user's share.

Applies to: **articles** (shipped), **full videos** (shipped), **short videos** (out of
scope).

---

## Behaviour

| Aspect | Rule |
|---|---|
| Auth | Anonymous allowed — no session required |
| Recording | Fire-and-forget; failures swallowed, never toasted |
| Count | `shareCount` bumped optimistically in the cache |
| Dedup | None — every share is a new row; the count is a running total (see [15](15-counting-anonymous-actions.md)) |
| Channel | The frontend reports a `shareChannel` (Facebook / X / WhatsApp / Clipboard / WebShare) |

---

## Two share UIs

- **Article** — a **share rail** (`ArticleDetailShareRail`): Facebook · X · WhatsApp · copy
  link, sticky beside the body, backed by `useShareArticle`.
- **Video** — a **share modal** (`VideoShareModal`): the same targets in a dialog, backed by
  `useShareVideo`.

Both build the canonical URL (`{origin}/articles/{slug}` or `/videos/{slug}`), hand off to
the channel (deep link, Web Share sheet, or clipboard), then record the event.

`useShareArticle` additionally uses the **Web Share API** when available
(`navigator.share`), falling back to `clipboard.writeText`. `useShareVideo` bumps the cached
detail entity's `shareCount` optimistically.

---

## The share channel

The frontend passes a `shareChannel` label to the share use case:

```ts
container.cradle.shareArticleUseCase.execute({ articleId, shareChannel: "webshare" });
container.cradle.shareVideoUseCase.execute({ videoId, shareChannel });
```

The backend **accepts and stores it**. The share endpoints take an optional JSON body
`{ "shareChannel": "..." }`; the endpoint resolves it through the `ShareChannel` value
object (`ShareChannel.TryFrom`, case-insensitive, unrecognized → ignored) into an
`EnumShareChannel` — `Facebook`, `X`, `WhatsApp`, `Clipboard`, `WebShare` — persisted on the
`*ShareEntity` (`share_channel` column). Naming note: this is deliberately **not** called
`Platform` — the backend already uses `EnumPlatform` for the session's OS.

Client contract:

- The frontend sends its UI identifiers as-is (`facebook`, `x`, `whatsapp`, `clipboard`);
  the backend parses them case-insensitively and stores the canonical enum name.
- The one exception is the Web Share sheet, sent as `webshare` (not `web-share`) so it
  parses to `WebShare`.
- An unrecognized channel is stored as null (the share still succeeds — fire-and-forget).

---

## Fire-and-forget contract

The share **succeeds** the moment the sheet opens or the URL is copied. The recording call
is not awaited for user feedback and its errors are caught and dropped. Consequences:

- No loading spinner on a share button.
- No error toast if recording fails.
- The optimistic `shareCount` bump may briefly overcount if recording failed — acceptable;
  it reconciles on the next detail fetch.

---

## Surfaces

| Surface | Component | Hook |
|---|---|---|
| Article detail | `ArticleDetailShareRail` | `useShareArticle` |
| Article feed card | `ArticleCard.Engagement` (share count) | — (display only) |
| Video detail | `VideoShareModal` | `useShareVideo` |
| Video feed card | `VideoCard.ShareCount` | — (display only) |

The full contract is in [specs/07-shares.md](specs/07-shares.md).
