/**
 * Where the progress bar leaves its opening band, as a percentage read.
 */
const WARNING_FROM = 40;

/**
 * Where it enters its closing band.
 */
const SUCCESS_FROM = 75;

/**
 * readingProgressColor
 *
 * @description
 * Maps a reading-progress percentage to a semantic token background class:
 * `bg-destructive` near the start, `bg-warning` through the middle, and `bg-success`
 * approaching the end.
 *
 * @param progress - The reading progress, 0..100.
 * @returns {string} The token background class for the current band.
 */
export function readingProgressColor(progress: number): string {
    if (progress < WARNING_FROM) return "bg-destructive";
    if (progress < SUCCESS_FROM) return "bg-warning";
    return "bg-success";
}
