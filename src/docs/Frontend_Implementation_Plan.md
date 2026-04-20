# LEGASHOP — Frontend Implementation Plan

> Created: April 18, 2026
> Ref: `API_Integration_Map.md` (Apr 16) · `LEGASHOP_Business_Plan_v2.md` (Apr 18)

---

## Current State Summary

| Metric | Value |
|---|---|
| API endpoints fully connected | **22 / 34** (64 %) |
| Pages using real API | **14 / 17** |
| Pages still hardcoded / stub | **0** |
| React Query hooks available | **17** |
| Pages bypassing RQ hooks (direct `useEffect`) | **6** |
| Known bugs from audit | **0 critical, 4 important** |

---

## Phase 1 — Fix Critical Gaps (P0) ✅ COMPLETED

> All 4 critical gaps fixed on April 18, 2026.

### 1.1 ✅ Connect `StoresPage` to real API

| | |
|---|---|
| **File** | `src/pages/StoresPage.tsx` |
| **Problem** | ~~100 % hardcoded array of 8 fake stores. Links use array index (`/stores/${i+1}`) which breaks with real DB IDs.~~ |
| **What was done** | Replaced hardcoded stores with `useStores()` hook. Uses real `store.id` for links. Search filters on `name`, `name_ar`, `district`. Added loading skeleton + error state + empty state. |
| **Status** | ✅ Done |

### 1.2 ✅ Wire review submission form on `ProductPage`

| | |
|---|---|
| **Files** | `src/pages/ProductPage.tsx` |
| **Problem** | ~~Reviews display fine but no form to submit. `useCreateReview()` hook unused.~~ |
| **What was done** | Added `ReviewForm` component with interactive star rating (hover + click), comment textarea, submit via `useCreateReview()` mutation. Shows login prompt for unauthenticated users. Handles loading/error states. On success: prepends new review to list, shows toast, resets form. |
| **Status** | ✅ Done |

### 1.3 ✅ Fix delivery fee mismatch (3 SAR vs 5 SAR)

| | |
|---|---|
| **Files** | `src/hooks/use-cart.tsx` |
| **Problem** | ~~Frontend hardcodes `deliveryFee = 3 SAR`, backend charges `5 SAR`.~~ |
| **What was done** | Changed frontend `deliveryFee` to `5 SAR` to match backend. Added TODO comment for future per-store delivery fee. |
| **Status** | ✅ Done |

### 1.4 ✅ Fix stock restoration on order cancel (backend)

| | |
|---|---|
| **File** | `backend/orders/views.py` → `OrderCancelView` |
| **Problem** | ~~Stock decremented on order creation but never restored on cancel.~~ |
| **What was done** | Added `@transaction.atomic` to `OrderCancelView.update()`. After setting `status=CANCELLED`, loops through `order.items` and restores `product.stock += item.quantity`. |
| **Status** | ✅ Done |

---

## Phase 2 — Code Quality & Consistency (P0/P1) ✅ COMPLETED

> Goal: Remove tech debt that causes silent failures or stale data.

### 2.1 Migrate 6 pages from direct `useEffect` to React Query hooks ✅

| Page / Component | Previous | Migrated to | Status |
|---|---|---|---|
| `ProductPage.tsx` | `useEffect` + `fetchProductById` + `fetchProductReviews` | `useProduct(id)` + `useProductReviews(id)` | ✅ Done |
| `StorePage.tsx` | `useEffect` + `fetchStoreById` + `fetchStoreProducts` + `fetchStoreReviews` | `useStore(id)` + `useStoreProducts(id)` + `useStoreReviews(id)` | ✅ Done |
| `CheckoutPage.tsx` | `useEffect` + `fetchAddresses` | `useAddresses()` + `useCreateAddress()` + `useCreateOrder()` | ✅ Done |
| `AddressesSection.tsx` | direct `fetchAddresses` + `createAddress` + `updateAddress` + `deleteAddress` | `useAddresses()` + `useCreateAddress()` + `useUpdateAddress()` + `useDeleteAddress()` | ✅ Done |
| `ProfileSection.tsx` | reads from auth context (stale localStorage) | `useProfile()` + `useUpdateProfile()` for fresh data on mount | ✅ Done |
| `SecuritySection.tsx` | direct `changePassword()` call | `useChangePassword()` mutation hook | ✅ Done |

**Benefits:** automatic caching, background refetch, deduplication, loading/error states via RQ.

### 2.2 Fix `OrderDetailPage` address display ✅

