"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortsPlayer } from "@/modules/shorts/presentation/components/modals/ShortsPlayer";
import { useShortBySlug } from "@/modules/shorts/presentation/hooks/useShortBySlug";
import { HOME_PATH } from "@/shared/presentation/constants/paths";

/**
 * Props for the ShortDetailContainer component.
 *
 * @interface ShortDetailContainerProps
 * @property {string} slug - The short slug from the route.
 * @property {IShortVideoEntity} [initialData] - Server-fetched short seeding the query.
 */
export interface ShortDetailContainerProps {
    slug: string;
    initialData?: IShortVideoEntity;
}

/**
 * ShortDetailContainer
 *
 * @description
 * The by-slug short surface (`/shorts/{slug}`): opens the full-screen player straight
 * onto that short. Closing the player returns to the homepage. A dark backdrop covers
 * the page while the short resolves so the route never flashes an empty screen.
 */
export function ShortDetailContainer({ slug, initialData }: ShortDetailContainerProps) {
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
            onClose={() => router.push(HOME_PATH)}
        />
    );
}
