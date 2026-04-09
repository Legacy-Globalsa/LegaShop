# LEGASHOP — Frontend Implementation Plan

**Date:** April 9, 2026  
**Based on:** MVP Business Plan + Current Codebase Audit

---

## Current State Summary

### Backend (Django REST Framework) — ~85% Core API Complete
- ✅ User auth (signup, login, Google OAuth, JWT)
- ✅ Profile & address management (CRUD)
- ✅ Product browsing + category management (with filters)
- ✅ Store listing + vendor store CRUD
- ✅ Review system (store & product reviews)
- ✅ Order creation with stock validation + status machine
- ✅ Payment model (Mada, Visa, Apple Pay, COD)
- ✅ Vendor dashboard endpoints (products, orders, analytics)
- ❌ Real payment gateway integration (Stripe/PayTabs)
- ❌ SMS/OTP notifications
- ❌ Search (Elasticsearch)
- ❌ PH remittance fulfillment logic

### Frontend (React + Vite + TypeScript) — ~60% Feature Complete
- ✅ Homepage (hero, deals, categories, stores, remittance preview, stats, footer)
- ✅ Auth pages (login, signup with Google OAuth)
- ✅ Deal pages (1 SAR, 5 SAR)
- ✅ Categories page
- ✅ Stores page
- ✅ Remittance page (UI only)
- ✅ Product detail page (partial API integration)
- ✅ Design system (Philippine flag palette, Inter/Space Grotesk fonts)
- ✅ 48 shadcn/ui components installed
- ✅ Mock data (16 products, 8 categories, 8 stores)
- ❌ Shopping cart (state + UI)
- ❌ Checkout flow
- ❌ Order history / tracking
- ❌ User profile / address management
- ❌ Search functionality
- ❌ Vendor dashboard
- ❌ Admin panel

---

## Phased Implementation Plan

### Phase 1: Core Shopping Flow (Cart → Checkout → Orders)
> **Goal:** Complete the buyer journey from browsing to purchasing
> **Priority:** P0 — Without this, there is no usable product

| # | Task | Components/Pages | Mock Data |
|---|------|-----------------|-----------|
| 1.1 | **Cart State Management** | `useCart` hook (Zustand or Context) | Cart stored in localStorage |
| 1.2 | **Cart Drawer/Page** | `CartDrawer.tsx`, update `Navbar.tsx` cart badge | Uses mock products |
| 1.3 | **Add-to-Cart** on all product surfaces | Update `ProductPage`, deal pages, featured products | — |
| 1.4 | **Checkout Page** | `CheckoutPage.tsx` — address form, order summary, payment method selection | Mock addresses, COD default |
| 1.5 | **Order Confirmation Page** | `OrderConfirmationPage.tsx` — success state, order ID | Mock order response |
| 1.6 | **Order History Page** | `OrdersPage.tsx` — list of past orders with status badges | Mock orders |
| 1.7 | **Order Detail Page** | `OrderDetailPage.tsx` — items, status timeline, tracking | Mock order detail |

**Deliverable:** User can browse → add to cart → checkout (COD) → see order history

---

### Phase 2: User Account & Address Management
> **Goal:** Complete user profile experience
> **Priority:** P0 — Required for checkout to work properly

| # | Task | Components/Pages | Mock Data |
|---|------|-----------------|-----------|
| 2.1 | **Profile Page** | `ProfilePage.tsx` — name, email, phone, avatar | Current auth user |
| 2.2 | **Address Management** | `AddressesPage.tsx` — CRUD addresses, set default | Mock addresses |
| 2.3 | **Address Picker in Checkout** | Integrate saved addresses into checkout flow | — |
| 2.4 | **Password Change** | Add to profile page | — |
| 2.5 | **Protected Routes** | Wire `ProtectedRoute` to cart, checkout, orders, profile | — |

**Deliverable:** User can manage profile, save addresses, use them at checkout

---

### Phase 3: Search, Filters & Product Discovery
> **Goal:** Users can find products efficiently
> **Priority:** P1 — Critical for usability at scale

| # | Task | Components/Pages | Mock Data |
|---|------|-----------------|-----------|
| 3.1 | **Global Search** | `SearchResults.tsx` — search across products, stores, categories | Filter mock data |
| 3.2 | **Search in Navbar** | Wire search input → results page/dropdown | — |
| 3.3 | **Category Filtering** | Filter products by category on category pages | — |
| 3.4 | **Store Product Listing** | `StorePage.tsx` — individual store with its products | Mock store-product mapping |
| 3.5 | **Sort Controls** | Price low/high, rating, newest on product listings | — |
| 3.6 | **Product Reviews Section** | Display reviews on `ProductPage`, submission form | Mock reviews |