| | |
|---|---|
| **File** | `src/pages/OrderDetailPage.tsx` + `backend/orders/serializers.py` |
| **What was done** | Added `DeliveryAddressSerializer` to backend `OrderSerializer` (field: `delivery_address_data`). Updated frontend `Order` type with `delivery_address_data` object. Updated `OrderDetailPage` to display `street`, `district`, `city`, and `label` from the nested address. |
| **Status** | ✅ Done |

### 2.3 Remove mock-data fallbacks in `api.ts` ✅

| | |
|---|---|
| **File** | `src/lib/api.ts` |
| **What was done** | Removed all 12 `catch { import("./mock-data") }` blocks from: `fetchProducts`, `fetchProductById`, `fetchDeals`, `fetchCategories`, `fetchStores`, `fetchStoreById`, `fetchStoreProducts`, `fetchProductReviews`, `fetchStoreReviews`, `fetchOrders`, `fetchAddresses`, `searchAll`. All functions now throw on error, letting React Query handle error states. |
| **Status** | ✅ Done |

### 2.4 Add product seed images ✅

| | |
|---|---|
| **What was done** | Added `image_url` (placehold.co placeholder images with product names) to all 35 products in `seed_data.py`. Updated seed defaults to include `image_url` field. |
| **Status** | ✅ Done |

---

## Phase 3 — Features for Launch (P0)

> Goal: Payment processing, maps, vendor dashboard — the remaining blockers before any real user can transact.

### 3.1 Google Maps integration

| | |
|---|---|
| **Install** | `bun add @vis.gl/react-google-maps` |
| **Env var** | `VITE_GOOGLE_MAPS_KEY` in `.env` |
| **Components to build** | |

| Component | Page | Purpose |
|---|---|---|
| `MapsProvider` | `App.tsx` (wraps all routes) | `<APIProvider>` with key + `places,geometry` libs |
| `NearbyStoresMap` | `StoresPage.tsx` | Map with store markers + user location pin |
| `AddressPickerMap` | `AddressesSection.tsx`, `CheckoutPage.tsx` | Draggable pin + Places Autocomplete → lat/lng |
| `LiveTrackingMap` | `OrderDetailPage.tsx` | Rider marker updated via polling (WebSocket in Phase 5) |

**Backend dependency:** `GET /api/stores/nearby/?lat=&lng=&radius_km=` (PostGIS) — can stub with Haversine SQL initially.

**Effort:** ~3 hr

### 3.2 PayTabs payment integration

| | |
|---|---|
| **Flow** | Hosted Payment Page (HPP) — PCI SAQ-A |
| **Frontend changes** | |

1. `CheckoutPage.tsx`: When `payment_method !== 'COD'`, after `createOrder()`, backend returns `{ payment_url }` → `window.location.href = payment_url`.
2. New `src/pages/PaymentReturnPage.tsx`: mounted at `/payment/return` → reads `?o=<order_uuid>&status=` → shows success/failure UI → links to order detail.
3. Route: add `/payment/return` to `App.tsx`.

**Backend dependency:** `POST /api/orders/create/` needs to call PayTabs API and return `payment_url`. Webhook at `POST /api/webhooks/paytabs/`.

**Effort:** ~1.5 hr (frontend) + ~2 hr (backend)

### 3.3 Vendor Dashboard (frontend)

| | |
|---|---|
| **Route prefix** | `/vendor/*` (protected by `role === 'VENDOR'` guard) |
| **Pages** | |

| Page | Route | Backend endpoint | Priority |
|---|---|---|---|
| `VendorDashboard` | `/vendor` | — | P0 |
| `VendorProducts` | `/vendor/products` | `GET /api/vendor/products/` | P0 |
| `VendorProductForm` | `/vendor/products/new`, `/vendor/products/:id/edit` | `POST / PATCH /api/vendor/products/` | P0 |
| `VendorOrders` | `/vendor/orders` | `GET /api/vendor/orders/` | P0 |
| `VendorOrderDetail` | `/vendor/orders/:id` | `PATCH /api/vendor/orders/:id/` | P0 |
| `VendorStoreSettings` | `/vendor/store` | `PATCH /api/stores/:id/update/` | P1 |

**Key features:**
- Product CRUD with Cloudinary image upload
- Order queue: see incoming orders, accept/reject, update status
- Basic analytics (order count, revenue this week)

**Effort:** ~4–6 hr

---

## Phase 4 — UX Polish (P1)

> Goal: The app feels responsive and professional.

