"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    type ComponentRef,
    type ForwardRefExoticComponent,
    forwardRef,
    type RefAttributes
} from "react";

import { DialogOverlay } from "@/shared/presentation/components/ui/Dialog";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SheetContentProps, SheetDetent, SheetVariant } from "./types";

/**
 * Opening height per detent. `dvh` follows the mobile browser's shrinking viewport, so a
 * sheet never hides its footer behind the address bar.
 */
const DETENT: Record<SheetDetent, string> = {
    fit: "max-h-[85dvh]",
    medium: "h-[60dvh] max-h-[85dvh]",
    large: "h-[92dvh] max-h-[92dvh]"
};

/**
 * Where the panel sits from `sm` up. A sheet keeps the bottom edge at every width; an
 * adaptive one becomes a centred dialog, trading the sheet keyframes for the dialog's so
 * it does not slide up on a pointer screen. Both are the same element, so a form inside
 * survives a resize.
 */
const VARIANT: Record<SheetVariant, string> = {
    sheet: "sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2",
    adaptive: [
        "sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:h-auto sm:max-h-[85dvh] sm:max-w-md",
        "sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border sm:border-outlined",
        "sm:data-[state=open]:animate-dialog-in sm:data-[state=closed]:animate-dialog-out"
    ].join(" ")
};

/**
 * Sheet.Content
 *
 * @description
 * The sheet panel: anchored to the bottom edge, rising over a dimmed overlay and
 * centred with a dialog's width from `sm` up, so one surface serves phones and larger
 * screens. Lays its children out in a column — a header and footer keep their place while
 * only `Sheet.Body` scrolls.
 *
 * @param detent - How tall the sheet opens.
 * @param variant - Sheet at every width, or a dialog from `sm` up.
 * @param showHandle - Whether to draw the drag handle.
 * @param className - Extra classes merged onto the panel.
 * @param children - The sheet's regions.
 */
export const SheetContent = forwardRef<
    ComponentRef<typeof DialogPrimitive.Content>,
    SheetContentProps
>(({ className, children, variant, detent = "medium", showHandle = true, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed inset-x-0 bottom-0 z-50 flex w-full flex-col overflow-hidden rounded-t-2xl bg-dialog text-dialog-foreground shadow-[0_-8px_32px_rgba(0,0,0,0.28)] focus:outline-none",
                "data-[state=open]:animate-sheet-in-bottom data-[state=closed]:animate-sheet-out-bottom",
                "sm:inset-x-auto sm:w-full",
                DETENT[detent],
                VARIANT[variant],
                className
            )}
            {...props}
        >
            {showHandle && (
                <span
                    aria-hidden
                    className={cn(
                        "mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/40",
                        variant === "adaptive" && "sm:hidden"
                    )}
                />
            )}
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
SheetContent.displayName = "Sheet.Content";

/**
 * The content props a bound presentation exposes: the variant is the binding's own, so a
 * call site never names one.
 */
type PresetContentProps = Omit<SheetContentProps, "variant">;

/**
 * withVariant
 *
 * @description
 * Binds one presentation to {@link SheetContent}, so the namespace a call site imports
 * carries the choice and reads as the surface it renders.
 *
 * @param variant - The presentation to bind.
 * @param name - Display name for the bound component.
 * @returns The content component for that presentation.
 */
function withVariant(
    variant: SheetVariant,
    name: string
): ForwardRefExoticComponent<
    PresetContentProps & RefAttributes<ComponentRef<typeof SheetContent>>
> {
    const Content = forwardRef<ComponentRef<typeof SheetContent>, PresetContentProps>(
        (props, ref) => (
            <SheetContent
                ref={ref}
                variant={variant}
                {...props}
            />
        )
    );
    Content.displayName = name;
    return Content;
}

/**
 * The bottom-docked presentation, at every width.
 */
export const DockedSheetContent = withVariant("sheet", "Sheet.Content");

/**
 * The sheet-on-phone, dialog-from-`sm` presentation.
 */
export const AdaptiveDialogContent = withVariant("adaptive", "AdaptiveDialog.Content");
