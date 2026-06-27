import { COUNTRY_LIST, type ICountryObject } from "@/shared/infrastructure/constants/countries";

/**
 * findCountryByName
 *
 * @description
 * Looks up a country entry by its exact display name — used to derive the ISO and dial
 * codes from the name a country select emits.
 *
 * @param name - The country display name, or null/undefined.
 * @returns The matching {@link ICountryObject}, or undefined when not found.
 */
export function findCountryByName(name?: string | null): ICountryObject | undefined {
    if (!name) return undefined;
    return COUNTRY_LIST.find((country) => country.name === name);
}

/**
 * findCountryByIsoCode
 *
 * @description
 * Looks up a country entry by its ISO 3166-1 alpha-2 code (case-insensitive) — used to
 * resolve an IP-detected country code into a full country (name, dial code, flag).
 *
 * @param iso - The ISO alpha-2 country code, or null/undefined.
 * @returns The matching {@link ICountryObject}, or undefined when not found.
 */
export function findCountryByIsoCode(iso?: string | null): ICountryObject | undefined {
    if (!iso) return undefined;
    const code = iso.trim().toUpperCase();
    return COUNTRY_LIST.find((country) => country.isoCode === code);
}
