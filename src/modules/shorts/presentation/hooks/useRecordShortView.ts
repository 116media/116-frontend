"use client";

import container from "@/shared/infrastructure/service.locator";

/**
 * useRecordShortView
 *
 * @description
 * Records a view event against a short, fire-and-forget. The engagement gate and
 * per-session dedup live in the player; this hook only issues the call and
 * swallows failures.
 *
 * @returns A `recordView(shortId)` function.
 */
export function useRecordShortView() {
    return (shortId: string) => {
        void container.cradle.recordShortViewUseCase.execute(shortId);
    };
}
