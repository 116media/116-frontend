# 15 — Shared Articles

## Definition

Show distinct published articles shared while the user was authenticated. Repeated share
events collapse to one article ordered by the latest event.

## Result context

- article summary;
- latest share timestamp;
- total authenticated share-event count for that user/article;
- latest recorded share channel, when present.

## Privacy and history limits

`ArticleShareEntity.UserId` is nullable because sharing is anonymous-capable. The query
must filter exactly `UserId == currentUserId`. Anonymous events are intentionally absent,
even if they occurred in the same browser before login.

## UI

Reuse the article grid and add a compact context label such as “You shared this 3 times ·
Last shared yesterday · WhatsApp”. `interactionCount` is the current user's event count,
not the article's global aggregate. The channel is supplementary and may be absent. Sharing
again invalidates the collection only when authenticated.

## Current blocker

The backend records user ids and channels but exposes no share-history read and has no
user-first share index.
