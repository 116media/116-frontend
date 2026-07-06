"use client";

import { SiFacebook, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import type { CSSProperties, ReactNode } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ButtonGroup } from "@/shared/presentation/components/ui/ButtonGroup";
import { LinkIcon } from "@/shared/presentation/components/ui/Icon";
import { Colors } from "@/shared/presentation/constants/colors";
import { cn } from "@/shared/presentation/utils/cn";
import { buildShareUrl, type SharePlatform } from "@/shared/presentation/utils/shareUrl";

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
 * Props for SocialShareGroup.
 *
 * @interface SocialShareGroupProps
 * @property {string} url - The absolute URL being shared.
 * @property {string} title - The page title, carried into the share message.
 * @property {"horizontal" | "vertical"} [orientation] - Group direction. Defaults to vertical.
 * @property {ISocialShareLabels} labels - Accessible labels for the four buttons.
 * @property {(platform: string) => void} [onShared] - Fires after a network share completes (telemetry seam).
 * @property {() => void} [onCopied] - Fires after the URL lands in the clipboard (toast seam).
 * @property {SocialShareKey[]} [platforms] - Which buttons to render, in order.
 * Defaults to all four (`facebook`, `x`, `whatsapp`, `copy`).
 * @property {string} [className] - Extra classes merged onto the ButtonGroup.
 */
export interface SocialShareGroupProps {
    url: string;
    title: string;
    orientation?: "horizontal" | "vertical";
    labels: ISocialShareLabels;
    onShared?: (platform: string) => void;
    onCopied?: () => void;
    platforms?: SocialShareKey[];
    className?: string;
}

/**
 * The addressable buttons in the group: the three network intents plus the
 * copy-link action.
 */
export type SocialShareKey = SharePlatform | "copy";

/**
 * Default button set and order when `platforms` is not supplied.
 */
const DEFAULT_PLATFORMS: SocialShareKey[] = ["facebook", "x", "whatsapp", "copy"];

/**
 * One button in the share group. Each button carries a solid background — a
 * network's brand color (via `brand`) or a token background (via `bgClass`) —
 * with a white glyph.
 *
 * @interface ISocialShareButton
 * @property {string} key - Stable list key.
 * @property {ReactNode} icon - The brand / action glyph.
 * @property {string} label - Accessible label (`aria-label`).
 * @property {() => void} onClick - The share or copy action.
 * @property {string} [brand] - Solid brand background color, applied inline (network buttons).
 * @property {string} [bgClass] - Token background utilities (copy button).
 */
interface ISocialShareButton {
    key: string;
    icon: ReactNode;
    label: string;
    onClick: () => void;
    brand?: string;
    bgClass?: string;
}

/**
 * SocialShareGroup
 *
 * @description
 * The shared share affordance: Facebook, X, WhatsApp, and copy-link buttons
 * rendered as one segmented `ButtonGroup` (vertical for the article rail,
 * horizontal for the video share modal). Each network button carries its
 * brand color as a solid background with a white glyph; the copy-link button
 * uses the adaptive accent token. Network buttons prefer the native Web Share
 * API and fall back to opening the platform's intent URL in a new window; the
 * copy-link button writes the URL to the clipboard. Side effects stay with
 * the caller: `onShared(platform)` is the telemetry seam and `onCopied` the
 * toast seam. The solid brand backgrounds are the one documented brand-color
 * exception; all other colors are tokens.
 *
 * @param url - The absolute URL being shared.
 * @param title - The page title, carried into the share message.
 * @param orientation - Group direction. Defaults to vertical.
 * @param labels - Accessible labels for the four buttons.
 * @param onShared - Fires after a network share completes.
 * @param onCopied - Fires after the URL lands in the clipboard.
 * @param platforms - Which buttons to render, in order (defaults to all four).
 * @param className - Extra classes merged onto the ButtonGroup.
 */
export function SocialShareGroup({
    url,
    title,
    orientation = "vertical",
    labels,
    onShared,
    onCopied,
    platforms = DEFAULT_PLATFORMS,
    className
}: SocialShareGroupProps) {
    const shareTo = (platform: SharePlatform) => async () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ url, title });
            } catch {
                return;
            }
        } else {
            window.open(buildShareUrl(platform, url, title), "_blank", "noopener");
        }
        onShared?.(platform);
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(url);
        onCopied?.();
        onShared?.("clipboard");
    };

    const SHARE_BUTTONS: ISocialShareButton[] = [
        {
            key: "facebook",
            icon: <SiFacebook />,
            onClick: shareTo("facebook"),
            label: labels.facebook,
            brand: Colors.Facebook
        },
        {
            key: "x",
            icon: <SiX />,
            onClick: shareTo("x"),
            label: labels.x,
            brand: Colors.Twitter
        },
        {
            key: "whatsapp",
            icon: <SiWhatsapp />,
            onClick: shareTo("whatsapp"),
            label: labels.whatsapp,
            brand: Colors.Whatsapp
        },
        {
            key: "copy",
            icon: <LinkIcon />,
            onClick: copyLink,
            label: labels.copy,
            bgClass: "bg-accent text-accent-foreground hover:text-accent-foreground"
        }
    ];

    const buttons = platforms
        .map((platform) => SHARE_BUTTONS.find((button) => button.key === platform))
        .filter((button): button is ISocialShareButton => button !== undefined);

    return (
        <ButtonGroup
            orientation={orientation}
            className={className}
        >
            {buttons.map(({ key, icon, label, onClick, brand, bgClass }) => (
                <Button
                    key={key}
                    size="lg"
                    variant="ghost"
                    onClick={onClick}
                    aria-label={label}
                    style={brand ? ({ backgroundColor: brand } as CSSProperties) : undefined}
                    className={cn(
                        "size-12 p-0 text-white transition-all hover:text-white [&_svg]:size-5",
                        "hover:brightness-90 hover:[&_svg]:scale-120 [&_svg]:transition-transform",
                        bgClass
                    )}
                >
                    {icon}
                </Button>
            ))}
        </ButtonGroup>
    );
}
