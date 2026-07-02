import { toast } from "sonner";

/**
 * INotificationConfig
 *
 * @description
 * The shape of a toast notification. Instances are declared in `*.notification.ts`
 * config files (copy resolved from the i18n catalog), never inline at the call site.
 *
 * @interface INotificationConfig
 * @property {"success" | "error" | "info" | "warning"} type - The toast variant.
 * @property {string} title - The (already-localized) headline.
 * @property {string} [description] - The (already-localized) supporting line.
 * @property {number} [duration] - Auto-dismiss delay in ms; sonner's default when unset.
 */
export interface INotificationConfig {
    type: "success" | "error" | "info" | "warning";
    title: string;
    duration?: number;
    description?: string;
}

/**
 * showNotification
 *
 * @description
 * Displays a toast via sonner. The single entry point for notifications — pass a
 * config from a `*.notification.ts` file so copy stays centralized and localized.
 *
 * @param config - The notification to display. See {@link INotificationConfig}.
 */
export function showNotification({
    type,
    title,
    description,
    duration
}: INotificationConfig): void {
    const options = { description, duration };

    switch (type) {
        case "success":
            toast.success(title, options);
            break;
        case "error":
            toast.error(title, options);
            break;
        case "warning":
            toast.warning(title, options);
            break;
        default:
            toast.info(title, options);
            break;
    }
}
