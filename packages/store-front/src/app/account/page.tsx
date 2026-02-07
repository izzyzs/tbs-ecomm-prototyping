"use client"
import {useAuth} from "@/context/AuthContext";
import {useEffect, useState} from "react";
import {SupabaseOrderRepository} from "@tbs/infra"
import {createClient} from "@/lib/supabase/client";
import {UserIdMapper} from "@tbs/adapters";
import {OrderState, OrderStateMapper} from "@tbs/view-models"
import Link from "next/link";
import {formatCurrency} from "@/utils/helper-functions";

export default function AccountPage() {
    const {user} = useAuth();
    const supabase = createClient();
    const [orders, setOrders] = useState<OrderState[]>([]);
    const userRepository = new SupabaseOrderRepository(supabase);


    useEffect(() => {
        if (user) {
            const getOrders = async () => {
                const items = await userRepository.retrieveAllOrders(UserIdMapper.stateToDomain(user.id));
                const newOrders = items.map((domainOrder): OrderState => {
                    return OrderStateMapper.domainToState(domainOrder);
                })
                setOrders(newOrders);
            }
            getOrders();
        }
    }, [user]);

    if (!user) {
        return (
            <>you must login or sign up to see account details</>
        )
    }

    return (
        <div>
            <h1 className={`text-4xl`}>Orders</h1>
            {orders.length > 0
                ? orders.map((order, idx) => (
                    <div key={idx}>
                        <p>{order.orderId}</p>
                        <p>{order.createdAt.toString()}</p>
                        {order.orderItems.map((item, index) => (
                                <div key={index}>
                                    <p>{item.productName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>{formatCurrency(item.unitPrice*item.quantity)}</p>
                                </div>
                            )
                        )}
                    </div>
                ))
                :
                <div>
                    <p>Place your first order!</p>
                    <Link href={`/cart`}>Check Out!</Link>
                </div>

            }
        </div>

    )
}