export type Fulfillment = "NDD" | "SDD" | "PU";
export type Status = "CANCELLED" | "PLACED" | "READY_FOR_PICKUP" | "ON_ROUTE" | "COMPLETE";
export type Role = "ADMIN" | "DRIVER" | "FLOOR";

export type Credentials = {
    email: string;
    password: string;
};

export type SubmissionResponse = {
    msg: string;
    isError: boolean;
};

export interface Product {
    id: number;
    item: string;
    description: string;
    barcode: string;
    category: string;
    price: number;
    inventory: number;
    created_at: string; // ISO string from TIMESTAMPTZ
    updated_at: string;
}

export interface InventorySKU {}

export type ProductSubset = Pick<Product, "id" | "item" | "price">;

export interface Order {
    id: number;
    user_id: number;
    date: string;
    fulfillment: Fulfillment;
    status: Status;
    pickup_time: string | null;
    employee_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: number;
    user_id: number;
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface OrderProduct {
    order_id: number;
    product_id: number;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    professional: boolean;
    email: string;
}

export interface Employee {
    id: number;
    username: string;
    password: string;
    role: Role;
}

export interface Cart {
    id: number;
    user_id: number;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
}

export interface OrderWithRelations extends Order {
    user: User;
    employee?: Employee;
    orderProducts: OrderProduct[];
    addresses: Address[];
}

export interface CartWithItems extends Cart {
    items: CartItem[];
    user: User;
}

export interface ProductWithCartItems extends Product {
    CartItem: CartItem[];
    orderProducts: OrderProduct[];
}
