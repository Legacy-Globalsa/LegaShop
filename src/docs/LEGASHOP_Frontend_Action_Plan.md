# LEGASHOP — Frontend Action Plan

> Based on full analysis of both backend (Django REST) and frontend (React + TypeScript).
> Backend is ~65% complete; Frontend is ~40% complete. The backend has 33 API endpoints ready — only 3 are consumed by the frontend today.

---

## Backend API Endpoints Available (Not Yet Used by Frontend)

| # | Endpoint | Method | Auth | What It Does |
|---|----------|--------|------|--------------|
| 1 | `/api/categories/` | GET | Public | List top-level categories with nested subcategories |
| 2 | `/api/categories/:id/` | GET | Public | Single category detail |
| 3 | `/api/products/` | GET | Public | List products — filters: `?category=`, `?store=`, `?deal_type=ONE_RIYAL\|FIVE_RIYAL` |
| 4 | `/api/products/:id/` | GET | Public | **Product detail by ID** |
| 5 | `/api/products/deals/` | GET | Public | Deal products — filter: `?deal_type=` |
| 6 | `/api/stores/` | GET | Public | List active stores |
| 7 | `/api/stores/:id/` | GET | Public | Store detail |
| 8 | `/api/stores/:store_id/reviews/` | GET | Public | Store reviews |
| 9 | `/api/products/:product_id/reviews/` | GET | Public | Product reviews |
| 10 | `/api/reviews/` | POST | JWT | Submit a review |
| 11 | `/api/addresses/` | GET/POST | JWT | List / create addresses |
| 12 | `/api/addresses/:id/` | GET/PUT/DELETE | JWT | Manage single address |
| 13 | `/api/orders/` | GET | JWT | List user's orders |
| 14 | `/api/orders/:id/` | GET | JWT | Order detail |
| 15 | `/api/orders/create/` | POST | JWT (Customer) | Place order |
| 16 | `/api/orders/:id/cancel/` | PUT | JWT | Cancel pending order |

**Already consumed:** `/api/signup/`, `/api/login/`, `/api/auth/google/` (3 of 33)

---

## What's Missing in the Frontend UI

### Critical (Blocks Core UX)

| Gap | Where | Details |
|-----|-------|---------|
| **No login/logout button in Navbar** | `Navbar.tsx` | User can log in at `/login` but there's no way to reach it from the main nav, and no way to log out |
| **No auth-aware UI** | `Navbar.tsx` | Navbar always shows the same UI whether logged in or not — no user name, avatar, or dropdown |
| **No product detail page** | Missing page | Backend has `GET /api/products/:id/` — no route or page to view a single product |
| **No store detail page** | Missing page | Backend has `GET /api/stores/:id/` — no route or page to view a single store |
| **All data is hardcoded** | Every page | Products, stores, categories, deals all use inline mock arrays — nothing fetched from API |

### Important (Needed for MVP)

| Gap | Where | Details |
|-----|-------|---------|
| **No shopping cart** | Missing component/page | Cart icon shows hardcoded "3" badge — no cart state, no add-to-cart, no checkout |
| **No order placement flow** | Missing page | Backend has full order creation — frontend has nothing |
| **No order history** | Missing page | Backend has `GET /api/orders/` — no page to list past orders |
| **No address management** | Missing page | Backend has full CRUD for addresses — no UI |
| **No user profile/account page** | Missing page | No way to view or edit your profile after signup |
| **No protected routes** | `App.tsx` | Any unauthenticated user can navigate everywhere; no route guards |
| **No token refresh logic** | `api.ts` | Access token expires in 30 min — after that all auth'd requests fail silently |

### Nice to Have (Post-MVP)

