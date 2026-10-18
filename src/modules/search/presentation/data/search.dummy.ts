import type { ISearchHitEntity } from "@/modules/search/domain/entities/ISearchHitEntity";
import type { ISearchResultsEntity } from "@/modules/search/domain/entities/ISearchResultsEntity";
import { EContentType } from "@/modules/search/domain/enums/EContentType";
import { ESearchScope } from "@/modules/search/domain/enums/ESearchScope";

/**
 * Whether the dummy pool is mixed into live results. Development scaffolding: the
 * catalogue is too thin to exercise the result rows, the scope counts or the paging,
 * so the pool stands in until it is not. Flip to `false` to see the database alone.
 */
export const USE_DUMMY_SEARCH_RESULTS = true;

/**
 * Fixed epoch the dummy dates count back from (deterministic, SSR-safe).
 */
const DUMMY_BASE_MS = Date.parse("2026-07-01T09:00:00Z");

/**
 * One day in milliseconds.
 */
const DAY_MS = 86_400_000;

/**
 * Category names rotated across the dummy hits, so the row's category chip varies.
 */
const CATEGORIES = [
    "Discovery",
    "116 Interview",
    "Le Focus",
    "Rumba",
    "Hip-Hop",
    "Afrobeat",
    "Live Sessions",
    "Culture"
];

/**
 * Title fragments the dummy hits are built from. Every entry carries words a reader
 * would plausibly search, so a typed term matches something.
 */
const SUBJECTS = [
    "Fally Ipupa",
    "Ferre Gola",
    "Koffi Olomide",
    "Gaz Mawete",
    "Innoss'B",
    "Mbilia Bel",
    "Papa Wemba",
    "Werrason",
    "Awilo Longomba",
    "Tshala Muana",
    "Héritier Watanabe",
    "Fabregas",
    "Robinio Mundibu"
];

/**
 * The subject list is a prime length, so rotating it against the three content types
 * walks every subject through every type. An even split would lock each subject to one
 * type and leave two of the scope tabs empty for any term.
 */

/**
 * What each subject is doing, rotated so titles do not read as one template.
 */
const PREDICATES = [
    "annonce un concert au Stade des Martyrs",
    "dévoile un nouveau clip tourné à Kinshasa",
    "revient sur ses débuts dans la rumba congolaise",
    "signe un featuring surprise avec la scène afrobeat",
    "raconte les coulisses de son dernier album",
    "enflamme la scène lors d'une session live",
    "répond aux critiques sur son virage musical",
    "présente les musiciens de son orchestre"
];

/**
 * The excerpt bodies, rotated so the two-line clamp is exercised.
 */
const EXCERPTS = [
    "Une plongée dans la préparation du projet, des premières maquettes aux dernières retouches en studio, avec les musiciens qui l'ont accompagné.",
    "Entre Kinshasa et Paris, le parcours d'un artiste qui a su imposer sa signature sans renier ses racines ni son public de la première heure.",
    "Le récit d'une soirée qui a réuni plusieurs générations autour d'un même répertoire, devant une salle comble et un orchestre au complet.",
    "Retour sur les choix de production, les sessions nocturnes et les arrangements qui ont donné au disque sa couleur si particulière."
];

/**
 * The scope each dummy hit belongs to, rotated so every tab has something to show.
 */
const TYPES: readonly { type: EContentType; scope: ESearchScope }[] = [
    { type: EContentType.Article, scope: ESearchScope.Articles },
    { type: EContentType.Video, scope: ESearchScope.Videos },
    { type: EContentType.Short, scope: ESearchScope.Shorts }
];

/**
 * How many hits the pool holds. Large enough that a common term overflows one page.
 */
const POOL_SIZE = 96;

/**
 * Builds a URL-safe slug from a title.
 *
 * @param title - The dummy title.
 * @param index - The hit's position, keeping slugs unique.
 * @returns {string} The slug.
 */
function toSlug(title: string, index: number): string {
    const base = title
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `${base}-${index}`;
}

/**
 * The dummy pool, built once. Deterministic, so the server and the client agree.
 */
