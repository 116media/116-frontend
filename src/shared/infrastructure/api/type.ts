import type { ProblemDetails } from "@/shared/infrastructure/api/generated/116.api";

/**
 * Validation error details from API.
 *
 * @interface IValidationError
 *
 * @property {string} propertyName - Name of the property that failed validation
 * @property {string} errorMessage - Human-readable error message
 * @property {unknown} attemptedValue - The value that was attempted
 * @property {number} severity - Error severity level
 * @property {string} errorCode - Machine-readable error code
 */
export interface IValidationError {
    propertyName: string;
    errorMessage: string;
    attemptedValue: unknown;
    severity: number;
    errorCode: string;
}

/**
 * Extended API problem details interface.
 *
 * @interface IApiProblemDetails
 * @extends {ProblemDetails}
 *
 * @description
 * Extends the standard ProblemDetails from the generated API client with
 * field-level validation errors and rate-limit metadata.
 *
 * @property {IValidationError[]} errors - Field-level validation errors (400 responses)
 * @property {number} retryAfter - Seconds until the client may retry (429 responses)
 */
export interface IApiProblemDetails extends ProblemDetails {
    errors?: IValidationError[];
    retryAfter?: number;
}
