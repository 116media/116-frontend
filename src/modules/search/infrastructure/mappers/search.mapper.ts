import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import { EContentType } from "@/modules/search/domain/enums/EContentType";
import { ESearchScope, toSearchScope } from "@/modules/search/domain/enums/ESearchScope";
import {
    EnumCoreContentType,
    type PublicSearchResponse,
    type SearchHitDto
} from "@/shared/infrastructure/api/generated/116.api";

/**
 * The domain type each API content type maps to. The two enums carry the same values
 * but are distinct types, so the translation is explicit rather than a cast.
 */
const CONTENT_TYPES: Record<EnumCoreContentType, EContentType> = {
    [EnumCoreContentType.Article]: EContentType.Article,
    [EnumCoreContentType.Video]: EContentType.Video,
    [EnumCoreContentType.Short]: EContentType.Short,
    [EnumCoreContentType.Lyrics]: EContentType.Lyrics,
    [EnumCoreContentType.Custom]: EContentType.Custom
};

/**
 * Reads one scope's count out of the API's flat counts map, defaulting to zero so a
 * scope the response omits still labels its tab.
 *
 * @param counts - The counts map, keyed by lowercase scope name.
 * @param scope - The scope to read.
 * @returns {number} The hit count.
 */
function countFor(counts: Record<string, number>, scope: ESearchScope): number {
    return counts[scope] ?? 0;
}

/**
 * SearchMapper
 *
 * @description
 * Maps the search DTOs to domain entities, deriving the booleans the rows and the
 * empty state read, and normalising the counts so every scope has an entry.
 */
export const SearchMapper = {
    /**
     * Maps one hit DTO to its domain entity.
     *
     * @param dto - One hit from the API.
     * @returns {ISearchHitEntity} The mapped hit.
     */
    hitFromDto(dto: SearchHitDto): ISearchHitEntity {
        const ratingAverage = dto.ratingAverage ?? null;

        return {
            type: CONTENT_TYPES[dto.type] ?? EContentType.Article,
            id: dto.id,
            slug: dto.slug,
            title: dto.title,
            excerpt: dto.excerpt ?? "",
            imageUrl: dto.imageUrl ?? null,
            categoryId: dto.categoryId ?? null,
            categoryName: dto.categoryName ?? null,
            publishedAt: dto.publishedAt ?? null,
            score: dto.score,
            ratingAverage,
            hasRating: ratingAverage !== null && ratingAverage > 0
        };
    },

    /**
     * Maps a list of hit DTOs to domain entities.
     *
     * @param dtos - The hits from the API.
     * @returns {ISearchHitEntity[]} The mapped hits.
     */
    hitListFromDto(dtos: SearchHitDto[]): ISearchHitEntity[] {
        return dtos.map(SearchMapper.hitFromDto);
    },

    /**
     * Maps the search response envelope to its domain entity.
     *
     * @param dto - The response from the API.
     * @returns {ISearchResultsEntity} The mapped page.
     */
    resultsFromDto(dto: PublicSearchResponse): ISearchResultsEntity {
        const { items, pageIndex, pageSize, count } = dto.results;
        const counts = dto.counts ?? {};

        return {
            query: dto.query,
            scope: toSearchScope(dto.scope?.toLowerCase()),
            counts: {
                [ESearchScope.All]: countFor(counts, ESearchScope.All),
                [ESearchScope.Articles]: countFor(counts, ESearchScope.Articles),
                [ESearchScope.Videos]: countFor(counts, ESearchScope.Videos),
                [ESearchScope.Shorts]: countFor(counts, ESearchScope.Shorts)
            },
            items: SearchMapper.hitListFromDto(items ?? []),
            pageIndex: pageIndex ?? 0,
            pageSize: pageSize ?? 0,
            count: count ?? 0,
            hasMore: ((pageIndex ?? 0) + 1) * (pageSize ?? 0) < (count ?? 0),
            isEmpty: countFor(counts, ESearchScope.All) === 0
        };
    }
};
