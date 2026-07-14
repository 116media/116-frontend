import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * Playable sample clips from Cloudinary's public `demo` account, cropped to a 9:16
 * vertical frame on the fly (`c_fill`). Hotlink- and CORS-friendly with no API key,
 * so the dummy shorts actually play in the Plyr file source. A `<video>` source is
 * not subject to the `next/image` host allow-list.
 */
const CLOUDINARY_VERTICAL =
    "https://res.cloudinary.com/demo/video/upload/w_405,h_720,c_fill,q_auto";
const DUMMY_VIDEO_SOURCES = [
    `${CLOUDINARY_VERTICAL}/dog.mp4`,
    `${CLOUDINARY_VERTICAL}/sea_turtle.mp4`,
    `${CLOUDINARY_VERTICAL}/elephants.mp4`,
    `${CLOUDINARY_VERTICAL}/snow_horses.mp4`,
    `${CLOUDINARY_VERTICAL}/cld-sample-video.mp4`,
    `${CLOUDINARY_VERTICAL}/samples/sea-turtle.mp4`,
    `${CLOUDINARY_VERTICAL}/samples/elephants.mp4`,
    `${CLOUDINARY_VERTICAL}/samples/cld-sample-video.mp4`
];

/**
 * Portrait-friendly Pexels stills used as poster frames; the 9:16 tiles and stage
 * apply `object-cover`, so any orientation crops cleanly. `images.pexels.com` is an
 * allow-listed `next/image` host.
 */
const DUMMY_THUMBNAILS = [
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/1699414/pexels-photo-1699414.jpeg?auto=compress&cs=tinysrgb&w=405",
    "https://images.pexels.com/photos/2078071/pexels-photo-2078071.jpeg?auto=compress&cs=tinysrgb&w=405"
];

/**
 * Caption pool giving the dummy feed a plausible music/street-culture voice.
 */
const DUMMY_TITLES = [
    "Late-night cypher on the rooftop 🎤",
    "This dance move is taking over Kinshasa",
    "Studio session: the beat that broke the timeline",
    "Behind the scenes of the new video 🔥",
    "Rhumba x trap — turn it up",
    "One take, no autotune",
    "The crowd went crazy for this drop",
    "Sound check turned into a whole show",
    "POV: the beat just hit different",
    "Freestyle Friday, city edition",
    "When the bassline drops at 2am",
    "Little brother stole the spotlight 😂",
    "New wave, same energy",
    "Backstage before the biggest night",
    "This is how we close the set"
];

/**
 * Author pool for the dummy bylines, paired with a stable pravatar seed.
 */
const DUMMY_AUTHORS = [
    { userName: "kin_beats", seed: "kin_beats" },
    { userName: "mama_afro", seed: "mama_afro" },
    { userName: "studio242", seed: "studio242" },
    { userName: "nightowl", seed: "nightowl" },
    { userName: "rhumba_kid", seed: "rhumba_kid" },
    { userName: "citycypher", seed: "citycypher" },
    { userName: "loud_speaker", seed: "loud_speaker" },
    { userName: "the_producer", seed: "the_producer" }
];

/**
 * generateDummyShort
 *
 * @description
 * Builds one dummy short from its index. IDs, counts, and picks are deterministic
 * (no `Math.random()` / `Date.now()`) so the feed is stable across renders and the
 * keys never collide with the backend's UUID ids.
 *
 * @param index - The short's position in the padded feed.
 * @returns {IShortVideoEntity} A dummy short entity.
 */
export function generateDummyShort(index: number): IShortVideoEntity {
    const author = DUMMY_AUTHORS[index % DUMMY_AUTHORS.length];
    const hasFullVideo = index % 4 === 0;

    return {
        id: `dummy-short-${index + 1}`,
        title: DUMMY_TITLES[index % DUMMY_TITLES.length],
        slug: `dummy-short-${index + 1}`,
        videoUrl: DUMMY_VIDEO_SOURCES[index % DUMMY_VIDEO_SOURCES.length],
        thumbnailUrl: DUMMY_THUMBNAILS[index % DUMMY_THUMBNAILS.length],
        hasFullVideo,
        videoSlug: hasFullVideo ? `dummy-full-video-${index + 1}` : null,
        viewCount: 1200 + index * 137,
        likeCount: 80 + index * 13,
        shareCount: 5 + index * 3,
        bookmarkCount: 12 + index * 7,
        author: {
            userName: author.userName,
            avatarUrl: `https://i.pravatar.cc/150?u=${author.seed}`,
            role: undefined
        },
        isLiked: false,
        isBookmarked: false
    };
}

/**
 * generateDummyShorts
 *
 * @description
 * Builds a deterministic list of dummy shorts used to pad the feed until the
 * backend has enough active shorts to fill it on its own.
 *
 * @param count - How many dummy shorts to generate.
 * @returns {IShortVideoEntity[]} The dummy shorts.
 */
export function generateDummyShorts(count: number): IShortVideoEntity[] {
    return Array.from({ length: count }, (_, index) => generateDummyShort(index));
}
