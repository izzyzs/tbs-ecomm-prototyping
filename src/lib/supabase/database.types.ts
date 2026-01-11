export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string | null
          cart_id: number | null
          id: number
          product_id: number | null
          quantity: number | null
        }
        Insert: {
          added_at?: string | null
          cart_id?: number | null
          id?: never
          product_id?: number | null
          quantity?: number | null
        }
        Update: {
          added_at?: string | null
          cart_id?: number | null
          id?: never
          product_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          id: number
          status: Database["public"]["Enums"]["cart_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: never
          status?: Database["public"]["Enums"]["cart_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: never
          status?: Database["public"]["Enums"]["cart_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          depth: number
          id: number
          name: string
          parent_id: number | null
          path: unknown
          slug: string | null
        }
        Insert: {
          depth: number
          id?: never
          name: string
          parent_id?: number | null
          path?: unknown
          slug?: string | null
        }
        Update: {
          depth?: number
          id?: never
          name?: string
          parent_id?: number | null
          path?: unknown
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories_import: {
        Row: {
          depth: number | null
          id: number | null
          name: string | null
          parent_id: string | null
          slug: string | null
        }
        Insert: {
          depth?: number | null
          id?: number | null
          name?: string | null
          parent_id?: string | null
          slug?: string | null
        }
        Update: {
          depth?: number | null
          id?: number | null
          name?: string | null
          parent_id?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      category_data: {
        Row: {
          category: string | null
          subcategory_1: string | null
          subcategory_2: string | null
          subcategory_3: string | null
          subcategory_4: string | null
          subcategory_5: string | null
          subcategory_6: string | null
          subcategory_7: string | null
          subcategory_8: string | null
          subcategory_9: string | null
          system_id: string | null
        }
        Insert: {
          category?: string | null
          subcategory_1?: string | null
          subcategory_2?: string | null
          subcategory_3?: string | null
          subcategory_4?: string | null
          subcategory_5?: string | null
          subcategory_6?: string | null
          subcategory_7?: string | null
          subcategory_8?: string | null
          subcategory_9?: string | null
          system_id?: string | null
        }
        Update: {
          category?: string | null
          subcategory_1?: string | null
          subcategory_2?: string | null
          subcategory_3?: string | null
          subcategory_4?: string | null
          subcategory_5?: string | null
          subcategory_6?: string | null
          subcategory_7?: string | null
          subcategory_8?: string | null
          subcategory_9?: string | null
          system_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          brand: string | null
          category: string | null
          category_id: number | null
          custom_sku: string | null
          default_cost: string | null
          ean: string | null
          id: number
          item: string | null
          manufact_sku: string | null
          price: string | null
          publish_to_ecom: boolean | null
          qty: number | null
          season: string | null
          system_id: string | null
          tax: boolean | null
          tax_class: string | null
          upc: string | null
          vendor: string | null
          vendor_id: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          category_id?: number | null
          custom_sku?: string | null
          default_cost?: string | null
          ean?: string | null
          id?: never
          item?: string | null
          manufact_sku?: string | null
          price?: string | null
          publish_to_ecom?: boolean | null
          qty?: number | null
          season?: string | null
          system_id?: string | null
          tax?: boolean | null
          tax_class?: string | null
          upc?: string | null
          vendor?: string | null
          vendor_id?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          category_id?: number | null
          custom_sku?: string | null
          default_cost?: string | null
          ean?: string | null
          id?: never
          item?: string | null
          manufact_sku?: string | null
          price?: string | null
          publish_to_ecom?: boolean | null
          qty?: number | null
          season?: string | null
          system_id?: string | null
          tax?: boolean | null
          tax_class?: string | null
          upc?: string | null
          vendor?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      inventory_import: {
        Row: {
          brand: string | null
          category: string | null
          custom_sku: string | null
          default_cost: string | null
          department: string | null
          ean: string | null
          item: string | null
          manufact_sku: string | null
          msrp: string | null
          price: string | null
          publish_to_ecom: string | null
          qty: string | null
          season: string | null
          subcategory_1: string | null
          subcategory_2: string | null
          subcategory_3: string | null
          subcategory_4: string | null
          subcategory_5: string | null
          subcategory_6: string | null
          subcategory_7: string | null
          subcategory_8: string | null
          subcategory_9: string | null
          system_id: string | null
          tax: string | null
          tax_class: string | null
          upc: string | null
          vendor: string | null
          vendor_id: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          custom_sku?: string | null
          default_cost?: string | null
          department?: string | null
          ean?: string | null
          item?: string | null
          manufact_sku?: string | null
          msrp?: string | null
          price?: string | null
          publish_to_ecom?: string | null
          qty?: string | null
          season?: string | null
          subcategory_1?: string | null
          subcategory_2?: string | null
          subcategory_3?: string | null
          subcategory_4?: string | null
          subcategory_5?: string | null
          subcategory_6?: string | null
          subcategory_7?: string | null
          subcategory_8?: string | null
          subcategory_9?: string | null
          system_id?: string | null
          tax?: string | null
          tax_class?: string | null
          upc?: string | null
          vendor?: string | null
          vendor_id?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          custom_sku?: string | null
          default_cost?: string | null
          department?: string | null
          ean?: string | null
          item?: string | null
          manufact_sku?: string | null
          msrp?: string | null
          price?: string | null
          publish_to_ecom?: string | null
          qty?: string | null
          season?: string | null
          subcategory_1?: string | null
          subcategory_2?: string | null
          subcategory_3?: string | null
          subcategory_4?: string | null
          subcategory_5?: string | null
          subcategory_6?: string | null
          subcategory_7?: string | null
          subcategory_8?: string | null
          subcategory_9?: string | null
          system_id?: string | null
          tax?: string | null
          tax_class?: string | null
          upc?: string | null
          vendor?: string | null
          vendor_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          is_professional: boolean | null
          last_name: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          is_professional?: boolean | null
          last_name?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          is_professional?: boolean | null
          last_name?: string | null
        }
        Relationships: []
      }
      sku_data: {
        Row: {
          buyer: string | null
          sku: number | null
          sku_description: string | null
        }
        Insert: {
          buyer?: string | null
          sku?: number | null
          sku_description?: string | null
        }
        Update: {
          buyer?: string | null
          sku?: number | null
          sku_description?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      unique_categories_from_inventory: {
        Row: {
          category: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_cart_item: {
        Args: { p_cart_id: number; p_product_id: number; p_quantity: number }
        Returns: {
          added_at: string | null
          cart_id: number | null
          id: number
          product_id: number | null
          quantity: number | null
        }
        SetofOptions: {
          from: "*"
          to: "cart_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      distinct_categories: {
        Args: never
        Returns: {
          depth: number
          id: number
          name: string
          parent_id: number | null
          path: unknown
          slug: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "categories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      ensure_cart: { Args: { user_id: string }; Returns: number }
      get_category_tree: { Args: never; Returns: Json }
      get_products: {
        Args: { p_cursor: number; p_limit: number }
        Returns: Json
      }
      get_random_products: {
        Args: { p_limit_count: number }
        Returns: {
          brand: string | null
          category: string | null
          category_id: number | null
          custom_sku: string | null
          default_cost: string | null
          ean: string | null
          id: number
          item: string | null
          manufact_sku: string | null
          price: string | null
          publish_to_ecom: boolean | null
          qty: number | null
          season: string | null
          system_id: string | null
          tax: boolean | null
          tax_class: string | null
          upc: string | null
          vendor: string | null
          vendor_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "inventory"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_subcategories_by_parent_category: {
        Args: { p_parent_category: string }
        Returns: {
          depth: number
          id: number
          name: string
          parent_id: number | null
          path: unknown
          slug: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "categories"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      insert_categories_from_categories_import: {
        Args: never
        Returns: {
          categories_added: number
          categories_parent_set: number
        }[]
      }
      insert_inventory_data: { Args: never; Returns: number }
      pgroonga_command:
        | { Args: { groongacommand: string }; Returns: string }
        | {
            Args: { arguments: string[]; groongacommand: string }
            Returns: string
          }
      pgroonga_command_escape_value: {
        Args: { value: string }
        Returns: string
      }
      pgroonga_condition: {
        Args: {
          column_name?: string
          fuzzy_max_distance_ratio?: number
          index_name?: string
          query?: string
          schema_name?: string
          scorers?: string[]
          weights?: number[]
        }
        Returns: Database["public"]["CompositeTypes"]["pgroonga_condition"]
        SetofOptions: {
          from: "*"
          to: "pgroonga_condition"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      pgroonga_equal_query_text_array: {
        Args: { query: string; targets: string[] }
        Returns: boolean
      }
      pgroonga_equal_query_text_array_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              targets: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              targets: string[]
            }
            Returns: boolean
          }
      pgroonga_equal_query_varchar_array: {
        Args: { query: string; targets: string[] }
        Returns: boolean
      }
      pgroonga_equal_query_varchar_array_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              targets: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              targets: string[]
            }
            Returns: boolean
          }
      pgroonga_equal_text: {
        Args: { other: string; target: string }
        Returns: boolean
      }
      pgroonga_equal_text_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_equal_varchar: {
        Args: { other: string; target: string }
        Returns: boolean
      }
      pgroonga_equal_varchar_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_escape:
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: boolean }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: number }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { special_characters: string; value: string }
            Returns: string
          }
        | {
            Args: { value: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { value: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.pgroonga_escape(value => bool), public.pgroonga_escape(value => int8), public.pgroonga_escape(value => int2), public.pgroonga_escape(value => int4), public.pgroonga_escape(value => text), public.pgroonga_escape(value => float4), public.pgroonga_escape(value => float8), public.pgroonga_escape(value => timestamp), public.pgroonga_escape(value => timestamptz). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      pgroonga_flush: { Args: { indexname: unknown }; Returns: boolean }
      pgroonga_highlight_html:
        | { Args: { keywords: string[]; target: string }; Returns: string }
        | {
            Args: { indexname: unknown; keywords: string[]; target: string }
            Returns: string
          }
        | { Args: { keywords: string[]; targets: string[] }; Returns: string[] }
        | {
            Args: { indexname: unknown; keywords: string[]; targets: string[] }
            Returns: string[]
          }
      pgroonga_index_column_name:
        | { Args: { columnindex: number; indexname: unknown }; Returns: string }
        | { Args: { columnname: string; indexname: unknown }; Returns: string }
      pgroonga_is_writable: { Args: never; Returns: boolean }
      pgroonga_list_broken_indexes: { Args: never; Returns: string[] }
      pgroonga_list_lagged_indexes: { Args: never; Returns: string[] }
      pgroonga_match_positions_byte:
        | { Args: { keywords: string[]; target: string }; Returns: number[] }
        | {
            Args: { indexname: unknown; keywords: string[]; target: string }
            Returns: number[]
          }
      pgroonga_match_positions_character:
        | { Args: { keywords: string[]; target: string }; Returns: number[] }
        | {
            Args: { indexname: unknown; keywords: string[]; target: string }
            Returns: number[]
          }
      pgroonga_match_term:
        | { Args: { target: string; term: string }; Returns: boolean }
        | { Args: { target: string[]; term: string }; Returns: boolean }
        | { Args: { target: string; term: string }; Returns: boolean }
        | { Args: { target: string[]; term: string }; Returns: boolean }
      pgroonga_match_text_array_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string[]
            }
            Returns: boolean
          }
      pgroonga_match_text_array_condition_with_scorers: {
        Args: {
          condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition_with_scorers"]
          target: string[]
        }
        Returns: boolean
      }
      pgroonga_match_text_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_match_text_condition_with_scorers: {
        Args: {
          condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition_with_scorers"]
          target: string
        }
        Returns: boolean
      }
      pgroonga_match_varchar_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_match_varchar_condition_with_scorers: {
        Args: {
          condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition_with_scorers"]
          target: string
        }
        Returns: boolean
      }
      pgroonga_normalize:
        | { Args: { target: string }; Returns: string }
        | { Args: { normalizername: string; target: string }; Returns: string }
      pgroonga_prefix_varchar_condition:
        | {
            Args: {
              conditoin: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              conditoin: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_query_escape: { Args: { query: string }; Returns: string }
      pgroonga_query_expand: {
        Args: {
          query: string
          synonymscolumnname: string
          tablename: unknown
          termcolumnname: string
        }
        Returns: string
      }
      pgroonga_query_extract_keywords: {
        Args: { index_name?: string; query: string }
        Returns: string[]
      }
      pgroonga_query_text_array_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              targets: string[]
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              targets: string[]
            }
            Returns: boolean
          }
      pgroonga_query_text_array_condition_with_scorers: {
        Args: {
          condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition_with_scorers"]
          targets: string[]
        }
        Returns: boolean
      }
      pgroonga_query_text_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_query_text_condition_with_scorers: {
        Args: {
          condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition_with_scorers"]
          target: string
        }
        Returns: boolean
      }
      pgroonga_query_varchar_condition:
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_condition"]
              target: string
            }
            Returns: boolean
          }
        | {
            Args: {
              condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition"]
              target: string
            }
            Returns: boolean
          }
      pgroonga_query_varchar_condition_with_scorers: {
        Args: {
          condition: Database["public"]["CompositeTypes"]["pgroonga_full_text_search_condition_with_scorers"]
          target: string
        }
        Returns: boolean
      }
      pgroonga_regexp_text_array: {
        Args: { pattern: string; targets: string[] }
        Returns: boolean
      }
      pgroonga_regexp_text_array_condition: {
        Args: {
          pattern: Database["public"]["CompositeTypes"]["pgroonga_condition"]
          targets: string[]
        }
        Returns: boolean
      }
      pgroonga_result_to_jsonb_objects: {
        Args: { result: Json }
        Returns: Json
      }
      pgroonga_result_to_recordset: {
        Args: { result: Json }
        Returns: Record<string, unknown>[]
      }
      pgroonga_score:
        | { Args: { row: Record<string, unknown> }; Returns: number }
        | { Args: { ctid: unknown; tableoid: unknown }; Returns: number }
      pgroonga_set_writable: {
        Args: { newwritable: boolean }
        Returns: boolean
      }
      pgroonga_snippet_html: {
        Args: { keywords: string[]; target: string; width?: number }
        Returns: string[]
      }
      pgroonga_table_name: { Args: { indexname: unknown }; Returns: string }
      pgroonga_tokenize: {
        Args: { options: string[]; target: string }
        Returns: Json[]
      }
      pgroonga_vacuum: { Args: never; Returns: boolean }
      pgroonga_wal_apply:
        | { Args: never; Returns: number }
        | { Args: { indexname: unknown }; Returns: number }
      pgroonga_wal_set_applied_position:
        | { Args: never; Returns: boolean }
        | { Args: { block: number; offset: number }; Returns: boolean }
        | { Args: { indexname: unknown }; Returns: boolean }
        | {
            Args: { block: number; indexname: unknown; offset: number }
            Returns: boolean
          }
      pgroonga_wal_status: {
        Args: never
        Returns: {
          current_block: number
          current_offset: number
          current_size: number
          last_block: number
          last_offset: number
          last_size: number
          name: string
          oid: unknown
        }[]
      }
      pgroonga_wal_truncate:
        | { Args: never; Returns: number }
        | { Args: { indexname: unknown }; Returns: number }
      retrieve_cart_items:
        | { Args: { active_cart_id: number }; Returns: Json }
        | { Args: { p_cart_id: number }; Returns: Json }
        | { Args: { p_user_id: string }; Returns: Json }
      retrieve_cart_items_to_front: {
        Args: { p_user_id: string }
        Returns: Json
      }
      search_products: {
        Args: { query: string }
        Returns: {
          brand: string | null
          category: string | null
          category_id: number | null
          custom_sku: string | null
          default_cost: string | null
          ean: string | null
          id: number
          item: string | null
          manufact_sku: string | null
          price: string | null
          publish_to_ecom: boolean | null
          qty: number | null
          season: string | null
          system_id: string | null
          tax: boolean | null
          tax_class: string | null
          upc: string | null
          vendor: string | null
          vendor_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "inventory"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      sync_local_cart_to_db: {
        Args: { p_cart_id: number; p_local_cart: string }
        Returns: {
          added_at: string | null
          cart_id: number | null
          id: number
          product_id: number | null
          quantity: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "cart_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      text2ltree: { Args: { "": string }; Returns: unknown }
      update_parent_id: { Args: never; Returns: number }
    }
    Enums: {
      cart_status: "open" | "completed"
      Fulfillment: "NDD" | "SDD" | "PU"
      Role: "ADMIN" | "DRIVER" | "FLOOR"
      Status:
        | "CANCELLED"
        | "PLACED"
        | "READY_FOR_PICKUP"
        | "ON_ROUTE"
        | "COMPLETE"
    }
    CompositeTypes: {
      cartitem: {
        id: number | null
        productId: number | null
        name: string | null
        brand: string | null
        price: number | null
        quantity: number | null
      }
      pgroonga_condition: {
        query: string | null
        weigths: number[] | null
        scorers: string[] | null
        schema_name: string | null
        index_name: string | null
        column_name: string | null
        fuzzy_max_distance_ratio: number | null
      }
      pgroonga_full_text_search_condition: {
        query: string | null
        weigths: number[] | null
        indexname: string | null
      }
      pgroonga_full_text_search_condition_with_scorers: {
        query: string | null
        weigths: number[] | null
        scorers: string[] | null
        indexname: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cart_status: ["open", "completed"],
      Fulfillment: ["NDD", "SDD", "PU"],
      Role: ["ADMIN", "DRIVER", "FLOOR"],
      Status: [
        "CANCELLED",
        "PLACED",
        "READY_FOR_PICKUP",
        "ON_ROUTE",
        "COMPLETE",
      ],
    },
  },
} as const
