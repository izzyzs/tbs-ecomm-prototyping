/**
 *                             Table "public.inventory"
     Column      |  Type   | Collation | Nullable |           Default            
-----------------+---------+-----------+----------+------------------------------
 system_id       | text    |           |          | 
 upc             | text    |           |          | 
 ean             | text    |           |          | 
 custom_sku      | text    |           |          | 
 manufact_sku    | text    |           |          | 
 item            | text    |           |          | 
 vendor_id       | text    |           |          | 
 qty             | integer |           |          | 
 price           | text    |           |          | 
 tax             | boolean |           |          | 
 brand           | text    |           |          | 
 publish_to_ecom | boolean |           |          | 
 season          | text    |           |          | 
 tax_class       | text    |           |          | 
 default_cost    | text    |           |          | 
 vendor          | text    |           |          | 
 category        | text    |           |          | 
 id              | bigint  |           | not null | generated always as identity
 category_id     | bigint  |           |          | 
Indexes:
    "inventory_id_pkey" UNIQUE CONSTRAINT, btree (id)
    "inventory_search_idx" pgroonga (((brand || ' '::text) || item))
Referenced by:
    TABLE "cart_items" CONSTRAINT "test_cart_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES inventory(id)


 */
