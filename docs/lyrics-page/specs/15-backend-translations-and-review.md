# Spec 15 — Backend: AI Translations & Community Review

Schema: [../08-db-schema.md](../08-db-schema.md) (`LyricsTranslations`,
`LyricsTranslationRevisions`, `LyricsTranslationVotes`). Design:
[../06-musixmatch-scale-expansion.md](../06-musixmatch-scale-expansion.md) §2b.

## Entities

```csharp
public sealed class LyricsTranslationEntity : Aggregate<Guid>
{
    public Guid LyricsId { get; private set; }
    public string Language { get; private set; }
    public string Text { get; private set; }
    public TranslationSource Source { get; private set; } // Ai | Community
    public TranslationStatus Status { get; private set; } // Published | Locked

    public static LyricsTranslationEntity CreateAi(Guid lyricsId, string language, string text) { ... }
    public void ApplyAcceptedRevision(string newText) => (Text, Source) = (newText, TranslationSource.Community);
    public void Lock() => Status = TranslationStatus.Locked;
}

public sealed class LyricsTranslationRevisionEntity : Aggregate<Guid>
{
    public Guid TranslationId { get; private set; }
    public string ProposedText { get; private set; }
    public string? EditSummary { get; private set; }
    public Guid ProposedByUserId { get; private set; }
    public RevisionStatus Status { get; private set; } // Pending | Accepted | Rejected
    public Guid? DecidedByUserId { get; private set; }

    public static LyricsTranslationRevisionEntity Propose(Guid translationId, string text, string? summary, Guid userId) { ... }
    public void Accept(Guid? decidedByUserId) => (Status, DecidedByUserId) = (RevisionStatus.Accepted, decidedByUserId);
    public void Reject(Guid decidedByUserId) => (Status, DecidedByUserId) = (RevisionStatus.Rejected, decidedByUserId);
}
```

`LyricsTranslationVoteEntity` is a plain record (`RevisionId`, `UserId`, `Vote`, `Comment`) — no
behavior beyond construction; the `UNIQUE(RevisionId, UserId)` constraint (08) is the actual guard.

## AI translation generation

`RequestLyricsTranslationCommand(LyricsId, Language)`:

1. If a `LyricsTranslationEntity` already exists for `(LyricsId, Language)`, return it directly —
   idempotent, no duplicate generation.
2. Otherwise, call the configured translation provider (an `ITranslationService` port — an LLM API
   call, kept behind an interface so the provider is swappable and mockable in tests, same
   dependency-inversion shape as `IFileRepository`/`IUserLookupService` elsewhere in this module)
   with the song's `LyricsText` and target language.
3. Persist the result via `LyricsTranslationEntity.CreateAi(...)`, `Source = Ai`, `Status =
   Published` — visible immediately, no review gate before first display (06b: AI output is shown
   right away, labeled "Machine translated").

This is a synchronous request-response call in the simplest version (the endpoint waits for the
translation and returns it) — a background-job/polling variant is a valid alternative if provider
latency turns out too high for a request cycle, but isn't required to start.

## Review workflow

```text
ProposeTranslationRevisionCommand(TranslationId, ProposedText, EditSummary)
  -> creates LyricsTranslationRevisionEntity, Status = Pending

VoteOnTranslationRevisionCommand(RevisionId, Vote, Comment?)
  -> creates LyricsTranslationVoteEntity
  -> recomputes tally; if net approvals >= TranslationConstants.AutoAcceptThreshold (e.g. 3),
     calls revision.Accept(decidedByUserId: null) and translation.ApplyAcceptedRevision(text)

DecideTranslationRevisionCommand(RevisionId, Accept|Reject)  [Admin/Moderator only]
  -> bypasses the vote tally entirely, decides immediately
```

Accepting a revision is the two-step, individually-safe-to-retry sequence described in
[../08-db-schema.md](../08-db-schema.md)'s ACID section: mark the revision `Accepted` first, then
update the translation's current `Text`/`Source` — if the second step is interrupted, a
`GET /api/v1/admin/translations/revisions?status=accepted-unapplied` reconciliation query (or a
scheduled job) finishes it; nothing is lost or double-applied because `ApplyAcceptedRevision` is
idempotent (setting `Text` to the same value twice is a no-op).

## Endpoints

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/api/v1/public/lyrics/{id}/translations` | Anonymous — list available languages + published text |
| POST | `/api/v1/public/lyrics/{id}/translations` | Authenticated — `RequestLyricsTranslationCommand` |
| POST | `/api/v1/translations/{id}/revisions` | Authenticated — propose |
| POST | `/api/v1/translations/revisions/{id}/votes` | Authenticated — vote |
| PUT | `/api/v1/admin/translations/revisions/{id}` | Admin/Moderator — direct accept/reject |
| GET | `/api/v1/translations/{id}/revisions` | Anonymous — full history, mirrors a Wikipedia article's revision history view |

All authenticated (non-admin) routes sit under the new `ContentContribution` rate-limit tier
(07 §1's anti-abuse note), stricter than `ContentBrowsing`.

## Task checklist

- [x] `LyricsTranslationEntity`, `LyricsTranslationRevisionEntity`, `LyricsTranslationVoteEntity` +
  EF configurations + migration
- [ ] `ITranslationService` port + a concrete provider implementation — **the port ships, the
  concrete provider does not.** `PlaceholderTranslationService` (backend
  `Infrastructure/Services/PlaceholderTranslationService.cs`) is registered in its place and
  echoes the source text unchanged. Every consumer (request/propose/vote/accept) is fully built
  and tested against it. Remaining work isn't code — no LLM/translation vendor has been chosen
  for this platform yet (API key, provider client, cost). Swap the DI registration in
  `ContentModule.cs` once one is.
- [x] `RequestLyricsTranslationCommand`/`Handler` (idempotent on existing translations)
- [x] `ProposeTranslationRevisionCommand`, `VoteOnTranslationRevisionCommand` (threshold
  auto-accept), `DecideTranslationRevisionCommand` (admin override)
- [x] `TranslationConstants.AutoAcceptThreshold` (named constant, not a magic number)
- [x] All five endpoints + `ContentContribution` rate-limit policy
- [x] Reconciliation query/job for accepted-but-unapplied revisions
- [x] Integration tests: idempotent AI generation, revision propose → vote → threshold-accept →
  text updates, duplicate vote rejected (unique constraint), admin override bypasses tally
