import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the Prose component.
 *
 * @interface ProseProps
 * @augments HTMLAttributes<HTMLDivElement>
 */
export type ProseProps = HTMLAttributes<HTMLDivElement>;

/**
 * Prose
 *
 * @description
 * A typographic container for rendered rich-text HTML. Applies a curated set of descendant
 * styles (headings, paragraphs, links, images, blockquotes, lists, embeds, rules) using
 * theme tokens so content reads consistently in light and dark mode. Images are
 * full-width, auto-height and rounded; iframes are responsive. Forwards its ref to the
 * underlying div so the content element can be measured for reading progress. No global
 * typography plugin is required.
 *
 * @param className - Extra classes merged onto the container.
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
    { className, children, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={cn(
                "max-w-none text-foreground",
                "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-bold [&_h2]:text-2xl",
                "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-bold [&_h3]:text-xl",
                "[&_p]:my-4 [&_p]:leading-relaxed",
                "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
                "[&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg",
                "[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-lg",
                "[&_blockquote]:border-border [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
                "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
                "[&_hr]:my-8 [&_hr]:border-border",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
