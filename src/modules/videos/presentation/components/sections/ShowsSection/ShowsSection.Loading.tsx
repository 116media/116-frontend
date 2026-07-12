import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * ShowsSectionLoading
 *
 * @description
 * Skeleton placeholder for the shows section, shown while the client-side
 * request resolves. Mirrors the section layout, built from the shared Skeleton
 * primitive so the shimmer idiom stays consistent.
 */
export function ShowsSectionLoading() {
    return (
        <section className="flex flex-col gap-4">
            <Skeleton className="mx-auto h-8 w-72 max-w-[80%]" />

            <div className="flex gap-4 overflow-hidden px-1 py-4">
                {[0, 1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        className="aspect-4/5 w-[80%] shrink-0 rounded-2xl sm:w-[48%] md:w-[34%] lg:w-[27%] xl:w-[22%]"
                    />
                ))}
            </div>

            <Skeleton className="mx-auto h-10 w-44 rounded-full" />
        </section>
    );
}
