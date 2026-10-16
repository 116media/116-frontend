/**
 * The horizontal page gutter, owned in one place so every surface that draws a page
 * edge lands on the same line: the header, the page body, and both mega menus. Surface
 * Pro 10 runs roughly three times the standard gutter at either orientation; its two
 * variants are declared in `styles/theme.css`, which carries the viewports that
 * identify the device.
 */
export const PAGE_GUTTER =
    "px-3 sm:px-6 lg:px-8 surface-pro-portrait:px-18 surface-pro-landscape:px-24";

/**
 * Share of the viewport the mobile mega menu covers on a tablet. A phone gets the whole
 * screen; a tablet has room to keep the page behind the sheet visible.
 */
export const MOBILE_MENU_TABLET_WIDTH = "md:right-auto md:w-4/5 md:max-w-[52rem] md:border-r";
