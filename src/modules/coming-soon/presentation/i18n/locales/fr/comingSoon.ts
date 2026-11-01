/**
 * comingSoon (fr)
 *
 * @description
 * French strings for the pre-launch route and the per-feature waiting pages. Reference
 * catalog: the English mirror must hold the exact same keys.
 */
export const comingSoon = {
    launch: {
        meta: {
            title: "Bientôt en ligne",
            description:
                "La culture urbaine africaine arrive sur 116. Inscrivez-vous pour être parmi les premiers."
        },
        badge: "Lancement imminent",
        title: "La culture urbaine africaine arrive sur 116.",
        countdown: {
            label: "Lancement dans {{days}} jours, {{hours}} heures et {{minutes}} minutes",
            days: "jours",
            hours: "heures",
            minutes: "min",
            seconds: "sec"
        },
        notify: {
            title: "Prévenez-moi quand la plateforme ouvre",
            subtitle: "Un seul e-mail, le jour du lancement. Désinscription en un clic.",
            submit: "Me prévenir"
        },
        highlights: {
            title: "Ce qui vous attend",
            news: {
                title: "News",
                body: "L'actu musicale et culturelle, vérifiée, chaque jour."
            },
            videos: {
                title: "Vidéos et émissions",
                body: "Interviews, sessions studio, clips et documentaires."
            },
            lyrics: {
                title: "Lyrics",
                body: "Les paroles des sons qui font bouger le continent."
            },
            shorts: {
                title: "Shorts",
                body: "Les moments forts en format vertical."
            }
        },
        socials: {
            title: "Suivez-nous en attendant",
            subtitle: "Premières vidéos, coulisses et date du lancement : déjà sur nos réseaux.",
            follow: "Suivre",
            followAria: "Suivre 116 sur {{network}}"
        }
    },
    feature: {
        heading: "Bientôt",
        badge: "Bientôt sur 116",
        notify: {
            title: "Prévenez-moi quand cette page est disponible",
            subtitle: "Un seul e-mail, le jour de l'ouverture. Désinscription en un clic.",
            submit: "Me prévenir"
        },
        explore: "Explorer les vidéos",
        videos: {
            title: "En attendant",
            subtitle: "Les dernières vidéos publiées sur 116.",
            all: "Toutes les vidéos"
        },
        socials: {
            title: "Suivez 116 pour ne rien rater",
            subtitle: "Les annonces de {{feature}} sortiront d'abord sur nos réseaux."
        },
        highlights: {
            title: "Ce qui vous attend"
        }
    },
    lyrics: {
        meta: { title: "116 Lyrics" },
        name: "116 Lyrics",
        tag: "Paroles",
        description:
            "Les paroles des sons qui font bouger Kinshasa et le continent, transcrites et vérifiées par l'équipe 116 Lyriks, reliées à leur clip officiel.",
        points: {
            verified: "Paroles vérifiées par 116 Lyriks, avec couplets et refrains repérés",
            clip: "Le clip officiel juste à côté des paroles",
            genres: "Classées par genre, rap, rumba, afrobeats, et corrections proposées par la communauté"
        },
        highlights: {
            verified: {
                title: "Paroles vérifiées",
                body: "Transcrites et relues par l'équipe 116 Lyriks, ligne par ligne."
            },
            structure: {
                title: "Couplets et refrains",
                body: "Chaque partie du son repérée, pour chanter au bon moment."
            },
            clip: {
                title: "Le clip à côté",
                body: "Le clip officiel sur la même page que les paroles."
            },
            genres: {
                title: "Rap, rumba, afrobeats",
                body: "Des paroles classées par genre, et des corrections proposées par la communauté."
            }
        }
    },
    artists: {
        meta: { title: "Artistes 116" },
        name: "Artistes 116",
        tag: "Artistes",
        description:
            "Les voix de la scène congolaise et de la diaspora, suivies par 116 : un profil par artiste avec ses vidéos, ses paroles et tout ce que 116 a publié sur lui.",
        points: {
            profile: "Un profil par artiste : bio, genre, pays",
            everything: "Ses vidéos, ses paroles et les articles de 116 au même endroit",
            follow: "Suivez vos artistes et soyez prévenu de leurs nouveautés"
        },
        highlights: {
            profile: {
                title: "Profils vérifiés",
                body: "Bio, genre et pays, validés avec chaque artiste."
            },
            videos: {
                title: "Vidéos et clips",
                body: "Ses clips, interviews et sessions 116 réunis."
            },
            lyrics: {
                title: "Paroles et articles",
                body: "Ses paroles 116 Lyriks et tout ce que 116 a publié sur lui."
            },
            follow: {
                title: "Suivez vos artistes",
                body: "Une notification à chaque nouveau son ou nouvelle vidéo."
            }
        }
    }
} as const;
