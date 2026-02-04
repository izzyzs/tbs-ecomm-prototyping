import { stripe } from "@/lib/stripe";

async function fulfillCheckout(sessionId: string): Promise<void> {
    console.log(`Fulfilling checkout session: ${sessionId}`);

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
    });

    if (checkoutSession) {
        console.log(JSON.stringify(checkoutSession, null, 2));
    }
}

const endpointSecret = "whsec_54d8258727fade7ec44eaf4280c237f7f859492f26973fae884044ca06c7df64"

export async function POST(request: Request) {
    const sig = request.headers.get("stripe-signature") ?? "";
    const event = stripe.webhooks.constructEvent(await request.json(), sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
        fulfillCheckout(event.data.object.id);
    }

    return new Response('hey!');

    // console.log("POST request", await request.json());
}
