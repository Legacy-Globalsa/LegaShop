# LegaShop — API Integration Map

> Last updated: April 16, 2026
> Base URL: `http://127.0.0.1:8000/api`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Profile & Password](#2-profile--password)
3. [Addresses](#3-addresses)
4. [Categories](#4-categories)
5. [Products (Public)](#5-products-public)
6. [Products (Vendor)](#6-products-vendor)
7. [Reviews](#7-reviews)
8. [Stores](#8-stores)
9. [Orders (Customer)](#9-orders-customer)
10. [Orders (Vendor)](#10-orders-vendor)
11. [Search](#11-search)
12. [Integration Summary](#12-integration-summary)
13. [Known Issues & Gaps](#13-known-issues--gaps)
14. [Suggested Improvements](#14-suggested-improvements)

---

## 1. Authentication

### `POST /api/signup/` — Register new user

| | |
|---|---|
| **Backend** | `SignupView` → `users/views.py` |
| **Permission** | `AllowAny` |
| **Request** | `{ name, email, phone_number?, role?, password, confirm_password }` |
| **Response** | `{ user: {id, first_name, email, phone_number, role}, tokens: {access, refresh} }` |
| **Frontend function** | `apiSignup()` → `api.ts` |
| **Used in** | `signup-form.tsx` (direct call) |
| **Status** | ✅ Fully connected |

### `POST /api/login/` — Login with email/password

| | |
|---|---|
| **Backend** | `LoginView` → `users/views.py` |
| **Permission** | `AllowAny` |
| **Request** | `{ email, password }` |
| **Response** | `{ user, tokens }` |
| **Frontend function** | `apiLogin()` → `api.ts` |
| **Used in** | `login-form.tsx` (direct call) |
| **Status** | ✅ Fully connected |

### `POST /api/auth/google/` — Google OAuth login

| | |
|---|---|
| **Backend** | `GoogleLoginView` → `users/views.py` |
| **Permission** | `AllowAny` |
| **Request** | `{ id_token }` |
| **Response** | `{ user, tokens }` |
| **Frontend function** | `apiGoogleLogin()` → `api.ts` |
| **Used in** | `login-form.tsx`, `signup-form.tsx` |
| **Status** | ✅ Fully connected |

### `POST /api/token/refresh/` — Refresh JWT access token

| | |
|---|---|
| **Backend** | `TokenRefreshView` (simplejwt built-in) → `users/urls.py` |
| **Permission** | `AllowAny` |
| **Request** | `{ refresh }` |
| **Response** | `{ access, refresh }` (rotated) |
| **Frontend function** | `tryRefreshToken()` → `api.ts` (auto-called by `authFetch` on 401) |
| **Features** | Rotate refresh tokens on use, blacklist old tokens |
| **Status** | ✅ Fully connected |

---

## 2. Profile & Password

### `GET /api/profile/` — Get current user profile

| | |
|---|---|
| **Backend** | `ProfileView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Response** | `{ id, first_name, email, phone_number, role }` |
| **Frontend function** | `fetchProfile()` → `api.ts` |
| **React Query hook** | `useProfile()` → `use-api.ts` |
| **Used in** | `ProfileSection.tsx` reads from auth context instead of fetching fresh |
| **Status** | ⚠️ Function exists but ProfileSection reads cached auth context, not a fresh API call |

### `PATCH /api/profile/` — Update user profile

| | |
|---|---|
| **Backend** | `ProfileView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Request** | `{ first_name?, phone_number? }` |
| **Response** | Updated user object |
| **Frontend function** | `updateProfile()` → `api.ts` |
| **React Query hook** | `useUpdateProfile()` → `use-api.ts` |
| **Used in** | `ProfileSection.tsx` (direct call, not hook) |
| **Status** | ✅ Connected (bypasses RQ hook) |

### `POST /api/change-password/` — Change password

| | |
|---|---|
| **Backend** | `ChangePasswordView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Request** | `{ current_password, new_password, confirm_new_password }` |
| **Response** | `{ detail: "Password changed successfully." }` |
| **Frontend function** | `changePassword()` → `api.ts` |
| **React Query hook** | `useChangePassword()` → `use-api.ts` |
| **Used in** | `SecuritySection.tsx` (direct call, not hook) |
| **Status** | ✅ Connected (bypasses RQ hook) |

---

## 3. Addresses

### `GET /api/addresses/` — List user addresses

| | |
|---|---|
| **Backend** | `AddressListCreateView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Response** | `[{ id, label, street, city, district, latitude, longitude, is_default, created_at }]` |
| **Frontend function** | `fetchAddresses()` → `api.ts` |
| **React Query hook** | `useAddresses()` → `use-api.ts` |
| **Used in** | `AddressesSection.tsx` (direct call), `CheckoutPage.tsx` (direct call) |
| **Status** | ✅ Connected (mock fallback if API fails) |

### `POST /api/addresses/` — Create address

| | |
|---|---|
| **Backend** | `AddressListCreateView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Request** | `{ label, street, city?, district, latitude?, longitude?, is_default }` |
| **Response** | Created address object |
| **Frontend function** | `createAddress()` → `api.ts` |
| **React Query hook** | `useCreateAddress()` → `use-api.ts` |
| **Used in** | `AddressesSection.tsx` (direct call), `CheckoutPage.tsx` (direct call) |
| **Status** | ✅ Connected (bypasses RQ hook) |

### `PATCH /api/addresses/:id/` — Update address

| | |
|---|---|
| **Backend** | `AddressDetailView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Request** | Any address field(s) |
| **Frontend function** | `updateAddress()` → `api.ts` |
| **React Query hook** | `useUpdateAddress()` → `use-api.ts` |
| **Used in** | `AddressesSection.tsx` (direct call) |
| **Status** | ✅ Connected |

### `DELETE /api/addresses/:id/` — Delete address

| | |
|---|---|
| **Backend** | `AddressDetailView` → `users/views.py` |
| **Permission** | `IsAuthenticated` |
| **Frontend function** | `deleteAddress()` → `api.ts` |
| **React Query hook** | `useDeleteAddress()` → `use-api.ts` |
| **Used in** | `AddressesSection.tsx` (direct call) |
| **Status** | ✅ Connected |

---

## 4. Categories

### `GET /api/categories/` — List all categories

| | |
|---|---|
| **Backend** | `CategoryListView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Response** | Paginated: `{ count, next, results: [{ id, name, name_tl, name_ar, parent, image_url, image, is_active, subcategories, created_at }] }` |
| **Search fields** | `?search=rice` searches `name`, `name_tl`, `name_ar` |
| **Frontend function** | `fetchCategories()` → `api.ts` |
| **React Query hook** | `useCategories()` → `use-api.ts` |
| **Used in** | `CategoriesPage.tsx` (via hook) |
| **Status** | ✅ Connected (mock fallback, pagination handled) |

### `GET /api/categories/:id/` — Get single category

| | |
|---|---|
| **Backend** | `CategoryDetailView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Frontend function** | ❌ None |
| **Used in** | Nowhere |
| **Status** | 🔴 Backend exists, no frontend integration |

### `POST /api/categories/create/` — Admin create category

| | |
|---|---|
| **Backend** | `CategoryCreateView` → `products/views.py` |
| **Permission** | `IsAdmin` |
| **Frontend function** | ❌ None |
| **Used in** | Nowhere (no admin panel yet) |
| **Status** | 🔵 Admin-only — not needed for customer frontend |

### `PUT|PATCH /api/categories/:id/update/` — Admin update category

| | |
|---|---|
| **Backend** | `CategoryUpdateView` → `products/views.py` |
| **Permission** | `IsAdmin` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Admin-only |

### `DELETE /api/categories/:id/delete/` — Admin delete category

| | |
|---|---|
| **Backend** | `CategoryDeleteView` → `products/views.py` |
| **Permission** | `IsAdmin` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Admin-only |

---

## 5. Products (Public)

### `GET /api/products/` — List all products

| | |
|---|---|
| **Backend** | `ProductListView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Query params** | `?category=ID`, `?store=ID`, `?deal_type=ONE_RIYAL|FIVE_RIYAL`, `?search=term`, `?ordering=price|-price|created_at` |
| **Response** | Paginated: `{ count, next, results: [{ id, store, store_name, category, category_name, name, name_tl, name_ar, description, price, sale_price, currency, stock, unit, image_url, image, is_deal, deal_type, is_active, created_at }] }` |
| **Frontend function** | `fetchProducts(params?)` → `api.ts` |
| **React Query hook** | `useProducts(params?)` → `use-api.ts` |
| **Used in** | `FeaturedProducts.tsx` (hook), `CategoriesPage.tsx` (hook) |
| **Status** | ✅ Connected (mock fallback, pagination handled via `unwrapResults`) |

### `GET /api/products/:id/` — Get single product

| | |
|---|---|
| **Backend** | `ProductDetailView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Frontend function** | `fetchProductById(id)` → `api.ts` |
| **React Query hook** | `useProduct(id)` → `use-api.ts` |
| **Used in** | `ProductPage.tsx` (direct call in useEffect, not hook) |
| **Status** | ✅ Connected (mock fallback, bypasses RQ hook) |

### `GET /api/products/deals/` — List deal products

| | |
|---|---|
| **Backend** | `ProductDealsView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Query params** | `?deal_type=ONE_RIYAL|FIVE_RIYAL` (optional — omit for all deals) |
| **Response** | Paginated: `{ count, next, results: [...] }` |
| **Frontend function** | `fetchDeals(dealType?)` → `api.ts` |
| **React Query hook** | `useDeals(dealType?)` → `use-api.ts` |
| **Used in** | `OneSarDeals.tsx` (hook), `FiveSarDeals.tsx` (hook), `FlashDeals.tsx` (hook, no filter) |
| **Status** | ✅ Connected (mock fallback, pagination handled) |

---

## 6. Products (Vendor)

### `POST /api/vendor/products/` — Vendor create product

| | |
|---|---|
| **Backend** | `VendorProductCreateView` → `products/views.py` |
| **Permission** | `IsVendor` |
| **Request** | `{ category, name, description?, price, sale_price?, stock, unit?, image_url?, image?, is_deal, deal_type? }` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only — no vendor dashboard in frontend yet |

### `PUT|PATCH /api/vendor/products/:id/` — Vendor update product

| | |
|---|---|
| **Backend** | `VendorProductUpdateView` → `products/views.py` |
| **Permission** | `IsVendor` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only |

### `DELETE /api/vendor/products/:id/delete/` — Vendor delete product

| | |
|---|---|
| **Backend** | `VendorProductDeleteView` → `products/views.py` |
| **Permission** | `IsVendor` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only |

---

## 7. Reviews

### `GET /api/products/:id/reviews/` — Product reviews

| | |
|---|---|
| **Backend** | `ProductReviewListView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Response** | Paginated: `{ count, next, results: [{ id, user, reviewer_name, store, product, rating, comment, created_at }] }` |
| **Frontend function** | `fetchProductReviews(productId)` → `api.ts` |
| **React Query hook** | `useProductReviews(productId)` → `use-api.ts` |
| **Used in** | `ProductPage.tsx` (direct call in useEffect) |
| **Status** | ✅ Connected (mock fallback, pagination handled, bypasses RQ hook) |

### `GET /api/stores/:id/reviews/` — Store reviews

| | |
|---|---|
| **Backend** | `StoreReviewListView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Frontend function** | `fetchStoreReviews(storeId)` → `api.ts` |
| **React Query hook** | `useStoreReviews(storeId)` → `use-api.ts` |
| **Used in** | `StorePage.tsx` (direct call in useEffect) |
| **Status** | ✅ Connected (mock fallback, pagination handled, bypasses RQ hook) |

### `POST /api/reviews/` — Submit a review

| | |
|---|---|
| **Backend** | `ReviewCreateView` → `products/views.py` |
| **Permission** | `IsAuthenticated` |
| **Request** | `{ store, product?, rating (1-5), comment? }` |
| **Frontend function** | `createReview()` → `api.ts` |
| **React Query hook** | `useCreateReview()` → `use-api.ts` |
| **Used in** | ❌ **NOT WIRED** — `ProductPage.tsx` has a review stub that only shows a toast |
| **Status** | 🔴 Backend + function + hook exist, but UI form is non-functional |

---

## 8. Stores

### `GET /api/stores/` — List all stores

| | |
|---|---|
| **Backend** | `StoreListView` → `stores/views.py` |
| **Permission** | `AllowAny` |
| **Response** | Paginated: `{ count, next, results: [{ id, owner, owner_name, name, name_ar, description, phone, latitude, longitude, delivery_zone, avg_delivery_min, rating, is_active, image_url, image, district, created_at }] }` |
| **Search fields** | `?search=term` searches `name`, `name_ar`, `description`, `district` |
| **Frontend function** | `fetchStores()` → `api.ts` |
| **React Query hook** | `useStores()` → `use-api.ts` |
| **Used in** | Not used by `StoresPage.tsx` (still hardcoded) |
| **⚠️ NOT used in** | **`StoresPage.tsx`** — this page is 100% hardcoded |
| **Status** | 🔴 **StoresPage is NOT connected** — uses hardcoded array of fake stores |

### `GET /api/stores/:id/` — Get single store

| | |
|---|---|
| **Backend** | `StoreDetailView` → `stores/views.py` |
| **Permission** | `AllowAny` |
| **Frontend function** | `fetchStoreById(id)` → `api.ts` |
| **React Query hook** | `useStore(id)` → `use-api.ts` |
| **Used in** | `StorePage.tsx` (direct call in useEffect) |
| **Status** | ✅ Connected (mock fallback, bypasses RQ hook) |

### `GET /api/products/?store=X` — Store products (uses products endpoint)

| | |
|---|---|
| **Frontend function** | `fetchStoreProducts(storeId)` → `api.ts` |
| **React Query hook** | `useStoreProducts(storeId)` → `use-api.ts` |
| **Used in** | `StorePage.tsx` (direct call in useEffect) |
| **Status** | ✅ Connected (mock fallback, pagination handled) |

### `POST /api/stores/create/` — Vendor create store

| | |
|---|---|
| **Backend** | `StoreCreateView` → `stores/views.py` |
| **Permission** | `IsVendor` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only |

### `PUT|PATCH /api/stores/:id/update/` — Vendor update store

| | |
|---|---|
| **Backend** | `StoreUpdateView` → `stores/views.py` |
| **Permission** | `IsVendor` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only |

### `PUT|PATCH /api/admin/stores/:id/` — Admin update store

| | |
|---|---|
| **Backend** | `AdminStoreUpdateView` → `stores/views.py` |
| **Permission** | `IsAdmin` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Admin-only |

---

## 9. Orders (Customer)

### `GET /api/orders/` — List my orders

| | |
|---|---|
| **Backend** | `OrderListView` → `orders/views.py` |
| **Permission** | `IsAuthenticated` |
| **Response** | Paginated: `{ count, next, results: [{ id, user, store, store_name, delivery_address, order_type, status, subtotal, delivery_fee, total, currency, note, items: [...], payment: {...}, created_at, updated_at }] }` |
| **Frontend function** | `fetchOrders()` → `api.ts` |
| **React Query hook** | `useOrders()` → `use-api.ts` |
| **Used in** | `OrdersPage.tsx` (via hook) |
| **Status** | ✅ Connected (mock fallback, pagination handled) |

### `GET /api/orders/:id/` — Get single order

| | |
|---|---|
| **Backend** | `OrderDetailView` → `orders/views.py` |
| **Permission** | `IsAuthenticated` |
| **Frontend function** | `fetchOrderById(id)` → `api.ts` |
| **React Query hook** | `useOrder(id)` → `use-api.ts` |
| **Used in** | `OrderDetailPage.tsx` (via hook) |
| **Status** | ✅ Connected (no mock fallback) |

### `POST /api/orders/create/` — Place new order

| | |
|---|---|
| **Backend** | `OrderCreateView` → `orders/views.py` |
| **Permission** | `IsCustomer` |
| **Request** | `{ store, delivery_address, order_type?, payment_method?, note?, items: [{product, quantity}] }` |
| **Response** | Full order with computed subtotal/delivery_fee/total, nested items + payment |
| **Frontend function** | `createOrder()` → `api.ts` |
| **React Query hook** | `useCreateOrder()` → `use-api.ts` |
| **Used in** | `CheckoutPage.tsx` (direct call) |
| **Status** | ✅ Connected |
| **Note** | Backend charges 5 SAR delivery fee; frontend cart shows 3 SAR — **mismatch** |

### `PUT /api/orders/:id/cancel/` — Cancel order

| | |
|---|---|
| **Backend** | `OrderCancelView` → `orders/views.py` |
| **Permission** | `IsAuthenticated` |
| **Constraint** | Only if status = `PENDING` |
| **Frontend function** | `cancelOrder(id)` → `api.ts` |
| **React Query hook** | `useCancelOrder()` → `use-api.ts` |
| **Used in** | `OrderDetailPage.tsx` (via hook) |
| **Status** | ✅ Connected |
| **Bug** | ⚠️ Cancelled orders do not restore product stock |

---

## 10. Orders (Vendor)

### `GET /api/vendor/orders/` — List store's incoming orders

| | |
|---|---|
| **Backend** | `VendorOrderListView` → `orders/views.py` |
| **Permission** | `IsVendor` |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only — no vendor dashboard yet |

### `PUT|PATCH /api/vendor/orders/:id/` — Update order status

| | |
|---|---|
| **Backend** | `VendorOrderUpdateView` → `orders/views.py` |
| **Permission** | `IsVendor` |
| **Valid transitions** | PENDING→CONFIRMED/CANCELLED, CONFIRMED→PREPARING/CANCELLED, PREPARING→OUT_FOR_DELIVERY, OUT_FOR_DELIVERY→DELIVERED |
| **Frontend function** | ❌ None |
| **Status** | 🔵 Vendor-only |

---

## 11. Search

### `GET /api/search/?q=term` — Combined search (products + stores + categories)

| | |
|---|---|
| **Backend** | `search_view` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Query params** | `?q=search term` (required) |
| **Response** | `{ products: [...], stores: [...], categories: [...] }` |
| **Frontend function** | `searchAll(query)` → `api.ts` |
| **React Query hook** | `useSearch(query)` → `use-api.ts` |
| **Used in** | `SearchResults.tsx` (direct call via `searchAll`) |
| **Status** | ✅ Fully connected (mock fallback, server-side search) |

---

## 12. Integration Summary

### By Status

| Status | Count | Meaning |
|--------|-------|---------|
| ✅ Fully connected | 22 | Frontend calls the real API with pagination support |
| 🔴 Gap / broken | 3 | Backend exists but frontend is missing or non-functional |
| 🔵 Admin/Vendor only | 9 | No customer-facing frontend needed (yet) |

### Page Connection Matrix

| Page / Component | API Source | React Query? | Mock Fallback? | Auth Guard? |
|---|---|---|---|---|
| `login-form.tsx` | `apiLogin`, `apiGoogleLogin` | — | No | N/A |
| `signup-form.tsx` | `apiSignup`, `apiGoogleLogin` | — | No | N/A |
| `FlashDeals.tsx` | `useDeals()` | ✅ | Yes | ✅ |
| `FeaturedProducts.tsx` | `useProducts()` | ✅ | Yes | ✅ |
| `OneSarDeals.tsx` | `useDeals("ONE_RIYAL")` | ✅ | Yes | ✅ |
| `FiveSarDeals.tsx` | `useDeals("FIVE_RIYAL")` | ✅ | Yes | ✅ |
| `CategoriesPage.tsx` | `useCategories()` + `useProducts()` | ✅ | Yes | ✅ |
| `ProductPage.tsx` | `fetchProductById` + `fetchProductReviews` | ❌ direct | Yes | ✅ |
| **`StoresPage.tsx`** | **NONE — 100% hardcoded** | ❌ | N/A | ❌ |
| `StorePage.tsx` | `fetchStoreById` + `fetchStoreProducts` + `fetchStoreReviews` | ❌ direct | Yes | ✅ |
| `SearchResults.tsx` | `searchAll(query)` — backend server-side search | ❌ direct | Yes (client filter) | ✅ |
| `CheckoutPage.tsx` | `fetchAddresses` + `createAddress` + `createOrder` | ❌ direct | Partial | ProtectedRoute |
| `OrdersPage.tsx` | `useOrders()` | ✅ | Yes | ProtectedRoute |
| `OrderDetailPage.tsx` | `useOrder()` + `useCancelOrder()` | ✅ | No | ProtectedRoute |
| `OrderConfirmationPage.tsx` | None (static) | — | — | ProtectedRoute |
| `ProfileSection.tsx` | `updateProfile` | ❌ direct | No | ProtectedRoute |
| `AddressesSection.tsx` | Full CRUD addresses | ❌ direct | Partial | ProtectedRoute |
| `SecuritySection.tsx` | `changePassword` | ❌ direct | No | ProtectedRoute |

### Infrastructure Status

| Feature | Status |
|---|---|
| JWT token refresh | ✅ `POST /api/token/refresh/` — auto-refresh on 401, tokens rotate, old ones blacklisted |
| Pagination | ✅ Global PAGE_SIZE=20, all list endpoints return `{count, next, results}` |
| Server-side search | ✅ `GET /api/search/?q=` — searches products, stores, categories with SQL `icontains` |
| Image storage | ✅ Cloudinary via `STORAGES` dict (Django 6.0), `ImageField` on Product, Store, Category |
| Per-user cart | ✅ Cart scoped to user ID in localStorage (`legashop_cart_{userId}`) |
| Seed data | ✅ `python manage.py seed_data` — 35 products, 3 stores, 8 categories, 4 test accounts |

---

## 13. Known Issues & Gaps

### 🔴 Critical — Must Fix

| # | Issue | Location | Fix |
|---|---|---|---|
| 1 | **StoresPage is 100% hardcoded** — doesn't call any API, shows fake stores | `StoresPage.tsx` | Replace with `useStores()` hook |
| 2 | **Review form is non-functional** — "Write a Review" on ProductPage shows a toast but doesn't submit anything | `ProductPage.tsx` | Wire up to `createReview()` / `useCreateReview()` |
| 3 | **Delivery fee mismatch** — Cart context hardcodes 3 SAR, backend charges 5 SAR | `use-cart.tsx` vs `orders/views.py` | Sync to a single source of truth |
| 4 | **Cancelled orders don't restore stock** — product stock is decremented on order creation but never restored on cancel | `orders/views.py` | Add stock restoration logic in `OrderCancelView` |

### ⚠️ Important — Should Fix

| # | Issue | Location | Fix |
|---|---|---|---|
| 5 | **6 pages bypass React Query hooks** — lose caching, dedup, background refetch | ProductPage, StorePage, CheckoutPage, AddressesSection, ProfileSection | Migrate to `use-api.ts` hooks |
| 6 | **OrderDetailPage address display** — shows hardcoded "Riyadh, Saudi Arabia" instead of actual delivery address | `OrderDetailPage.tsx` | Read `order.delivery_address` data or nest address in order serializer |
| 7 | **ProfileSection doesn't fetch fresh data** — reads from auth context (localStorage) on mount | `ProfileSection.tsx` | Use `useProfile()` hook to fetch fresh data |
| 8 | **Product images are empty** — seed data has no image URLs, products show blank placeholders | Seed data / admin | Add product image URLs or upload images via vendor dashboard |

---

## 14. Suggested Improvements

### 🏗️ High Priority — Core Features

| # | Suggestion | Impact | Effort | Details |
|---|---|---|---|---|
| 1 | **Vendor Dashboard** | 🔥🔥🔥 | 2-3 hrs | Build a `/vendor` dashboard with product CRUD, image upload (Cloudinary), order management, and store settings. Backend has 7 vendor endpoints ready. |
| 2 | **Connect StoresPage to API** | 🔥🔥 | 20 min | Replace hardcoded stores in `StoresPage.tsx` with `useStores()` hook and add actual map/distance sorting using store `latitude`/`longitude`. |
| 3 | **Wire up review submission form** | 🔥🔥 | 30 min | Complete the "Write a Review" modal on `ProductPage.tsx` to actually POST to `/api/reviews/`. Add star rating selector and confirmation feedback. |
| 4 | **Stock restoration on cancel** | 🔥🔥 | 10 min | When `OrderCancelView` updates status to CANCELLED, loop through `order.items` and add quantities back to `product.stock`. |

### ⚡ Performance & UX

| # | Suggestion | Impact | Effort | Details |
|---|---|---|---|---|
| 5 | **Infinite scroll / "Load More" pagination** | 🔥🔥 | 1 hr | Backend returns `next` URL in paginated responses. Add a "Load More" button or `IntersectionObserver` to fetch the next page. Currently only the first 20 items load. |
| 6 | **Optimistic cart updates** | 🔥 | 30 min | Cart mutations currently wait for state update. Use optimistic updates in React state for instant UI feedback on add/remove. |
| 7 | **Search debounce & autocomplete** | 🔥🔥 | 45 min | Add a 300ms debounce to the navbar search input and show a dropdown with live results from `/api/search/?q=` as the user types. |
| 8 | **Skeleton loading states** | 🔥 | 30 min | Some pages show raw loading spinners. Add skeleton cards (like SearchResults already has) to all product/store listing pages. |

### 🔒 Security & Reliability

| # | Suggestion | Impact | Effort | Details |
|---|---|---|---|---|
| 9 | **Rate limiting on auth endpoints** | 🔥🔥 | 15 min | Add `django-ratelimit` or DRF throttling to `/login/`, `/signup/`, `/token/refresh/` to prevent brute force attacks. |
| 10 | **Email verification on signup** | 🔥 | 1.5 hrs | Users can sign up with any email without verification. Add email verification flow with a confirmation link. |
| 11 | **CORS lockdown for production** | 🔥🔥 | 5 min | `CORS_ALLOW_ALL_ORIGINS = True` is set. Before deploying, restrict to the actual frontend domain. |
| 12 | **Remove mock data fallbacks** | 🔥 | 20 min | All `catch` blocks in `api.ts` silently fall back to mock data, masking real API errors. Add proper error handling/display and remove mocks. |

### 📦 Business Features

| # | Suggestion | Impact | Effort | Details |
|---|---|---|---|---|
| 13 | **Order tracking / status timeline** | 🔥🔥 | 1 hr | Show a visual timeline (PENDING→CONFIRMED→PREPARING→OUT_FOR_DELIVERY→DELIVERED) on the order detail page. Backend already has status transitions. |
| 14 | **Push notifications for order updates** | 🔥 | 2 hrs | Notify customers when order status changes. Options: Firebase Cloud Messaging (web push), or email via SendGrid/SES. |
| 15 | **Wishlist / Favorites** | 🔥 | 1.5 hrs | Let users save products to a wishlist. Requires new `Wishlist` model + endpoint + frontend UI. |
| 16 | **Product variant support** | 🔥 | 2 hrs | Some products come in different sizes/weights (e.g., Rice 2kg vs 5kg). Add a `ProductVariant` model linked to `Product`. |
| 17 | **Coupon / promo code system** | 🔥🔥 | 2 hrs | Create a `Coupon` model with discount type (percentage/fixed), expiry, min order amount. Apply at checkout. |
| 18 | **Remittance to PH flow** | 🔥 | 3 hrs | The "Send to Philippines" page is a placeholder. Build the actual flow: recipient info, amount, payment, confirmation. |

### 🚀 Deployment

| # | Suggestion | Impact | Effort | Details |
|---|---|---|---|---|
| 19 | **Backend deployment** | 🔥🔥🔥 | 1 hr | Deploy Django to Railway or Render with PostgreSQL. Configure `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `DEBUG=False`. |
| 20 | **Frontend deployment** | 🔥🔥🔥 | 30 min | Deploy React to Vercel or Netlify. Set `VITE_API_BASE_URL` to the production backend URL. |
| 21 | **CI/CD pipeline** | 🔥 | 1 hr | GitHub Actions: run `tsc --noEmit` + `pytest` on every PR. Auto-deploy on merge to `main`. |
| 22 | **Database backup strategy** | 🔥🔥 | 30 min | Set up automatic daily PostgreSQL backups (pg_dump to S3 or Cloudinary). |
