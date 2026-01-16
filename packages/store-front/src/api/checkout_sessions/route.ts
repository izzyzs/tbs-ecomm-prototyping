import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

//
// class HTTPError extends Error {
//     constructor(
//         message: string,
//         public statusCode = 404
//     ) {
//         super(message);
//     }
// }
export async function POST() {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
        line_items: [
            {
            // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            price: '{{PRICE_ID}}',
            quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        });
        return NextResponse.redirect(session.url!, 303)
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
