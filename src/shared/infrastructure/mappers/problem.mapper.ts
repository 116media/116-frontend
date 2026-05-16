import type { Failure } from "@/shared/domain/failures/failure";
import { serverFailure, unknownFailure } from "@/shared/domain/failures/failure";
import type { IApiProblemDetails } from "@/shared/infrastructure/api/type";

/**
 * Converts caught errors into typed domain failures.
 *
 * Centralizes the exception-to-failure conversion at the infrastructure
 * boundary. Repositories call this in their catch blocks to produce
 * a `Failure` for the `Result` return type.
 */
export const ProblemMapper = {
    /**
     * Converts an unknown caught error into a typed Failure.
     *
     * If the error has a `title` and `detail` (i.e. it was normalized
     * by the Axios error handler into IApiProblemDetails), it becomes
     * a ServerFailure. Otherwise, it becomes an UnknownFailure.
     */
    toFailure(error: unknown): Failure {
        if (isApiProblemDetails(error)) {
            return serverFailure({
                title: error.title ?? "Erreur",
                detail: error.detail ?? "Une erreur est survenue.",
                status: error.status ?? 0,
                instance: error.instance,
                traceId: (error as Record<string, unknown>).traceId as string | undefined,
                timestamp: (error as Record<string, unknown>).timestamp as string | undefined,
                errors: error.errors,
                retryAfter: error.retryAfter
            });
        }

        return unknownFailure();
    }
};

/**
 * Type guard checking if the error has the shape of IApiProblemDetails.
 */
const isApiProblemDetails = (error: unknown): error is IApiProblemDetails => {
    return typeof error === "object" && error !== null && "title" in error && "detail" in error;
};
