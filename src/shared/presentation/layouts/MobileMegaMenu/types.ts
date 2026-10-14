import type { ReactNode } from "react";

import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu/types";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu/types";
import type { MegaMenuTagItem } from "@/shared/presentation/layouts/MegaMenuShell";

/**
 * Props for the MobileMegaMenu root.
 *
 * @interface MobileMegaMenuProps
 * @property {ArticlesMegaMenuProps} articles - Prefetched articles menu data.
 * @property {VideosMegaMenuProps} videos - Prefetched videos menu data.
 */
export interface MobileMegaMenuProps {
    articles: ArticlesMegaMenuProps;
    videos: VideosMegaMenuProps;
}

/**
 * Props for MobileMegaMenu.Section.
 *
 * @interface MobileMegaMenuSectionProps
 * @property {string} title - The already-localized section heading.
 * @property {ReactNode} children - The section body.
 * @property {string} [className] - Extra classes merged onto the section.
 */
export interface MobileMegaMenuSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

/**
 * Props for MobileMegaMenu.Featured.
 *
 * @interface MobileMegaMenuFeaturedProps
 * @property {string} viewAllHref - Destination of the trailing link.
 * @property {() => void} onNavigate - Closes the panel once a link is followed.
 * @property {ReactNode} children - The promoted card grid or list.
 * @property {string} [title] - Heading override; defaults to the shared "featured" label.
 * @property {"panel" | "plain"} [variant] - `panel` draws the accent-tinted inset block;
 * `plain` drops the tint and inset so a card grid spans the panel's full content width.
 */
export interface MobileMegaMenuFeaturedProps {
    viewAllHref: string;
    onNavigate: () => void;
    children: ReactNode;
    title?: string;
    variant?: "panel" | "plain";
}

/**
 * Props for MobileMegaMenu.Tags.
 *
 * @interface MobileMegaMenuTagsProps
 * @property {MegaMenuTagItem[]} tags - The popular tags to render.
 * @property {string} basePath - Base path the tag filter links are built on.
 * @property {() => void} onNavigate - Closes the panel once a tag is followed.
 */
export interface MobileMegaMenuTagsProps {
    tags: MegaMenuTagItem[];
    basePath: string;
    onNavigate: () => void;
}

/**
 * Props for MobileMegaMenu.Footer.
 *
 * @interface MobileMegaMenuFooterProps
 * @property {() => void} onNavigate - Closes the panel before the auth modal opens.
 */
export interface MobileMegaMenuFooterProps {
    onNavigate: () => void;
}

/**
 * One row of MobileMegaMenu.List.
 *
 * @interface MobileMegaMenuListItem
 * @property {string} id - React key.
 * @property {string} href - Destination.
 * @property {string} title - The primary label, clamped to two lines.
 * @property {string} meta - The supporting line below the title.
 * @property {string | null} [imageUrl] - Thumbnail; a muted block stands in when absent.
 * @property {number} [rank] - Position marker, shown ahead of the thumbnail.
 */
export interface MobileMegaMenuListItem {
    id: string;
    href: string;
    title: string;
    meta: string;
    imageUrl?: string | null;
    rank?: number;
}

/**
 * Props for MobileMegaMenu.List.
 *
 * @interface MobileMegaMenuListProps
 * @property {MobileMegaMenuListItem[]} items - The rows to render.
 * @property {boolean} [square] - Square thumbnails, for artists and songs.
 * @property {() => void} onNavigate - Closes the panel once a row is followed.
 */
export interface MobileMegaMenuListProps {
    items: MobileMegaMenuListItem[];
    square?: boolean;
    onNavigate: () => void;
}

/**
 * One chip of MobileMegaMenu.Chips.
 *
 * @interface MobileMegaMenuChipItem
 * @property {string} id - React key.
 * @property {string} href - Destination.
 * @property {string} label - The chip text.
 */
export interface MobileMegaMenuChipItem {
    id: string;
    href: string;
    label: string;
}

/**
 * Props for MobileMegaMenu.Chips.
 *
 * @interface MobileMegaMenuChipsProps
 * @property {MobileMegaMenuChipItem[]} items - The chips to render.
 * @property {() => void} onNavigate - Closes the panel once a chip is followed.
 */
export interface MobileMegaMenuChipsProps {
    items: MobileMegaMenuChipItem[];
    onNavigate: () => void;
}
