import type { Result } from "@/shared/domain/results/result";

/**
 * Repository port for geolocation data access.
 *
 * @description
 * Defines the contract for resolving the visitor's country. Implemented in the
 * infrastructure layer; all methods return `Result<T>` so failures are typed
 * `Failure` values rather than thrown exceptions.
 */
export interface IGeoRepositoryPort {
    /**
     * Resolves the visitor's ISO alpha-2 country code from the internal
     * `/api/geo` route (edge geo header, IP lookup fallback). Browser-only.
     *
     * @returns `ok(string)` with the ISO code, `ok(null)` when the country
     * cannot be determined, or `err(Failure)` on transport failure.
     */
    detectCountryIso(): Promise<Result<string | null>>;
}
