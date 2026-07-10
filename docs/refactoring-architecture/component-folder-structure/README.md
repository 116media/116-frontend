# Component & Folder Structure

The definitive structure for the frontend **presentation layer** — how components are
foldered, split, named, and organized so the codebase stays consistent, discoverable, and
reusable.

This folder is both the **design rationale** (why) and the **contract** (rules Claude and
the team follow). It was produced from a deep, file-by-file audit of every presentation
component across all modules (see [../](../) for the wider
inconsistency audit this extends).

## Read in this order

| # | Doc | What it is |
|---|-----|-----------|
| 01 | [rules.md](01-rules.md) | **The contract.** The enforceable rules. Start here. |
| 02 | [container-presentational.md](02-container-presentational.md) | The smart/dumb model + "island containers" |
| 03 | [buckets-and-anatomy.md](03-buckets-and-anatomy.md) | Kind buckets, the 2–3-file rule, compound exception, state files, the local→shared ladder |
| 04 | [naming-conventions.md](04-naming-conventions.md) | Folder / file / export / type naming |
| 05 | [decision-guide.md](05-decision-guide.md) | Flowcharts: "where does this file go?" |
| 06 | [target-videos.md](06-target-videos.md) | Full target tree — videos |
| 07 | [target-articles.md](07-target-articles.md) | Full target tree — articles |
| 08 | [target-auth-settings-session.md](08-target-auth-settings-session.md) | Full target trees — auth, settings, session |
| 09 | [target-shared.md](09-target-shared.md) | Shared additions + promotion targets |
| 10 | [cleanups-and-debt.md](10-cleanups-and-debt.md) | Dead code, duplication, dummy-data TODOs surfaced during the audit |
| — | [specs/](specs/) | Checkbox implementation specs (the migration) |

## Where the rules live so they're followed

- **`apps/frontend/AGENTS.md`** carries a concise, always-loaded rule block that points here.
  Claude Code reads `AGENTS.md`/`CLAUDE.md` at the start of every session, so any new code
  starts compliant.
- **[01-rules.md](01-rules.md)** is the full, authoritative version referenced from there.

## One-sentence summary

> Every component is its own flat folder of **2–3 files** (`Component.tsx` + `index.ts`,
> plus `types.ts` when shared and `.Loading`/`.Error`/`.Empty`/`.NotFound` when applicable);
> a component folder **never contains another component folder**; **compound components**
> (card families, the player, mega-menus, toolbars) are the sole exception and keep their
> intrinsic parts as dotted files in one folder; and components are grouped into
> **kind buckets** (`containers/ pages/ sections/ cards/ …`) so anything is findable by what
> it is.

## Status

Design + rules: **complete**. Migration: tracked in [specs/](specs/) (not yet executed).
