"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ArticlesMobileMenu } from "@/modules/articles/presentation/components/navigation/ArticlesMobileMenu";
import { VideosMobileMenu } from "@/modules/videos/presentation/components/navigation/VideosMobileMenu";
import { Button } from "@/shared/presentation/components/ui/Button";
import { MenuIcon } from "@/shared/presentation/components/ui/Icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/presentation/components/ui/Tabs";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { MOBILE_MENU_TABS, SWIPE_CLOSE_THRESHOLD } from "./constants";
import { MobileMegaMenuArtists } from "./MobileMegaMenu.Artists";
import { MobileMegaMenuFooter } from "./MobileMegaMenu.Footer";
import { MobileMegaMenuHeader } from "./MobileMegaMenu.Header";
import { MobileMegaMenuLyrics } from "./MobileMegaMenu.Lyrics";
import type { MobileMegaMenuProps } from "./types";

/**
 * MobileMegaMenu
 *
 * @description
 * The mega menu below `md`: a full-screen panel sliding in from the left, with the
 * four nav sections on the shared Tabs primitive. Owns the open state and the drag
 * offset; the per-section panels come from each content module.
 */
export function MobileMegaMenu({ articles, videos }: MobileMegaMenuProps) {
    const { t } = useTranslation();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [dragX, setDragX] = useState(0);
    const startX = useRef<number | null>(null);
    const openedAt = useRef(pathname);

    const close = () => setIsOpen(false);

    // A navigation the link handlers miss would otherwise leave the panel open
    // over the destination, since the client router does not unmount the dialog.
    useEffect(() => {
        if (openedAt.current === pathname) return;
        openedAt.current = pathname;
        setIsOpen(false);
    }, [pathname]);

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") return;
        startX.current = event.clientX;
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (startX.current === null) return;
        setDragX(Math.min(0, event.clientX - startX.current));
    };

    const onPointerUp = () => {
        if (dragX < -SWIPE_CLOSE_THRESHOLD) close();
        startX.current = null;
        setDragX(0);
    };

    return (
        <DialogPrimitive.Root
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogPrimitive.Trigger asChild>
                <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={t("navigation.mobileMenu.open")}
                    className="size-10 text-muted-foreground hover:text-foreground [&_svg]:size-5 lg:hidden"
                >
                    <MenuIcon />
                </Button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden",
                        "data-[state=open]:animate-dialog-overlay-in",
                        "data-[state=closed]:animate-dialog-overlay-out"
                    )}
                />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    onPointerUp={onPointerUp}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerCancel={onPointerUp}
                    style={dragX === 0 ? undefined : { transform: `translateX(${dragX}px)` }}
                    className={cn(
                        "fixed inset-0 z-50 flex flex-col bg-background lg:hidden",
                        dragX === 0 && "data-[state=open]:animate-sheet-in-left",
                        "data-[state=closed]:animate-sheet-out-left"
                    )}
                >
                    <DialogPrimitive.Title className="sr-only">
                        {t("navigation.mobileMenu.title")}
                    </DialogPrimitive.Title>

                    <MobileMegaMenuHeader />

                    <Tabs
                        defaultValue={MOBILE_MENU_TABS[0].value}
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="px-3 pb-3">
                            <TabsList
                                className="flex w-full"
                                aria-label={t("navigation.mobileMenu.sections")}
                            >
                                {MOBILE_MENU_TABS.map(({ value, label }) => (
                                    <TabsTrigger
                                        key={value}
                                        value={value}
                                        className="min-h-8 flex-1 font-bold uppercase tracking-wide"
                                    >
                                        {t(label)}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <TabsContent value="news">
                                <ArticlesMobileMenu
                                    {...articles}
                                    onNavigate={close}
                                />
                            </TabsContent>

                            <TabsContent value="videos">
                                <VideosMobileMenu
                                    {...videos}
                                    onNavigate={close}
                                />
                            </TabsContent>

                            <TabsContent value="artistes">
                                <MobileMegaMenuArtists onNavigate={close} />
                            </TabsContent>

                            <TabsContent value="lyrics">
                                <MobileMegaMenuLyrics onNavigate={close} />
                            </TabsContent>
                        </div>
                    </Tabs>

                    <MobileMegaMenuFooter onNavigate={close} />
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
