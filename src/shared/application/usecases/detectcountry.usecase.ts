import type { IGeoRepositoryPort } from "@/shared/application/repositories/geo.repository.port";
import type { IResultUseCase } from "@/shared/application/usecases/IUseCase";
import type { Result } from "@/shared/domain/results/result";

/**
 * @interface IDetectCountryUseCase
 * @extends {IResultUseCase<void, string | null>}
 */
interface IDetectCountryUseCase extends IResultUseCase<void, string | null> {}

/**
 * Use case for detecting the visitor's country.
 *
 * @class DetectCountryUseCase
 * @implements {IDetectCountryUseCase}
 *
 * @description
 * Resolves the visitor's ISO alpha-2 country code via the geo repository, which
 * proxies the internal `/api/geo` route so any third-party IP lookup stays
 * server-side. Returns the repository's `Result<string | null>` unchanged.
 */
export class DetectCountryUseCase implements IDetectCountryUseCase {
    private readonly geoRepository: IGeoRepositoryPort;

    /**
     * @param {IGeoRepositoryPort} geoRepository - Repository for geolocation operations (injected)
     */
    constructor({ geoRepository }: { geoRepository: IGeoRepositoryPort }) {
        this.geoRepository = geoRepository;
    }

    /**
     * Executes the detect-country use case.
     *
     * @returns {Promise<Result<string | null>>} `ok(iso)` or `ok(null)` on success, `err(Failure)` on failure
     */
    async execute(): Promise<Result<string | null>> {
        return this.geoRepository.detectCountryIso();
    }
}
