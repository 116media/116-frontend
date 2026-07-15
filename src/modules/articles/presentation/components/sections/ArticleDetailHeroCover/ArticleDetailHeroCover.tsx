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
    title: string;
    categoryName: string;
    coverImageUrl: string | null;
}

/**
 * ArticleDetailHeroCover
 *
 * @description
 * Cover band with the category chip overlaid in the corner. When there is no cover image,
 * a muted surface with a NewspaperIcon stands in — no placeholder asset.
 */
export function ArticleDetailHeroCover({
    title,
    categoryName,
    coverImageUrl
}: ArticleDetailHeroCoverProps) {
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
