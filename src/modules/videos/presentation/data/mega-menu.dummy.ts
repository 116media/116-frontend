import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";

/**
 * Placeholders for the mega menu's featured column until the API returns promoted
 * videos. Shared by the desktop menu and its mobile panel so both show the same
 * four cards.
 */
export const DUMMY_VIDEOS: IVideoSummaryEntity[] = [
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
