# Today Beauty Supply E-Commerce Prototype

A full-stack e-commerce prototype built for Today Beauty Supply to evaluate whether a custom in-house storefront could support the business’s transition into online retail.

The application implements a database-backed product catalog, product detail pages, cart management, inventory visibility, SKU/barcode metadata, and a Stripe Checkout flow. It was built with Next.js, TypeScript, Supabase/PostgreSQL, Stripe, Tailwind CSS, and deployed on Vercel.

The prototype was ultimately used as a business and technical validation exercise. After comparing the custom build against Shopify, the business chose Shopify for production because of its built-in payment handling, admin tooling, operational maturity, extensibility, and faster time-to-market for a nontechnical retail team.

Live Demo: [https://tbs-ecomm-prototyping-store-front.vercel.app/](https://tbs-ecomm-prototyping-store-front.vercel.app/)

### Features

- Database-backed product catalog using Supabase/PostgreSQL
- Product detail pages with pricing, stock count, category, and barcode metadata
- Hierarchical category browsing
- Cart management with quantity updates, item removal, subtotal calculation, and checkout entry point
- Stripe Checkout integration in sandbox mode
- Order confirmation page with item, tax, total, and confirmation email details
- Authentication flow for login and signup
- Vercel deployment

## Images

### Storefront Landing Page

A pickup-oriented storefront experience for browsing beauty supply essentials.

![Landing Page](./demo_pics/storefront-landing-page.png)

### Authentication Flow

User login and signup modals for account-based shopping.

![Auth Modal](./demo_pics/authentication-flow.png)

### Category Browsing

Hierarchical category navigation for organizing beauty supply inventory.

![Category Navigation](./demo_pics/category-navigation.png)

### Product Detail Page

Product detail view [^1] with pricing, stock count, category, and barcode metadata.

![Product Detail Page](./demo_pics/product-detail-page.png)

[^1]: Product images are represented with generated placeholders in the prototype while the business prepares a separate production catalog and photography workflow.

### Cart Management

Cart summary with quantity updates, item removal, subtotal calculation, and checkout entry point.

![Cart Management](./demo_pics/cart.png)

### Stripe Checkout

Stripe Checkout integration in sandbox mode for validating the payment flow.

![Stripe Checkout](./demo_pics/stripe_checkout.png)

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Database / Backend Services:** Supabase, PostgreSQL
- **Payments:** Stripe Checkout
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

I kept the stack intentionally lean. Supabase provided the core backend services, while PostgreSQL gave the project a flexible relational data model for products, categories, inventory metadata, and checkout-related workflows.

Before building the database layer, I completed a focused two-week study of PostgreSQL fundamentals. That helped me move beyond basic Supabase queries and use PostgreSQL more directly through views, indexes, SQL scripts, and database procedures exposed through Supabase RPC.

For the frontend, I chose Next.js because of my existing React experience and because server-side rendering can support SEO for product pages.
I used shadcn/ui components to move quickly with accessible, reusable UI primitives while focusing most of my engineering effort on the data model, backend integration, checkout flow, and application architecture.

## Repository Structure

The project is organized as a pnpm monorepo with application and library code split across packages in the `packages/` directory,
generally corresponding with the layers of Clean Architecture,
as described by Uncle Bob in his book with the same name.

### **Enterprise Business Rules (Entities & Repositories)**

These are found in `@tbs/core` package, located at the `core/` directory.
Here you can find business entities and rules, alongside the necessary interfaces
required for data access in the repositories.

### **Application Business Rules (Use Cases)**

You can find use cases in the client facing packages,
`internal-dashboard` and `store-front` (each located in the directory sharing the same name.)
Currently, only use cases of the store-front have been implemented.

### **Interface Adapters (Gateways, Controllers, and Presenters)**

The interface adapters are found in the `@tbs/adapters` package, located at the `adapters/` directories.

### **Frameworks and Drivers**

The frameworks and drivers of the project are found in a few different places. The UI is found in `internal-dashboard` and `store-front`.
Mappers and types used for UI state are found in `@tbs/view-models`, the `view-models/` directory.

### Architecture Note

The project was incrementally refactored toward a Clean Architecture-inspired structure as the application grew in complexity.
Some parts of the codebase follow the layered package structure more closely than others, but the main goal was to separate domain logic, data access,
view models, and application-facing UI code so the project could remain maintainable as features were added.

## AI Usage

I used AI tools selectively throughout the project for debugging support, technical reference, and frontend styling acceleration.

The core architecture, database modeling, application structure, Supabase/PostgreSQL work, Stripe integration flow, and business tradeoff analysis were implemented and reviewed directly by me. For frontend design, I used AI assistance to speed up visual iteration while focusing my primary learning effort on backend systems, data modeling, application architecture, and full-stack integration.
