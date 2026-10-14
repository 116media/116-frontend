"use client";

import { Tag } from "@/shared/presentation/components/ui/Tag";

import type { MobileMegaMenuChipsProps } from "./types";

/**
 * MobileMegaMenu.Chips
 *
 * @description
 * A wrapped row of filter chips, used by the genre blocks. Unlike the tag cloud
 * these carry no `#` prefix, matching the artboard.
 */
export function MobileMegaMenuChips({ items, onNavigate }: MobileMegaMenuChipsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => (
                <Tag
                    size="lg"
                    key={item.id}
                    shape="pill"
                    href={item.href}
                    variant="default"
                    onClick={onNavigate}
                    className="min-h-11 px-3"
                >
                    {item.label}
                </Tag>
            ))}
        </div>
    );
}