### 4.1 Infinite scroll / "Load More" pagination

| | |
|---|---|
| **Affected pages** | `CategoriesPage`, `StoresPage`, `OrdersPage`, deal pages |
| **How** | Backend already returns `{ count, next, results }`. Use `useInfiniteQuery` from React Query or add a "Load More" button that appends next page results. |
| **Effort** | ~1 hr |

### 4.2 Search debounce & autocomplete dropdown

| | |
|---|---|
| **File** | `src/components/Navbar.tsx` (search input) |
| **How** | Add 300 ms debounce on input. Show a dropdown with live results from `searchAll(query)` — 3 products, 2 stores, 2 categories max. Click to navigate. |
| **Effort** | ~45 min |

### 4.3 Skeleton loading states

| | |
|---|---|
| **Affected pages** | `StoresPage`, `ProductPage`, `StorePage`, `CategoriesPage` |
| **How** | Add `Skeleton` component (shadcn/ui has one) for product cards, store cards, category grid while `isLoading`. `SearchResults.tsx` already has a good pattern to copy. |
| **Effort** | ~30 min |

### 4.4 Order status timeline

| | |
|---|---|
| **File** | `src/pages/OrderDetailPage.tsx` |
| **How** | Add a visual step timeline: `PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`. Highlight current step. Grey out future steps. Show timestamps where available. |
| **Effort** | ~45 min |

### 4.5 Toast notifications for order updates

| | |
|---|---|
| **How** | Use `sonner` (already likely in shadcn stack) or `react-hot-toast`. Show toast on: order placed, order cancelled, review submitted, address saved. |
| **Effort** | ~20 min |

---

## Phase 5 — i18n, Realtime, Remittance (P1)

### 5.1 Internationalization (EN / TL / AR)

| | |
|---|---|
| **Install** | `bun add react-i18next i18next i18next-browser-languagedetector` |
| **Structure** | `src/i18n/{en,tl,ar}/common.json` |
| **RTL** | Toggle `<html dir="rtl">` for Arabic. Use Tailwind `rtl:` variants. |
| **Backend** | Already stores `name_tl`, `name_ar` on products/categories. Add `Accept-Language` header in `authFetch`. |
| **Effort** | ~3 hr (full app) |

### 5.2 WebSocket order tracking

| | |
|---|---|
| **How** | Connect to `wss://api.legashop.com/ws/orders/<id>/` on `OrderDetailPage`. Update rider marker on `LiveTrackingMap` in real-time. Fallback: poll `GET /api/orders/:id/` every 15 s. |
| **Backend dependency** | Django Channels + Redis (not yet set up). |
| **Effort** | ~1.5 hr (frontend) + ~2 hr (backend) |

### 5.3 Remittance (Padala) flow

| | |
|---|---|
| **File** | `src/pages/RemittancePage.tsx` (currently static) |
| **What to build** | Browse Puregold-tagged catalog. Add items to PH cart. Enter recipient details (name, phone, Puregold branch). Show SAR→PHP conversion at live rate. Checkout flow (reuse `CheckoutPage` patterns). Confirmation with SMS tracking. |
| **Backend dependency** | PH remittance endpoints, FX rate cache, Puregold CSV ingest — all P1 backend. |
| **Effort** | ~4 hr (frontend) + ~3 hr (backend) |

---

## Phase 6 — Admin, Security, Deployment (P1)

### 6.1 Admin Console

| Page | Route | Purpose |
|---|---|---|
| `AdminDashboard` | `/admin` | KPIs: orders today, revenue, new users |
| `AdminUsers` | `/admin/users` | List/search users, change roles |
| `AdminStores` | `/admin/stores` | Approve/reject stores, edit details |
| `AdminOrders` | `/admin/orders` | View all orders, handle disputes |
| `AdminCategories` | `/admin/categories` | CRUD categories with image upload |

**Effort:** ~4 hr

### 6.2 Security hardening

| Item | Action |
|---|---|
| CORS lockdown | Set `CORS_ALLOWED_ORIGINS` to production domain (currently `CORS_ALLOW_ALL_ORIGINS = True`) |
| Rate limiting | Add `django-ratelimit` on `/login/`, `/signup/`, `/token/refresh/` |
| Email verification | Add verification flow on signup |
| Sentry | Add `@sentry/react` to frontend, `sentry-sdk` to backend |
| HTTPS-only cookies | Migrate refresh token from `localStorage` to `httpOnly` cookie |

