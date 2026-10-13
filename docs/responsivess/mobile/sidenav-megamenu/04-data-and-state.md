# Data and state

## No new data

The panel adds **zero** network calls. It renders the payload `AppShell` already
prefetches on the server for the desktop menus:

```tsx
// src/shared/presentation/layouts/AppShell/AppShell.tsx — unchanged
const cradle = await createServerCradle();
const result = await cradle.prefetchNavigationUseCase.execute();

const { articles, videos } = unwrap(result, {
    videos: { categories: [], promotedVideos: [], popularTags: [] },
    articles: { categories: [], promotedArticles: [], popularTags: [] }
});
```

`AppShell` passes that to `Header`, and `Header` forwards it to both `DesktopNav`
and `MobileMegaMenu`. One fetch, two surfaces, populated on first paint.

```text
AppShell (RSC)
  └─ prefetchNavigationUseCase.execute()
       └─ Header
            ├─ DesktopNav      ( >= md )  -> ArticlesMegaMenu / VideosMegaMenu
            └─ MobileMegaMenu  ( < md  )  -> ArticlesMobileMenu / VideosMobileMenu
```

Because the data is already resolved server-side, the panel has no loading state and
needs no skeleton. An empty `categories` array renders the "All" row alone; an empty
`promotedArticles` hides the featured block; an empty `popularTags` hides the tag
section. Those guards are in the component snippets in 03.

## State

All state is local to `MobileMegaMenu`. No store, no context, no URL state.

| State | Owner | Type | Notes |
| --- | --- | --- | --- |
| `isOpen` | `MobileMegaMenu` | `useState<boolean>` | Radix `Dialog` controlled pair |
| active tab | `Tabs` | uncontrolled | `defaultValue="news"`; resets on unmount |
| drag offset | `MobileMegaMenu` | `useState<number>` | Only while a touch drag is live, see 05 |

The tab resets to News every time the panel opens, because Radix unmounts
`Dialog.Content` when closed. That is the wanted behaviour: a menu that reopens on
the section you last browsed is disorienting when the trigger is a generic hamburger.

## Closing

Every exit routes through the same `close()`:

| Trigger | Mechanism |
| --- | --- |
| Close button | `Dialog.Close` |
| Overlay tap | Radix default |
| `Escape` | Radix default |
| Any link inside | `onNavigate` prop threaded to `MegaMenuRow`, `Tag`, featured link |
| Swipe left past threshold | `onPointerUp` handler, see 05 |

The `onNavigate` thread matters: Next's client router does not unmount the dialog on
navigation, so without it the panel would stay open over the destination page. This
is the bug `MobileNav` avoids today by wrapping each link in `Dialog.Close`; we use a
callback instead because `Tag` and the cards are not direct children.

## Route changes

Belt and braces for a navigation the callbacks miss (browser back, a link added
later that forgets the prop):

```tsx
const pathname = usePathname();

// Close on any route change, so a navigation the link handlers miss cannot
// leave the panel open over the destination.
useEffect(() => {
    setIsOpen(false);
}, [pathname]);
```

## Scroll locking

Radix `Dialog` already sets `pointer-events: none` on the body and locks scroll while
open, so no extra handling is needed. The scrolling region inside carries
`overscroll-contain` so a flick at the end of the list does not chain to the page
behind the overlay.
