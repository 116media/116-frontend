"use client";

import type { ReactNode } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";

/**
 * Props for {@link ConfirmDialog}.
 *
 * @interface ConfirmDialogProps
 * @property {boolean} open - Whether the dialog is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/cancel).
 * @property {string} title - The accessible title / headline.
 * @property {ReactNode} [description] - Supporting text under the title.
 * @property {string} confirmLabel - Label for the confirm action.
 * @property {string} cancelLabel - Label for the cancel action.
 * @property {() => void} onConfirm - Runs when the user confirms.
 * @property {boolean} [loading] - Disables both actions while the confirm action is in flight.
 * @property {boolean} [destructive] - Renders the confirm button in the destructive style.
 */
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    loading?: boolean;
    destructive?: boolean;
}

/**
 * ConfirmDialog
 *
 * @description
 * A small, themed yes/no dialog for confirming an action (e.g. signing out). Supplies
 * its own `bg-card` panel chrome (the generic `DialogContent` is a bare shell) plus a
 * centered title/description and a cancel + confirm button row. Controlled via `open`.
 *
 * @param props - See {@link ConfirmDialogProps}.
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    loading = false,
    destructive = false
}: ConfirmDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent {...(description ? {} : { "aria-describedby": undefined })}>
                <div className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-xl">
                    <div className="grid gap-1.5 text-center">
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            disabled={loading}
                            onClick={() => onOpenChange(false)}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            type="button"
                            className="flex-1"
                            disabled={loading}
                            onClick={onConfirm}
                            variant={destructive ? "destructive" : "default"}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
