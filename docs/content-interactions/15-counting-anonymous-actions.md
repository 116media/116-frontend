# 15 — Counting Anonymous Actions (Shares & Views)

Two interactions are **anonymous-allowed**: share (articles, videos, short videos) and view
(short videos). Anonymity makes *counting* them the hard part — with no `userId` there is no
obvious identity to deduplicate or rate-limit against. This doc records how they are counted
today, why that is insufficient, how a real system (YouTube) does it, and the phased path to
a trustworthy count.

> This is primarily a **backend** concern — the current integer counter cannot deduplicate.
> The frontend's role is narrow but essential: supply a stable identity surrogate and gate
> *when* an event is worth firing. Both are covered below.

---

## Today: naive increment

The shipped backend counts by brute increment:

- **Short-video view** — `RecordShortVideoView(shortVideoId)` takes no user id at all and does
  `viewCount++`.
- **Share** — every call inserts a share row and increments `shareCount`; no deduplication.

Consequence: both counts are **trivially inflatable** — a loop hitting the endpoint runs the
number up. Acceptable for the dummy / MVP phase; wrong for any metric that drives ranking,
social proof, or reporting.

---

## The identity problem

Counting means deciding *who* acted, so repeats can be deduplicated and abuse throttled.
Anonymous means no `userId`, so a **surrogate key** is needed. In increasing quality:

| Key | Quality | Weakness |
|---|---|---|
| Raw increment *(today)* | none | one script = unbounded count |
| IP address | coarse | CGNAT/office NAT collapses many people to one IP (under-counts); VPN hop = new "person" (over-counts) |
| IP + User-Agent hash | better | still shared on large networks |
| **Anonymous device id** (first-party cookie / localStorage UUID) | best for anon | cleared storage = new id; but stable for real users |
| `userId` | best | only available for signed-in users |

The recommended key is a **composite**: `userId` when signed in, else a persistent anonymous
device id, with IP + UA kept as a secondary fraud signal only.

---

## Reference model — how YouTube counts views

YouTube's view count is not a live counter; it is the **output of a fraud pipeline**:

1. **A view is an intentional play, not an impression.** Scrolling past a thumbnail is not a
   view; initiating playback is. (For **Shorts** the bar is lower — a view historically counts
   the moment the Short starts playing on-screen, which is why Shorts counts dwarf
   regular-video counts.)
2. **Engagement threshold.** A "qualified" view needs meaningful playback (the well-known
   ~30-second heuristic), which discards accidental autoplay and instant bounces.
3. **Dedup + rate-limit per identity.** Refreshing 100 times does not add 100 views; repeated
   plays from the same identity within a window are throttled.
4. **Asynchronous verification.** Views are **provisional** until a batch job validates them
   against bot/spam signals — the classic "count freezes near 300" was this verification. The
   displayed number is eventually-consistent and approximate.
5. **Bot filtering.** Datacenter IPs, headless browsers, and impossible watch patterns are
   stripped after the fact.

The mental model: **record raw events liberally; compute the *displayed* count from a
filtered, deduplicated view of those events.** The number shown ≠ the count of rows.

---

## Counting here — phased

The current schema (an `int` counter incremented in place) cannot support any of this — an
integer cannot be deduplicated. The real fix is a **raw-events table** plus a derived count.

### Phase 1 — dedup key + window *(kills casual inflation)*

- **Frontend** — mint a persistent anonymous device id (a UUID in a first-party
  cookie/localStorage) and send it with every view/share event; attach `userId` automatically
  when signed in.
- **Backend** — store `(contentId, dedupKey, ip, ua, timestamp)` as a raw row. Increment the
  displayed count only when there is **no counted event from that `dedupKey` in the last N
  hours** (e.g. 24h). A refresh or a same-day re-watch is one view.

### Phase 2 — engagement threshold *(kills scroll-through inflation)*

- **Frontend** gates the event: for a **Short**, fire `recordView` only after it has been
  on-screen and *playing* for **≥ 2–3 s** (IntersectionObserver + a play timer), not the
  instant it mounts. For a full video, after N seconds of watch. This is the single biggest
  quality lever and it lives on the frontend.

### Phase 3 — asynchronous fraud pass *(when it matters)*

- A background job (the backend already runs **Quartz**) recomputes counts from raw events,
  dropping datacenter IPs and impossible patterns. The displayed count becomes
  eventually-consistent — YouTube's model.

---

## Shares are not views

Do **not** over-engineer shares:

- A share has **no ranking incentive** — nobody games a share count for reach the way views
  are gamed — and sharing the same content twice legitimately *is* two shares.
- So **`shareCount` as a raw event count is defensible**; naive increment is acceptable for
  shares. Only add dedup if product wants a distinct metric such as *"unique sharers"*, keyed
  by the same composite identity.
- The one worthwhile share addition is the **`platform`** already flagged in
  [14 — G1](14-open-questions.md), so shares can be broken down by channel.

Views, by contrast, drive social proof and (eventually) ranking, so they warrant the full
dedup + threshold + fraud treatment above.

---

## Frontend responsibilities

Whatever the backend algorithm, two inputs can only come from the client:

1. **The identity surrogate** — generate and persist an anonymous device id, attach it (and
   `userId` when present) to every view/share event. Illustratively:

   ```ts
   /**
    * Returns a stable per-browser anonymous id, minting and persisting one on first use.
    * Sent with view/share events so the backend can deduplicate anonymous actions.
    */
   function getAnonymousDeviceId(): string {
       const existing = localStorage.getItem("anon-device-id");
       if (existing) return existing;
       const id = crypto.randomUUID();
       localStorage.setItem("anon-device-id", id);
       return id;
   }
   ```

2. **The engagement gate** — decide *when* an event is worth firing (a Short played ≥ N s, a
   video watched ≥ N s) rather than firing on render. This is what separates a real view from
   a scroll-through.

Both are the frontend preparing clean signals; the deduplication and fraud logic stay in the
backend.

---

## Status & scope

- **Phase 1 is implemented in the backend.** Short-video views now write a raw
  `short_video_view_events` row (`dedupKey`, `ip`, `ua`, `isCounted`) and increment the
  displayed count only when the dedup key has no counted view in the last 24 h. The dedup key
  is `user:{id}` → `device:{X-Device-Id}` → `ip:{address}`; signal-less callers always count
  (a shared "unknown" bucket must not suppress unrelated viewers). A Quartz job
  (`ShortVideoViewEventCleanupJob`, daily) prunes uncounted events past 30 days; a future
  fraud pass (Phase 3) hooks in there.
- **The identity surrogate already flows.** The frontend's axios `deviceIdInterceptor` sends
  `X-Device-Id` (a persisted UUID) on every request — no separate `getAnonymousDeviceId()`
  was needed; the backend reads the same header the session layer already uses.
- **Phase 2 (engagement gate) waits for the surface.** The short-video content type is
  **not modeled** in the frontend ([02 — Support Matrix](02-support-matrix.md)), so the
  play-time gate ships with that feature.
- **Shares stay naive by design**, now with `platform` recorded per event (see
  [14 — G1](14-open-questions.md)).
