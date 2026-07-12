"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticlePromotionCard } from "@/modules/articles/presentation/components/cards/ArticlePromotionCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/shared/presentation/components/ui/Carousel";
import { CarouselDots } from "@/shared/presentation/components/ui/CarouselDots";

/**
 * Props for the PairColumnCarousel sub-component.
 *
 * @interface PairColumnCarouselProps
 * @property {IArticleSummaryEntity[]} articles - Articles for one paired column.
 */
export interface PairColumnCarouselProps {
    articles: IArticleSummaryEntity[];
}

/**
 * Props for the PairCarousel component.
 *
 * @interface PairCarouselProps
 * @property {IArticleSummaryEntity[]} pairA - Articles for the first paired column.
 * @property {IArticleSummaryEntity[]} pairB - Articles for the second paired column.
 */
export interface PairCarouselProps {
    pairA: IArticleSummaryEntity[];
    pairB: IArticleSummaryEntity[];
}

/**
 * PairColumnCarousel
 *
 * @description
 * Single-column fade carousel for spot 3, with autoplay and dot indicators. Renders a
 * static card for a single article.
 */
function PairColumnCarousel({ articles }: PairColumnCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Fade(),
        Autoplay({ delay: 40_000, stopOnInteraction: false })
    ]);

    if (articles.length === 0) return null;

    if (articles.length === 1) {
        return <ArticlePromotionCard.Pair article={articles[0]} />;
    }

    return (
        <Carousel
            api={emblaApi}
            emblaRef={emblaRef}
        >
            <CarouselContent
                overlay={<CarouselDots className="absolute bottom-3 right-3 z-10 hidden sm:flex" />}
            >
                {articles.map((article) => (
                    <CarouselItem key={article.id}>
                        <ArticlePromotionCard.Pair article={article} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}

/**
 * PairCarousel
 *
 * @description
 * Spot 3 — two side-by-side columns (3a + 3b) in the promotion grid, each an independent
 * carousel with its own autoplay and dot indicators.
 */
export function PairCarousel({ pairA, pairB }: PairCarouselProps) {
    return (
        <div className="grid h-full grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div className="aspect-3/4 overflow-hidden lg:aspect-auto">
                <PairColumnCarousel articles={pairA} />
            </div>
            <div className="aspect-3/4 overflow-hidden lg:aspect-auto">
                <PairColumnCarousel articles={pairB} />
            </div>
        </div>
    );
}
