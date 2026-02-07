import { redirect } from 'next/navigation'

import { stripe } from '@/lib/stripe'
import {formatCurrency} from "@/utils/helper-functions";
import {Button} from "@/components/my-button";
import OrdersButton from "@/components/account/OrdersButton";

export default async function Success({ searchParams }: { searchParams?: Promise<{ session_id?: string; [key: string]: string | string[] | undefined }>}) {
    const params = await searchParams


    if (!params?.session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session_id = params.session_id

    const {
        status,
        customer_details: { email: customerEmail },
        line_items
    } = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        return (
            <>
                <section id="success">
                    <p>
                        We appreciate your business! A confirmation email will be sent to{' '}
                        {customerEmail}. If you have any questions, please email{' '}
                    </p>
                    <a href="mailto:orders@example.com">orders@example.com</a>.
                </section>
                <div>
                    {line_items && line_items.data.map((line_item, idx) => (
                        <div key={idx} className={`border-2 p-3 m-5`}>
                            <p>{line_item.id}</p>
                            <p>{line_item.description}</p>
                            <p>Quantity: {line_item.quantity}</p>
                            <p>Subtotal: {formatCurrency(line_item.amount_subtotal/100)}</p>
                            <p>Tax: {formatCurrency(line_item.amount_tax/100)}</p>
                            <p>Total: {formatCurrency(line_item.amount_total/100)}</p>
                        </div>
                    ))}
                </div>
                <OrdersButton />
            </>

        )
    }
}