"use client";

import type { ComponentProps, ReactNode } from "react";
import {
    DialogCloseButton,
    DialogDescription,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { AdaptiveDialog } from "@/shared/presentation/components/ui/Sheet";
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
 * @property {string} [closeLabel] - Accessible label for the close control.
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
    closeLabel?: string;
    describedById?: string;
}

/**
 * ModalForm
 *
 * @description
 * Shared chrome for every form-bearing modal: header with title and close button,
 * a form body, and a footer of actions, wrapped in one `<form>` so a footer submit
 * button drives `onSubmit`. Controlled via `open`/`onOpenChange`. The panel is a bottom
 * sheet on phones and the same centred dialog as before from `sm` up, so a field keeps
 * its place above the keyboard without the form changing shape.
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
    closeLabel = "Close",
    describedById
}: ModalFormProps) {
    return (
        <AdaptiveDialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <AdaptiveDialog.Content
                detent="fit"
                aria-describedby={subtitle ? undefined : describedById}
                className={cn("bg-dialog sm:shadow-xl", className)}
            >
                <DialogCloseButton
                    label={closeLabel}
                    className="absolute top-5 right-6 z-10"
                />

                <form
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <header className="flex shrink-0 items-start border-b py-4 pr-12 pl-6">
                        <div className="grid min-w-0 gap-1">
                            <DialogTitle>{header}</DialogTitle>
                            {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
                        </div>
                    </header>

                    <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto overscroll-contain px-6 py-8">
                        {children}
                    </div>

                    <footer className="flex shrink-0 items-center justify-between gap-3 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {footer}
                    </footer>
                </form>
            </AdaptiveDialog.Content>
        </AdaptiveDialog.Root>
    );
}
