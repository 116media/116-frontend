/**
 * comingSoon (en)
 *
 * @description
 * English strings for the pre-launch route and the per-feature waiting pages. Mirror of
 * the French catalog; must hold the exact same keys.
 */
export const comingSoon = {
    launch: {
        meta: {
            title: "Coming soon",
            description: "African urban culture is coming to 116. Sign up to be among the first in."
        },
        badge: "Launching soon",
        title: "African urban culture is coming to 116.",
        countdown: {
            label: "Launching in {{days}} days, {{hours}} hours and {{minutes}} minutes",
            days: "days",
            hours: "hours",
            minutes: "min",
            seconds: "sec"
        },
        notify: {
            title: "Tell me when the platform opens",
            subtitle: "One email, on launch day. Unsubscribe in one click.",
            submit: "Notify me"
        },
        highlights: {
            title: "What is coming",
            news: {
                title: "News",
                body: "Music and culture reporting, checked, every day."
            },
            videos: {
                title: "Videos and shows",
                body: "Interviews, studio sessions, clips and documentaries."
            },
            lyrics: {
                title: "Lyrics",
                body: "The words behind the songs moving the continent."
            },
            shorts: {
                title: "Shorts",
                body: "The best moments, vertical."
            }
        },
        socials: {
            title: "Follow us in the meantime",
            subtitle:
                "First videos, behind the scenes and the launch date, already on our channels.",
            follow: "Follow",
            followAria: "Follow 116 on {{network}}"
        }
    },
    feature: {
        heading: "Coming soon",
        badge: "Coming soon to 116",
        notify: {
            title: "Tell me when this page is available",
            subtitle: "One email, the day it opens. Unsubscribe in one click.",
            submit: "Notify me"
        },
        explore: "Browse the videos",
        videos: {
            title: "In the meantime",
            subtitle: "The latest videos published on 116.",
            all: "All videos"
        },
        socials: {
            title: "Follow 116 so you don't miss it",
            subtitle: "News about {{feature}} lands on our channels before anywhere else."
        },
        highlights: {
            title: "What is coming"
        }
    },
    lyrics: {
        meta: { title: "116 Lyrics" },
        name: "116 Lyrics",
        tag: "Lyrics",
        description:
            "The words behind the songs moving Kinshasa and the continent, transcribed and checked by the 116 Lyriks team, tied to their official clip.",
        points: {
            verified: "Lyrics checked by 116 Lyriks, with verses and choruses marked",
            clip: "The official clip right beside the words",
            genres: "Sorted by genre, rap, rumba, afrobeats, with corrections from the community"
        },
        highlights: {
            verified: {
                title: "Checked lyrics",
                body: "Transcribed and reread by the 116 Lyriks team, line by line."
            },
            structure: {
                title: "Verses and choruses",
                body: "Every part of the song marked, so you come in on time."
            },
            clip: {
                title: "The clip beside it",
                body: "The official clip on the same page as the words."
            },
            genres: {
                title: "Rap, rumba, afrobeats",
                body: "Lyrics sorted by genre, with corrections proposed by the community."
            }
        }
    },
    artists: {
        meta: { title: "116 Artists" },
        name: "116 Artists",
        tag: "Artists",
        description:
            "The voices of the Congolese scene and its diaspora, followed by 116: one profile per artist with their videos, their lyrics and everything 116 has published about them.",
        points: {
            profile: "One profile per artist: bio, genre, country",
            everything: "Their videos, their lyrics and 116's articles in one place",
            follow: "Follow your artists and hear about what they release"
        },
        highlights: {
            profile: {
                title: "Verified profiles",
                body: "Bio, genre and country, confirmed with each artist."
            },
            videos: {
                title: "Videos and clips",
                body: "Their clips, interviews and 116 sessions together."
            },
            lyrics: {
                title: "Lyrics and articles",
                body: "Their 116 Lyriks lyrics and everything 116 has published about them."
            },
            follow: {
                title: "Follow your artists",
                body: "A notification for every new song or video."
            }
        }
    }
} as const;
