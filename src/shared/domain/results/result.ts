import type { Failure } from "@/shared/domain/failures/failure";

/**
 * Discriminated union representing either a successful value or a typed failure.
 *
 * @template T - The success value type
 * @template E - The error type (defaults to Failure)
 */
export type Result<T, E = Failure> = Ok<T> | Err<E>;

interface Ok<T> {
    readonly ok: true;
    readonly value: T;
}

interface Err<E> {
    readonly ok: false;
    readonly error: E;
}

/**
 * Creates a successful Result wrapping the given value.
 *
 * @template T - The success value type
 * @param value - The value to wrap
 * @returns A Result in the success state containing the value
 */
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

/**
 * Creates a failed Result wrapping the given error.
 *
 * @template E - The error type (defaults to Failure)
 * @param error - The error to wrap
 * @returns A Result in the error state containing the failure
 */
export const err = <E = Failure>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * Extracts the value from a Result, returning a fallback on failure.
 *
 * @param result - The Result to unwrap
 * @param fallback - The value to return if the Result is an error
 * @returns The success value or the fallback
 */
export const unwrap = <T>(result: Result<T>, fallback: T): T =>
    result.ok ? result.value : fallback;
