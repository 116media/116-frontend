import { apiErrors } from "@/shared/presentation/i18n/locales/fr/apiErrors";
import { favorites } from "@/shared/presentation/i18n/locales/fr/favorites";
import { footer } from "@/shared/presentation/i18n/locales/fr/footer";
import { form } from "@/shared/presentation/i18n/locales/fr/form";
import { general } from "@/shared/presentation/i18n/locales/fr/general";
import { navigation } from "@/shared/presentation/i18n/locales/fr/navigation";
import { newsletter } from "@/shared/presentation/i18n/locales/fr/newsletter";
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
    newsletter,
    footer,
    form,
    validator,
    apiErrors,
    favorites
} as const;

export default fr;
