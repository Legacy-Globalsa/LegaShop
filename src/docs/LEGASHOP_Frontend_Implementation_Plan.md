# LEGASHOP Frontend Implementation Plan

**Canonical frontend plan:** This file replaces the older `Frontend_Implementation_Plan.md`.
**Last updated:** May 24, 2026
**Scope:** React/Vite frontend only, with backend dependencies called out where they block frontend completion.

---

## Current State

The April audits are historical. The customer marketplace and vendor portal are now mostly implemented. The remaining launch work is concentrated in Maps backend completion, payments, admin, remittance fulfillment, and production hardening.

| Area | Current state |
|---|---|
| Customer shopping flow | Done for MVP: home, auth, deals, categories, stores, store detail, product detail/reviews, wishlist, account/profile/security/addresses, search, cart, checkout, order confirmation/history/detail. |
| API integration | Mostly done: React Query hooks cover products, categories, stores, nearby stores, reviews, orders, addresses, profile, wishlist, and vendor APIs. |
| Vendor portal | Done for MVP at `/vendor/*`: onboarding, dashboard, products CRUD, orders/status actions, store settings, reviews, analytics, payouts placeholder, route guard, loading/empty/error states. |
| Maps frontend | Done for local MVP as of May 24: Google Maps provider, store map, address autocomplete, StoresPage map view, nearby stores hook, draggable `AddressPickerMap`, checkout estimate UI, dynamic delivery fee override, out-of-zone warning, StorePage delivery radius map, vendor onboarding picker, and vendor store settings picker. |
| Maps backend | Done for local MVP: nearby stores, delivery estimate, reverse geocode, order ETA/distance fields, dynamic fee, and delivery-zone validation. Production still needs a server-restricted `GOOGLE_MAPS_SERVER_KEY`; local dev falls back to Haversine estimates without it. |
| Payments | Not complete: COD works through order creation, but hosted PayTabs/Stripe flow and payment return page are missing. |
| Admin console | Not started in React. Backend has Django Admin, category admin endpoints, and store approval/suspension update, but no full admin API surface yet. |
| Remittance | UI/marketing-level only. No true PH grocery checkout, FX cache, Puregold ingest, recipient fulfillment, or PH status flow yet. |
| Production readiness | `npm.cmd run build` passes. Existing warnings remain for Browserslist freshness and large JS chunk size. Lint/CI/Sentry/deployment hardening are still pending. |

---

## Completed Frontend Work

### Core Marketplace

- Cart state, cart drawer, add-to-cart surfaces, checkout, order confirmation, order list/detail.
- Account profile, password/security, address CRUD, protected account route.
- Store browsing, store detail, store products, product detail, product reviews, wishlist, search results.
- Navbar search debounce and autocomplete dropdown are already implemented.

### API and State Consistency

- Removed mock-data fallbacks from API calls so React Query error states can handle failures.
- Migrated key pages from direct `useEffect` fetching to React Query hooks.
- Added order address display through `delivery_address_data`.
- Kept customer and vendor data paths aligned with current backend endpoints.

### Vendor Portal

- Vendor route guard and layout.
- Vendor dashboard, product CRUD, product form, orders, order detail, order status actions.
- Vendor store settings, reviews, analytics, and payouts placeholder.
- Vendor loading, empty, and error states.

### Maps V1 Frontend Polish - Completed May 24, 2026

| Item | Status | Files |
|---|---|---|
| Delivery estimate API helper and hook | Done | `src/lib/api.ts`, `src/hooks/use-api.ts` |
| Reverse geocode API helper and hook | Done | `src/lib/api.ts`, `src/hooks/use-api.ts` |
| Draggable address picker map | Done | `src/components/maps/AddressPickerMap.tsx` |
| Address form map pin integration | Done | `src/components/account/AddressFormDialog.tsx` |
| Checkout ETA/distance/dynamic fee UI | Done | `src/pages/CheckoutPage.tsx`, `src/hooks/use-cart.tsx` |
| Checkout out-of-zone warning | Done | `src/pages/CheckoutPage.tsx` |
| StorePage mini-map with delivery radius | Done | `src/pages/StorePage.tsx`, `src/components/maps/StoreMap.tsx` |
| Vendor store map picker | Done | `src/pages/vendor/VendorStoreSettings.tsx` |
| Vendor onboarding map picker | Done | `src/pages/vendor/VendorOnboarding.tsx` |
| Google Maps env compatibility | Done | Vite loads the shared repo `.env`; supports `VITE_GOOGLE_MAPS_API_KEY` and `VITE_GOOGLE_MAPS_KEY`. |

---

## Current Priority Order

