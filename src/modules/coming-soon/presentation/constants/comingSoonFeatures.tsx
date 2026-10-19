import type { ReactNode } from "react";

import {
    BadgeCheckIcon,
    BellIcon,
    FilmIcon,
    ListVideoIcon,
    MusicIcon,
    NewspaperIcon,
    PlayIcon
} from "@/shared/presentation/components/ui/Icon";

/**
 * One tile under "what is coming": an icon and the two i18n keys naming it.
 *
 * @interface IComingSoonHighlight
 * @property {string} id - Stable key for the tile.
 * @property {ReactNode} icon - The tile's icon.
 * @property {string} titleKey - The i18n key for its title.
 * @property {string} bodyKey - The i18n key for its description.
 */
export interface IComingSoonHighlight {
    id: string;
    icon: ReactNode;
    titleKey: string;
    bodyKey: string;
}

/**
 * One feature the site announces before it opens: how it is labelled, what it promises
 * and which tiles sit under it.
 *
 * @interface IComingSoonFeature
 * @property {string} nameKey - The i18n key for the feature's name.
 * @property {string} tagKey - The i18n key for its badge label.
 * @property {string} descriptionKey - The i18n key for its description.
 * @property {string[]} pointKeys - The i18n keys for what it will do, in order.
 * @property {IComingSoonHighlight[]} highlights - The tiles under it.
 */
export interface IComingSoonFeature {
    nameKey: string;
    tagKey: string;
    descriptionKey: string;
    pointKeys: string[];
    highlights: IComingSoonHighlight[];
}

/**
 * Builds a highlight tile from its icon and the namespace holding its copy.
 *
 * @param id - The tile's stable key, also the last segment of its i18n keys.
 * @param icon - The tile's icon.
 * @param namespace - The feature's highlights namespace.
 * @returns {IComingSoonHighlight} The tile.
 */
function highlight(id: string, icon: ReactNode, namespace: string): IComingSoonHighlight {
    return {
        id,
        icon,
        titleKey: `${namespace}.${id}.title`,
        bodyKey: `${namespace}.${id}.body`
    };
}

/**
 * The lyrics page, until the catalog opens.
 */
export const LYRICS_FEATURE: IComingSoonFeature = {
    nameKey: "comingSoon.lyrics.name",
    tagKey: "comingSoon.lyrics.tag",
    descriptionKey: "comingSoon.lyrics.description",
    pointKeys: [
        "comingSoon.lyrics.points.verified",
        "comingSoon.lyrics.points.clip",
        "comingSoon.lyrics.points.genres"
    ],
    highlights: [
        highlight("verified", <BadgeCheckIcon />, "comingSoon.lyrics.highlights"),
        highlight("structure", <ListVideoIcon />, "comingSoon.lyrics.highlights"),
        highlight("clip", <PlayIcon />, "comingSoon.lyrics.highlights"),
        highlight("genres", <MusicIcon />, "comingSoon.lyrics.highlights")
    ]
};

/**
 * The artists page, until the profiles open.
 */
export const ARTISTS_FEATURE: IComingSoonFeature = {
    nameKey: "comingSoon.artists.name",
    tagKey: "comingSoon.artists.tag",
    descriptionKey: "comingSoon.artists.description",
    pointKeys: [
        "comingSoon.artists.points.profile",
        "comingSoon.artists.points.everything",
        "comingSoon.artists.points.follow"
    ],
    highlights: [
        highlight("profile", <BadgeCheckIcon />, "comingSoon.artists.highlights"),
        highlight("videos", <PlayIcon />, "comingSoon.artists.highlights"),
        highlight("lyrics", <NewspaperIcon />, "comingSoon.artists.highlights"),
        highlight("follow", <BellIcon />, "comingSoon.artists.highlights")
    ]
};

/**
 * What the whole platform opens with, shown on the pre-launch route.
 */
export const LAUNCH_HIGHLIGHTS: IComingSoonHighlight[] = [
    highlight("news", <NewspaperIcon />, "comingSoon.launch.highlights"),
    highlight("videos", <PlayIcon />, "comingSoon.launch.highlights"),
    highlight("lyrics", <MusicIcon />, "comingSoon.launch.highlights"),
    highlight("shorts", <FilmIcon />, "comingSoon.launch.highlights")
];
