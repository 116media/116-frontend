import { GossipStrip } from "@/modules/articles/presentation/components/GossipStrip";
import { HeroCarousel } from "@/modules/articles/presentation/components/HeroCarousel";
import { PairCarousel } from "@/modules/articles/presentation/components/PairCarousel";
import { SideCarousel } from "@/modules/articles/presentation/components/SideCarousel";

import type { ArticlePromotionFeedViewProps } from "./types";

/**
 * ArticlePromotionFeed
 *
 * @description
 * Presentation component for the homepage article promotion grid.
 * Desktop layout (md+) uses an explicit viewport-based height so
 * grid `fr` rows divide space proportionally:
 *   Left column  — Hero (60%) + Pair A/B (40%)
 *   Right column — Side carousel + Gossip strip (fills remaining)
 * Mobile layout — single column, auto-height, stacked vertically.
 */
export function ArticlePromotionFeed({ feed }: ArticlePromotionFeedViewProps) {
    return (
        <section className="grid grid-cols-1 gap-4 md:h-[80vh] md:grid-cols-[3fr_2fr]">
            <div className="grid gap-4 md:grid-rows-[4fr_2fr]">
                <HeroCarousel articles={feed.hero} />
                <PairCarousel
                    pairA={feed.pairA}
                    pairB={feed.pairB}
                />
            </div>

            <div className="grid gap-4 md:grid-rows-[2fr_2.5fr]">
                <SideCarousel articles={feed.side} />
                <GossipStrip articles={feed.gossipStrip} />
            </div>
        </section>
    );
}
