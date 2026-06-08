import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import {
    MegaMenuShell,
    MegaMenuShellCards,
    MegaMenuShellCategories
} from "@/shared/presentation/layouts/MegaMenuShell";
import { VideosMegaMenuCard } from "../VideosMegaMenuCard";
import type { VideosMegaMenuProps } from "./types";
import { VideosMegaCategoryList } from "./VideosMegaCategoryList";

/**
 * Dummy videos used as placeholders in the À la une column
 * until real promoted videos are available from the API.
 * The first two are shown as Featured (vertical) cards,
 * the last two as Compact (horizontal) list rows with spinning border.
 */
const DUMMY_VIDEOS: IVideoSummaryEntity[] = [
    {
        id: "dummy-v1",
        categoryId: "cat-v1",
        categoryName: "Concerts",
        title: "Microphone Classic — Live Session Vol. 3",
        slug: "microphone-classic-live-session-3",
        thumbnailUrl: "https://i.pravatar.cc/400?img=10",
        youtubeVideoUrl: null,
        isPromoted: true,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        shareCount: 74,
        ratingAverage: 4.7,
        ratingCount: 213
    },
    {
        id: "dummy-v2",
        categoryId: "cat-v2",
        categoryName: "Studio",
        title: "Beyond Stereo — The Making Of",
        slug: "beyond-stereo-making-of",
        thumbnailUrl: "https://i.pravatar.cc/400?img=11",
        youtubeVideoUrl: null,
        isPromoted: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        shareCount: 38,
        ratingAverage: 4.2,
        ratingCount: 95
    },
    {
        id: "dummy-v3",
        categoryId: "cat-v3",
        categoryName: "Clips",
        title: "Ninho — Lettre à une femme (Clip Officiel)",
        slug: "ninho-lettre-femme-clip",
        thumbnailUrl: "https://i.pravatar.cc/400?img=12",
        youtubeVideoUrl: null,
        isPromoted: true,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        shareCount: 156,
        ratingAverage: 4.9,
        ratingCount: 442
    },
    {
        id: "dummy-v4",
        categoryId: "cat-v4",
        categoryName: "Interviews",
        title: "Aya Nakamura — Confessions d'une icône mondiale",
        slug: "aya-nakamura-confessions-icone",
        thumbnailUrl: "https://i.pravatar.cc/400?img=13",
        youtubeVideoUrl: null,
        isPromoted: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        shareCount: 91,
        ratingAverage: 3.8,
        ratingCount: 67
    }
];

/**
 * VideosMegaMenu
 *
 * @description
 * Mega menu panel for the VIDEOS nav item.
 * Uses MegaMenuShell for the shared 3-column layout structure.
 * Data is prefetched server-side and received as props — no
 * client-side fetching or loading state.
 * When no promoted videos are available, dummy placeholders are shown.
 */
export function VideosMegaMenu({ categories, promotedVideos, popularTags }: VideosMegaMenuProps) {
    const cards = promotedVideos.length > 0 ? promotedVideos.slice(0, 4) : DUMMY_VIDEOS;
    const featured = cards.slice(0, 2);
    const compact = cards.slice(2, 4);

    return (
        <MegaMenuShell
            tagsBasePath={VIDEOS_PATH}
            popularTags={popularTags}
        >
            <MegaMenuShellCategories>
                <VideosMegaCategoryList categories={categories} />
            </MegaMenuShellCategories>

            <MegaMenuShellCards
                viewAllHref={VIDEOS_PATH}
                label="Voir tout →"
            >
                <div className="grid grid-cols-2 gap-2 grid-rows-[320px]">
                    {featured[0] && <VideosMegaMenuCard.FeaturedFullBleed video={featured[0]} />}
                    {featured[1] && <VideosMegaMenuCard.FeaturedSpotlight video={featured[1]} />}
                </div>
                <div className="grid grid-cols-2 gap-2 grid-rows-[180px]">
                    {compact.map((video) => (
                        <VideosMegaMenuCard.Compact
                            key={video.id}
                            video={video}
                        />
                    ))}
                </div>
            </MegaMenuShellCards>
        </MegaMenuShell>
    );
}
