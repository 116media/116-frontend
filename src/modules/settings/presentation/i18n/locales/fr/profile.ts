/**
 * Profile tab strings — headers, cards, fields, and the edit modal.
 */
export const profile = {
    title: "Profil",
    subtitle: "Gérez vos informations personnelles et votre photo de profil.",
    photo: {
        title: "Photo de profil",
        change: "Changer la photo"
    },
    info: {
        title: "Informations du compte"
    },
    fields: {
        userName: "Pseudo",
        email: "Adresse e-mail",
        country: "Pays",
        phone: "Téléphone"
    },
    edit: {
        title: "Modifier les informations du compte",
        email: "Adresse e-mail",
        userName: "Pseudo",
        country: "Pays",
        countryPlaceholder: "Sélectionner un pays",
        phone: "Téléphone",
        phonePlaceholder: "Numéro de téléphone",
        phoneInvalid: "Saisissez un numéro de téléphone valide.",
        phoneInvalidRegion: "Saisissez un numéro de téléphone valide pour le pays choisi.",
        selectCountryFirst: "Sélectionnez d'abord un pays.",
        submit: "Enregistrer"
    }
} as const;