| Gap | Details |
|-----|---------|
| Search functionality | Navbar search bar exists but does nothing |
| Filter/sort on deal pages | Buttons exist but are non-functional |
| Reviews UI | Backend supports reviews — no way to read or submit them |
| Vendor dashboard | Backend has vendor endpoints (products CRUD, order management) — no vendor UI |
| Admin panel | Category CRUD, store approval — no admin UI |
| Password reset | Not in backend either |
| Dark mode | `next-themes` is installed but not wired up |

---

## Recommended Task Order — Where to Start

### Phase 1: Auth UX (Start Here)

These are quick wins that make the app feel real and usable.

**1.1 — Add Login/Signup button to Navbar**
- **File:** `src/components/Navbar.tsx`
- **What:** Import `useAuth` hook. If not authenticated show a "Login" `<Link>` to `/login`. If authenticated show user's name + a logout button/dropdown.
- **Effort:** Small
- **Dependencies:** None — `useAuth` hook and `logout()` already exist in `api.ts`

**1.2 — Add Logout action**
- **File:** `src/components/Navbar.tsx` (or a new `UserMenu.tsx` dropdown)
- **What:** Call `logout()` from `api.ts` and `useAuth().logout()`, then redirect to `/` or `/login`.
- **Effort:** Small
- **Dependencies:** 1.1

**1.3 — Add Protected Route wrapper**
- **File:** Create `src/components/ProtectedRoute.tsx`
- **What:** Wrapper that checks `useAuth().isAuthenticated` — redirects to `/login` if not.
- **Use in:** `App.tsx` for routes like `/orders`, `/account`, `/addresses`
- **Effort:** Small

### Phase 2: API Integration (Replace Hardcoded Data)

These connect the frontend to the real backend.

**2.1 — Create API service functions**
- **File:** `src/lib/api.ts`
- **What:** Add functions for the public endpoints. Use `getAccessToken()` for auth headers. Example:
  ```ts
  export async function fetchProducts(params?: Record<string,string>) { ... }
  export async function fetchProductById(id: number) { ... }
  export async function fetchCategories() { ... }
  export async function fetchStores() { ... }
  export async function fetchStoreById(id: number) { ... }
  export async function fetchDeals(dealType: string) { ... }
  ```
- **Tip:** React Query (`@tanstack/react-query`) is already installed — use `useQuery` hooks for caching + loading states.
- **Effort:** Medium
- **Note:** If backend isn't running, create a `src/lib/mock-data.ts` file with the same data currently hardcoded in pages, and have the API functions fall back to mock data. This way you can develop without the server.

**2.2 — Wire CategoriesPage to API**
- **File:** `src/pages/CategoriesPage.tsx`
- **What:** Replace hardcoded categories array with `useQuery(['categories'], fetchCategories)`. Show loading skeleton while fetching.
- **Effort:** Medium

**2.3 — Wire DealsPages to API**
- **Files:** `src/pages/OneSarDeals.tsx`, `src/pages/FiveSarDeals.tsx`
- **What:** Fetch from `/api/products/deals/?deal_type=ONE_RIYAL` and `FIVE_RIYAL`.
- **Effort:** Medium

**2.4 — Wire StoresPage to API**
- **File:** `src/pages/StoresPage.tsx`
- **What:** Fetch from `/api/stores/`. Replace hardcoded store list.
- **Effort:** Medium

### Phase 3: New Pages (Product & Store Detail)

**3.1 — Product Detail Page**
- **File:** Create `src/pages/ProductPage.tsx`
- **Route:** `/products/:id`
- **What:** Fetch `GET /api/products/:id/`. Show product image, name, price, sale price, stock status, store info, add-to-cart button. Optionally show reviews from `/api/products/:id/reviews/`.
- **Effort:** Medium-Large

**3.2 — Store Detail Page**
- **File:** Create `src/pages/StorePage.tsx`
- **Route:** `/stores/:id`
- **What:** Fetch `GET /api/stores/:id/`. Show store info, products via `/api/products/?store=:id`, reviews via `/api/stores/:id/reviews/`.
- **Effort:** Medium-Large

