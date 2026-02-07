import { stripe } from "@/lib/stripe";
import { SupabaseOrderRepository } from "@tbs/infra";
import {Money, Order, OrderItemPrototype, OrderPrototype, Quantity, SKU, StripeCheckoutId, UserId} from "@tbs/core";
import { Temporal } from "@js-temporal/polyfill";
import Stripe from "stripe";
import {createClient} from "@/lib/supabase/server";

async function fulfillCheckout(sessionId: string, supabaseOrderRepository: SupabaseOrderRepository): Promise<Order | undefined> {
    console.log(`Fulfilling checkout session: ${sessionId}`);

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items.data.price.product"]
    });

    if (checkoutSession) {
        // console.log(checkoutSession.metadata?.customer_id);
        // console.log("created time:", checkoutSession.created);
        // console.log(created.toString());
        console.log(JSON.stringify(checkoutSession, null, 2));
        const stripeOrderId = checkoutSession.id;
        const items = checkoutSession.line_items?.data.map((lineItem): OrderItemPrototype => {
            const price = lineItem.price
            const product = price?.product as Stripe.Product
            return { productName: lineItem.description!!, sku: new SKU(product.metadata.sku), unitPrice: new Money(price?.unit_amount!!), quantity: new Quantity(lineItem.quantity!) };
        }) ?? []
        console.log(items);
        const created = Temporal.Instant.fromEpochMilliseconds(+(checkoutSession.created + "000"));

        const prototype: OrderPrototype = {
            userId: new UserId(checkoutSession.metadata?.customer_id!),
            paidAt: created,
            stripeId: new StripeCheckoutId(stripeOrderId),
            orderItemPrototypeList: items
        }

        const order = await supabaseOrderRepository.createOrder(prototype);
        return order;
    }

}


export async function POST(request: Request) {
    const supabase = await createClient();
    const supabaseOrderRepository = new SupabaseOrderRepository(supabase);
    const event = await request.json();
    // console.log("type", event.type);
    // console.log(event);

    // const event = stripe.webhooks.constructEvent(request.body as unknown as Buffer<ArrayBufferLike>, sig, endpointSecret);
    // console.log("event", event);
    //
    if (event.type === "checkout.session.completed") {
        console.log("\n\n\nevent:", event, "\n\n");
        const order = await fulfillCheckout(event.data.object.id, supabaseOrderRepository);
        console.log(JSON.stringify(order));
        return new Response(JSON.stringify(order));
    }

    return new Response();
}
