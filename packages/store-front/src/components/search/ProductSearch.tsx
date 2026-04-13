"use client";
import React, { useState } from "react";
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
            <div className="sticky top-[72px] z-30 px-4 pt-4 sm:top-[88px] sm:px-6 lg:px-8">
                <div className="tbs-panel mx-auto flex w-full max-w-4xl items-center gap-2 p-3">
                    <Form action="" className="flex w-full gap-2">
                        <Input type="text" placeholder="Search for products..." name="query" disabled className="h-11 rounded-full bg-white/90" />
                        {/* TODO: press enter key to search functionality*/}
                        <Button type="submit" className="h-11 w-11 px-0" disabled>
                            <Search />
                        </Button>
                    </Form>
                </div>
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

    return (
        <>
            <div className="sticky top-[72px] z-30 px-4 pt-4 sm:top-[88px] sm:px-6 lg:px-8">
                <div className="tbs-panel mx-auto flex w-full max-w-5xl flex-col gap-3 p-3 sm:flex-row sm:items-center">
                    <Form action="" className="flex w-full gap-2">
                        <Input type="text" placeholder="Search for products..." name="query" defaultValue={query ?? ""} className="h-11 rounded-full bg-white/90" />
                        {/* TODO: press enter key to search functionality*/}
                        <Button type="submit" className="h-11 w-11 px-0" onClick={() => setShowResults(true)}>
                            <Search />
                        </Button>
                    </Form>
                    {state && (search || (query ?? "").trim() !== "" && state.inventory.length > 0) ? (
                        <Button
                            className="w-full sm:w-auto"
                            variant="outline"
                            onClick={() => {
                                setShowResults((prev) => !prev);
                                setSearch((prev) => !prev);
                            }}
                        >
                            {search ? "Show Categories" : "Show Results"}
                        </Button>
                    ) : null}
                    {state ? <p className="whitespace-nowrap text-sm font-medium text-[rgba(63,22,60,0.68)]">{state.inventory.length.toString() + " " + (state.inventory.length != 1 ? `Results` : `Result`)}</p> : null}
                </div>
            </div>
            <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
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
                                  <div
                                      key={idx}
                                      className="border-b border-[var(--tbs-border-strong)] py-4 text-[var(--tbs-plum)] transition-colors last:border-b-0 hover:text-[var(--tbs-pink-deep)]"
                                  >
                                      <Link href={`/product/${sku.id}`} className="block">
                                          {sku.brand ? <p>{`${sku.brand} ${sku.item}`}</p> : <p>{sku.item}</p>}
                                      </Link>
                                  </div>
                              );
                          })
                    : ""}
            </div>
        </>
    );
}