**3.3 — Link product cards everywhere**
- **Files:** All pages/components that render product cards
- **What:** Wrap product cards in `<Link to={/products/${id}}>` so clicking navigates to detail page.
- **Effort:** Small (but touches many files)

### Phase 4: Cart & Orders

**4.1 — Cart state management**
- **File:** Create `src/hooks/use-cart.tsx` (Context + useReducer)
- **What:** `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `cartTotal`. Persist to localStorage.
- **Effort:** Medium

**4.2 — Cart Page / Drawer**
- **File:** Create `src/pages/CartPage.tsx` or a Sheet/Drawer component
- **What:** List cart items, quantities, subtotal, proceed to checkout.
- **Effort:** Medium

**4.3 — Checkout & Order Placement**
- **File:** Create `src/pages/CheckoutPage.tsx`
- **What:** Select delivery address (fetch from `/api/addresses/`), payment method, review order, submit to `POST /api/orders/create/`.
- **Effort:** Large

**4.4 — Order History Page**
- **File:** Create `src/pages/OrdersPage.tsx`
- **Route:** `/orders`
- **What:** Fetch `GET /api/orders/`. Show list of orders with status badges.
- **Effort:** Medium

### Phase 5: Account & Addresses

**5.1 — Account Page**
- **File:** Create `src/pages/AccountPage.tsx`
- **Route:** `/account`
- **What:** Show user info (name, email, phone, role). Link to addresses, orders.
- **Effort:** Small-Medium

**5.2 — Address Management**
- **File:** Create `src/pages/AddressesPage.tsx`
- **Route:** `/account/addresses`
- **What:** Full CRUD using `/api/addresses/` endpoints. Set default address.
- **Effort:** Medium

---

## Quick Reference: File Map

```
src/
├── lib/
│   ├── api.ts              ← ADD: product/store/category/order API functions
│   └── mock-data.ts        ← NEW: centralized mock data (fallback when no backend)
├── hooks/
│   ├── use-auth.tsx         ← EXISTS: auth context (working)
│   └── use-cart.tsx         ← NEW: cart context
├── components/
│   ├── Navbar.tsx           ← EDIT: add auth buttons (login/logout/user menu)
│   ├── ProtectedRoute.tsx   ← NEW: route guard component
│   ├── ProductCard.tsx      ← NEW: reusable product card (extract from pages)
│   └── UserMenu.tsx         ← NEW: dropdown with profile, orders, logout
├── pages/
│   ├── ProductPage.tsx      ← NEW: product detail by ID
│   ├── StorePage.tsx        ← NEW: store detail
│   ├── CartPage.tsx         ← NEW: shopping cart
│   ├── CheckoutPage.tsx     ← NEW: checkout flow
│   ├── OrdersPage.tsx       ← NEW: order history
│   ├── AccountPage.tsx      ← NEW: user profile
│   └── AddressesPage.tsx    ← NEW: address CRUD
```

---

## Mock Data Strategy

Since the backend may not always be running during frontend development:

1. **Extract** all hardcoded data from pages into `src/lib/mock-data.ts`
2. **API functions** should catch network errors and fall back to mock data in dev mode
3. **Or** use MSW (Mock Service Worker) to intercept fetch calls — already compatible with Vite

Example pattern:
```ts
// api.ts
export async function fetchProducts(params?: Record<string,string>) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products/?${query}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    // Fallback to mock data during dev
    const { mockProducts } = await import('./mock-data');
    return mockProducts;
  }
}
```

---

## Summary — Start With These 3 Files

| Priority | File | What to Do |
|----------|------|------------|
| **1st** | `src/components/Navbar.tsx` | Add login/logout button using `useAuth` |
| **2nd** | `src/lib/api.ts` | Add `fetchProducts`, `fetchProductById`, `fetchCategories`, `fetchStores` |
| **3rd** | `src/pages/ProductPage.tsx` | Create product detail page + add route in `App.tsx` |

Everything else flows from these three.
