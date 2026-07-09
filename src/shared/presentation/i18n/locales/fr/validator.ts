/**
 * validator (fr)
 *
 * @description
 * Miroir français des messages de validation. Chaque message nomme son champ via
 * l'interpolation `{{field}}` (le libellé localisé du champ, fourni par `Validators`).
 * Doit rester aligné avec l'anglais.
 */
export const validator = {
    required: "{{field}} est obligatoire",
    email: "{{field}} doit être une adresse e-mail valide",
    invalid: "{{field}} est invalide",
    minLength: "{{field}} doit contenir au moins {{min}} caractères",
    maxLength: "{{field}} doit contenir au plus {{max}} caractères",
    passwordStrength:
        "{{field}} doit contenir au moins {{min}} caractères avec une majuscule, une minuscule et un chiffre",
    otp: "{{field}} doit être un code à 6 chiffres",
    mustMatch: "{{field}} ne correspond pas"
} as const;
