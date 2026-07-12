import type { SharePlatform } from "@/shared/presentation/utils/share/share.utils";

/**
 * Accessible labels for the four share buttons, provided by the caller so the
 * group stays i18n-namespace-agnostic.
 *
 * @interface ISocialShareLabels
 * @property {string} facebook - Label for the Facebook button.
 * @property {string} x - Label for the X button.
 * @property {string} whatsapp - Label for the WhatsApp button.
 * @property {string} copy - Label for the copy-link button.
 */
export interface ISocialShareLabels {
    facebook: string;
    x: string;
    whatsapp: string;
    copy: string;
}

/**
 * A renderable share action: one of the intent platforms, or the copy-link button.
 */
export type SocialShareKey = SharePlatform | "copy";

/**
 * Props for SocialShareGroup.
 *
 * @interface SocialShareGroupProps
 * @property {string} url - The absolute URL being shared.
 * @property {string} title - The page title, carried into the share message.
 * @property {"horizontal" | "vertical"} [orientation] - Group direction. Defaults to vertical.
 * @property {boolean} [separated] - Render individually rounded, gapped buttons instead of
 * one seamless segmented control. Defaults to false.
 * @property {ISocialShareLabels} labels - Accessible labels for the four buttons.
 * @property {(platform: string) => void} [onShared] - Fires after a network share completes (telemetry seam).
 * @property {() => void} [onCopied] - Fires after the URL lands in the clipboard (toast seam).
 * @property {SocialShareKey[]} [platforms] - Which buttons to render, in order.
 * Defaults to all four (`facebook`, `x`, `whatsapp`, `copy`).
 * @property {string} [className] - Extra classes merged onto the group container.
 */
export interface SocialShareGroupProps {
    url: string;
    title: string;
    separated?: boolean;
    labels: ISocialShareLabels;
    orientation?: "horizontal" | "vertical";
    onCopied?: () => void;
    onShared?: (platform: string) => void;
    className?: string;
    platforms?: SocialShareKey[];
}
