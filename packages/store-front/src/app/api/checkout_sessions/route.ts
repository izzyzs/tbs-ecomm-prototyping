import {NextRequest, NextResponse} from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import {CartItemState} from "@tbs/view-models";
import {HandleCheckoutBodyType} from "@/lib/types";
import {ProductId} from "@tbs/core";

//
// class HTTPError extends Error {
//     constructor(
//         message: string,
//         public statusCode = 404
//     ) {
//         super(message);
//     }
// }
type ProductData =  { name: string, metadata: { [key: string]: string } };
type PriceData = {currency: string, product_data: ProductData, unit_amount: number };
type LineItem = { price_data: PriceData, quantity: number };

const cartItemStateToLineItemMapper
    = (cartItem: CartItemState): LineItem => {
    return {
        price_data: {
            currency: 'usd',
            product_data: {
                name: cartItem.name,
                metadata: {
                    sku: cartItem.sku
                },
            },
            unit_amount: cartItem.price * 100,
        },
        quantity: cartItem.quantity,
    }
}

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')
        console.log("starting body parse");
        const { cartItems, email, customer_id } : HandleCheckoutBodyType = await request.json();
        const lineItems: LineItem[] = cartItems.map(
            (cartItem: CartItemState) => cartItemStateToLineItemMapper(cartItem)
        )
        console.log(lineItems);

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            // customer: customer_id,
            customer_email: email,
        });

        console.log("STRIPE_KEY starts with:", process.env.STRIPE_SECRET_KEY?.slice(0, 7))
        console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.slice(0, 7))
        console.log("SESSION:", session.id, session.url)


        return NextResponse.json({ url: session.url }, {status: 303})
        // return NextResponse.redirect(`${origin}/success`, 303)
    } catch (err: unknown) {
        const message =  err instanceof Error ? err.message : "Something went wrong";
        const status =
            typeof err === "object" &&
            err != null &&
            "statusCode" in err &&
            typeof (err as any) === "object" &&
            (err as any).statusCode === "number"
                ? (err as any).statusCode
                : 500;

        return NextResponse.json(
            {error: message},
            {status}
        )
    }
}
