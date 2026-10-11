# Spec 07 — i18n strings

Two new pieces: the `lyrics` module namespace (composed of a `lyrics.ts` list-surface file and a
`lyrics-detail.ts` detail-surface file, mirroring the `articles`/`article-detail` split), and a
small shared `artistes` namespace for the coming-soon placeholder (no module exists to own it).
`fr` is authored first (default/fallback locale), `en` mirrors it key-for-key.

**Note on the language filter**: `lyrics.languageFilter` holds only two UI strings (`all`,
`search`) — the ~180 language *names* themselves are **not** i18n keys. They come from
`CONTENT_LANGUAGE_LIST`'s own `name`/`nativeName` fields (spec 04), displayed the same way
regardless of the site's active UI language, exactly how the dashboard's `getLanguageName` already
works. An earlier draft of this spec had `fr`/`ln`/`en` translated sub-keys under
`languageFilter` — that assumed a fixed 3-language set, which was wrong (see
[../05-open-questions.md](../05-open-questions.md), question 6).

---

## Module namespace: `lyrics`

**`src/modules/lyrics/presentation/i18n/locales/fr/lyrics.ts`**

```ts
/**
 * lyrics (fr)
 *
 * @description
 * French strings for the lyrics listing surface — the page title, search input, and
 * grid states — referenced as `t("lyrics.<key>")`. Must hold the exact same keys as the
 * English mirror.
 */
export const lyrics = {
    pageTitle: "Paroles",
    searchPlaceholder: "Rechercher un titre ou un artiste…",
    clearSearch: "Effacer la recherche",
    languageFilter: {
        all: "Toutes les langues",
        search: "Rechercher une langue…"
    },
    grid: {
        empty: {
            title: "Aucune parole pour le moment",
            body: "Revenez bientôt pour de nouvelles paroles."
        },
        noResults: {
            title: "Aucune parole ne correspond à votre recherche",
            body: "Essayez un autre titre ou artiste."
        },
        error: {
            title: "Impossible de charger les paroles",
            retry: "Réessayer"
        },
        end: "Vous êtes à jour"
    }
} as const;
```

**`src/modules/lyrics/presentation/i18n/locales/en/lyrics.ts`**

```ts
/**
 * lyrics (en)
 *
 * @description
 * English mirror of the shared lyrics listing namespace. Must contain the exact same
 * keys as fr.
 */
export const lyrics = {
    pageTitle: "Lyrics",
    searchPlaceholder: "Search a song or artist…",
    clearSearch: "Clear search",
    languageFilter: {
        all: "All languages",
        search: "Search a language…"
    },
    grid: {
        empty: {
            title: "No lyrics yet",
            body: "Check back soon for new lyrics."
        },
        noResults: {
            title: "No lyrics match your search",
            body: "Try a different song or artist."
        },
        error: {
            title: "Couldn't load lyrics",
            retry: "Try again"
        },
        end: "You're all caught up"
    }
} as const;
```

**`src/modules/lyrics/presentation/i18n/locales/fr/lyrics-detail.ts`**

```ts
/**
 * lyricsDetail (fr)
 *
 * @description
 * French strings for the standalone lyrics detail page — the not-found state and, if
 * question 4 is answered "add the cross-link", the "watch the video" action — referenced
 * as `t("lyrics.detail.<key>")`. Must hold the exact same keys as the English mirror.
 */
export const lyricsDetail = {
    detail: {
        by: "par",
        watchVideo: "Regarder la vidéo",
        credits: {
            album: "Album",
            releaseYear: "Année de sortie",
            label: "Label",
            songwriter: "Paroles",
            producer: "Composition"
        },
        engagement: {
            views_one: "{{count}} vue",
            views_other: "{{count}} vues",
            like: "Aimer",
            unlike: "Ne plus aimer",
            share: "Partager"
        },
        similar: {
            title: "Paroles similaires"
        },
        notFound: {
            title: "Paroles introuvables",
            subtitle: "Ces paroles ont peut-être été supprimées ou le lien est erroné."
        }
    }
} as const;
```

**`src/modules/lyrics/presentation/i18n/locales/en/lyrics-detail.ts`**

