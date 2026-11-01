/**
 * How far the launch still is, already split into the units the row shows.
 *
 * @interface ILaunchRemaining
 * @property {number} days - Whole days left.
 * @property {number} hours - Hours past the last whole day.
 * @property {number} minutes - Minutes past the last whole hour.
 * @property {number} seconds - Seconds past the last whole minute.
 */
export interface ILaunchRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

/**
 * Splits the time left before the launch into days, hours, minutes and seconds, and
 * floors at zero so a date already past reads as a launch rather than a negative run.
 *
 * @param target - When the platform opens.
 * @returns {ILaunchRemaining} What is left.
 */
export function remainingUntil(target: Date): ILaunchRemaining {
    const left = Math.max(0, target.getTime() - Date.now());
    const seconds = Math.floor(left / 1000);

    return {
        days: Math.floor(seconds / 86_400),
        hours: Math.floor((seconds % 86_400) / 3_600),
        minutes: Math.floor((seconds % 3_600) / 60),
        seconds: seconds % 60
    };
}

/**
 * Pads a unit to the two digits the row is sized for, so the numbers do not jump as
 * they tick down.
 *
 * @param value - The unit's value.
 * @returns {string} The padded value.
 */
export function padUnit(value: number): string {
    return String(value).padStart(2, "0");
}
