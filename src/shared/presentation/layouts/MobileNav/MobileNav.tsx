"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import { ChevronRightIcon, MenuIcon, SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { NAV_LINKS } from "@/shared/presentation/layouts/Header/constants";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * MobileNav
 *
 * @description
 * Primary navigation below `md`, where `DesktopNav` is hidden. Opens the same
 * `NAV_LINKS` as a sheet from the left; each link closes the sheet as it navigates.
 */
export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <DialogPrimitive.Root
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogPrimitive.Trigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Ouvrir le menu"
                    className="text-muted-foreground hover:text-foreground md:hidden"
                >
                    <MenuIcon />
                </Button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
                        "data-[state=open]:animate-dialog-overlay-in",
                        "data-[state=closed]:animate-dialog-overlay-out"
                    )}
                />
                <DialogPrimitive.Content
                    aria-label="Navigation principale"
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col",
                        "border-r border-border bg-background shadow-xl",
                        "data-[state=open]:animate-dialog-in",
                        "data-[state=closed]:animate-dialog-out"
                    )}
                >
                    <DialogPrimitive.Title className="border-b border-border px-5 py-4 text-sm font-semibold tracking-wide text-muted-foreground">
                        Navigation
                    </DialogPrimitive.Title>

                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                        {NAV_LINKS.map(({ label, href }) => {
                            const isActive = pathname === href || pathname.startsWith(`${href}/`);

                            return (
                                <DialogPrimitive.Close
                                    asChild
                                    key={href}
                                >
                                    <Link
                                        href={href}
                                        aria-current={isActive ? "page" : undefined}
                                        className={cn(
                                            "flex items-center justify-between rounded-md px-4 py-3 text-base font-medium transition-colors",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            isActive
                                                ? "bg-accent text-primary dark:text-secondary"
                                                : "text-foreground"
                                        )}
                                    >
                                        {label}
                                        <ChevronRightIcon
                                            size={16}
                                            aria-hidden="true"
                                            className="text-muted-foreground"
                                        />
                                    </Link>
                                </DialogPrimitive.Close>
                            );
                        })}
                    </nav>

                    <div className="border-t border-border p-3">
                        <Button
                            variant="outline"
                            aria-label="Rechercher"
                            className="w-full justify-start gap-2 text-muted-foreground"
                        >
                            <SearchIcon />
                            Rechercher
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
