"use client";

import { useQuery } from "@tanstack/react-query";

import type { ICountryObject } from "@/shared/infrastructure/constants/countries";
import container from "@/shared/infrastructure/service.locator";
import { findCountryByIsoCode } from "@/shared/presentation/utils/country";

/**
 * Stable query key for the once-per-session country detection.
 */
const DETECTED_COUNTRY_KEY = ["geo", "detected-country"] as const;

/**
 * useDetectedCountry
 *
 * @description
 * Detects the visitor's country and maps it to a full country entry, for use as
 * a default in country/phone fields. Delegates the detection to
 * `detectCountryUseCase` (which resolves the ISO code via the internal
 * `/api/geo` route, keeping any third-party lookup server-side) and maps that
 * ISO code to a country entry. Resolved once per session and cached
 * (`staleTime`/`gcTime` infinite, so concurrent consumers share one lookup);
 * returns `{ country: null }` until resolved or when detection fails.
 *
 * @returns The detected country entry, or null.
 */
export function useDetectedCountry(): { country: ICountryObject | null } {
    const { data } = useQuery<ICountryObject | null>({
        queryKey: DETECTED_COUNTRY_KEY,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: Number.POSITIVE_INFINITY,
        queryFn: async () => {
            const result = await container.cradle.detectCountryUseCase.execute();
            const iso = result.ok ? result.value : null;
            return findCountryByIsoCode(iso) ?? null;
        }
    });

    return { country: data ?? null };
}