1. Add hosted payment flow: PayTabs/Stripe order redirect and `/payment/return`.
2. Build Admin Console v1: admin guard/layout, pending store approvals, users, orders, categories, platform analytics.
3. Convert remittance from static UI into a real PH order flow.
4. Production hardening: lint debt, CI, Sentry, security settings, deployment, E2E tests.
5. Production Maps hardening: server-restricted `GOOGLE_MAPS_SERVER_KEY`, Cloud billing/quota alerts, and browser key restrictions.

---

## Roadmap

### Phase 1 - Maps V1 Completion

**Frontend status:** Done for local MVP.  
**Backend status:** Done for local MVP.

| Task | Owner | Status |
|---|---|---|
| `GET /api/stores/nearby/?lat=&lng=&radius_km=` | Backend | Done with approximate distance/fee. |
| `GET /api/stores/<id>/delivery-estimate/?lat=&lng=` | Backend | Done with Google Distance Matrix when configured and Haversine fallback locally. |
| `GET /api/geo/reverse/?lat=&lng=` | Backend | Done with Google Geocoding when configured and coordinate fallback locally. |
| `Order.estimated_delivery_min` and `Order.distance_km` | Backend | Done. |
| Backend dynamic fee and zone validation | Backend | Done. |
| Checkout estimate display, dynamic fee, out-of-zone UI | Frontend | Done. |
| AddressPickerMap drag/search/current-location picker | Frontend | Done. |
| StorePage delivery zone mini-map | Frontend | Done. |
| Vendor store map picker | Frontend | Done. |
| Vendor onboarding map picker | Frontend | Done. |

**Remaining Maps action:** manual browser verification with valid Google browser key and production Google Cloud restrictions/billing.

### Phase 2 - Payments

| Task | Details | Status |
|---|---|---|
| Hosted payment redirect | In `CheckoutPage`, when `payment_method !== "COD"`, redirect to backend returned `payment_url`. | Pending |
| Payment return page | Add `src/pages/PaymentReturnPage.tsx` at `/payment/return`; read order/status params and link to order detail. | Pending |
| Payment failure states | Show retry/back-to-orders actions for failed/cancelled payment. | Pending |

**Backend dependency:** order creation must create a PayTabs/Stripe payment session and return `payment_url`; webhook must update payment/order status.

### Phase 3 - Admin Console V1

| Page | Route | Purpose | Status |
|---|---|---|---|
| Admin dashboard | `/admin` | KPIs: orders today, revenue, users, pending stores. | Pending |
| Users | `/admin/users` | List/search users, view profile, role/status controls. | Pending |
| Stores | `/admin/stores` | Pending approvals, approve/reject/suspend. | Pending |
| Orders | `/admin/orders` | All-orders oversight with filters. | Pending |
| Categories | `/admin/categories` | CRUD categories and image workflow. | Pending |

**Backend dependency:** list/search users, list/search stores, all-orders admin list, platform analytics, role changes, approval notes, audit logs.

### Phase 4 - Remittance / Padala Flow

| Task | Details | Status |
|---|---|---|
| PH catalog | Browse Puregold/PH-available items separately from Riyadh local stores. | Pending |
| SAR to PHP display | Show dual currency using backend FX rate cache. | Pending |
| Recipient form | Recipient name, phone, branch/pickup/delivery details. | Pending |
| PH checkout | Reuse checkout patterns with `order_type = "PH_REMITTANCE"`. | Pending |
| PH order history tab | Filter local Riyadh and PH remittance orders. | Pending |

**Backend dependency:** PH catalog ingestion, FX rate cache, recipient model/fields, PH fulfillment/status endpoints.

### Phase 5 - UX and Production Hardening

| Task | Status |
|---|---|
| More skeleton states on slower pages | Partial |
| Order status timeline polish | Pending |
| Infinite/load-more pagination where backend provides `next` | Pending |
| E2E tests for auth, cart, checkout, vendor order status | Pending |
| Sentry frontend integration | Pending |
| CI pipeline: build, tests, lint | Pending |
| Bundle splitting for large production chunk | Pending |
| PWA/SEO/i18n/RTL | Pending |

---

## Verification Notes

- `npm.cmd run build` passes as of May 24, 2026.
- Build warnings:
  - Browserslist/caniuse-lite data is outdated.
  - Main JS chunk is larger than 500 kB; consider route-level lazy loading/manual chunks.
- Manual Maps checks still need a browser API key and backend endpoints to validate end-to-end estimates.

---

## Historical Notes

The old `Frontend_Implementation_Plan.md` and the earlier sections in this file tracked April work such as cart, checkout, orders, account, search, API migration, and vendor dashboard. Those items are now summarized above as completed so future planning can focus on what remains.
