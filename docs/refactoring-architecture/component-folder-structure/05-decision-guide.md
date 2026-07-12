# 05 — Decision Guide

Fast flowcharts for placing any presentation file. Rule IDs in parentheses point to
[01-rules.md](01-rules.md).

## A) Where does a new component go?

```
Does it own the surface's primary server read (useQuery/useInfiniteQuery)?
├─ YES, and it's the route/section orchestrator ──────────► containers/<Surface>Container/   (R2)
├─ YES, but it's an independently-loading island ─────────► its kind bucket, mark "island"   (R3)
└─ NO (props in, JSX out)
      │
      What kind is it?
      ├─ page assembler ........................► pages/<Surface>/                 (R9)
      ├─ page region / homepage section ........► sections/<Name>/                 (R9)
      ├─ card ..................................► cards/<Name>/                    (R9)
      ├─ carousel ..............................► carousels/<Name>/                (R9)
      ├─ player / media ........................► media/<Name>/                    (R9)
      ├─ modal / dialog ........................► modals/<Name>/                   (R9)
      ├─ menu / mega-menu / toolbar / navbar ...► navigation/<Name>/              (R9)
      ├─ form ..................................► forms/<Name>/                    (R9)
      ├─ display/input field ...................► fields/<Name>/                   (R9)
      ├─ list container ........................► lists/<Name>/                    (R9)
      └─ social-auth widget ....................► social/<Name>/                   (R9)
```

## B) Own folder, dotted file, or inline?

```
Is it a compound component (variants, or a widget with intrinsic sub-parts)?
├─ YES ───► ONE folder; parts are dotted files; namespace assembled in index.ts   (R8)
└─ NO
     │
     Is it exported / reused by another component?
     ├─ YES ──► its own component folder (R4)
     └─ NO (private, single caller) ──► inline unexported function in the parent .tsx   (R7a)
```

## C) Does this belong in the component folder at all?

```
It's a state view (Loading/Error/Empty/NotFound/EndOfFeed)?
   └─ dotted file in the component's own folder — never a states/ folder   (R5, R7)

It's a props/type?
   ├─ used by ≥2 files in this folder? ──► types.ts (R12)
   └─ single file? ──► inline `export interface XxxProps` above the component (R12)
   (domain entity? ──► domain/entities/, NEVER here)

It's a constant / helper?
   ├─ shared across a COMPOUND's parts? ──► colocated constants.ts / utils.ts (R13)
   ├─ reused beyond this folder? ──► module constants/ or utils/ (R13/R14)
   └─ single use? ──► inline
```

## D) Should it move to `shared/`?

```
Is it imported by a SECOND module (not just app/ pages of its own module)?
├─ YES ──► promote to shared/presentation/components/<kind>/   (R10)
└─ NO  ──► keep it in its module bucket (do NOT pre-share)     (R10)
```

## E) "Compound" vs "page with sections" (the tricky one)

```
Are the parts variants of ONE published thing, or intrinsic pieces only it uses,
none meaningful standalone?
├─ YES ──► compound → one folder (R8)          e.g. VideoCard.{Vertical,Horizontal}
└─ NO — each part is an independent component with its own concern
        (its own island query, or substantial, or reusable) ──► separate folders (R4)
                                               e.g. VideoDetail → Header / Tabs / Scoreboard
```

## Worked examples

| Thing | Verdict | Path |
|---|---|---|
| `VideoDetail` page shell that calls `useVideoDetail` | route container | `containers/VideoDetailContainer/` |
| `VideoDetail` assembler (props in) | page assembler | `components/pages/VideoDetail/` |
| `VideoDetailScoreboard` | page section (own concern) | `components/sections/VideoDetailScoreboard/` |
| `ScoreboardColumn` (private, only Scoreboard) | inline | inside `VideoDetailScoreboard.tsx` |
| `VideoCard.Horizontal` | compound variant | `components/cards/VideoCard/VideoCard.Horizontal.tsx` |
| `VideoPlayer` + Plyr + Poster | compound widget, shared library | `shared/…/common/VideoPlayer/` (R10a) |
| `VideoDetailSimilar` (infinite query) | island container | `components/sections/VideoDetailSimilar/` |
| `SocialShareGroup` (used by articles + videos) | shared | `shared/presentation/components/common/SocialShareGroup/` |
| `SettingsCard` (settings-only today, generic) | module bucket now | `components/cards/SettingsCard/` (promote when a 2nd module imports) |
