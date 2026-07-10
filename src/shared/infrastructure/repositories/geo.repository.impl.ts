import type { IGeoRepositoryPort } from "@/shared/application/repositories/geo.repository.port";
import { unknownFailure } from "@/shared/domain/failures/failure";
import { err, ok, type Result } from "@/shared/domain/results/result";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * Geolocation repository implementation backed by the internal `/api/geo`
 * route handler.
 *
 * @description
 * Implements IGeoRepositoryPort by calling the same-origin `/api/geo` endpoint,
 * which resolves the country server-side (keeping any third-party IP lookup off
 * the browser). Browser-only — outside the browser the relative URL cannot
 * resolve, so it returns a failure without touching the network. All outcomes
 * are `Result<T>`; errors are converted to typed Failure values.
 */
export class GeoRepositoryImpl implements IGeoRepositoryPort {
    /**
     * @inheritdoc
     */
    async detectCountryIso(): Promise<Result<string | null>> {
        if (typeof window === "undefined") return err(unknownFailure());

        try {
            const response = await fetch("/api/geo");
            if (!response.ok) return err(unknownFailure());
            const data = (await response.json()) as { countryCode: string | null };
            return ok(data.countryCode);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
