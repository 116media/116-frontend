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
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

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
 * Shared chrome for every form-bearing modal: header with title and close button,
 * a form body, and a footer of actions, wrapped in one `<form>` so a footer submit
 * button drives `onSubmit`. Controlled via `open`/`onOpenChange`.
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
                        "relative flex max-h-[85vh] flex-col rounded-2xl border bg-dialog shadow-xl",
                        className
                    )}
                >
                    <header className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-4">
                        <div className="grid min-w-0 gap-1">
                            <DialogTitle>{header}</DialogTitle>
                            {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
                        </div>
                        <DialogClose
                            type="button"
                            aria-label={header}
                            className="mt-0.5 shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <XIcon className="size-5" />
                        </DialogClose>
                    </header>

                    <div className="grid gap-5 px-6 py-8">{children}</div>

                    <footer className="flex shrink-0 items-center justify-between gap-3 border-t px-6 py-4">
                        {footer}
                    </footer>
                </form>
            </DialogContent>
        </Dialog>
    );
}
