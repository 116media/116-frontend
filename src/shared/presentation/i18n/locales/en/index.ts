import { apiErrors } from "@/shared/presentation/i18n/locales/en/apiErrors";
import { favorites } from "@/shared/presentation/i18n/locales/en/favorites";
import { form } from "@/shared/presentation/i18n/locales/en/form";
import { general } from "@/shared/presentation/i18n/locales/en/general";
import { navigation } from "@/shared/presentation/i18n/locales/en/navigation";
import { validator } from "@/shared/presentation/i18n/locales/en/validator";

/**
 * en
 *
 * @description
 * English translation catalog. This barrel's type is the canonical key shape used by the
 * react-i18next module augmentation, so it must stay key-complete.
 */
const en = {
    general,
    navigation,
    form,
    validator,
    apiErrors,
    favorites
} as const;

export default en;
