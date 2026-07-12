"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import type { Failure } from "@/shared/domain/failures/failure";
import type { Result } from "@/shared/domain/results/result";

/**
 * useToggle
 *
 * @description
 * Shared optimistic toggle used by like and bookmark: flips `on` and `count`
 * immediately, runs the on/off use case, and rolls both back on failure.
 * `initialOn` seeds the state from the entity's per-user flag when the DTO has one.
 *
 * @param initialCount - The baseline count from the entity.
 * @param onExecute - Runs the "on" (true) or "off" (false) mutation; resolves the success flag.
 * @param initialOn - The entity's per-user flag baseline. Defaults to false.
 * @returns `{ on, count, toggle }`.
 */
export function useToggle(
    initialCount: number,
    onExecute: (next: boolean) => Promise<boolean>,
    initialOn = false
) {
    const [on, setOn] = useState(initialOn);
    const [count, setCount] = useState(initialCount);

    const mutation = useMutation<boolean, Failure, boolean>({
        mutationFn: (next) => onExecute(next)
    });

    const toggle = () => {
        const next = !on;
        setOn(next);
        setCount((c) => c + (next ? 1 : -1));
        mutation.mutate(next, {
            onError: () => {
                setOn(!next);
                setCount((c) => c + (next ? -1 : 1));
            }
        });
    };

    return { on, count, toggle };
}

/**
 * runInteraction
 *
 * @description
 * Runs a `Result<boolean>` use case and throws its `Failure` on error (so the mutation's
 * `onError` fires), returning the success flag otherwise.
 *
 * @param execute - The use-case call producing a `Result<boolean>`.
 * @returns The success flag from the result.
 */
export async function runInteraction(execute: () => Promise<Result<boolean>>) {
    const result = await execute();
    if (!result.ok) throw result.error;
    return result.value;
}
