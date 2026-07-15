import type { IShowEntity } from "@/modules/videos/domain/entities/IShowEntity";

/**
 * Number of dummy shows used as a fallback for the shows surfaces (carousel,
 * browse modal, and the shows page grid).
 */
const SHOWS_COUNT = 60;

const posters = [
    "https://images.pexels.com/photos/7586662/pexels-photo-7586662.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2240771/pexels-photo-2240771.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?auto=compress&cs=tinysrgb&w=800"
];

/**
 * Deterministic poster-color pairs mirroring what the backend extracts from a
 * real poster (dominant background + WCAG-contrasting foreground). Used so the
 * fallback carousel exercises the same color-driven card styling as live data.
 */
const palette = [
    { background: "#1F2A44", foreground: "#FFFFFF" },
    { background: "#F4C430", foreground: "#000000" },
    { background: "#7B2D26", foreground: "#FFFFFF" },
    { background: "#0D3B2E", foreground: "#FFFFFF" },
    { background: "#E8D5B5", foreground: "#000000" },
    { background: "#2C2240", foreground: "#FFFFFF" }
];

const shows = [
    {
        name: "Chronique Sale",
        description: "The unfiltered late-night talk show digging into the city's loudest stories."
    },
    {
        name: "Studio Sessions",
        description: "Behind the glass with the producers and artists shaping the new sound."
    },
    {
        name: "The Cypher",
        description: "Raw, one-take cyphers gathering the sharpest lyricists in one room."
    },
    {
        name: "Backstage Pass",
        description: "What really happens before the lights go up — tours, soundchecks, and chaos."
    },
    {
        name: "Le Focus",
        description: "Long-form interviews that put one artist and one story under the spotlight."
    },
    {
        name: "Rooftop Live",
        description: "Sunset performances above the skyline, stripped down and electric."
    },
    {
        name: "Diaspora Beats",
        description: "Tracing the sound from Kinshasa to the world and back again."
    },
    {
        name: "First Listen",
        description: "Premieres and reactions to the projects everyone will be talking about."
    },
    {
        name: "The Comeback",
        description: "Stories of the artists who disappeared, regrouped, and came back harder."
    },
    {
        name: "Block Party",
        description: "Street takeovers and neighborhood shows where the culture actually lives."
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
        colors: palette[index % palette.length]
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
