/**
 * Minimum query length before a search request is issued. A shorter term matches most
 * of the corpus for no information, and the API's validator rejects it anyway.
 */
export const MIN_SEARCH_LENGTH = 2;

/**
 * Idle time in milliseconds before a typed filter reaches the query layer.
 */
export const SEARCH_DEBOUNCE_MS = 300;
