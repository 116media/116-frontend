/**
 * Shape of the ids the API issues. Dummy fixtures use readable ids like `feed-video-8`,
 * which the backend rejects when they reach a `Guid` parameter.
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Whether the value is a UUID the API can bind, as opposed to a dummy fixture id.
 *
 * @param value - The id to test.
 * @returns True when the id is a UUID.
 */
export function isApiId(value: string | null | undefined): boolean {
    return typeof value === "string" && UUID_PATTERN.test(value);
}

/**
 * The id when the API can bind it, otherwise undefined, for query parameters that must be
 * omitted rather than sent with a dummy fixture id.
 *
 * @param value - The id to pass through.
 * @returns The id, or undefined when it is not a UUID.
 */
export function apiIdOrUndefined(value: string | null | undefined): string | undefined {
    return isApiId(value) ? (value as string) : undefined;
}
