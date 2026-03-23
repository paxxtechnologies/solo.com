# Solo.com

Solo.com is a Next.js storefront and admin dashboard for a gadget retail business serving South East Nigeria. The application includes a customer-facing shopping experience, checkout flow, account area, and an internal admin interface for managing products, orders, promotions, rewards, and content.

## Overview

This project is currently set up as a frontend-driven application with mock data and local state providers. It is designed to present the full product and admin experience before wiring everything to production APIs.

Core capabilities included in the app:

- Customer storefront with category browsing, product pages, flash deals, FAQs, contact, and store locations
- Shopping cart, wishlist, mock authentication, and checkout flow
- SoloSwap trade-in experience
- Admin dashboard for products, orders, customers, analytics, promotions, flash deals, rewards, and settings
- Shared design system built from reusable UI components

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- React Hook Form + Zod
- Recharts
- Vercel Analytics

## Project Structure

```text
app/                 Application routes using the Next.js App Router
app/(customer)/      Customer-facing pages
app/admin/           Admin dashboard pages
components/          Reusable UI, layout, product, and home components
context/             App-wide state providers for auth, cart, wishlist, and toasts
lib/                 Mock data and utility helpers
public/              Static assets such as icons and branding
styles/              Global styling support
```

## Main Routes

Customer experience:

- `/` landing page
- `/shop` product discovery
- `/shop/[category]` category-specific listing
- `/product/[slug]` product details
- `/flash-deals` promotions
- `/soloswap` trade-in flow
- `/checkout` and `/checkout/success`
- `/login` and `/register`
- `/account/*` customer account area
- `/about`, `/contact`, `/faqs`, `/stores`, `/track-order`

Admin experience:

- `/admin`
- `/admin/login`
- `/admin/products`
- `/admin/orders`
- `/admin/customers`
- `/admin/analytics`
- `/admin/promotions`
- `/admin/flash-deals`
- `/admin/rewards`
- `/admin/settings`

## State Management

Global providers are registered in `app/providers.tsx`:

- `AuthProvider`
- `CartProvider`
- `WishlistProvider`
- `ToastProvider`

These currently support a frontend-first workflow and mock interactions.

## Data Source

Most storefront content currently comes from `lib/mock-data.ts`.

This includes:

- Products
- Categories
- Testimonials
- Flash deals
- Hero content
- Store information
- Announcement messages

When integrating a real backend, this file is the main place that should be replaced with API-backed fetching.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Build

Create a production build with:

```bash
npm run build
```

Start the production server with:

```bash
npm run start
```

## Notes

- The app currently uses mock data and simulated flows in several places.
- Authentication is not yet connected to a live backend.
- Product search and admin actions are primarily demo behavior at this stage.
- Branding assets live in `public/` and the shared logo component lives in `components/ui/SoloLogo.tsx`.

## Next Recommended Steps

- Connect storefront and admin flows to a real API
- Replace mock product and order data with backend data fetching
- Add automated tests for critical customer and admin flows
- Add environment-specific configuration for API base URLs and deployment targets

