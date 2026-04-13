import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SupabaseOrderRepository } from "@tbs/infra";
import { Order, OrderId } from "@tbs/core";
import OrderStatusShell from "@/components/orders/OrderStatusShell";
import { Status } from "@/components/orders/order.type";
import { OrderStateMapper } from "@tbs/view-models";

type PageProps = { params: Promise<{ id: string }> };

function getOrderStatus(order: Order): Status {
    return order.pickedUpAt ? "Picked up" : order.readyAt ? "Ready for pickup" : order.preparedAt ? "Prepared" : "Created";
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) notFound();

    const supabase = await createClient();
    // @ts-expect-error: annoying issue with supabase typing.
    const orderRepository = new SupabaseOrderRepository(supabase);
    const order: Order | null = await orderRepository.retrieveSingleOrder(new OrderId(+id));
    if (!order) notFound();
    const initialOrder = OrderStateMapper.domainToState(order);
    const { data: nameData } = await supabase.from("profiles").select("first_name, last_name, email").eq("id", order.userId.value).single();
    const status = getOrderStatus(order);
    const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity.amount, 0);
    const orderTotal = order.orderItems.reduce((sum, item) => sum + item.unitPrice.inDollars * item.quantity.amount, 0);
    const customerName = [nameData?.first_name, nameData?.last_name].filter(Boolean).join(" ");

    return <OrderStatusShell initialOrder={initialOrder} orderDetails={{ status, totalItems, orderTotal, customerName, userId: order.userId.value, email: nameData?.email ?? "" }} />;
}