### 6.3 CI/CD & Deployment

| Item | Tool | Action |
|---|---|---|
| Backend deploy | Railway / Render | Django + PostgreSQL + Redis |
| Frontend deploy | Vercel / Netlify | Vite build, `VITE_API_BASE_URL` → prod |
| CI pipeline | GitHub Actions | `tsc --noEmit` + `vitest run` + `pytest` on every PR |
| DB backups | Automated | Daily `pg_dump` to S3 |

---

## Implementation Order (Recommended Sprint Plan)

### Sprint 1 (Days 1–3) — Critical Fixes

| # | Task | Phase | Effort |
|---|---|---|---|
| 1 | Connect StoresPage to `useStores()` | 1.1 | 20 min |
| 2 | Wire review form on ProductPage | 1.2 | 30 min |
| 3 | Fix delivery fee mismatch (3→5 SAR) | 1.3 | 5 min |
| 4 | Fix stock restoration on cancel | 1.4 | 10 min |
| 5 | Fix OrderDetailPage address display | 2.2 | 15 min |
| 6 | Remove mock-data fallbacks in api.ts | 2.3 | 30 min |
| 7 | Add skeleton loading states | 4.3 | 30 min |
| 8 | Add order status timeline | 4.4 | 45 min |

### Sprint 2 (Days 4–7) — React Query Migration & UX

| # | Task | Phase | Effort |
|---|---|---|---|
| 9 | Migrate ProductPage to RQ hooks | 2.1 | 20 min |
| 10 | Migrate StorePage to RQ hooks | 2.1 | 20 min |
| 11 | Migrate CheckoutPage to RQ hooks | 2.1 | 15 min |
| 12 | Migrate AddressesSection to RQ hooks | 2.1 | 20 min |
| 13 | Migrate ProfileSection to `useProfile()` | 2.1 | 15 min |
| 14 | Infinite scroll / "Load More" | 4.1 | 1 hr |
| 15 | Search debounce + autocomplete dropdown | 4.2 | 45 min |
| 16 | Toast notifications | 4.5 | 20 min |

### Sprint 3 (Days 8–14) — Maps & Payments

| # | Task | Phase | Effort |
|---|---|---|---|
| 17 | Google Maps provider + NearbyStoresMap | 3.1 | 1.5 hr |
| 18 | AddressPickerMap component | 3.1 | 1 hr |
| 19 | PayTabs payment flow (frontend) | 3.2 | 1.5 hr |
| 20 | PaymentReturnPage | 3.2 | 30 min |
| 21 | Add product seed images | 2.4 | 20 min |

### Sprint 4 (Days 15–21) — Vendor Dashboard

| # | Task | Phase | Effort |
|---|---|---|---|
| 22 | VendorProducts page + CRUD | 3.3 | 2 hr |
| 23 | VendorOrders page + status updates | 3.3 | 2 hr |
| 24 | VendorStoreSettings page | 3.3 | 1 hr |
| 25 | Vendor route guard + layout | 3.3 | 30 min |

### Sprint 5 (Days 22–28) — i18n, Realtime, Polish

| # | Task | Phase | Effort |
|---|---|---|---|
| 26 | i18n setup (EN/TL/AR + RTL) | 5.1 | 3 hr |
| 27 | WebSocket order tracking | 5.2 | 1.5 hr |
| 28 | Admin console (basic) | 6.1 | 4 hr |

### Sprint 6 (Days 29–35) — Security, Deployment, Remittance

| # | Task | Phase | Effort |
|---|---|---|---|
| 29 | Security hardening (CORS, rate limit, Sentry) | 6.2 | 2 hr |
| 30 | CI/CD pipeline | 6.3 | 1.5 hr |
| 31 | Deploy backend (Railway/Render) | 6.3 | 1 hr |
| 32 | Deploy frontend (Vercel/Netlify) | 6.3 | 30 min |
| 33 | Remittance (Padala) flow | 5.3 | 4 hr |

---

## Risk Notes

| Risk | Mitigation |
|---|---|
| PostGIS not ready for Sprint 3 maps | Use client-side Haversine distance on existing `lat/lng` columns as fallback |
| PayTabs sandbox delays | Build full flow against mock responses; swap URL on approval |
| Vendor dashboard scope creep | Ship minimal CRUD first, iterate based on vendor feedback |
| i18n breaks layout | Test Arabic RTL early; Tailwind `rtl:` variants handle 90 % of cases |

---

*This plan is a living document. Update status per sprint.*
