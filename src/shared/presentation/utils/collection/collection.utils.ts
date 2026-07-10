/**
 * dedupeById
 *
 * @description
 * Flattens accumulated infinite-query pages into a single list, dropping repeated ids so
 * an item never renders twice across page seams. Order-preserving: the first occurrence
 * of each id wins.
 *
 * @param pages - The query's page arrays, or undefined before the first load
 * @returns The de-duplicated, order-preserving flat list
 */
export function dedupeById<T extends { id: string }>(pages: T[][] | undefined): T[] {
    const seen = new Set<string>();
    const flat: T[] = [];
    for (const item of pages?.flat() ?? []) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        flat.push(item);
    }
    return flat;
}
