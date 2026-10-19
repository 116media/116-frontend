/**
 * When the platform opens. The pre-launch countdown reads this; move the date and the
 * page follows, with no other change.
 */
export const LAUNCH_DATE = new Date("2026-12-15T18:00:00+01:00");

/**
 * The column ladder the waiting pages share: four tiles across a desktop, two on a
 * tablet, stacked on a phone.
 */
export const COMING_SOON_GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";
