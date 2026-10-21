import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows the built-in `text-xs`…`text-9xl` scale, so it classifies the
 * custom `text-field` size as a text color and lets any `text-*` color delete it.
 * Registering it as a font size keeps the two on separate conflict groups.
 */
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [{ text: ["field"] }]
        }
    }
});

/**
 * Merges Tailwind CSS class names, resolving conflicting utility classes.
 *
 * @param inputs - Class names, arrays, or conditional objects
 * @returns Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
