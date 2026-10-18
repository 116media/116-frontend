# Verification and Acceptance

No test runner is configured in this app, so verification is manual plus measured in
the browser. Where a number is claimed, measure it.

## Checklist

- [x] `yarn lint:types` clean
- [x] `yarn lint:code` clean
- [x] Every state reached and checked — driven in a browser at 390 and 1440, not asserted by a test
- [ ] Request count per typed word measured — **not done**
- [ ] Contrast measured in both themes — **not done**
- [ ] URL behaviour checked including back and reload — **not done**

---

## States

Reach each one deliberately:

| State | How | Expected |
| --- | --- | --- |
| Idle | Open `/search` | Recent searches, then popular tags; no request issued |
| Below floor | Type `f` | Still idle; **zero** requests in the network panel |
| Loading | Type `fally` | Skeleton rows in the result layout |
| Results | Wait for the response | Ranked rows, counts on all three tabs |
| Refreshing | Type `fally i` | Previous results dim, no skeleton flash |
| Empty | Type `zzzzzz` | "Aucun résultat pour « zzzzzz »" plus the hint |
| Error | Block the request in devtools | Alert with a working retry |

---

## Request behaviour

```js
// In the browser console, before typing
let n = 0;
const open = XMLHttpRequest.prototype.open;
performance.clearResourceTimings();
```

Then type `fally ipupa` at a normal speed and count the requests to
`/api/v1/public/search`:

| Expected | Value |
| --- | --- |
| Requests while typing `fally ipupa` | 1–3, not 11 |
| Requests for a 1-character query | 0 |
| Requests when switching to an already-loaded scope | 0 |
| Requests when switching to a new scope | 1 |

The scope rows are the ones worth checking: they prove `searchKeys.results` is keyed
correctly and that the counts came from the first response.

---

## URL behaviour

| Action | Expected |
| --- | --- |
| Type a query | `?q=` appears, one history entry per settled term |
| Switch scope | `?scope=` appears |
| Reload | Same results, same scope, field populated |
| Copy the URL to a new tab | Same results |
| Back after one search | Returns to the previous page, not to a partial query |
| Hand-edit `?scope=nonsense` | Falls back to `all`, page renders |

---

## Geometry and contrast

Measure, do not eyeball. The pattern used elsewhere in this repo:

```js
// Active-panel geometry
document.querySelector('[role="tab"][aria-selected="true"]').getBoundingClientRect().height
// expect >= 44
```

For contrast, screenshot the element, decode the PNG, sample the composited background
and glyph pixels, and compute the ratio. The pairings to check are listed in
[07-i18n-and-a11y.md](07-i18n-and-a11y.md); the `opacity-60` scope count is the one
most likely to fail.

---

## Cross-browser

| Check | Why |
| --- | --- |
| `type="search"` clear affordance | Safari and Chrome render their own; confirm it does not collide with ours |
| `enterKeyHint="search"` | iOS Safari shows the Search key |
| `autoFocus` on iOS | Does not open the keyboard without a user gesture; confirm the page is still usable |

That last one is a known platform behaviour, not a bug to fix. The field is focused,
the keyboard is not forced open.

---

## Acceptance criteria

Mirrors `../../../../docs/search/07-rollout-and-acceptance.md`, scoped to this repo:

1. A reader on any page reaches cross-type results in one interaction.
2. No screen renders two fields that do the same thing.
3. Typing a full word issues at most one request.
4. A one-character query issues none.
5. Query and scope are in the URL; reload and back both behave.
6. Switching to an already-fetched scope issues no request.
7. The result count is announced politely on change.
8. Every target is at least 44px, with the documented clear-button exception.
9. New colour pairings meet AA, measured.
10. `fr` and `en` are key-complete and the build passes.

---

## Known gaps at launch

| Gap | Tracked in |
| --- | --- |
| No suggestions dropdown | `../../../../docs/search/03-api-contract.md`, phase 3 |
| No highlighted snippets | `../../../../docs/search/04-relevance-and-ranking.md` |
| No typo tolerance | Phase 4, trigram fallback |
| Lyrics and artists scopes absent | No public listing endpoints exist |
| No infinite scroll on results | `pageSize` 20 covers the common case; revisit with telemetry |

---

## There is no test runner

The frontend ships no test stack: no vitest, no jest, no testing-library, no Playwright
config in `package.json`. Every acceptance line above that says "checked" was checked by
driving a browser by hand, which is not coverage and does not survive a refactor.

Standing one up is a stack decision rather than part of this feature, so it is called out
here rather than taken unilaterally. Until then the search module has **no automated
frontend tests at all.**
