# 05 — Alphabet Rail, Search & URL State

The two ways into a directory: you know the name (search), or you're browsing (alphabet).

## Alphabet rail

```
[Tous] [#] [A] [B] [C] [D] [E] … [X] [Y] [Z]
```

- `Tous` / `All` — default, no letter filter, selected on first load.
- `#` — artists whose name starts with a digit or symbol (`50 Cent`, `6LACK`, `¥$`).
- `A–Z` — 26 latin letters.

### Bucketing rules

Bucketing is computed **on the backend** from a normalised initial, never in the browser — the
client only ever holds one page of artists and cannot bucket a set it hasn't loaded.

| Input | Bucket | Note |
|---|:---:|---|
| `Fally Ipupa` | `F` | |
| `élodie` | `E` | accent-folded |
| `Ferré Gola` | `F` | |
| `50 Cent` | `#` | leading digit |
| `¥$` | `#` | leading symbol |
| `  Awilo` | `A` | leading whitespace trimmed first |

Folding must match the sort collation from [04](04-artists-index-page.md), or a name can sort into
one position and bucket into another.

### Rendering

- Horizontally scrollable on mobile, wrapping inline at `md+`. Never a dropdown — the value of the
  rail is that every option is visible at once.
- The selected letter is visually distinct **and** carries `aria-current="true"`.
- **Letters with zero artists are disabled, not hidden.** A rail that changes length as data loads
  is disorienting, and a missing letter reads as a bug. This requires the backend to return
  available buckets — see [16](16-backend-gaps-and-contracts.md).

## Search

Scoped to artists, on the page — not the global header search, which spans lyrics/videos/articles.

- Matches against artist **name** only. Bio search returns confusing results ("why did this artist
  match 'Kinshasa'?") and needs a full-text index we don't have.
- Case- and accent-insensitive, substring match — typing `gola` finds `Ferré Gola`.
- **Debounced 300ms**, minimum **2 characters**. A 1-char query matches most of the directory and
  costs a request for nothing.
- Clearing the input returns to the unfiltered directory.

Backed by `ILIKE` on the server. The admin artist endpoint already does this; the public one must
too ([16](16-backend-gaps-and-contracts.md)).

## Mutual exclusion

`letter` and `q` cannot both be active.

- Typing in search → clears `letter`, rail resets to `Tous`.
- Picking a letter → clears `q`, input empties.

Combining them means "artists starting with F whose name contains 'gola'", which is a query no
user forms, usually returns nothing, and leaves them unsure which control to undo.

## URL state

| Param | Values | Default | Notes |
|---|---|---|---|
| `letter` | `A`–`Z`, `%23` (`#`) | absent | absent = all |
| `q` | string, ≥2 chars | absent | |
| `page` | integer ≥ 1 | `1` | |

Examples:

```
/artistes                  all artists, page 1
/artistes?letter=F         artists starting with F
/artistes?q=gola           name contains "gola"
/artistes?letter=F&page=2  second page of F
```

Rules:

- Changing `letter` or `q` **resets `page` to 1**. Landing on page 3 of a filter you just applied
  is a classic paging bug.
- Filter changes use `router.replace`, not `push` — otherwise every keystroke-debounce becomes a
  history entry and Back takes ten presses to escape.
- `page` changes are appends, so they also `replace` — the accumulated list is the state, and the
  URL records how deep you are.
- Unknown/malformed values are ignored and treated as absent rather than erroring.

## Server vs client

The page is server-rendered from `searchParams` so a shared link renders correct content and is
crawlable. Interaction (typing, letter clicks, load-more) is client-side against the same
paginated query, keyed by the same params — see [20](20-state-management-and-query-keys.md).

## Empty results

Filtered-to-empty is **not** the same as an empty directory. Copy must name the active filter and
offer the escape:

- Letter: *"Aucun artiste ne commence par « Q »."* + `Voir tous les artistes`
- Search: *"Aucun artiste ne correspond à « xyz »."* + `Effacer la recherche`

See [09](09-loading-empty-error.md).
