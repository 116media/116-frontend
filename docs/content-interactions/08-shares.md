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
| Platform | The frontend picks a target (Facebook / X / WhatsApp / copy / Web Share) |

---

## Two share UIs

- **Article** — a **share rail** (`ArticleDetailShareRail`): Facebook · X · WhatsApp · copy
  link, sticky beside the body, backed by `useShareArticle`.
- **Video** — a **share modal** (`VideoShareModal`): the same targets in a dialog, backed by
  `useShareVideo`.

Both build the canonical URL (`{origin}/articles/{slug}` or `/videos/{slug}`), hand off to
the platform (deep link, Web Share sheet, or clipboard), then record the event.

`useShareArticle` additionally uses the **Web Share API** when available
(`navigator.share`), falling back to `clipboard.writeText`. `useShareVideo` bumps the cached
detail entity's `shareCount` optimistically.

---

## The platform-param discrepancy

The frontend passes a `platform` label to the share use case:

```ts
container.cradle.shareArticleUseCase.execute({ articleId, platform: "web-share" });
container.cradle.shareVideoUseCase.execute({ videoId, platform });
```

**The backend does not accept or store a platform.** Its share command is
`(contentId, userId?, timestamp)` only. So today the `platform` value is **inert** — it
travels through the frontend use case but is dropped before the network call (or ignored by
the endpoint).

Why keep it:

- It documents intent at the call site (which button was pressed).
- It is analytics-ready if a client-side telemetry sink is added.
- It matches the mobile app's contract, easing a future backend `platform` column.

This is a **known, non-blocking gap** — tracked in [14](14-open-questions.md). Do not "fix"
it by removing the param; if per-platform share breakdown is wanted, it is a backend change
(add `platform` to the share command + entity), then the frontend already supplies it.

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
