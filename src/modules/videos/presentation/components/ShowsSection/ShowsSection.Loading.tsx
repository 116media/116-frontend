/**
 * ShowsSectionLoading
 *
 * @description
 * Skeleton placeholder for the shows section, shown while the client-side
 * request resolves. Mirrors the layout — a centred title placeholder, a row of
 * 4:5 card placeholders, and a centred button placeholder.
 */
export function ShowsSectionLoading() {
    return (
        <section className="flex flex-col gap-4">
            <div className="mx-auto h-8 w-72 max-w-[80%] rounded bg-muted-foreground/10" />

            <div className="flex gap-4 overflow-hidden px-1 py-4">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="aspect-4/5 w-[80%] shrink-0 animate-pulse rounded-2xl bg-muted sm:w-[48%] md:w-[34%] lg:w-[27%] xl:w-[22%]"
                    />
                ))}
            </div>

            <div className="mx-auto h-10 w-44 rounded-full bg-muted-foreground/10" />
        </section>
    );
}
