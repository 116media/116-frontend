import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";

/**
 * Number of dummy shows used as a fallback for the shows surfaces (carousel,
 * browse modal, and the shows page grid).
 */
const SHOWS_COUNT = 60;

const posters = [
    "https://www.revolt.tv/media_18d4d117df3479f2373befd395cfadafdc3487dcd.png?width=750&format=webp&optimize=high",
    "https://www.revolt.tv/media_1ab87243e31962411ffd077417c0fa0030333d6f8.webp?width=750&format=webp&optimize=high",
    "https://www.revolt.tv/media_1a9cbfc4387cfdeffff22f882ebe6cf9c8b5481d7.webp?width=750&format=webp&optimize=high",
    "https://www.revolt.tv/media_17a08d8cea9c586980321de3d4239956594895b9f.webp?width=750&format=webp&optimize=high",
    "https://www.revolt.tv/media_1666bf448c4d3919ae96ffd19634aa836b3e7ce4c.png?width=750&format=webp&optimize=high",
    "https://www.revolt.tv/media_1233783e791d33a52ee523178c13bb7630606f53c.png?width=2000&format=webp&optimize=high",
    "https://www.revolt.tv/media_1e13c6dc528b47b942fdc063af256ac37f9606e2e.png?width=2000&format=webp&optimize=high",
    "https://www.revolt.tv/media_1c1e5e078197f0d34bfd0ae1478731231cd317127.png?width=2000&format=webp&optimize=high"
];

/**
 * Poster-color pairs read off each poster above, index for index: the dominant tone once
 * the near-black and near-white pixels are dropped, paired with whichever of black or
 * white contrasts better with it, as the backend's extraction does for real artwork.
 */
const palette = [
    { background: "#565258", foreground: "#FFFFFF" },
    { background: "#2C2A27", foreground: "#FFFFFF" },
    { background: "#B87845", foreground: "#000000" },
    { background: "#B5E51B", foreground: "#000000" },
    { background: "#C33332", foreground: "#FFFFFF" },
    { background: "#0167C7", foreground: "#FFFFFF" },
    { background: "#292A27", foreground: "#FFFFFF" },
    { background: "#6A6507", foreground: "#FFFFFF" }
];

const shows = [
    {
        name: "Chronique Sale",
        description:
            "The unfiltered late-night talk show digging into the city's loudest stories, where nothing gets edited out and no guest leaves without saying the thing they came to avoid. Recorded live, aired untouched, argued about for the rest of the week."
    },
    {
        name: "Studio Sessions",
        description: "Behind the glass with the producers and artists shaping the new sound."
    },
    {
        name: "The Cypher",
        description:
            "Raw, one-take cyphers gathering the sharpest lyricists in one room, with no beat switches, no retakes, and no edits. Sixteen bars each, passed around until the circle breaks or the sun comes up."
    },
    {
        name: "Backstage Pass",
        description: "What really happens before the lights go up: tours, soundchecks, and chaos."
    },
    {
        name: "Le Focus",
        description:
            "Long-form interviews that put one artist and one story under the spotlight for a full hour, tracing the work back through the rooms, the setbacks and the people who shaped it long before anyone outside was paying attention."
    },
    {
        name: "Rooftop Live",
        description: "Sunset performances above the skyline, stripped down and electric."
    },
    {
        name: "Diaspora Beats",
        description:
            "Tracing the sound from Kinshasa to Brussels, Paris and Johannesburg and back again, following the records, the producers and the dancefloors that carried it."
    },
    {
        name: "First Listen",
        description:
            "Premieres and first reactions to the projects everyone will be arguing about by Friday."
    },
    {
        name: "The Comeback",
        description:
            "Stories of the artists who disappeared, regrouped and came back harder, told by the people who were in the room when it fell apart and the ones who answered the phone when it was time to start again. Six episodes, six second chances."
    },
    {
        name: "Block Party",
        description: "Street takeovers and neighbourhood shows where the culture actually lives."
    }
];

/**
 * generateDummyShow
 *
 * @description
 * Creates a single dummy show entity from its index. Deterministic IDs, slugs,
 * and posters (no Math.random() / Date.now()) so the carousel renders the same
 * on the server and the client.
 *
 * @param index - The position of the show in the list
 * @returns A dummy show entity
 */
function generateDummyShow(index: number): IShowEntity {
    const show = shows[index % shows.length];
    const season = Math.floor(index / shows.length) + 1;
    const name = season > 1 ? `${show.name} S${season}` : show.name;

    return {
        id: `dummy-show-${index + 1}`,
        name,
        slug: name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        description: show.description,
        posterUrl: posters[index % posters.length],
        colors: palette[index % posters.length],
        episodeCount: 6 + ((index * 5) % 19)
    };
}

/**
 * generateDummyShows
 *
 * @description
 * Builds the fallback list of dummy shows, used while the request is in
 * flight or when the public categories endpoint returns nothing. Base names
 * repeat with a season suffix so every entry stays unique and deterministic.
 *
 * @returns Sixty deterministic dummy shows
 */
export function generateDummyShows(): IShowEntity[] {
    return Array.from({ length: SHOWS_COUNT }, (_, index) => generateDummyShow(index));
}
