"use client";
import React, { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/my-button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Form from "next/form";
import { searchProducts } from "@/app/(cart)/actions";
import { SearchResponse } from "@tbs/infra";

// { searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
export default function ProductSearch({ search, setSearch }: { search?: boolean; setSearch?: React.Dispatch<React.SetStateAction<boolean>> }) {
    if (!setSearch) {
        return (
            <div className="flex w-full py-6 px-5 sm:max-w-md items-center gap-2 sticky top-0 bg-white sm:mx-auto">
                <Form action="" className="flex gap-2 w-full">
                    <Input type="text" placeholder="Search for products..." name="query" disabled />
                    {/* TODO: press enter key to search functionality*/}
                    <Button type="submit" className="bg-pink-500 hover:bg-pink-900" onClick={() => setShowResults(true)}>
                        <Search />
                    </Button>
                </Form>
            </div>
        );
    }
    const [state, setState] = useState<SearchResponse | undefined>();

    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    // !query ? setSearch(false) : undefined;

    React.useEffect(() => {
        console.log("query", query);
        console.log("state:", state);
    }, [state]);

    React.useEffect(() => {
        const getProducts = async () => {
            if (query === null) {
                return;
            }
            setSearch(true);
            setState(await searchProducts(query));
        };
        getProducts();
    }, [searchParams]);

    const [showResults, setShowResults] = React.useState<boolean>(true);

    const returnIsError = (msg: string) => {
        setSearch(false);
        return <p className="text-red-600">{msg}</p>;
    };

    return (
        //  justify-between px-4 py-4 bg-white shadow-md fixed bottom-0 sm:bottom-auto sm:sticky sm:top-0 sm:z-50
        <>
            <div className="flex w-full py-6 px-5 sm:max-w-md items-center gap-2 sticky top-0 bg-white sm:mx-auto">
                <Form action="" className="flex gap-2 w-full">
                    <Input type="text" placeholder="Search for products..." name="query" defaultValue={query ?? ""} />
                    {/* TODO: press enter key to search functionality*/}
                    <Button type="submit" className="bg-pink-500 hover:bg-pink-900" onClick={() => setShowResults(true)}>
                        <Search />
                    </Button>
                </Form>
                {state ? (
                    <Button
                        className="border-pink-500 text-pink-500 hover:text-pink-800 hover:bg-pink-50"
                        variant="outline"
                        onClick={() => {
                            setShowResults((prev) => !prev);
                            setSearch((prev) => !prev);
                        }}
                    >
                        {search ? "Show Categories" : query === "" || state.inventory.length == 0 ? "" : "Show Results"}
                    </Button>
                ) : (
                    <></>
                )}
                {state ? <p className="text-nowrap">{state.inventory.length.toString() + " " + (state.inventory.length != 1 ? `Results` : `Result`)}</p> : <></>}
            </div>
            <div className="flex flex-col p-8 sm:px-24">
                {state
                    ? state.isError
                        ? // ? returnIsError(state.msg)
                          (function (msg) {
                              setSearch(false);
                              return <p className="text-red-600">{msg}</p>;
                          })(state.msg)
                        : showResults &&
                          state.inventory.map((sku, idx) => {
                              return (
                                  <div key={idx} className="mx-auto w-[100%] border-b-2 border-pink-300 flex">
                                      {/* <div className="bg-amber-200 w-[20px] h-[20px]"> </div> */}
                                      <Link href={`/product/${sku.id}`} className="my-2 py-4 w-[100%] hover:text-pink-300">
                                          {sku.brand ? <p>brand{`${sku.brand} ${sku.item}`}</p> : <p>{sku.item}</p>}
                                      </Link>
                                  </div>
                              );
                          })
                    : ""}
            </div>
        </>
    );
}
