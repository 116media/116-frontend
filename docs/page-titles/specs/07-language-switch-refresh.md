# Spec 07 — Instant title update on language switch

Follow-up to specs 01–06. Once every route has a language-dependent `generateMetadata`, a gap
became visible: switching language via the dropdown didn't update the tab `<title>` until the
next navigation or reload. This spec closes that gap.

---

## Why the title didn't update

`generateMetadata` runs **server-side only**, once, when a route is requested — it reads the
language cookie at that moment and never runs again on its own. `useLanguageDropdown`'s
`updateLanguage` is a **client-only** operation: it writes `localStorage`, sets the cookie (for
*future* requests), calls `i18n.changeLanguage()` (so every `useTranslation()` consumer
re-renders), and dispatches a `storage` event. None of that touches the already-rendered
`<title>` element, and none of it asks the server to re-render.

This is the same class of problem `I18nProvider` already solves for `<html lang>` — a
server-rendered attribute with no client reactivity by default — but `<title>` can't be patched
the same way (see the rejected alternative below).

## Chosen fix — `router.refresh()`

**`src/shared/presentation/hooks/useLanguageDropdown.ts`** (relevant excerpt)

```ts
"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { LANGUAGE_LIST, USER_LANG } from "@/shared/presentation/constants/languages";
import { i18n } from "@/shared/presentation/i18n/config";
import {
    getClientLanguage,
    setClientLanguage,
    setLanguageCookie
} from "@/shared/presentation/utils/language/language.client.utils";

/**
 * useLanguageDropdown
 *
 * @description
 * Current-language resolution and update logic for the language dropdown. Uses
 * useSyncExternalStore to avoid hydration mismatches; updates persist the choice,
 * switch i18next and dayjs, dispatch a StorageEvent for subscribers, and refresh the
 * current route so server-rendered, language-dependent output (page `<title>`, any
 * server-fetched content) picks up the new language immediately.
 *
 * @returns currentCode, currentLanguage, updateLanguage
 */
export function useLanguageDropdown() {
    const router = useRouter();
    // ...currentCode / currentLanguage unchanged

    const updateLanguage = useCallback(
        (code: string) => {
            if (code === currentCode) return;

            setClientLanguage(code);
            setLanguageCookie(code);

            void i18n.changeLanguage(code);
            dayjs.locale(code);

            window.dispatchEvent(new StorageEvent("storage", { key: USER_LANG, newValue: code }));
            router.refresh();
        },
        [currentCode, router]
    );

    // ...return unchanged
}
```

`setLanguageCookie` (via `cookies-next/client`'s `setCookie`) writes `document.cookie`
synchronously, so by the time `router.refresh()` fires its request, the server reads the
already-updated cookie. `router.refresh()` re-runs the current route's Server Components — every
`generateMetadata` this feature added, plus any server-fetched data — while preserving client
component state (no full page reload, no lost scroll position, no `I18nProvider` remount).

## Why not a manual `document.title` patch

The alternative considered was extending `I18nProvider`'s existing `useEffect` (the one that
already syncs `document.documentElement.lang`) to also set `document.title` directly, using a
route → title-key lookup on the client. Rejected:

- **Duplicated source of truth.** Every route's title key would need to live in two places — the
  server `generateMetadata` this feature just centralized, and a second client-side map — which
  will drift as routes change.
- **Doesn't cover the four detail routes.** `articles/videos/shorts/shows [slug]` titles come from
  the entity's own content (`article.metaTitle ?? article.title`), not a translation key. A static
  client map has no access to that without threading the fetched entity into client state
  specifically for this purpose.
- **Fights Next's own metadata management.** Next owns the `<title>` DOM node through its
  Metadata API; manually overwriting it client-side isn't a documented, supported pattern.

`router.refresh()` reuses the real `generateMetadata` for every route uniformly, detail routes
included, with no new state to keep in sync.

## Cost accepted

`router.refresh()` re-runs server data fetching for the current route on every language toggle
(e.g. the root layout's `getProfileUseCase.execute()`, or an article-detail `fetchArticle` call) —
a network round-trip and brief re-render. Accepted because a language switch is a deliberate,
infrequent action, not a hot path.

## Task checklist

- [x] Add `useRouter()` to `useLanguageDropdown` and call `router.refresh()` at the end of
  `updateLanguage`, after the cookie is set.
- [x] `tsc --noEmit` clean.
- [x] `biome check` clean.
- [ ] Toggle the language dropdown on `/`, `/articles`, `/videos`, an article detail page, and a
  favorites/settings page (signed in); confirm the tab `<title>` updates immediately, without a
  manual reload, and without losing scroll position or client UI state (e.g. an open modal).
