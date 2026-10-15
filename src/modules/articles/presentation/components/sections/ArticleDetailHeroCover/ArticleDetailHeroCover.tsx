import Image from "next/image";

import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for ArticleDetailHeroCover.
 *
 * @interface ArticleDetailHeroCoverProps
 * @property {string | null} coverImageUrl - The cover image URL, or null for the fallback.
 * @property {string} title - The article title, used as the image alt text.
 */
export interface ArticleDetailHeroCoverProps {
    title: string;
    coverImageUrl: string | null;
}

/**
 * ArticleDetailHeroCover
 *
 * @description
 * Cover band for the article. When there is no cover image, a muted surface with a
 * NewspaperIcon stands in — no placeholder asset.
 */
export function ArticleDetailHeroCover({ title, coverImageUrl }: ArticleDetailHeroCoverProps) {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:h-[60vh]">
            {coverImageUrl ? (
                <Image
                    fill
                    priority
                    alt={title}
                    sizes="100vw"
                    src={coverImageUrl}
                    className="object-cover"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-16 text-muted-foreground" />
                </div>
            )}
        </div>
    );
}
