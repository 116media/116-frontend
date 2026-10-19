/**
 * alignToPlayer
 *
 * @description
 * Puts the tab row back at the line it pins to, so the incoming tab starts under the
 * player rather than wherever the reader had scrolled to, which a shorter tab would
 * otherwise leave at the footer. A row that has not reached the line yet is left alone.
 *
 * @param bar - The sticky tab row.
 */
export function alignToPlayer(bar: HTMLDivElement | null): void {
    if (bar === null) return;

    const line = Number.parseFloat(getComputedStyle(bar).top);
    if (!Number.isFinite(line)) return;

    const { top } = bar.getBoundingClientRect();
    if (top > line + 1) return;

    window.scrollTo({ top: Math.max(top + window.scrollY - line, 0), behavior: "auto" });
}
