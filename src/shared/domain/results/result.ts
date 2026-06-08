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
 */
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

/**
 * Creates a failed Result wrapping the given error.
 */
export const err = <E = Failure>(error: E): Result<never, E> => ({ ok: false, error });
