"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";

import { CheckIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Checkbox
 *
 * @description
 * The base checkbox primitive — a Radix checkbox with the token skin: brand fill
 * when checked, standard focus ring, and disabled state. All colors are theme
 * tokens; Radix keeps the checkbox semantics.
 *
 * @param className - Extra classes merged onto (and overriding) the base styles.
 */
export const Checkbox = forwardRef<
    ComponentRef<typeof CheckboxPrimitive.Root>,
    ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        data-slot="checkbox"
        className={cn(
            "size-4 shrink-0 rounded border border-input bg-transparent transition-colors",
            "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20",
            "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            "dark:data-[state=checked]:border-secondary dark:data-[state=checked]:bg-secondary dark:data-[state=checked]:text-secondary-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <CheckIcon className="size-3" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";
