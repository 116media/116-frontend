"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import { ArticlePromotionCard } from "@/modules/articles/presentation/components/ArticlePromotionCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/shared/presentation/components/ui/Carousel";
import { CarouselDots } from "@/shared/presentation/components/ui/CarouselDots";

interface HeroCarouselProps {
    articles: IArticleSummaryEntity[];
}

/**
 * HeroCarousel
 *
 * @description
 * Spot 1 — large hero carousel occupying the top-left of the promotion grid.
 * Uses slide transition with autoplay (30s) and dot indicators inside
 * the card (bottom-right). No arrows.
 * When only one article is present, renders a static card
 * without carousel wrapping.
 */
export function HeroCarousel({ articles }: HeroCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 30_000, stopOnInteraction: false })
    ]);

    if (articles.length === 0) return null;

    if (articles.length === 1) {
        return <ArticlePromotionCard.Hero article={articles[0]} />;
    }

    return (
        <Carousel
            emblaRef={emblaRef}
            api={emblaApi}
        >
            <CarouselContent overlay={<CarouselDots className="absolute bottom-3 right-3 z-10" />}>
                {articles.map((article) => (
                    <CarouselItem key={article.id}>
                        <ArticlePromotionCard.Hero article={article} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
