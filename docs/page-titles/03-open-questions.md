# Page Titles — Decisions

Resolved. Recorded here for reference; specs 02–06 already reflect these.

## 1. `general.metaTitleTemplate` — removed

**Decision: remove.** `{{page}} | 116"` was authored in both locales but is shaped for **manual**
string composition (`t("general.metaTitleTemplate", { page: ... })`), not for Next's built-in
`title.template`. It is deleted from both `general.ts` locale files (spec 02) — the brand-name
literal now lives directly in the root layout's `generateMetadata`.

## 2. Title format — `116 - <Page>`, not `<Page> | 116`

**Decision: every route's title starts with `116 -`, never ends with `| 116`.** The root
layout's `title.template` is `"116 - %s"`, not `"%s | 116"`. This supersedes the original
`"%s | 116"` template that the detail routes (`articles/videos/shorts/shows [slug]`) already rely
on today — their rendered title changes shape too, from `<Content Title> | 116` to
`116 - <Content Title>`, even though those routes' own code doesn't change (they still return a
bare `title: string`; only the inherited template changes).

Every "expect" value across specs 02–06 and the verification checklist reads `116 - <Page>`
accordingly. The homepage's own `title.default` (`116 - Musique & Culture Hip-Hop` /
`116 - Hip-Hop Music & Culture`) already matched this shape natively — it required no change.

## 3. Settings `robots` — left untouched, title still added

**Decision: do not add `robots` to the three `settings/*` routes.** Unlike favorites (which
already ship `robots: { index: false, follow: false }` today, unchanged by this feature), settings
gets **only** a translated `title` in spec 04 — no `robots` field is added or removed on any
private route as part of this feature. Indexing policy for settings stays exactly as it is today
(no `robots` field at all); the pre-existing gap identified in the original question 2 is
explicitly left as a separate, unrelated concern, not folded into this change.

## 4. `/favorites` and `/settings` index redirects — no change needed

Both `page.tsx` files at `/favorites` and `/settings` call `redirect()` unconditionally and render
nothing — no `generateMetadata` is needed there since the response never carries a body/title for
that URL; the browser lands on the redirect target's own title. Confirmed non-issue, no spec
covers it.
