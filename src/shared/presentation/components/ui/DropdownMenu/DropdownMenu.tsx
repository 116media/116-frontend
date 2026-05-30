"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

/**
 * DropdownMenu
 *
 * @description
 * Root provider for the dropdown menu. Manages open/close state.
 * Wrap DropdownMenuTrigger and DropdownMenuContent inside this.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export { DropdownMenu, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuTrigger };
