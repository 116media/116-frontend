"use client";

import { useRouter } from "@bprogress/next/app";

/**
 * useProgressRouter
 *
 * @description
 * App Router navigation that also drives the top progress bar. BProgress only watches
 * anchor clicks, so `next/navigation`'s own `useRouter` reaches another page with no bar
 * at all. Use this wherever code navigates to a different page; keep `next/navigation`
 * for `replace` calls that only write query state back to the current page.
 *
 * @returns The router instance, with the same API as `next/navigation`'s.
 */
export function useProgressRouter() {
    return useRouter();
}
