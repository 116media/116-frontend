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

/**
 * Props for the SideCarousel component.
 *
 * @interface SideCarouselProps
 * @property {IArticleSummaryEntity[]} articles - Articles shown in the side carousel.
 */
export interface SideCarouselProps {
    articles: IArticleSummaryEntity[];
}

/**
 * SideCarousel
 *
 * @description
 * Spot 2 — tall side fade carousel in the promotion grid, with autoplay and no dots.
 * When only one article is present, renders a static card without carousel wrapping.
 */
export function SideCarousel({ articles }: SideCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Fade(),
        Autoplay({ delay: 35_000, stopOnInteraction: false })
    ]);

    if (articles.length === 0) return null;

    if (articles.length === 1) {
        return <ArticlePromotionCard.Side article={articles[0]} />;
    }

    return (
        <Carousel
            api={emblaApi}
            emblaRef={emblaRef}
        >
            <CarouselContent>
                {articles.map((article) => (
                    <CarouselItem key={article.id}>
                        <ArticlePromotionCard.Side article={article} />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
