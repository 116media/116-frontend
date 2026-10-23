import { Close, Root, Trigger } from "@radix-ui/react-dialog";

import { SheetBody } from "./Sheet.Body";
import { AdaptiveDialogContent, DockedSheetContent } from "./Sheet.Content";
import { SheetFooter } from "./Sheet.Footer";
import { SheetHeader } from "./Sheet.Header";

/**
 * Sheet
 *
 * @description
 * A panel docked to the bottom edge at every width, for surfaces a thumb drives such as
 * the comment thread or a filter list. `.Root` owns the open state; `.Header` / `.Body` /
 * `.Footer` are its regions, and only the body scrolls.
 */
export const Sheet = {
    Root,
    Trigger,
    Close,
    Content: DockedSheetContent,
    Header: SheetHeader,
    Body: SheetBody,
    Footer: SheetFooter
} as const;

/**
 * AdaptiveDialog
 *
 * @description
 * The same panel as a sheet on phones and a centred dialog from `sm` up, for surfaces that
 * belong to both: the auth flow, form modals, share, rating. One element at every width, so
 * a half-filled form survives a resize.
 */
export const AdaptiveDialog = {
    Root,
    Trigger,
    Close,
    Content: AdaptiveDialogContent,
    Header: SheetHeader,
    Body: SheetBody,
    Footer: SheetFooter
} as const;

export type {
    SheetContentProps,
    SheetDetent,
    SheetHeaderProps,
    SheetRegionProps,
    SheetVariant
} from "./types";
