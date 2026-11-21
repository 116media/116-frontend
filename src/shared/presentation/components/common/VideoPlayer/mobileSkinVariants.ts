/**
 * The touch target every control in the phone skin fills, at the platform minimum rather
 * than the pointer-sized one the desktop skin is built for. Shared by the parts that draw
 * controls, so the scale is declared once.
 */
export const MOBILE_CONTROL_TARGET =
    "grid size-11 shrink-0 place-items-center rounded-full text-white";

/**
 * How the transport sits in each band: the pinned one carries its scrub line on the very
 * bottom edge, where a docked player puts it, while the inline one keeps it inset above
 * the control row and needs the taller hit area a thumb wants.
 */
export const MOBILE_SCRUBBER_HEIGHT = { pinned: "h-1", inline: "h-5" } as const;
