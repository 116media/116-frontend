"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { buildShortDetailPath } from "@/modules/shorts/presentation/utils/navigation/navigation.utils";

/**
 * Returns a short opener that preserves the current internal route for closing.
 *
 * @returns A callback that navigates to a short by slug.
 */
export function useOpenShort(): (slug: string) => void {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const returnTo = useMemo(() => {
        const query = searchParams.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    return useCallback(
        (slug: string) => router.push(buildShortDetailPath(slug, returnTo)),
        [returnTo, router]
    );
}
