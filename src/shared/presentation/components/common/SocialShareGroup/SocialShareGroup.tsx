"use client";

import { SiFacebook, SiWhatsapp, SiX } from "@icons-pack/react-simple-icons";
import type { CSSProperties, ReactNode } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ButtonGroup } from "@/shared/presentation/components/ui/ButtonGroup";
import { LinkIcon } from "@/shared/presentation/components/ui/Icon";
import { Colors } from "@/shared/presentation/constants/colors";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { buildShareUrl, type SharePlatform } from "@/shared/presentation/utils/share/share.utils";
import type { SocialShareGroupProps, SocialShareKey } from "./types";

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
    label: string;
    brand?: string;
    icon: ReactNode;
    bgClass?: string;
    onClick: () => void;
}

/**
 * SocialShareGroup
 *
 * @description
 * The shared share affordance: Facebook, X, WhatsApp, and copy-link buttons in one
 * `ButtonGroup`. Network buttons prefer the native Web Share API and fall back to the
 * platform's intent URL; the solid brand backgrounds are the one brand-color exception.
 */
export function SocialShareGroup({
    url,
    title,
    orientation = "vertical",
    separated = false,
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

    const renderedButtons = buttons.map(({ key, icon, label, onClick, brand, bgClass }) => (
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
                separated && "rounded-lg",
                bgClass
            )}
        >
            {icon}
        </Button>
    ));

    if (separated) {
        return (
            <div
                className={cn(
                    "flex w-fit items-stretch gap-2",
                    orientation === "vertical" && "flex-col",
                    className
                )}
            >
                {renderedButtons}
            </div>
        );
    }

    return (
        <ButtonGroup
            className={className}
            orientation={orientation}
        >
            {renderedButtons}
        </ButtonGroup>
    );
}
