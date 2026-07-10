# 08 — Share Modal

The header's Share button opens a **dialog** carrying the same brand social buttons as
the article page's share rail — Facebook, X, WhatsApp, copy-URL — laid out
**horizontally** in a `ButtonGroup`.

```text
┌───────────────────────────────┐
│ Share this video          ✕   │
│                               │
│ [ f ][ 𝕏 ][ ⓦ ][ 🔗 ]        │   ← horizontal segmented ButtonGroup
│                               │
└───────────────────────────────┘
```

## One source of truth: `SocialShareGroup`

The article `ShareRail` already defines the canonical button set: solid brand
backgrounds from the `Colors` palette (Facebook blue, X black, WhatsApp green), the
adaptive `accent` copy button, white glyphs, `hover:brightness-90` + icon scale. That
config is **extracted to a shared component** so both surfaces render one
implementation:

```text
shared/presentation/components/common/SocialShareGroup/
    props: {
        orientation: "horizontal" | "vertical"
        url: string            ← absolute URL to share
        title: string          ← share message where supported
        onShared(platform)     ← telemetry callback (fire-and-forget)
    }
```

- Internally: `ButtonGroup` + the `IShareRailButton`-style config, `buildShareUrl` from
  shared utils, Web Share API first with per-platform intent fallback, clipboard + the
  link-copied toast for copy.
- The article `ShareRail` becomes a thin wrapper (`orientation="vertical"`, sticky
  positioning, records via `shareArticleUseCase`); the video modal uses
  `orientation="horizontal"` and records via `shareVideoUseCase`.

## The modal

`VideoShareModal` (in `VideoDetail/`) wraps the group in the shared `Dialog`:

- Header: `videos.detail.share.title` + the standard close affordance.
- Body: the horizontal `SocialShareGroup`, centered, `size-11` buttons.
- `onShared(platform)` → `useShareVideo(videoId)`: fire-and-forget
  `publicShareVideo`, optimistic `shareCount + 1` on the cached detail entity, swallow
  failures (telemetry never blocks sharing). Copy also fires the shared link-copied
  toast (`share.notification.ts` config, video-scoped copy).
- The modal closes on successful copy; network shares leave it open (the OS/native
  sheet or the new tab takes over).

## URL

`window.location.href` in the browser (always the case — the modal is client-only),
falling back to `NEXT_PUBLIC_SITE_URL + /videos/{slug}` for safety, mirroring the
article `resolveArticleUrl` helper generalized to a path argument.
