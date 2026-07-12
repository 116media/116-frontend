import Image from "next/image";
import type { ComponentProps } from "react";

import { ButtonFrostedPlay } from "@/shared/presentation/components/ui/Button";

/**
 * Props for VideoCardMedia.
 *
 * @interface VideoCardMediaProps
 * @property {string} title - The video title, used as the image alt text.
 * @property {string | null} thumbnailUrl - The thumbnail URL, or null when unset.
 * @property {ComponentProps<typeof ButtonFrostedPlay>["size"]} playSize - Size of the hover play button.
 * @property {string} sizes - The responsive `sizes` hint for the fill image.
 */
export interface VideoCardMediaProps {
    title: string;
    thumbnailUrl: string | null;
    playSize: ComponentProps<typeof ButtonFrostedPlay>["size"];
    sizes: string;
}

/**
 * VideoCardMedia
 *
 * @description
 * The thumbnail layer shared by every VideoCard variant. Fills its positioned parent, so each
 * variant owns the outer sized and rounded container (and the muted surface when no thumbnail
 * is set); hover effects are driven by the ancestor card's `group` class.
 */
export function VideoCardMedia({ title, thumbnailUrl, playSize, sizes }: VideoCardMediaProps) {
    return (
        <>
            {thumbnailUrl && (
                <Image
                    fill
                    alt={title}
                    src={thumbnailUrl}
                    sizes={sizes}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ButtonFrostedPlay size={playSize} />
            </div>
        </>
    );
}