```ts
/**
 * lyricsDetail (en)
 *
 * @description
 * English mirror of the lyrics detail namespace. Must contain the exact same keys as fr.
 */
export const lyricsDetail = {
    detail: {
        by: "by",
        watchVideo: "Watch the video",
        credits: {
            album: "Album",
            releaseYear: "Release year",
            label: "Label",
            songwriter: "Lyrics by",
            producer: "Composed by"
        },
        engagement: {
            views_one: "{{count}} view",
            views_other: "{{count}} views",
            like: "Like",
            unlike: "Unlike",
            share: "Share"
        },
        similar: {
            title: "Similar lyrics"
        },
        notFound: {
            title: "Lyrics not found",
            subtitle: "This lyrics page may have been removed or the link is wrong."
        }
    }
} as const;
```

## Module barrels

**`src/modules/lyrics/presentation/i18n/locales/en/index.ts`** (mirrors `articles`' barrel shape)

```ts
import { lyrics } from "@/modules/lyrics/presentation/i18n/locales/en/lyrics";
import { lyricsDetail } from "@/modules/lyrics/presentation/i18n/locales/en/lyrics-detail";

/**
 * en
 *
 * @description
 * English translation catalog for the lyrics module. Composes the module's namespaces;
 * the composition root nests the result under the `lyrics` key, so keys resolve as
 * `t("lyrics.pageTitle")` and `t("lyrics.detail.notFound.title")`.
 */
export const en = {
    ...lyrics,
    ...lyricsDetail
} as const;
```

**`src/modules/lyrics/presentation/i18n/index.ts`** (mirrors `articles/presentation/i18n/index.ts`)

```ts
import { en } from "@/modules/lyrics/presentation/i18n/locales/en";
import { fr } from "@/modules/lyrics/presentation/i18n/locales/fr";

/**
 * lyricsMessages
 *
 * @description
 * The lyrics module's composed translation bundle, one entry per locale. Consumed by
 * the composition root (`resources.ts`) alongside every other module's messages.
 */
export const lyricsMessages = { en, fr };
```

## Composition root

**`src/shared/presentation/i18n/resources.ts`** (relevant excerpt — add `lyrics` alongside the
other module imports/spreads)

```ts
import { lyricsMessages } from "@/modules/lyrics/presentation/i18n";
// ...
export const en = {
    ...sharedEn,
    articles: articlesMessages.en,
    videos: videosMessages.en,
    shorts: shortsMessages.en,
    lyrics: lyricsMessages.en,
    auth: authMessages.en,
    settings: settingsMessages.en
} as const;

export const fr = {
    ...sharedFr,
    articles: articlesMessages.fr,
    videos: videosMessages.fr,
    shorts: shortsMessages.fr,
    lyrics: lyricsMessages.fr,
    auth: authMessages.fr,
    settings: settingsMessages.fr
} as const;
```

## Shared namespace: `artistes`

No module exists to own this — two keys, added directly to the shared catalog, the same way
`general` holds cross-cutting strings with no single module owner.

**`src/shared/presentation/i18n/locales/fr/artistes.ts`**

```ts
/**
 * artistes (fr)
 *
 * @description
 * French strings for the artistes placeholder page, referenced as `t("artistes.<key>")`.
 * Must hold the exact same keys as the English mirror.
 */
export const artistes = {
    pageTitle: "Artistes",
    comingSoon: {
        title: "Bientôt disponible",
        subtitle: "Les pages artistes arrivent bientôt. Revenez plus tard !"
    }
} as const;
```

**`src/shared/presentation/i18n/locales/en/artistes.ts`**

```ts
/**
 * artistes (en)
 *
 * @description
 * English mirror of the shared artistes namespace. Must contain the exact same keys as fr.
 */
export const artistes = {
    pageTitle: "Artists",
    comingSoon: {
        title: "Coming soon",
        subtitle: "Artist pages are on the way. Check back soon!"
    }
} as const;
```

Add `artistes` to both `src/shared/presentation/i18n/locales/{en,fr}/index.ts` barrels, alongside
`general`, `navigation`, `form`, `validator`, `apiErrors`, `favorites`.

## Task checklist

- [ ] Add `lyrics.ts` + `lyrics-detail.ts` in both locales; add the module's `index.ts` barrels.
- [ ] Add `lyricsMessages` to `resources.ts`'s `en`/`fr` composition.
- [ ] Add `artistes.ts` in both shared locales; add to both shared `index.ts` barrels.
- [ ] `tsc --noEmit` clean (the `react-i18next` module augmentation will fail to compile if `en`
  and `fr` don't hold identical keys — this is the type-safety net documented in
  `../../../../docs/i18n/frontend/11-type-safety.md`).
- [ ] `biome check` clean.
