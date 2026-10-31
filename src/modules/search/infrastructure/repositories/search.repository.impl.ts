import type {
    ISearchContentInput,
    ISearchRepositoryPort
} from "@/modules/search/application/repositories/search.repository.port";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";
import { SearchMapper } from "@/modules/search/infrastructure/mappers/search.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * The scope spellings the API accepts. The domain enum stays lowercase for the URL,
 * so the two meet here and nowhere else.
 */
const API_SCOPES: Record<ESearchScope, "All" | "Articles" | "Videos" | "Shorts"> = {
    [ESearchScope.All]: "All",
    [ESearchScope.Articles]: "Articles",
    [ESearchScope.Videos]: "Videos",
    [ESearchScope.Shorts]: "Shorts"
};

/**
 * SearchRepositoryImpl
 *
 * @description
 * Wraps the generated search call, mapping success through `SearchMapper` and
 * failure through `ProblemMapper.toFailure`.
 */
export class SearchRepositoryImpl implements ISearchRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async search(input: ISearchContentInput): Promise<Result<ISearchResultsEntity>> {
        try {
            const response = await this.api.publicSearch({
                q: input.query,
                scope: API_SCOPES[input.scope],
                pageIndex: input.pageIndex,
                pageSize: input.pageSize
            });
            return ok(SearchMapper.resultsFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