const POOL: ISearchHitEntity[] = Array.from({ length: POOL_SIZE }, (_, index) => {
    const { type } = TYPES[index % TYPES.length];
    const subject = SUBJECTS[index % SUBJECTS.length];
    const predicate = PREDICATES[index % PREDICATES.length];
    const isShort = type === EContentType.Short;
    const title = isShort ? `${subject} — extrait ${index + 1}` : `${subject} ${predicate}`;
    const ratingAverage = type === EContentType.Video ? 3.6 + (index % 14) / 10 : null;

    return {
        type,
        title,
        id: `dummy-${index}`,
        slug: toSlug(title, index),
        score: 1 - index / POOL_SIZE,
        excerpt: isShort ? "" : EXCERPTS[index % EXCERPTS.length],
        imageUrl: null,
        categoryId: isShort ? null : `dummy-category-${index % CATEGORIES.length}`,
        categoryName: isShort ? null : CATEGORIES[index % CATEGORIES.length],
        publishedAt: new Date(DUMMY_BASE_MS - index * DAY_MS).toISOString(),
        ratingAverage,
        hasRating: ratingAverage !== null
    };
});

/**
 * Normalises text for matching: lowercase and accent-stripped, so "melodie" finds
 * "mélodie" the way the backend's unaccent does.
 *
 * @param value - The text to fold.
 * @returns {string} The folded text.
 */
function fold(value: string): string {
    return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * The dummy hits a term matches, in pool order.
 *
 * @param query - The reader's term.
 * @param scope - The scope to narrow to.
 * @returns {ISearchHitEntity[]} The matching dummy hits.
 */
function matches(query: string, scope: ESearchScope): ISearchHitEntity[] {
    const needle = fold(query);

    return POOL.filter((hit) => {
        const inScope =
            scope === ESearchScope.All ||
            TYPES.find((entry) => entry.type === hit.type)?.scope === scope;

        return inScope && (fold(hit.title).includes(needle) || fold(hit.excerpt).includes(needle));
    });
}

/**
 * Counts the dummy matches per scope, so the tabs add up to what the list shows.
 *
 * @param query - The reader's term.
 * @returns {Record<ESearchScope, number>} The per-scope counts.
 */
function dummyCounts(query: string): Record<ESearchScope, number> {
    const all = matches(query, ESearchScope.All);

    const countFor = (scope: ESearchScope) =>
        all.filter((hit) => TYPES.find((entry) => entry.type === hit.type)?.scope === scope).length;

    return {
        [ESearchScope.All]: all.length,
        [ESearchScope.Articles]: countFor(ESearchScope.Articles),
        [ESearchScope.Videos]: countFor(ESearchScope.Videos),
        [ESearchScope.Shorts]: countFor(ESearchScope.Shorts)
    };
}

/**
 * Mixes the dummy pool into a live page: real hits keep their ranking and lead, the
 * dummy matches follow, and every count is the sum of both.
 *
 * @param live - The page the API returned.
 * @param query - The term that produced it.
 * @param scope - The active scope.
 * @param pageSize - Items per page, so the merged page is sliced like a real one.
 * @returns {ISearchResultsEntity} The merged page.
 */
export function withDummySearchResults(
    live: ISearchResultsEntity,
    query: string,
    scope: ESearchScope,
    pageSize: number
): ISearchResultsEntity {
    if (!USE_DUMMY_SEARCH_RESULTS) return live;

    const extra = dummyCounts(query);
    const counts = {
        [ESearchScope.All]: live.counts[ESearchScope.All] + extra[ESearchScope.All],
        [ESearchScope.Articles]: live.counts[ESearchScope.Articles] + extra[ESearchScope.Articles],
        [ESearchScope.Videos]: live.counts[ESearchScope.Videos] + extra[ESearchScope.Videos],
        [ESearchScope.Shorts]: live.counts[ESearchScope.Shorts] + extra[ESearchScope.Shorts]
    };

    // The live page already carries its own slice, so the dummies fill what is left of it.
    const merged = [...live.items, ...matches(query, scope)].slice(
        live.pageIndex * pageSize,
        live.pageIndex * pageSize + pageSize
    );

    const count = counts[scope] ?? counts[ESearchScope.All];

    return {
        ...live,
        counts,
        count,
        items: merged,
        hasMore: (live.pageIndex + 1) * pageSize < count,
        isEmpty: counts[ESearchScope.All] === 0
    };
}
