# LegaShop — API Integration Map

> Last updated: April 14, 2026
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
11. [Integration Summary](#11-integration-summary)
12. [Known Issues & Gaps](#12-known-issues--gaps)

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
| **Response** | `[{ id, name, name_tl, name_ar, parent, image_url, is_active, subcategories, created_at }]` |
| **Frontend function** | `fetchCategories()` → `api.ts` |
| **React Query hook** | `useCategories()` → `use-api.ts` |
| **Used in** | `CategoriesPage.tsx` (via hook), `SearchResults.tsx` (direct call) |
| **Status** | ✅ Connected (mock fallback) |

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
| **Query params** | `?category=ID`, `?store=ID`, `?deal_type=ONE_RIYAL|FIVE_RIYAL` |
| **Response** | `[{ id, store, store_name, category, category_name, name, name_tl, name_ar, description, price, sale_price, currency, stock, unit, image_url, is_deal, deal_type, is_active, created_at }]` |
| **Frontend function** | `fetchProducts(params?)` → `api.ts` |
| **React Query hook** | `useProducts(params?)` → `use-api.ts` |
| **Used in** | `FeaturedProducts.tsx` (hook), `CategoriesPage.tsx` (hook), `SearchResults.tsx` (direct call) |
| **Status** | ✅ Connected (mock fallback) |

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
| **Frontend function** | `fetchDeals(dealType?)` → `api.ts` |
| **React Query hook** | `useDeals(dealType?)` → `use-api.ts` |
| **Used in** | `OneSarDeals.tsx` (hook), `FiveSarDeals.tsx` (hook), `FlashDeals.tsx` (hook, no filter) |
| **Status** | ✅ Connected (mock fallback) |

---

## 6. Products (Vendor)

### `POST /api/vendor/products/` — Vendor create product

| | |
|---|---|
| **Backend** | `VendorProductCreateView` → `products/views.py` |
| **Permission** | `IsVendor` |
| **Request** | `{ category, name, description?, price, sale_price?, stock, unit?, image_url?, is_deal, deal_type? }` |
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
| **Response** | `[{ id, user, reviewer_name, store, product, rating, comment, created_at }]` |
| **Frontend function** | `fetchProductReviews(productId)` → `api.ts` |
| **React Query hook** | `useProductReviews(productId)` → `use-api.ts` |
| **Used in** | `ProductPage.tsx` (direct call in useEffect) |
| **Status** | ✅ Connected (mock fallback, bypasses RQ hook) |

### `GET /api/stores/:id/reviews/` — Store reviews

| | |
|---|---|
| **Backend** | `StoreReviewListView` → `products/views.py` |
| **Permission** | `AllowAny` |
| **Frontend function** | `fetchStoreReviews(storeId)` → `api.ts` |
| **React Query hook** | `useStoreReviews(storeId)` → `use-api.ts` |
| **Used in** | `StorePage.tsx` (direct call in useEffect) |
| **Status** | ✅ Connected (mock fallback, bypasses RQ hook) |

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
| **Response** | `[{ id, owner, owner_name, name, name_ar, description, phone, latitude, longitude, delivery_zone, avg_delivery_min, rating, is_active, image_url, district, created_at }]` |
| **Frontend function** | `fetchStores()` → `api.ts` |
| **React Query hook** | `useStores()` → `use-api.ts` |
| **Used in** | `SearchResults.tsx` (direct call) |
| **⚠️ NOT used in** | **`StoresPage.tsx`** — this page is 100% hardcoded |
| **Status** | 🔴 **StoresPage is NOT connected** — uses hardcoded array of 8 fake stores |

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
| **Status** | ✅ Connected (mock fallback) |

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
| **Response** | `[{ id, user, store, store_name, delivery_address, order_type, status, subtotal, delivery_fee, total, currency, note, items: [...], payment: {...}, created_at, updated_at }]` |
| **Frontend function** | `fetchOrders()` → `api.ts` |
| **React Query hook** | `useOrders()` → `use-api.ts` |
| **Used in** | `OrdersPage.tsx` (via hook) |
| **Status** | ✅ Connected (mock fallback) |

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

## 11. Integration Summary

### By Status

| Status | Count | Meaning |
|--------|-------|---------|
| ✅ Fully connected | 20 | Frontend calls the real API |
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
| `SearchResults.tsx` | `fetchProducts` + `fetchStores` + `fetchCategories` | ❌ direct | Yes | ✅ |
| `CheckoutPage.tsx` | `fetchAddresses` + `createAddress` + `createOrder` | ❌ direct | Partial | ProtectedRoute |
| `OrdersPage.tsx` | `useOrders()` | ✅ | Yes | ProtectedRoute |
| `OrderDetailPage.tsx` | `useOrder()` + `useCancelOrder()` | ✅ | No | ProtectedRoute |
| `OrderConfirmationPage.tsx` | None (static) | — | — | ProtectedRoute |
| `ProfileSection.tsx` | `updateProfile` | ❌ direct | No | ProtectedRoute |
| `AddressesSection.tsx` | Full CRUD addresses | ❌ direct | Partial | ProtectedRoute |
| `SecuritySection.tsx` | `changePassword` | ❌ direct | No | ProtectedRoute |

---

## 12. Known Issues & Gaps

### 🔴 Critical — Must Fix

| # | Issue | Location | Fix |
|---|---|---|---|
| 1 | **StoresPage is 100% hardcoded** — doesn't call any API, shows 8 fake stores | `StoresPage.tsx` | Replace with `useStores()` hook |
| 2 | **Review form is non-functional** — "Write a Review" on ProductPage shows a toast but doesn't submit anything | `ProductPage.tsx` | Wire up to `createReview()` / `useCreateReview()` |
| 3 | **Delivery fee mismatch** — Cart context hardcodes 3 SAR, backend charges 5 SAR | `use-cart.tsx` vs `orders/views.py` | Sync to a single source of truth |

### ⚠️ Important — Should Fix

| # | Issue | Location | Fix |
|---|---|---|---|
| 4 | **6 pages bypass React Query hooks** — lose caching, dedup, background refetch | ProductPage, StorePage, SearchResults, CheckoutPage, AddressesSection, ProfileSection | Migrate to `use-api.ts` hooks |
| 5 | **SearchResults does client-side filtering** — fetches ALL data then filters in browser | `SearchResults.tsx` | Add `?search=` query param to backend products endpoint, or use existing `?category=` / `?store=` filters |
| 6 | **OrderDetailPage address display** — shows hardcoded "Riyadh, Saudi Arabia" instead of actual delivery address | `OrderDetailPage.tsx` | Read `order.delivery_address` data or nest address in order serializer |
| 7 | **ProfileSection doesn't fetch fresh data** — reads from auth context (localStorage) on mount | `ProfileSection.tsx` | Use `useProfile()` hook to fetch fresh data |
| 8 | **No backend search endpoint** — no full-text search across products/stores | `products/views.py` | Add `?search=term` queryset filter with `icontains` |

### 🔵 Nice to Have — Future

| # | Feature | Notes |
|---|---|---|
| 9 | Vendor dashboard (product CRUD, order management) | Backend is ready (7 vendor endpoints), no frontend |
| 10 | Admin panel (category CRUD, store approval) | Backend is ready (5 admin endpoints), no frontend |
| 11 | Token refresh endpoint (`POST /api/token/refresh/`) | `tryRefreshToken()` exists in `api.ts` — verify endpoint exists in backend URL config |
| 12 | Remove mock data fallbacks once backend is seeded | All `catch` blocks in `api.ts` fall back to mock data silently |

### Token Refresh — MISSING from Backend

The frontend's `tryRefreshToken()` in `api.ts` calls `POST /api/token/refresh/` but **this endpoint does NOT exist** in the backend URL config. The route is not registered anywhere in `config/urls.py` or `users/urls.py`. This means:

- Token refresh silently fails → user gets logged out after access token expires (30 min)
- The `authFetch` interceptor catches 401, tries refresh, refresh fails, logs out

**Fix:** Add to `users/urls.py`:
```python
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # ... existing paths ...
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
```
