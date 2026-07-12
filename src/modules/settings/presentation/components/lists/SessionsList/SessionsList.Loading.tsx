import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * SessionsList.Loading
 *
 * @description
 * Placeholder session rows shown while the sessions query resolves, matching the
 * session-card footprint so the swap causes no layout shift.
 */
export function SessionsListLoading() {
    return (
        <div className="flex flex-col gap-3">
            {[0, 1].map((row) => (
                <div
                    key={row}
                    className="flex items-center gap-3 rounded-md border p-3"
                >
                    <Skeleton className="size-10 shrink-0 rounded-md" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-2 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}
