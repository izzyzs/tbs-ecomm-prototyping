// TODO: LET SUPABASE HANDLE TYPES AND CREATE mapToMyOwnType
//  functions for conversions to th types and interfaces below

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

export type CategoryObject = { category: string };

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
export interface Deez {
    system_id: string;
    upc: string;
    ean: string;
    custom_sku: string;
    manufact_sku: string;
    item: string;
    vendor_id: string;
    qty: number;
    price: string;
    tax: boolean;
    brand: string;
    publish_to_ecom: boolean;
    season: string;
    department: string;
    msrp: string;
    tax_class: string;
    default_cost: string;
    vendor: string;
    category: string;
    subcategory: string;
    subcategory_2: string;
    subcategory_3: string;
    subcategory_4: string;
    subcategory_5: string;
    subcategory_6: string;
    subcategory_7: string;
    subcategory_8: string;
    subcategory_9: string;
    id: number;
    price_num: number;
    item_vector: string;
}

export interface SearchResponse extends SubmissionResponse {
    deez: Deez[];
}
export interface InventorySKU {
    id: number;
    system_id: number;
    upc: number;
    ean: number;
    custom_sku: string;
    manufact_sku: string;
    item: string;
    vendor_id: string;
    qty: number;
    price: number;
    tax: boolean;
    brand: string;
    publish_to_ecom: boolean;
    season: string;
    department: string;
    msrp: number;
    tax_class: string;
    default_cost: number;
    vendor: string;
    category: string;
    subcategory: string;
    subcategory_2: string;
    subcategory_3: string;
    subcategory_4: string;
    subcategory_5: string;
    subcategory_6: string;
    subcategory_7: string;
    subcategory_8: string;
    subcategory_9: string;
    supercategory: string;
}

export type ProductSubset = Pick<InventorySKU, "id" | "item" | "price">;

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

// TODO: gonna have to come back here and figure out whether or not
// I want to have a secondary, "pre db insert" CartItem so insert to
// database is solely CartContext.add()'s job
export interface CartItem {
    id: number;
    productId: number;
    name: string;
    brand: string;
    price: number;
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
