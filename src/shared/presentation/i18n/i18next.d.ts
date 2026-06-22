import type { DEFAULT_NAMESPACE } from "@/shared/presentation/i18n/config";
import type { en } from "@/shared/presentation/i18n/resources";

/**
 * react-i18next type augmentation.
 *
 * @description
 * Teaches react-i18next the app's resource shape so t() keys are typed and autocompleted.
 * The default namespace name and the resource type are derived from the runtime config and
 * the composed English catalog (`resources.ts`) respectively, keeping the types in lockstep
 * with the actual catalog — including the per-module namespaces nested by the composition root.
 *
 * `returnNull: false` makes t() return `string` (never `null`) for present keys, which suits
 * direct rendering in JSX.
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
