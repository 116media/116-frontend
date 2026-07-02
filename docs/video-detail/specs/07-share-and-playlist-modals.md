# Spec 07 — Share & Playlist Modals (+ Checkbox, SocialShareGroup)

Design ref: [../08-share-modal.md](../08-share-modal.md),
[../09-playlist-modal.md](../09-playlist-modal.md).

## 1. Shared `Checkbox` — `ui/Checkbox/index.tsx`

`@radix-ui/react-checkbox` (latest via `npm show`). Token skin: `size-4 rounded
border border-input bg-transparent`, checked `bg-primary text-primary-foreground
border-primary dark:bg-secondary dark:border-secondary`, `CheckIcon` indicator
(`size-3`), the standard focus ring, `disabled:opacity-50`. JSDoc'd, generic.

## 2. Shared `SocialShareGroup` — `common/SocialShareGroup/index.tsx`

Extraction of the article share rail's button config into one component:

```ts
interface SocialShareGroupProps {
    url: string;
    title: string;
    orientation?: "horizontal" | "vertical";
    labels: { facebook: string; x: string; whatsapp: string; copy: string };
    onShared?: (platform: string) => void;
    onCopied?: () => void;
    className?: string;
}
```

- Internals move over verbatim: the `IShareRailButton`-style config (Facebook/X/WhatsApp
  solid `Colors` backgrounds + adaptive `bg-accent` copy button, white glyphs,
  `hover:brightness-90` + icon scale), `buildShareUrl`, Web-Share-first with intent
  fallback, clipboard for copy. Rendered through `ButtonGroup` with the given
  orientation; `size-11` buttons.
- Namespace-agnostic: aria-labels and toast side-effects come from the caller
  (`onCopied` fires the caller's toast).
- **Rewire `ArticleDetail.ShareRail`** to render
  `<SocialShareGroup orientation="vertical" …>` inside its sticky gradient-free wrapper,
  keeping `articles.share.*` labels and `shareArticleUseCase` telemetry. Zero visual
  change on the articles page (verify side-by-side).

## 3. `VideoDetail/VideoShareModal.tsx`

Props: `{ open, onOpenChange, videoId, slug, title }`.

- Shared `Dialog`; header `videos.detail.shareModal.title`.
- Body: `SocialShareGroup orientation="horizontal"`, centered;
  `url = window.location.href` (fallback `NEXT_PUBLIC_SITE_URL + /videos/{slug}`);
  labels from `videos.detail.shareModal.*`.
- `onShared(platform)` → `useShareVideo(videoId, slug)` fire-and-forget (+ optimistic
  share-count bump); `onCopied` → link-copied toast + close the dialog.

## 4. `VideoDetail/VideoPlaylistModal.tsx`

Props: `{ open, onOpenChange, videoId }`.

- Open is triggered through `useRequireAuth` at the header button, so the modal mounts
  authenticated; `useMyPlaylists(open)` drives the list.
- Rows: `Checkbox` + name + `videoCount` muted (`videos.detail.playlist.*`); selection
  in a local `Set<string>`; loading → 3 skeleton rows; `isError` → inline retry line.
- Inline create: `Input` + `Button` → `useCreatePlaylist`; created playlist appended +
  auto-checked; non-empty validation.
- Footer submit: label `addCount` pluralized with the live selection size, disabled at
  0, `loading` while pending → `useAddToPlaylist(videoId).submit(selected)`; success
  toast + close + reset selection; failure toast keeps selection.

## Tasks

- [ ] `Checkbox` primitive (radix, latest pinned) token-styled.
- [ ] `SocialShareGroup` extracted; **articles share rail visually unchanged**.
- [ ] Share modal: horizontal group, records fire-and-forget, copy toasts + closes.
- [ ] Playlist modal: auth-gated open, list/create/select/submit flows + all toasts.
- [ ] `tsc` + biome clean.
