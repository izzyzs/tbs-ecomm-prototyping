export default function Loading() {
    // Simple skeleton for product detail page
    return (
        <section className="py-16 px-6 bg-pink-50 animate-pulse">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80 bg-gray-200 rounded-lg" />
                <div className="flex flex-col justify-center space-y-4">
                    <div className="h-8 bg-gray-200 w-3/4 rounded" />
                    <div className="h-5 bg-gray-200 w-1/2 rounded" />
                    <div className="h-4 bg-gray-200 w-full rounded" />
                    <div className="h-6 bg-gray-200 w-1/3 rounded" />
                    <div className="h-10 bg-gray-200 w-1/4 rounded" />
                </div>
            </div>
        </section>
    );
}
