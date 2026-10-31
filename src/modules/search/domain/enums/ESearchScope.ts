/**
 * ESearchScope
 *
 * @description
 * The content types a search can be narrowed to. Values are lowercase because they
 * ride in the `?scope=` query string; the repository maps them to the API's casing.
 */
export enum ESearchScope {
    All = "all",
    Articles = "articles",
    Videos = "videos",
    Shorts = "shorts"
}

/**
 * The scopes in tab order, with `All` first.
 */
export const SEARCH_SCOPES: readonly ESearchScope[] = [
    ESearchScope.All,
    ESearchScope.Articles,
    ESearchScope.Videos,
    ESearchScope.Shorts
] as const;

/**
 * Narrows an arbitrary string to a scope, falling back to `All`.
 *
 * @param value - A value read from the URL or storage.
 * @returns {ESearchScope} The matching scope, or `All`.
 */
export function toSearchScope(value: string | null | undefined): ESearchScope {
    const match = SEARCH_SCOPES.find((scope) => scope === value);
    return match ?? ESearchScope.All;
}
