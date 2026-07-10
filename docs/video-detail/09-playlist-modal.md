# 09 — Add-to-Playlist Modal

The header's "+ Playlist" button opens a dialog listing the viewer's playlists as a
**checkbox list**, with an add action for the selected ones.

```text
┌─────────────────────────────────────┐
│ Add to playlist                 ✕   │
│                                     │
│ ☑  Chill afro         12 videos     │
│ ☐  Gym               4 videos       │
│ ☑  Favorites         31 videos      │
│                                     │
│ [ + New playlist            ]       │   ← inline create (name input)
│                                     │
│              [ Add to 2 playlists ] │
└─────────────────────────────────────┘
```

## Auth gate

Playlists are account-scoped (`GET /api/v1/public/playlists` requires auth). The button
runs through `useRequireAuth`: a guest gets the login modal and the playlist dialog
opens after a successful login. Inside the modal, the playlists query is
`enabled: open && isAuthenticated`.

## Behavior

- **List** — `useMyPlaylists()` → checkbox rows (`Checkbox` primitive + name +
  `videoCount` in muted text). Loading: 3 skeleton rows. Empty: a gentle empty line +
  the create field focused.
- **Selection** — local `Set<string>` of playlist ids; the submit button label carries
  the live count (`videos.detail.playlist.addCount`, pluralized) and disables at zero.
- **Create inline** — a small input + button calling `useCreatePlaylist`
  (`publicCreatePlaylist({ name })`); the created playlist is appended to the cached
  list and auto-checked. Kept minimal: name only, non-empty validation.
- **Submit** — `useAddToPlaylist(videoId)` fans out
  `publicAddVideoToPlaylist(playlistId, { videoId, sortOrder: videoCount })` over the
  selected ids (`Promise.all` of `Result`s). Full success → success toast
  (`playlist.notification.ts`) + modal closes + playlists query invalidated (counts
  changed). Partial/total failure → error toast naming nothing sensitive, selections
  preserved so the viewer can retry.
- **Already-added** videos: the backend responds with its conflict behavior; the
  mutation treats a failed playlist as "not added" in the partial-failure toast. A
  richer "already in playlist" pre-check needs a membership endpoint — see
  [18-open-questions.md](18-open-questions.md).

## Pieces

- `VideoPlaylistModal` (in `VideoDetail/`) — dialog shell, list, create field, submit.
- `Checkbox` — new shared radix primitive (`@radix-ui/react-checkbox`, latest via
  `npm show`), token-styled: `border-input`, checked `bg-primary
  text-primary-foreground` (`dark:bg-secondary`), `rounded` (4px), focus ring.
- Notifications — `playlist.notification.ts` configs: added-success (with count),
  add-failed, created-success.
