"use client";

import { useQuery } from "@tanstack/react-query";

import type { ICountryObject } from "@/shared/infrastructure/constants/countries";
import container from "@/shared/infrastructure/service.locator";
import { findCountryByIsoCode } from "@/shared/presentation/utils/country/country.utils";

/**
 * Stable query key for the once-per-session country detection.
 */
const DETECTED_COUNTRY_KEY = ["geo", "detected-country"] as const;

/**
 * useDetectedCountry
 *
 * @description
 * Detects the visitor's country via `detectCountryUseCase` and maps it to a full
 * country entry, as a default for country/phone fields. Cached for the session;
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
