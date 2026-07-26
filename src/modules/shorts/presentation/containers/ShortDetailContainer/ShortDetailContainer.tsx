"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortsPlayer } from "@/modules/shorts/presentation/components/modals/ShortsPlayer";
import { useShortBySlug } from "@/modules/shorts/presentation/hooks/useShortBySlug";

/**
 * Props for the ShortDetailContainer component.
 *
 * @interface ShortDetailContainerProps
 * @property {string} slug - The short slug from the route.
 * @property {string} returnTo - Validated internal route restored on close.
 * @property {IShortVideoEntity} [initialData] - Server-fetched short seeding the query.
 */
export interface ShortDetailContainerProps {
    slug: string;
    returnTo: string;
    initialData?: IShortVideoEntity;
}

/**
 * ShortDetailContainer
 *
 * @description
 * The by-slug short surface (`/shorts/{slug}`): opens the full-screen player straight
 * onto that short. Closing restores the validated route that opened it.
 */
export function ShortDetailContainer({ slug, returnTo, initialData }: ShortDetailContainerProps) {
    const router = useRouter();
    const { data: short } = useShortBySlug(slug, { initialData });

    const shorts = useMemo(() => (short ? [short] : []), [short]);

    if (shorts.length === 0) {
        return <div className="fixed inset-0 bg-black/90" />;
    }

    return (
        <ShortsPlayer
            shorts={shorts}
            initialIndex={0}
            hasNextPage={false}
            onLoadMore={() => undefined}
            onClose={() => router.replace(returnTo)}
        />
    );
}
