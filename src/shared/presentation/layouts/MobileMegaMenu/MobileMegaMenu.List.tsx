"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { MobileMegaMenuListProps } from "./types";

/**
 * MobileMegaMenu.List
 *
 * @description
 * The thumbnail-and-text row list used by the "most read", "trending" and "top
 * lyrics" blocks: a 16:10 (or square) thumbnail beside a two-line label, with an
 * optional rank ahead of it.
 */
export function MobileMegaMenuList({ items, square = false, onNavigate }: MobileMegaMenuListProps) {
    return (
        <div className="flex flex-col">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center gap-3 border-outlined/50 border-b py-3 last:border-b-0"
                >
                    {item.rank !== undefined && (
                        <span className="w-5 shrink-0 text-center font-bold text-muted-foreground text-sm tabular-nums">
                            {item.rank}
                        </span>
                    )}

                    <span
                        className={cn(
                            "relative shrink-0 overflow-hidden rounded-md bg-muted",
                            square ? "size-14" : "h-14 w-24"
                        )}
                    >
                        {item.imageUrl && (
                            <Image
                                fill
                                alt=""
                                sizes="96px"
                                src={item.imageUrl}
                                className="object-cover"
                            />
                        )}
                    </span>

                    <span className="flex min-w-0 flex-col gap-1">
                        <span className="line-clamp-2 font-semibold text-foreground text-sm">
                            {item.title}
                        </span>
                        <span className="truncate text-muted-foreground text-xs">{item.meta}</span>
                    </span>
                </Link>
            ))}
        </div>
    );
}
