# 07 — Frontend Video & Playlist Data

## Surface

```text
IVideoActivityEntity / IVideoActivityPage
IPlaylistEntity { id; name; videoCount; thumbnailUrls: Array<string | null> }
IPlaylistDetailEntity / IPlaylistVideoEntity
GetMyRatedVideosUseCase / GetMySharedVideosUseCase
GetPlaylistByIdUseCase
RenamePlaylistUseCase / DeletePlaylistUseCase / RemoveVideoFromPlaylistUseCase
useMyRatedVideos / useMySharedVideos
usePlaylist / useRenamePlaylist / useDeletePlaylist / useRemoveVideoFromPlaylist
```

Reuse video summary mapping and `useRateVideo`. Extend it to invalidate/update the rated collection
without coupling the hook to Favorites presentation.

## Playlist mapping/cache

Preserve zero-to-four nullable thumbnail slot order and server video `SortOrder`. Summary and detail use
separate keys. Create/rename/delete affect summaries; add/remove affect summary count/collage,
detail, and video-local membership. Roll back optimistic changes on failure.

## Tasks

- [ ] Add activity/detail types and upgrade `IPlaylistEntity`/mapper.
- [ ] Extend repository, use cases, DI, keys, and hooks.
- [ ] Add rated-list invalidation to the existing rating mutation.
- [ ] Test rating update, collage URL order, detail order, ownership failures, and cache rollback.
