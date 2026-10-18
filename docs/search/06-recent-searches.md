# Recent Searches

Per `../../../../docs/search/06-analytics-and-privacy.md`, history is browser-local and
never reaches the server.

## Checklist

- [x] `useRecentSearches` hook
- [x] Reads and writes guarded against a throwing `localStorage`
- [x] Capped at 8, most recent first, de-duplicated
- [x] Only remembers queries that returned something
- [x] Clear control on the idle state

---

## The hook

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "116:recent-searches";
const MAX_ENTRIES = 8;

/**
 * Reads the stored history, tolerating a throwing or absent `localStorage` and a
 * payload that is no longer an array of strings.
 *
 * @returns The stored queries, or an empty list.
 */
function readStored(): string[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter((entry): entry is string => typeof entry === "string");
    } catch {
        return [];
    }
}

/**
 * useRecentSearches
 *
 * @description
 * The reader's own recent queries, held in `localStorage` and never sent anywhere.
 * Hydrates after mount, because the server has no access to browser storage and
 * reading it during render would mismatch.
 *
 * @returns The history, a `remember` writer and a `clear` reset.
 */
export function useRecentSearches() {
    const [recent, setRecent] = useState<string[]>([]);

    useEffect(() => {
        setRecent(readStored());
    }, []);

    const persist = useCallback((next: string[]) => {
        setRecent(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // Private windows and blocked site data throw on write. The history is a
            // convenience, so losing it is not worth surfacing.
        }
    }, []);

    const remember = useCallback(
        (query: string) => {
            const trimmed = query.trim();
            if (trimmed.length === 0) return;

            setRecent((current) => {
                const deduped = current.filter(
                    (entry) => entry.toLowerCase() !== trimmed.toLowerCase()
                );
                const next = [trimmed, ...deduped].slice(0, MAX_ENTRIES);

                try {
                    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // See persist.
                }

                return next;
            });
        },
        []
    );

    const clear = useCallback(() => persist([]), [persist]);

    return { recent, remember, clear };
}
```

### Why hydration happens in an effect

Reading `localStorage` during render would produce different markup on the server (no
storage, empty list) and the client (populated), which is a hydration mismatch. The
list therefore renders empty on the first paint and fills immediately after mount. The
idle state's other content, the popular tags, covers that frame.

### Why `remember` is called on success only

The container calls it when `data.counts.all > 0`. A reader typing their way toward a
term produces a dozen partial queries; remembering all of them would fill the history
with prefixes. See the effect in [03-route-and-containers.md](03-route-and-containers.md).

### Case-insensitive de-duplication

`Fally` typed after `fally` replaces it rather than adding a second entry, keeping the
most recent casing.

---

## The idle state

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ClockIcon } from "@/shared/presentation/components/ui/Icon";

import type { SearchRecentProps } from "./types";

/**
 * SearchRecent
 *
 * @description
 * The idle-state history: the reader's own recent queries, each re-runnable, with a
 * clear control. Renders nothing when there is no history.
 */
export function SearchRecent({ recent, onSelect, onClear }: SearchRecentProps) {
    const { t } = useTranslation();

    if (recent.length === 0) return null;

    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    {t("search.recent.title")}
                </h2>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClear}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {t("search.recent.clear")}
                </Button>
            </div>

            <ul className="flex flex-col">
                {recent.map((entry) => (
                    <li key={entry}>
                        <button
                            type="button"
                            onClick={() => onSelect(entry)}
                            className="flex min-h-11 w-full items-center gap-3 rounded-md px-2 text-left text-foreground text-sm transition-colors hover:bg-accent/50"
                        >
                            <ClockIcon
                                aria-hidden="true"
                                className="size-4 shrink-0 text-muted-foreground"
                            />
                            {entry}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
```

Below the history, the idle state renders the popular tags already prefetched for the
mega menus, as browse entry points. That reuses `prefetchNavigationUseCase` output and
needs no additional request.
