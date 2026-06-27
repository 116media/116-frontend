/**
 * Profile tab strings — headers, cards, fields, and the edit modal.
 */
export const profile = {
    title: "Profile",
    subtitle: "Manage your personal information and profile photo.",
    photo: {
        title: "Profile photo",
        change: "Change photo"
    },
    info: {
        title: "Account information"
    },
    fields: {
        userName: "Username",
        email: "Email",
        country: "Country",
        phone: "Phone"
    },
    edit: {
        title: "Edit account information",
        subtitle: "Update your username, country, and phone number.",
        email: "Email",
        userName: "Username",
        country: "Country",
        countryPlaceholder: "Select a country",
        phone: "Phone",
        phonePlaceholder: "Phone number",
        phoneInvalid: "Enter a valid phone number.",
        phoneInvalidRegion: "Enter a valid phone number for the selected country.",
        selectCountryFirst: "Select a country first.",
        submit: "Save"
    }
} as const;
