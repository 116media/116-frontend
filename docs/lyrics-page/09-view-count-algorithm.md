# Lyrics Page — Read-Time View-Counting Algorithm

The MVP's view counter (spec 11) counts a view on page load, deduped by a 24h window per
viewer key (`user:{id}` / `device:{id}` / `ip:{addr}`). That's a page-load counter, not a *read*
counter — it doesn't know whether the visitor actually read the lyrics or bounced immediately. This
doc replaces that trigger with a read-time-based one, closer to how a "view" is meant to be
interpreted for a text-heavy page (mirrors how video platforms require a minimum watch duration
before counting a view, applied to reading instead of watching).

## Inputs

Two client-observed signals, sent once per page visit alongside the existing `recordView` call:

- **`dwellMs`** — total time the lyrics body was in the foreground (viewport visible **and** the
  tab/window focused — pause accumulation on `visibilitychange`/`blur`, resume on
  `visibilitychange`/`focus`; a backgrounded tab must not accumulate dwell time).
- **`scrollDepthRatio`** — the maximum fraction (0–1) of the lyrics text block that has scrolled
  into the viewport, tracked via `IntersectionObserver` thresholds on the lyrics container (not
  `scroll` event math) — the same primitive already used for infinite-scroll sentinels elsewhere
  in this codebase.

Both are collected client-side in the `useRecordLyricsView` hook and sent once, on the earlier of
"the visitor navigates away" (via `visibilitychange`/`beforeunload`, `navigator.sendBeacon`) or "a
generous cap" (e.g. 5 minutes) is reached — never as a stream of intermediate updates.

## Server-side expected reading time

The server does not trust the client's dwell time as sufficient on its own — a visitor could sit
on the page without reading, or a bot could fabricate the field. Instead, the server computes an
**expected reading time** from the song's own stored `LyricsText` and treats the client's dwell
time as *corroborating* evidence, not the sole signal:

```text
wordCount = countWords(lyrics.LyricsText)
wordsPerMinute = 130   // slower than prose reading (~200-250 wpm): lyrics are read
                       // with pauses, repeated hooks/choruses, and often sung-along mentally
expectedReadMs = (wordCount / wordsPerMinute) * 60_000
```

130 wpm is deliberately below typical silent-reading speed because lyrics pages are consumed
differently from articles — short repeated sections (choruses), and readers frequently pause to
match the text to the song rather than reading straight through once.

## Counting rule

A view is counted (subject to the existing 24h dedup window, unchanged from spec 11) when **all**
of the following hold:

```text
dwellMs        >= min(expectedReadMs * 0.6, 60_000)   // read at least 60% of expected time,
                                                        // capped at 60s so a long song doesn't
                                                        // require an unreasonable minimum
scrollDepthRatio >= 0.7                                // scrolled through most of the text,
                                                        // not just glanced at the top
dwellMs        >= 1_500                                // hard floor — rejects instantaneous/
                                                        // scripted requests outright, regardless
                                                        // of how the two ratios above compute
```

A very short song (a few lines, `expectedReadMs` near zero) still requires the `1_500ms` floor,
so an instant bounce never counts even where the ratio math would otherwise allow it.

## Where this fits in the existing pipeline

`RecordLyricsViewCommand` (spec 11) gains `DwellMs`/`ScrollDepthRatio` fields. The handler:

1. Loads `lyrics.LyricsText`, computes `expectedReadMs` server-side (never trusts a client-sent
   expected value).
2. Applies the counting rule above.
3. If it passes, proceeds exactly as spec 11 already does — dedup-window check, then the existing
   atomic `UPDATE ... SET ViewCount = ViewCount + 1`.
4. If it fails, the request still returns success (this isn't an error state — the visitor just
   didn't read enough for the view to count) but the counter isn't touched, and the two raw
   fields are still persisted on the `LyricsViewEvent` row (08's schema addition) for later
   analysis/tuning of the constants above, without affecting the public-facing counter.

## Anti-gaming notes

- The `1_500ms` floor and the server-recomputed `expectedReadMs` together mean a scripted view-farm
  has to actually hold a connection open and report plausible scroll coverage per request — raises
  the cost of gaming the counter without requiring CAPTCHAs or other friction on real readers.
- `scrollDepthRatio` from `IntersectionObserver` is harder to spoof cheaply than a single scroll
  position, since it requires simulating real viewport intersection over time, not just a numeric
  field.
- The three constants (`130` wpm, `0.6` time ratio, `0.7` scroll ratio, `1_500ms` floor) are the
  first tunable knobs if analysis of the persisted `DwellMs`/`ScrollDepthRatio` data later shows
  real readers being under- or over-counted — they're deliberately kept as named constants in one
  place (`ViewCountingConstants`, extending the existing class from spec 11), not scattered magic
  numbers.
