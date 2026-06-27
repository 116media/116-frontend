"use client";

import { useEffect, useState } from "react";

import type { ICountryObject } from "@/shared/infrastructure/constants/countries";
import { findCountryByIsoCode } from "@/shared/presentation/utils/country";

/**
 * Session-storage key under which the detected ISO country code is cached.
 */
const SESSION_KEY = "detected-country-iso";

/**
 * Process-wide memo of the resolved ISO code, so concurrent hook consumers share one
 * lookup. `undefined` means "not resolved yet"; `null` means "resolved, unknown".
 */
let cachedIso: string | null | undefined;

/**
 * resolveCountryIso
 *
 * @description
 * Resolves the caller's ISO country code once per session: returns the in-memory memo
 * or `sessionStorage` value when present, otherwise fetches `/api/geo` and caches the
 * result. Never throws — resolves to null on any failure.
 *
 * @returns The ISO alpha-2 country code, or null when it cannot be determined.
 */
async function resolveCountryIso(): Promise<string | null> {
    if (cachedIso !== undefined) return cachedIso;

    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) {
        cachedIso = stored;
        return stored;
    }

    try {
        const response = await fetch("/api/geo");
        const data = (await response.json()) as { countryCode: string | null };
        cachedIso = data.countryCode;
        if (data.countryCode) window.sessionStorage.setItem(SESSION_KEY, data.countryCode);
        return data.countryCode;
    } catch {
        cachedIso = null;
        return null;
    }
}

/**
 * useDetectedCountry
 *
 * @description
 * Detects the visitor's country (via `/api/geo`) and maps it to a full country entry,
 * for use as a default in country/phone fields. Resolves once per session and caches
 * the result; returns `{ country: null }` until resolved or when detection fails.
 *
 * @returns The detected country entry, or null.
 */
export function useDetectedCountry(): { country: ICountryObject | null } {
    const [country, setCountry] = useState<ICountryObject | null>(null);

    useEffect(() => {
        let active = true;
        resolveCountryIso().then((iso) => {
            if (active) setCountry(findCountryByIsoCode(iso) ?? null);
        });
        return () => {
            active = false;
        };
    }, []);

    return { country };
}
