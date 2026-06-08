import type { Result } from "@/shared/domain/results/result";

/**
 * Generic use case interface for operations that do not return a Result
 * (e.g. initialisation, fire-and-forget operations).
 *
 * @template TRequest - The input type for the use case
 * @template TResponse - The output type for the use case
 */
export interface IUseCase<TRequest = void, TResponse = void> {
    execute(request: TRequest): Promise<TResponse>;
}

/**
 * Generic use case interface for operations that return a Result.
 *
 * Use cases that call API-backed repositories should implement this
 * interface so errors are represented as typed Failure values rather
 * than thrown exceptions.
 *
 * @template TRequest - The input type for the use case
 * @template TResponse - The success value type inside the Result
 */
export interface IResultUseCase<TRequest = void, TResponse = void> {
    execute(request: TRequest): Promise<Result<TResponse>>;
}
