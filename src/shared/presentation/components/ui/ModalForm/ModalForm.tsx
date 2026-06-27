"use client";

import type { ComponentProps, ReactNode } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { XIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the ModalForm component.
 *
 * @interface ModalFormProps
 * @property {boolean} open - Whether the modal is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} header - The header title / accessible headline.
 * @property {ReactNode} [subtitle] - Optional supporting text under the header.
 * @property {ComponentProps<"form">["onSubmit"]} onSubmit - Submit handler for the body form.
 * @property {ReactNode} children - The form body (fields, alerts).
 * @property {ReactNode} footer - The footer actions; laid out with space-between.
 * @property {string} [className] - Extra classes merged onto the panel.
 * @property {string} [describedById] - Id of the element describing the dialog, if any.
 */
export interface ModalFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    header: string;
    subtitle?: ReactNode;
    onSubmit: NonNullable<ComponentProps<"form">["onSubmit"]>;
    children: ReactNode;
    footer: ReactNode;
    className?: string;
    describedById?: string;
}

/**
 * ModalForm
 *
 * @description
 * The shared chrome for every form-bearing modal in the app, so they all share the same
 * layout: a header with the title and a close button separated from the body by a bottom
 * border, a body holding the fields, and a footer holding the actions separated by a top
 * border and laid out with space-between. Renders its own panel surface (`bg-dialog`,
 * border, radius, shadow) over the bare `DialogContent` shell and is controlled via
 * `open`. Consumers supply the field rows as `children` and the action buttons as
 * `footer`; the `<form>` wraps both so a footer submit button drives `onSubmit`. An
 * optional `subtitle` renders as the dialog's accessible description. The body is not
 * clipped, so an in-flow field popover (e.g. `CountrySelect`) can overlay the rows and
 * footer below it.
 *
 * @param open - Whether the modal is open.
 * @param onOpenChange - Open-state setter.
 * @param header - The header title.
 * @param subtitle - Optional supporting text under the header.
 * @param onSubmit - Submit handler for the body form.
 * @param children - The form body.
 * @param footer - The footer actions.
 * @param className - Extra classes merged onto the panel.
 * @param describedById - Id of the describing element, if any.
 */
export function ModalForm({
    open,
    onOpenChange,
    header,
    subtitle,
    onSubmit,
    children,
    footer,
    className,
    describedById
}: ModalFormProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={subtitle ? undefined : describedById}>
                <form
                    onSubmit={onSubmit}
                    className={cn(
                        "relative flex max-h-[85vh] flex-col rounded-2xl border border-border bg-dialog shadow-xl",
                        className
                    )}
                >
                    <header className="flex shrink-0 items-start justify-between gap-4 border-border border-b px-6 py-4">
                        <div className="grid min-w-0 gap-1">
                            <DialogTitle>{header}</DialogTitle>
                            {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
                        </div>
                        <DialogClose
                            type="button"
                            aria-label={header}
                            className="mt-0.5 shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent 
                            hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <XIcon className="size-5" />
                        </DialogClose>
                    </header>

                    <div className="grid gap-5 px-6 py-8">{children}</div>

                    <footer className="flex shrink-0 items-center justify-between gap-3 border-border border-t px-6 py-4">
                        {footer}
                    </footer>
                </form>
            </DialogContent>
        </Dialog>
    );
}
