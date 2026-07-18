import { apiErrors } from "@/shared/presentation/i18n/locales/fr/apiErrors";
import { favorites } from "@/shared/presentation/i18n/locales/fr/favorites";
import { form } from "@/shared/presentation/i18n/locales/fr/form";
import { general } from "@/shared/presentation/i18n/locales/fr/general";
import { navigation } from "@/shared/presentation/i18n/locales/fr/navigation";
import { validator } from "@/shared/presentation/i18n/locales/fr/validator";

/**
 * fr
 *
 * @description
 * French translation catalog. Spreads every namespace module into the single flat
 * `translation` namespace registered in config.ts.
 */
const fr = {
    general,
    navigation,
    form,
    validator,
    apiErrors,
    favorites
} as const;

export default fr;
