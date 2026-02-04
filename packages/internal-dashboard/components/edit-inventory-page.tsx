"use client"
import { InventorySKU } from "@tbs/infra";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import EditInventoryAlertDialog from "@/components/edit-inventory-alert-dialog";
import {useActionState, useEffect} from "react";
import { updateSKUAction } from "@/app/(inventory)/updateSKUAction";

type EditInventoryPageProps = {sku: InventorySKU|undefined}

export default function EditInventoryPage({sku}: EditInventoryPageProps){

    const [formState, formAction] = useActionState(updateSKUAction, null);

    useEffect(() => {
        if (!formState) return;

        if (formState.isError)
            toast.error(formState.msg)
        else if (formState.isSuccess)
            toast.success(formState.msg)
        else
            toast.info(formState.msg)
    }, [formState]);


    if (sku) {
        /*
        * brand: string | null
          category: string | null
          category_id: number | null
          custom_sku: string | null             √
          default_cost: string | null
          ean: string | null
          id: number                            √
          item: string | null                   √
          manufact_sku: string | null
          price: string | null                  √
          publish_to_ecom: boolean | null
          qty: number | null
          season: string | null
          system_id: string | null              √
          tax: boolean | null                   √
          tax_class: string | null
          upc: string | null                    √
          vendor: string | null
          vendor_id: string | null
        * */

        return (<>
            <form id={`edit-sku-form`} action={formAction}>
            {/*<form>*/}
                <h1>Editing Product #{sku.id}: {sku.item}</h1>
                <div className="grid gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <div className="grid gap-3">
                            <Label htmlFor={`id`}>{`id`}</Label>
                            <Input id={`id`} name={`id`} defaultValue={sku.id} readOnly={true} />
                        </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Can&apos;t edit identifier fields</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="grid gap-3">
                                <Label htmlFor={`system_id`}>{`system_id`}</Label>
                                <Input id={`system_id`} name={`system_id`} defaultValue={sku.system_id ?? ""} disabled={true}/>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Can&apos;t edit identifier fields</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                    <div className="grid gap-3">
                        <Label htmlFor={`upc`}>{`upc`}</Label>
                        <Input id={`upc`} name={`upc`} defaultValue={sku.upc ?? ""} disabled={true}/>
                    </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Can&apos;t edit identifier fields</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="grid gap-3">
                        <Label htmlFor={`publish_to_ecom`}>{`publish_to_ecom`}</Label>
                        <Input id={`publish_to_ecom`} name={`publish_to_ecom`} type={`checkbox`} defaultChecked={!!sku.publish_to_ecom} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor={`qty`}>{`qty`}</Label>
                        <Input id={`qty`} name={`qty`} defaultValue={sku.qty ?? ""}/>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor={`item`}>{`item`}</Label>
                        <Input id={`item`} name={`item`} defaultValue={sku.item ?? ""}/>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor={`brand`}>{`brand`}</Label>
                        <Input id={`brand`} name={`brand`} defaultValue={sku.brand ?? ""}/>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor={`price`}>{`price`}</Label>
                        <Input id={`price`} name={`price`} defaultValue={sku.price ?? ""}/>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor={`tax`}>{`tax`}</Label>
                        <Input id={`tax`} name={`tax`} defaultChecked={!!sku.tax} type={`checkbox`}/>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor={`default_cost`}>{`default_cost`}</Label>
                        <Input id={`default_cost`} name={`default_cost`} defaultValue={sku.default_cost ?? ""} />
                    </div>


                </div>
                <EditInventoryAlertDialog formId={`edit-sku-form`}/>
            </form>
        </>)
    }
        return (
            <>
                <h1>Select a row</h1>
                <div className="grid gap-4">
                    <p>Select a row to edit a product</p>
                </div>
                <Button disabled>Save changes</Button>
            </>
        )

}