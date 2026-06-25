/**
 * IUpdateAccountCredentials
 *
 * @description
 * Presentation-layer input for the account/profile editing form. All fields are
 * optional — a partial update.
 *
 * @interface IUpdateAccountCredentials
 * @property {string} [email] - New email.
 * @property {string} [userName] - New username.
 * @property {string} [countryName] - Country display name.
 * @property {string} [partialPhoneNumber] - Local phone digits.
 * @property {string} [countryIsoCode] - ISO country code.
 * @property {string} [countryDialCode] - International dial code.
 */
export interface IUpdateAccountCredentials {
    email?: string;
    userName?: string;
    countryName?: string;
    partialPhoneNumber?: string;
    countryIsoCode?: string;
    countryDialCode?: string;
}
