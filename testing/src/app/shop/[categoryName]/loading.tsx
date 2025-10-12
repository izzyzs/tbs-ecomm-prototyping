export default function Loading() {
    return (
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-6 mx-auto pt-4 sm:p-8 rounded-sm sm:py-11 sm:px-12">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-40 w-full bg-gray-100 mb-4 rounded" />
                    <div className="h-4 mt-1 bg-gray-200 w-full rounded" />
                    <div className="h-4 mt-2 bg-gray-200 w-[50%] rounded" />

                    <div className="h-4 mt-3 bg-gray-200 w-[20%] rounded" />
                    <div className="mt-2 h-7 bg-gray-300 w-[50%] rounded" />
                    <div className="mt-2 h-7 bg-gray-300 w-[55%] rounded" />
                </div>
            ))}
        </main>
    );
}
