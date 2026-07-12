import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * UserAccountControlLoading
 *
 * @description
 * Loading placeholder that fills the reserved slot: a button-shaped bar in the
 * login button's place plus an avatar circle in the avatar's place.
 */
export function UserAccountControlLoading() {
    return (
        <div className="flex w-full items-center justify-end gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="size-8 shrink-0 rounded-full ring-2 ring-foreground/25" />
        </div>
    );
}
