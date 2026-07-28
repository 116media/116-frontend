# Spec 05 — Verification

Full sweep across every route and both locales, after specs 01–04 and 06 land.

---

## Manual checklist

For each route below: load it with the language cookie set to `fr`, note the `<title>` (view
source or devtools), switch language to `en` via the language dropdown, reload, note the
`<title>` again.

| Route | Expect (fr) | Expect (en) |
| --- | --- | --- |
| `/` | `116 - Musique & Culture Hip-Hop` | `116 - Hip-Hop Music & Culture` |
| `/articles` | `116 - Articles` | `116 - Articles` |
| `/articles/[slug]` | `116 - <article title>` | `116 - <article title>` |
| `/videos` | `116 - Explorez les collections vidéo` | `116 - Explore Video Collections` |
| `/videos/[slug]` | `116 - <video title>` | `116 - <video title>` |
| `/shows` | `116 - Toutes les émissions` | `116 - All Shows` |
| `/shows/[slug]` | `116 - <show title>` | `116 - <show title>` |
| `/shorts/[slug]` | `116 - <short title>` | `116 - <short title>` |
| `/favorites/articles` | `116 - Articles favoris` | `116 - Favorite articles` |
| `/favorites/videos` | `116 - Vidéos favorites` | `116 - Favorite videos` |
| `/favorites/shorts` | `116 - Shorts favoris` | `116 - Favorite shorts` |
| `/settings/profile` | `116 - Profil` | `116 - Profile` |
| `/settings/security` | `116 - Sécurité` | `116 - Security` |
| `/settings/account` | `116 - Compte` | `116 - Account` |
| `/articles/does-not-exist` (404) | `116 - Article introuvable` | `116 - Article not found` |
| `/videos/does-not-exist` (404) | `116 - Vidéo introuvable` | `116 - Video not found` |
| `/shows/does-not-exist` (404) | `116 - Émission introuvable` | `116 - Show not found` |
| `/shorts/does-not-exist` | `116 - Réel introuvable` | `116 - Short not found` |

Also confirm:

- [ ] None of the four missing-content rows above render the root default
  (`116 - Musique & Culture Hip-Hop` / `116 - Hip-Hop Music & Culture`) — per the locked principle
  in [../02-architecture.md](../02-architecture.md), only `/` should ever show it.
- [ ] Every non-home title above starts with `116 -` — none end with `| 116` (the old suffix
  shape, superseded per decision 2 in [../03-open-questions.md](../03-open-questions.md)).

- [ ] The three `favorites/*` routes still emit `<meta name="robots" content="noindex, nofollow">`;
  the three `settings/*` routes emit no `robots` field, exactly as before this feature (decision 3).
- [ ] `/favorites` and `/settings` (the index redirects) still redirect correctly and were not
  given metadata of their own.
- [ ] No route shows a raw i18next key (e.g. `articles.pageTitle`) as its title — this would mean
  the key is missing from one locale's catalog.

## Automated checks

- [ ] `yarn lint:types` (`tsc --noEmit`) clean.
- [ ] `yarn lint:code` (biome) clean.
- [ ] `yarn build` succeeds — confirms `generateMetadata` doesn't throw at build/prerender time
  for any static-eligible segment.

## Regression watch

- [ ] `metadataBase` still resolves correctly (Open Graph / canonical URLs on detail pages
  unaffected) — spot-check one `og:image` tag on an article detail page.
- [ ] `<html lang>` still matches the active language (unrelated to this change, but resolved by
  the same `getServerLanguage()` call — confirm it wasn't accidentally duplicated or diverged from
  `generateMetadata`'s own resolution).
