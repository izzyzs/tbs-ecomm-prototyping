export default function Loading() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-rose-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,245,247,0.92)_100%)] shadow-[0_24px_80px_-36px_rgba(190,24,93,0.4)]">
                <div className="border-b border-rose-200/70 bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.5),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,241,242,0.94))] px-5 py-6 sm:px-8 sm:py-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <div className="h-9 w-28 animate-pulse rounded-full bg-white/85" />
                        <div className="h-4 w-4 animate-pulse rounded-full bg-rose-200/80" />
                        <div className="h-9 w-32 animate-pulse rounded-full bg-white/75" />
                        <div className="h-4 w-4 animate-pulse rounded-full bg-rose-200/80" />
                        <div className="h-9 w-36 animate-pulse rounded-full bg-white/65" />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-3xl">
                            <div className="h-3 w-28 animate-pulse rounded-full bg-rose-200/80" />
                            <div className="mt-4 h-10 w-64 max-w-full animate-pulse rounded-full bg-slate-200/80 sm:w-80" />
                            <div className="mt-4 space-y-2">
                                <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-slate-200/70" />
                                <div className="h-4 w-4/5 max-w-xl animate-pulse rounded-full bg-slate-200/60" />
                            </div>
                        </div>

                        <div className="h-11 w-28 animate-pulse rounded-full border border-rose-200 bg-white/80" />
                    </div>
                </div>

                <div className="px-4 py-5 sm:px-6 sm:py-7">
                    <main className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {Array.from({ length: 15 }, (_, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.55)]"
                            >
                                <div className="h-40 w-full animate-pulse rounded-xl bg-slate-100" />

                                <div className="mt-4 space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded-full bg-slate-200/80" />
                                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200/70" />
                                    <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-200/60" />
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div className="h-9 w-full animate-pulse rounded-full bg-slate-200/80" />
                                    <div className="h-9 w-full animate-pulse rounded-full bg-rose-100/90" />
                                </div>
                            </div>
                        ))}
                    </main>
                </div>
            </div>
        </section>
    );
}
