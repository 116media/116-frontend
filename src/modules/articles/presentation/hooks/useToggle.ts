"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import type { Failure } from "@/shared/domain/failures/failure";
import type { Result } from "@/shared/domain/results/result";

/**
 * useToggle
 *
 * @description
 * Shared optimistic toggle used by like and bookmark: owns a boolean `on` state and a
 * displayed `count`, flips them immediately on `toggle`, runs the on/off use case, and
 * rolls both back on failure. State is client-owned because the summary DTO exposes no
 * per-user flag.
 *
 * @param initialCount - The baseline count from the entity.
 * @param onExecute - Runs the "on" (true) or "off" (false) mutation; resolves the success flag.
 * @returns `{ on, count, toggle }`.
 */
export function useToggle(initialCount: number, onExecute: (next: boolean) => Promise<boolean>) {
    const [on, setOn] = useState(false);
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
