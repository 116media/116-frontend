import type { IArticlePromotionFeedEntity } from "@/modules/articles/domain/entities/IArticlePromotionFeedEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";

const coverImages = [
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1644616/pexels-photo-1644616.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2263410/pexels-photo-2263410.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3756765/pexels-photo-3756765.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1571260/pexels-photo-1571260.jpeg?auto=compress&cs=tinysrgb&w=800"
];

const categories = [
    { id: "cat-1", name: "À la Une" },
    { id: "cat-2", name: "Focus" },
    { id: "cat-3", name: "Chronique Sale" },
    { id: "cat-4", name: "Interview" },
    { id: "cat-5", name: "Discovery" }
];

const articleTemplates = [
    {
        title: "Fally Ipupa Drops Explosive New Album",
        headline:
            "The Congolese superstar returns with a groundbreaking 24-track project that blends traditional sounds with modern production. Features include collaborations with top African and international artists. Critics are already calling it the album of the year. Pre-orders have broken every record on the continent."
    },
    {
        title: "Kinshasa Hip-Hop Scene Erupts: New Wave Takes Over",
        headline:
            "A new generation of artists is redefining the sound of Congolese rap, mixing local rhythms with trap beats. Underground cyphers in Matonge are drawing thousands every weekend. Labels from Lagos to Paris are scrambling to sign the freshest voices. The movement has already spawned three platinum singles this quarter alone."
    },
    {
        title: "Exclusive: Maître Gims Opens Up About His Journey",
        headline:
            "In a rare interview, the global superstar discusses his roots and his vision for African music. He reveals the struggles behind his rise from the streets of Kinshasa to sold-out arenas across Europe. The conversation touches on family, faith, and the future of Francophone hip-hop. Expect tears, laughter, and raw honesty in this two-hour sit-down."
    },
    {
        title: "Scandal Rocks the Industry: Label Feud Exposed",
        headline:
            "Behind-the-scenes drama erupts as contract disputes go public on social media. Two of the biggest labels in Congolese music are now locked in a legal battle over royalties and artist rights. Leaked documents reveal shocking terms that have artists speaking out. The fallout could reshape how the entire industry handles contracts going forward."
    },
    {
        title: "Rising Star: Mwaka's Journey from Streets to Stardom",
        headline:
            "How a young rapper from Matete became the voice of a generation overnight. His debut mixtape racked up 10 million streams in just two weeks without any label backing. Major brands are now lining up for endorsement deals. Mwaka credits his community and the raw energy of Kinshasa's streets for everything he has become."
    },
    {
        title: "Studio Session: Inside 116 Studio with DJ B-One",
        headline:
            "Exclusive behind-the-scenes footage of the hottest producers crafting the next chart-toppers. We spent 48 hours inside the legendary 116 Studio watching beats come to life from scratch. The session featured surprise visits from three A-list artists who laid down unreleased vocals. This is the creative engine room that powers half the hits you hear on radio today."
    },
    {
        title: "The Beat Makers: Congo's Top 10 Producers of 2024",
        headline:
            "From ndombolo to afrobeats, these are the sonic architects shaping the industry. Each producer on this list has crafted at least five hit records in the past twelve months. We break down their signature sounds, studio setups, and the artists who keep coming back for more. This ranking is bound to spark debate across every music forum in Central Africa."
    },
    {
        title: "BREAKING: Major Festival Returns After 3-Year Hiatus",
        headline:
            "The biggest music event in DRC announces comeback with star-studded lineup. Over 50 artists from across Africa and the diaspora are confirmed to perform over three unforgettable nights. Organizers promise state-of-the-art sound, massive LED stages, and a VIP experience unlike anything seen before. Early-bird tickets sold out within the first hour of going live."
    },
    {
        title: "Gossip: Secret Collaboration Revealed",
        headline:
            "Industry whispers suggest an unexpected pairing between two rival camps. Sources close to both artists confirm that studio sessions have already taken place in a private location outside Kinshasa. The track is rumored to feature a legendary guitarist and a surprise vocal feature. If the rumors are true, this could be the most talked-about release of the decade."
    },
    {
        title: "Viral Moment: Dance Challenge Sweeps Social Media",
        headline:
            "A new dance craze is taking over TikTok as celebrities join the movement. The challenge, born in a Kinshasa nightclub last month, has now been replicated by over 2 million users worldwide. International stars and athletes are posting their own versions daily. The original creator, a 19-year-old dancer, has been invited to perform on three major TV shows."
    },
    {
        title: "Behind the Lyrics: Decoding the City's Anthems",
        headline:
            "What do the biggest hits really say? A deep dive into the messages behind the music. We sat down with songwriters and linguists to unpack the hidden meanings in this year's most popular tracks. From political commentary disguised as love songs to coded street language, nothing is as simple as it sounds. This analysis will change how you listen to Congolese music forever."
    },
    {
        title: "Investigation: The Dark Side of the Music Industry",
        headline:
            "Uncovering the untold stories of exploitation and survival in the business. Our six-month investigation reveals how young artists are lured into predatory contracts with little legal recourse. Several prominent figures are implicated in a system that profits from talent while giving almost nothing back. This report includes testimony from over 30 current and former artists who agreed to speak on the record."
    },
    {
        title: "Top 5 Albums That Defined Congolese Music This Decade",
        headline:
            "A countdown of the records that shaped a movement and crossed borders. Each album on this list broke new ground in production, storytelling, or cultural impact. We trace how these projects influenced everything from fashion to politics across the continent. Whether you agree with our picks or not, there is no denying their lasting legacy on African music."
    }
];

/**
 * generateArticle
 *
 * @description
 * Creates a single dummy article entity from a template index and category.
 * Uses deterministic IDs and engagement numbers based on the index
 * so the feed renders consistently across page reloads.
 */
function generateArticle(index: number, categoryIndex: number): IArticleSummaryEntity {
    const template = articleTemplates[index % articleTemplates.length];
    const category = categories[categoryIndex % categories.length];

    return {
        id: `article-${index + 1}`,
        categoryId: category.id,
        categoryName: category.name,
        title: template.title,
        slug: template.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        headline: template.headline,
        coverImageUrl: coverImages[index % coverImages.length],
        isPromoted: index < 3,
        publishedAt: new Date(2026, 5, 16 - index).toISOString(),
        likeCount: 500 + index * 320,
        commentCount: 30 + index * 25,
        shareCount: 50 + index * 40
    };
}

/**
 * generateDummyFeed
 *
 * @description
 * Builds a complete dummy promotion feed with articles spread across
 * all 5 spots (hero, side, pairA, pairB, gossipStrip).
 * Returns deterministic data — no Math.random() or Date.now() so
 * the feed stays stable across server/client renders.
 * Remove this file once real API data is flowing.
 */
export function generateDummyFeed(): IArticlePromotionFeedEntity {
    return {
        hero: [
            generateArticle(0, 0),
            generateArticle(1, 0),
            generateArticle(2, 1),
            generateArticle(3, 2)
        ],
        side: [generateArticle(4, 1), generateArticle(5, 4), generateArticle(6, 2)],
        pairA: [generateArticle(7, 3), generateArticle(8, 4)],
        pairB: [generateArticle(9, 1), generateArticle(10, 3)],
        gossipStrip: [generateArticle(11, 2), generateArticle(12, 2), generateArticle(13, 2)]
    };
}