**Deliverable:** Full product discovery with search, filter, sort, and per-store browsing

---

### Phase 4: Backend API Integration
> **Goal:** Replace mock data with real API calls
> **Priority:** P1 — Connects frontend to live backend

| # | Task | Details |
|---|------|---------|
| 4.1 | **API client setup** | Axios instance with interceptors, token refresh, error handling |
| 4.2 | **React Query hooks** | `useProducts`, `useCategories`, `useStores`, `useOrders` |
| 4.3 | **Auth flow** | Connect signup/login/logout to backend, store JWT properly |
| 4.4 | **Product endpoints** | GET products, categories, deals, product detail, reviews |
| 4.5 | **Store endpoints** | GET stores, nearby stores, store detail + products |
| 4.6 | **Cart → Order** | POST order creation, GET order list/detail |
| 4.7 | **Address endpoints** | CRUD addresses via API |
| 4.8 | **Error handling** | Toast notifications for API errors, loading states, retry |

**Deliverable:** Frontend fully operational with live backend data

---

### Phase 5: Vendor Dashboard
> **Goal:** Store owners can manage their business
> **Priority:** P1 — Required for marketplace to function

| # | Task | Components/Pages |
|---|------|-----------------|
| 5.1 | **Vendor Layout** | `VendorLayout.tsx` — sidebar nav, header |
| 5.2 | **Vendor Dashboard Home** | `VendorDashboard.tsx` — sales stats, recent orders, quick actions |
| 5.3 | **Product Management** | `VendorProducts.tsx` — list, create, edit, delete products |
| 5.4 | **Order Management** | `VendorOrders.tsx` — incoming orders, accept/reject, update status |
| 5.5 | **Store Settings** | `VendorStoreSettings.tsx` — store profile, delivery zone, hours |
| 5.6 | **Basic Analytics** | Charts (Recharts already installed) — orders/day, revenue, top products |

**Deliverable:** Vendors can list products, manage orders, view analytics

---

### Phase 6: PH Remittance Grocery Enhancement
> **Goal:** Complete the OFW remittance-to-grocery flow
> **Priority:** P1 — Key differentiator per business plan

| # | Task | Details |
|---|------|---------|
| 6.1 | **Puregold Catalog Browsing** | Dedicated product grid for PH-available items |
| 6.2 | **SAR→PHP Live Conversion** | Display prices in both currencies with live rate |
| 6.3 | **Recipient Form** | Name, phone, Puregold branch selector |
| 6.4 | **PH Order Tracking** | Separate status flow (PH_PROCESSING → PH_READY_PICKUP → PH_DELIVERED) |
| 6.5 | **Order History (PH tab)** | Filter orders by LOCAL_RIYADH vs PH_REMITTANCE |

**Deliverable:** OFW can order groceries for family in Philippines

---

### Phase 7: Admin Panel
> **Goal:** Platform operators can moderate and manage
> **Priority:** P2 — Can use Django Admin initially

| # | Task | Details |
|---|------|---------|
| 7.1 | **Admin Layout** | Separate admin route group with sidebar |
| 7.2 | **User Management** | List/search users, view profiles, suspend accounts |
| 7.3 | **Store Approval** | Review pending stores, approve/reject with notes |
| 7.4 | **Order Oversight** | All orders dashboard with filters |
| 7.5 | **Platform Analytics** | Revenue, orders, users, top stores charts |
| 7.6 | **Content Moderation** | Review/product flagging and removal |

**Deliverable:** Full admin control panel

---

### Phase 8: Polish & Production Readiness
> **Goal:** App is launch-ready
> **Priority:** P2

| # | Task |
|---|------|
| 8.1 | **Loading skeletons** on all pages |
| 8.2 | **Error boundaries** (global + per-section) |
| 8.3 | **Empty states** (no results, no orders, etc.) |
| 8.4 | **SEO meta tags** per page |
| 8.5 | **PWA manifest + service worker** |
| 8.6 | **i18n** (English, Tagalog, Arabic stubs) |
| 8.7 | **Accessibility audit** (WCAG 2.1 AA) |
| 8.8 | **Performance audit** (Lighthouse 90+) |
| 8.9 | **E2E tests** (Playwright for critical flows) |
| 8.10 | **Environment config** (.env for API URL, Google Client ID, etc.) |

---

## Recommended Starting Point

**Phase 1 (Cart → Checkout → Orders)** is the highest-impact work. It completes the core buyer journey and makes the app functional as an e-commerce platform. All work can be done with mock data, and later connected to the real backend in Phase 4.

### Phase 1 Implementation Order:
1. Cart state management (Zustand store)
2. Cart drawer component
3. Add-to-cart on product surfaces
4. Checkout page
5. Order confirmation
6. Orders list page
7. Order detail page
