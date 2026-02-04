"use client"
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react";
import { Button } from "@/components/my-button";
import { useSearchParams } from "next/navigation"
import { formatCurrency } from "@/utils/helper-functions";
import { HandleCheckoutBodyType } from "@/lib/types";


type Fulfillment = "pickup" | "delivery"
export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const canceled = searchParams.get('canceled');

    if (canceled) {
        console.log(
            "Order canceled -- continue to shop around and checkout when you're ready."
        )
    }

    const { cartItems, subtotal } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [fulfillment, setFulfillment] = useState<Fulfillment>('pickup');

    // when delivery calculated
    // const calculateDeliveryFee = (formData: FormData) => {}

    const handleCheckout = async () => {
        if (!user) {
            throw new Error("Create an account to check out.");
        }
        const bodyObject: HandleCheckoutBodyType = { cartItems, email: user.email, customer_id: user.id }
        const url = '/api/checkout_sessions'
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(bodyObject),
        })
        console.log(res);
        const resJson = await res.json()
        if (res.status === 303) {
            console.log('Redirected to cart')
            const newUrl = resJson.url
            console.log(`parsed url: ${newUrl}`)
            router.push(`${newUrl}`);
        } else {
            console.error(resJson.error);
        }
    }

    return (
        <main>
            <div className={`m-5`}>
                <h1 className={'text-4xl pb-3'}>Line Items</h1>
                <ul className={'flex flex-col'}>
                    {cartItems.map((item, idx) => (
                        <li key={idx} className={'p-3 border-b-2 rounded-2xl mb-4'}>
                            <Field className={`flex flex-row`}>
                                <div className={`flex-1 w-10 h-40 bg-pink-300`}>

                                </div>
                                <div className={`flex-3 flex flex-col justify-around`}>
                                    <p className={'mx-1 text-lg'}>{item.name}</p>
                                    <p className={'mx-1'}>
                                        <span>{item.quantity} @ </span>
                                        <span>{formatCurrency(item.price)} each</span>
                                    </p>
                                    <p className={`text-lg`}>{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </Field>
                        </li>
                    ))}
                    <li className={'p-3 border-b-2 rounded-2xl mb-4 mx-10 bg-pink-50'}>
                        <Field className={`flex flex-row`}>
                            <div>
                                <span className={`text-2xl pb-2 pr-3`}>Subtotal:</span>
                                <span className={`text-xl`}>{formatCurrency(subtotal())}</span>
                            </div>
                        </Field>
                    </li>
                </ul>
            </div>
            <div className={`m-5`}>
                <h1 className={'text-4xl pb-3'}>Pick Method of Fullfilment</h1>
                <RadioGroup className="max-w-sm" defaultValue={`pickup`} onValueChange={(value) => setFulfillment(value as Fulfillment)}>
                    <FieldLabel htmlFor="pickup">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Pick Up</FieldTitle>
                                <FieldDescription>Pick up your order during our opening hours.</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="pickup" id="pickup"/>
                        </Field>
                    </FieldLabel>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <FieldLabel htmlFor="delivery" >
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldTitle>Delivery</FieldTitle>
                                            {/*We'll deliver directly to you, if possible, or send it in the mail.*/}
                                        <FieldDescription>
                                            Coming Soon!
                                        </FieldDescription>
                                    </FieldContent>
                                    <RadioGroupItem value="delivery" id="delivery" disabled={true} />
                                </Field>
                            </FieldLabel>
                        </TooltipTrigger>
                        <TooltipContent side={`bottom`}>
                            <p>Not yet available, coming soon!</p>
                        </TooltipContent>
                    </Tooltip>
                </RadioGroup>
            </div>
            {
                fulfillment === "delivery"
                    ? (<div className={`m-5`}>
                        <h1 className={'text-4xl pb-3'}>Enter your Address</h1>
                        <form action="">
                            <Label htmlFor={`address`}>address</Label>
                            <Input name={`address`}></Input>

                            <Label htmlFor={`city`}>city</Label>
                            <Input name={`city`}></Input>

                            <Label htmlFor={`state`}>state</Label>
                            <Input name={`state`}></Input>
                        </form>
                    </div>)
                    : fulfillment === "pickup"
                        ? (<div className={`m-5`}>
                            <Button className={'w-max'} onClick={handleCheckout}>Checkout</Button>
                           </div>)
                        : null
            }

        </main>
    )
}