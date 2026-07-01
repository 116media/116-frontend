/**
 * IActionResponse
 *
 * @description
 * Shared base for any action endpoint that returns a success indicator. Module
 * response entities extend this rather than re-declaring `isSuccess`.
 *
 * @interface IActionResponse
 * @property {boolean} isSuccess - Whether the operation completed successfully.
 */
export interface IActionResponse {
    isSuccess: boolean;
}
