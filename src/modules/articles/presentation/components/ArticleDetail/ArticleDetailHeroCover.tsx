import Image from "next/image";

import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * Props for ArticleDetailHeroCover.
 *
 * @interface ArticleDetailHeroCoverProps
 * @property {string | null} coverImageUrl - The cover image URL, or null for the fallback.
 * @property {string} categoryName - The category display name, shown as the corner chip.
 * @property {string} title - The article title, used as the image alt text.
 */
export interface ArticleDetailHeroCoverProps {
    coverImageUrl: string | null;
    categoryName: string;
    title: string;
}

/**
 * ArticleDetailHeroCover
 *
 * @description
 * The article's cover band: the cover image (next/image, fill, priority, object-cover) in a
 * rounded frame, with the category chip overlaid in the top-left corner. When there is no
 * cover, a token-colored muted surface with a NewspaperIcon stands in — no placeholder
 * asset. The title, byline, headline, and meta row all sit below the cover, not overlaid.
 *
 * @param coverImageUrl - The cover image URL, or null for the fallback.
 * @param categoryName - The category display name (corner chip).
 * @param title - The article title, used as the image alt text.
 */
export function ArticleDetailHeroCover({
    coverImageUrl,
    categoryName,
    title
}: ArticleDetailHeroCoverProps) {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:h-[60vh]">
            {coverImageUrl ? (
                <Image
                    fill
                    priority
                    src={coverImageUrl}
                    alt={title}
                    sizes="100vw"
                    className="object-cover"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-16 text-muted-foreground" />
                </div>
            )}
            <span className="absolute top-4 left-4">
                <Tag
                    size="lg"
                    as="span"
                    variant="ghost"
                    className="bg-white/10 text-white/90 backdrop-blur-sm"
                    prefix={
                        <span className="hidden size-2 animate-pulse rounded-full bg-secondary sm:block" />
                    }
                >
                    {categoryName}
                </Tag>
            </span>
        </div>
    );
}
