export default function Loading() {
    return (
        <div className="border rounded-lg p-4 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 w-full bg-gray-100 mb-4 rounded" />
            <div className="h-4 bg-gray-200 w-full rounded" />
            <h3 className="font-semibold text-center mb-1">name</h3>
            <p className="text-sm text-gray-600 text-center">price</p>
            <div className="mt-2">See More</div>
            <div className="mt-2">Add to Cart</div>
        </div>
    );
}
