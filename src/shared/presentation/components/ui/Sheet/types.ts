import type * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * How tall the sheet opens.
 *
 * `fit` hugs its content, for a short form or a confirmation. `medium` opens on roughly
 * half the viewport, `large` just under the top edge; both cap at the viewport so the
 * footer stays reachable.
 */
export type SheetDetent = "fit" | "medium" | "large";

/**
 * How the panel presents itself.
 *
 * `sheet` stays docked to the bottom edge at every width. `adaptive` is that sheet on a
 * phone and a centred dialog from `sm` up — the same element either way, so switching
 * widths never remounts the form it holds.
 */
export type SheetVariant = "sheet" | "adaptive";

/**
 * Props for Sheet.Content.
 *
 * @interface SheetContentProps
 * @augments ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
 * @property {SheetDetent} [detent] - How tall the sheet opens. Defaults to `medium`.
 * @property {SheetVariant} variant - Sheet at every width, or a dialog from `sm` up. Set by
 * the `Sheet` and `AdaptiveDialog` namespaces, not by call sites.
 * @property {boolean} [showHandle] - Renders the drag handle at the top edge. Defaults to true.
 */
export interface SheetContentProps
    extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    detent?: SheetDetent;
    variant: SheetVariant;
    showHandle?: boolean;
}

/**
 * Props for Sheet.Header.
 *
 * @interface SheetHeaderProps
 * @property {ReactNode} title - The sheet's title, announced as the dialog's accessible name.
 * @property {ReactNode} [description] - Supporting line under the title.
 * @property {ReactNode} [children] - Row under the title, e.g. tabs or a segmented control.
 * @property {ReactNode} [leading] - Control before the title, e.g. a back button on a
 * multi-step sheet.
 * @property {"start" | "center"} [align] - How the title block aligns. Defaults to `start`.
 * @property {boolean} [showCloseButton] - Renders the close control. Defaults to true.
 * @property {string} [closeLabel] - Accessible label for the close control.
 * @property {string} [className] - Extra classes merged onto the header.
 */
export interface SheetHeaderProps {
    title: ReactNode;
    leading?: ReactNode;
    children?: ReactNode;
    className?: string;
    closeLabel?: string;
    description?: ReactNode;
    showCloseButton?: boolean;
    align?: "start" | "center";
}

/**
 * Props for Sheet.Body and Sheet.Footer.
 *
 * @interface SheetRegionProps
 * @property {ReactNode} children - The region's content.
 * @property {string} [className] - Extra classes merged onto the region.
 */
export interface SheetRegionProps {
    children: ReactNode;
    className?: string;
}
