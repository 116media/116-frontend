import { ARTISTES_PATH, LYRICS_PATH } from "@/shared/presentation/constants/paths";

import type { MobileMegaMenuChipItem, MobileMegaMenuListItem } from "./types";

const PORTRAITS = [
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=300",
    "https://images.pexels.com/photos/1644616/pexels-photo-1644616.jpeg?auto=compress&cs=tinysrgb&w=300",
    "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300",
    "https://images.pexels.com/photos/2263410/pexels-photo-2263410.jpeg?auto=compress&cs=tinysrgb&w=300"
];

/**
 * Genre chips for the artists panel. Placeholders until an artists endpoint exists;
 * each chip links to the artists listing filtered by genre.
 */
export const DUMMY_ARTIST_GENRES: MobileMegaMenuChipItem[] = [
    "Rumba",
    "Afrobeats",
    "Hip-Hop",
    "Ndombolo",
    "Gospel",
    "Amapiano"
].map((label) => ({
    label,
    id: `genre-${label.toLowerCase()}`,
    href: `${ARTISTES_PATH}?genre=${encodeURIComponent(label)}`
}));

/**
 * Artists to follow, shown in the artists panel's featured block. Placeholders
 * until an artists endpoint exists.
 */
export const DUMMY_ARTISTS: MobileMegaMenuListItem[] = [
    { name: "Fally Ipupa", meta: "Rumba · RDC" },
    { name: "Innoss'B", meta: "Afrobeats · RDC" },
    { name: "Gaz Mawete", meta: "Rumba · RDC" },
    { name: "Mwaka", meta: "Hip-Hop · RDC" }
].map((artist, index) => ({
    id: `artist-${index}`,
    title: artist.name,
    meta: artist.meta,
    imageUrl: PORTRAITS[index % PORTRAITS.length],
    href: `${ARTISTES_PATH}/${artist.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}));

/**
 * Genre chips for the lyrics panel. Placeholders until a lyrics endpoint exists.
 */
export const DUMMY_LYRIC_GENRES: MobileMegaMenuChipItem[] = [
    "Rumba",
    "Hip-Hop",
    "Afrobeats",
    "Gospel"
].map((label) => ({
    label,
    id: `lyric-genre-${label.toLowerCase()}`,
    href: `${LYRICS_PATH}?genre=${encodeURIComponent(label)}`
}));

/**
 * The week's top lyrics, ranked. Placeholders until a lyrics endpoint exists.
 */
export const DUMMY_TOP_LYRICS: MobileMegaMenuListItem[] = [
    { title: "Mayanga", artist: "Fally Ipupa", views: "1.2M" },
    { title: "Yope Remix", artist: "Innoss'B", views: "980K" },
    { title: "Olina Ngai", artist: "Gaz Mawete", views: "740K" },
    { title: "Matete", artist: "Mwaka", views: "510K" },
    { title: "Kokoko", artist: "Phoenix", views: "480K" }
].map((song, index) => ({
    rank: index + 1,
    title: song.title,
    id: `lyric-${index}`,
    meta: `${song.artist} · ${song.views} vues`,
    imageUrl: PORTRAITS[index % PORTRAITS.length],
    href: `${LYRICS_PATH}/${song.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}));
