"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error.message || "Unexpected error while loading product."}</p>
            <button onClick={() => reset()} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
                Try again
            </button>
        </div>
    );
}
