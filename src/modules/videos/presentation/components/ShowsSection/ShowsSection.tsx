"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";
import { ShowsCarousel } from "@/modules/videos/presentation/components/ShowsCarousel";
import { Button } from "@/shared/presentation/components/ui/Button";
import { SHOWS_PATH } from "@/shared/presentation/constants/paths";

interface ShowsSectionProps {
    shows: IShowEntity[];
}

/**
 * ShowsSection
 *
 * @description
 * Homepage "shows" section: a centred i18n title, the swipeable focal carousel
 * of shows, and a centred "view all" button linking to the shows page. The
 * title and button labels read from the i18n context (suppressHydrationWarning
 * guards the streamed-in language).
 *
 * @param shows - The shows rendered in the carousel
 */
export function ShowsSection({ shows }: ShowsSectionProps) {
    const { t } = useTranslation();

    return (
        <section className="flex flex-col gap-4">
            <h2
                suppressHydrationWarning
                className="text-center text-xl font-bold uppercase tracking-wide text-foreground sm:text-2xl lg:text-3xl"
            >
                {t("videos.home.showsTitle")}
            </h2>

            <ShowsCarousel shows={shows} />

            <div className="flex justify-center">
                <Button
                    asChild
                    size="lg"
                    variant="brand-outline"
                >
                    <Link
                        href={SHOWS_PATH}
                        suppressHydrationWarning
                    >
                        {t("videos.home.showsViewAll")}
                    </Link>
                </Button>
            </div>
        </section>
    );
}
