import type { IValidationError } from "@/shared/infrastructure/api/type";

/**
 * Base failure type for domain-level error representation.
 *
 * All failures carry at least a title and a human-readable detail message.
 * Concrete subtypes add context specific to their error source.
 */
export interface Failure {
    readonly title: string;
    readonly detail: string;
}

/**
 * Failure originating from an API response (RFC 7807 ProblemDetails).
 *
 * Carries the full context from the backend error response.
 */
export interface ServerFailure extends Failure {
    readonly status: number;
    readonly instance?: string | null;
    readonly traceId?: string | null;
    readonly timestamp?: string | null;
    readonly errors?: IValidationError[];
    readonly retryAfter?: number;
}

/**
 * Fallback failure for network errors or unparseable responses.
 */
export interface UnknownFailure extends Failure {
    readonly status: number;
}

/**
 * Creates a ServerFailure from API error fields.
 */
export const serverFailure = (params: {
    title: string;
    detail: string;
    status: number;
    instance?: string | null;
    traceId?: string | null;
    timestamp?: string | null;
    errors?: IValidationError[];
    retryAfter?: number;
}): ServerFailure => params;

/**
 * Creates an UnknownFailure with French default messages.
 */
export const unknownFailure = (detail = "Une erreur inattendue est survenue."): UnknownFailure => ({
    title: "Erreur inconnue",
    detail,
    status: 0
});
