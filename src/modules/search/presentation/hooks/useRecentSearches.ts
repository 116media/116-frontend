"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Where the reader's history lives. Browser-only: it never reaches the server.
 */
const STORAGE_KEY = "116:recent-searches";

/**
 * How many terms are kept, most recent first.
 */
const MAX_ENTRIES = 8;

/**
 * Reads the stored history, tolerating a throwing or absent `localStorage` and a
 * payload that is no longer a list of strings.
 *
 * @returns {string[]} The stored terms, or an empty list.
 */
function readStored(): string[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter((entry): entry is string => typeof entry === "string")
            .slice(0, MAX_ENTRIES);
    } catch {
        return [];
    }
}

/**
 * Writes the history, ignoring a storage that refuses (private window, quota).
 *
 * @param entries - The terms to persist.
 */
function writeStored(entries: string[]): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
        // A reader whose storage refuses still gets a working search.
    }
}

/**
 * useRecentSearches
 *
 * @description
 * The reader's own search history, capped and de-duplicated, kept in the browser and
 * never sent anywhere. Reads on mount rather than during render, so the server and the
 * first client paint agree.
 *
 * @returns The stored terms with a recorder and a clear control.
 */
export function useRecentSearches() {
    const [recent, setRecent] = useState<string[]>([]);

    useEffect(() => {
        setRecent(readStored());
    }, []);

    const remember = useCallback((term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;

        setRecent((current) => {
            const deduped = current.filter(
                (entry) => entry.toLowerCase() !== trimmed.toLowerCase()
            );
            const next = [trimmed, ...deduped].slice(0, MAX_ENTRIES);
            writeStored(next);
            return next;
        });
    }, []);

    const clear = useCallback(() => {
        setRecent([]);
        writeStored([]);
    }, []);

    return { recent, remember, clear };
}
