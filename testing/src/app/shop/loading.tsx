import ProductSearch from "@/components/search/ProductSearch";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <>
            <ProductSearch />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-6 mx-auto pt-4 sm:p-8 rounded-sm sm:py-11 sm:px-12  bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50">
                {Array.from({ length: 21 }, (_, idx) => (
                    <div key={idx} className={"text-center sm:py-10 hover:sm:py-20 hover:transition-all relative hover:decoration-solid"}>
                        <div className="py-10 hover:py-20 hover:h-[50vh]" />

                        <div className="absolute inset-0 bg-black/50 sm:bg-none sm:hover:bg-pink-900/50 hover:transition-all" />
                        <LoaderCircle className="mx-auto animate-spin text-gray-100 text-6xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white  text-center drop-shadow-lg font-vbold text-xl sm:text-3xl pointer-events-none">
                            {`${categoryName}`}
                        </div> */}
                        {/* </div> */}
                    </div>
                ))}
            </div>
        </>
    );
}
