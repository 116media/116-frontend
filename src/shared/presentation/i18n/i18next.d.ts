import type { DEFAULT_NAMESPACE } from "@/shared/presentation/i18n/config";
import type { en } from "@/shared/presentation/i18n/resources";

/**
 * react-i18next type augmentation.
 *
 * @description
 * Teaches react-i18next the app's resource shape so t() keys are typed and autocompleted.
 * Types derive from the runtime config and the composed English catalog, staying in
 * lockstep with the actual keys. `returnNull: false` makes t() return `string`.
 */
declare module "react-i18next" {
    interface CustomTypeOptions {
        defaultNS: typeof DEFAULT_NAMESPACE;
        resources: {
            translation: typeof en;
        };
        returnNull: false;
    }
}
