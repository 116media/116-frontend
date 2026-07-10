import { toast } from "sonner";

import { FlashToast } from "@/shared/presentation/components/ui/Toaster/FlashToast";

/**
 * INotificationConfig
 *
 * @description
 * The shape of a toast notification. Instances are declared in `*.notification.ts`
 * config files (copy resolved from the i18n catalog), never inline at the call site.
 *
 * @interface INotificationConfig
 * @property {string} title - The (already-localized) headline.
 * @property {string} [description] - The (already-localized) supporting line.
 * @property {number} [duration] - Auto-dismiss delay in ms; sonner's default when unset.
 * @property {"success" | "error" | "info" | "warning"} type - The toast variant.
 */
export interface INotificationConfig {
    title: string;
    duration?: number;
    description?: string;
    type: "success" | "error" | "info" | "warning";
}

/**
 * showNotification
 *
 * @description
 * Displays a flash-message toast via sonner. The single entry point for
 * notifications — pass a config from a `*.notification.ts` file so copy stays
 * centralized and localized. Renders the custom {@link FlashToast} body
 * (`unstyled`, so its filled colored surface wins over sonner's defaults) and
 * wires the toast's own close button to sonner's `dismiss`.
 *
 * @param config - The notification to display. See {@link INotificationConfig}.
 */
export function showNotification({
    type,
    title,
    description,
    duration
}: INotificationConfig): void {
    toast.custom(
        (id) => (
            <FlashToast
                type={type}
                title={title}
                description={description}
                onDismiss={() => toast.dismiss(id)}
            />
        ),
        { duration, unstyled: true }
    );
}
