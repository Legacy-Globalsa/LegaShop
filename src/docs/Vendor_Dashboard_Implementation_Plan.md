# LEGASHOP — Vendor Dashboard Implementation Plan

> Created: April 23, 2026
> Refs: `Frontend_Implementation_Plan.md` · `LEGASHOP_Business_Plan_v2.md` (§5, §15.3)
> Scope: Frontend vendor portal at `/vendor/*` + backend gap analysis

---

## 1. Goals

Give baqala / mid-grocer owners a self-serve portal to:

1. **Onboard** their store (one store per vendor account).
2. **Manage products** (CRUD, stock, deal flags, images).
3. **Process orders** (accept → prepare → out for delivery → delivered, or cancel).
4. **Track performance** (today's orders, revenue, top products).
5. **Configure store** (hours, delivery zone, contact, banner).
6. *(Phase 2)* Manage payouts, promotions, staff accounts.

---

## 2. Backend API Audit

### 2.1 ✅ Already implemented (can be wired immediately)

| Capability | Method + Path | View | Notes |
|---|---|---|---|
| Create store (one per vendor) | `POST /api/stores/create/` | `StoreCreateView` | Uses `IsVendor`. `is_active=False` until admin approves. |
| Update own store | `PUT/PATCH /api/stores/<id>/update/` | `StoreUpdateView` | `queryset = Store.objects.filter(owner=request.user)` |
| Get store detail | `GET /api/stores/<id>/` | `StoreDetailView` | Public; reuse for "my store" view. |
| List categories (for product form) | `GET /api/categories/` | `CategoryListView` | Public, paginated off. |
| Create product | `POST /api/products/vendor/products/` | `VendorProductCreateView` | Auto-attaches `store = request.user.store`. |
| Update product | `PUT/PATCH /api/products/vendor/products/<id>/` | `VendorProductUpdateView` | Scoped to vendor's store. |
| Delete product | `DELETE /api/products/vendor/products/<id>/delete/` | `VendorProductDeleteView` | Scoped to vendor's store. |
| List incoming orders | `GET /api/orders/vendor/orders/` | `VendorOrderListView` | Scoped to `store__owner=request.user`. |
| Update order status | `PUT/PATCH /api/orders/vendor/orders/<id>/` | `VendorOrderUpdateView` | Enforces transition graph; restores stock on `CANCELLED`. |
| List store reviews | `GET /api/products/stores/<store_id>/reviews/` | `StoreReviewListView` | Public. |
| List product reviews | `GET /api/products/products/<product_id>/reviews/` | `ProductReviewListView` | Public. |

**Verdict:** Core CRUD is in place. ~80% of the vendor portal can be built against existing endpoints.

### 2.2 ⚠️ Gaps — endpoints we need to add

| # | Need | Suggested endpoint | Priority | Effort |
|---|---|---|---|---|
| G1 | List **only my products** (currently `GET /api/products/?store=<id>` requires knowing store id) | `GET /api/products/vendor/products/` (list view on existing class) | P0 | 10 min |
| G2 | Get vendor's own store ("me") | `GET /api/stores/me/` | P0 | 15 min |
| G3 | Single vendor order detail | `GET /api/orders/vendor/orders/<id>/` (add to `VendorOrderUpdateView` or new retrieve view) | P0 | 10 min |
| G4 | Dashboard analytics (today's orders, revenue, pending count, top products) | `GET /api/vendor/analytics/` | P0 | 45 min |
| G5 | Filter vendor orders by status / date | Query params `?status=&from=&to=` on `VendorOrderListView` | P0 | 15 min |
| G6 | Bulk stock update / low-stock alerts | `PATCH /api/products/vendor/products/<id>/stock/` + `?low_stock=true` filter | P1 | 30 min |
| G7 | Payouts statement | `GET /api/vendor/payouts/` | P1 | 1 hr (mock for now) |
| G8 | Toggle store open/closed | `PATCH /api/stores/<id>/update/` already supports it via `is_active`, but vendor cannot activate (admin only). Add `is_open` field separate from `is_active`. | P1 | 30 min |

### 2.3 🚫 Out of scope (admin owns)

Approving stores (`is_active=True`), assigning categories, setting commission tiers — handled by `AdminStoreUpdateView` / future admin console.

---

## 3. Frontend Architecture

### 3.1 Route structure

```
/vendor                      → VendorDashboard       (KPIs, today's orders snapshot)
/vendor/orders               → VendorOrders          (queue, filterable)
/vendor/orders/:id           → VendorOrderDetail     (items, customer, status actions)
/vendor/products             → VendorProducts        (table, search, filter)
/vendor/products/new         → VendorProductForm     (create)
/vendor/products/:id/edit    → VendorProductForm    (edit)
/vendor/store                → VendorStoreSettings   (profile, hours, banner)
/vendor/reviews              → VendorReviews         (read-only list)
/vendor/analytics            → VendorAnalytics       (P1 — charts)
/vendor/onboarding           → VendorOnboarding      (no store yet → create flow)
```

All routes wrapped by `<VendorRoute>` guard:

```tsx
// src/components/VendorRoute.tsx
const VendorRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login?next=/vendor" />;
  if (user?.role !== "VENDOR") return <Navigate to="/" />;
  return <VendorLayout>{children}</VendorLayout>;
};
```

### 3.2 Layout

`VendorLayout` = persistent sidebar (Dashboard, Orders, Products, Store, Reviews, Analytics) + top bar (store name, open/closed toggle, user menu). Mobile collapses sidebar to a drawer.

Reuses existing shadcn primitives: `Sidebar`, `Card`, `Table`, `Dialog`, `Form`, `Toast`, `Tabs`, `Badge`.

### 3.3 New files

```
src/
  components/
    VendorRoute.tsx
    vendor/
      VendorLayout.tsx
      VendorSidebar.tsx
      VendorTopBar.tsx
      OrderStatusBadge.tsx          (reused for customer side too)
      OrderStatusActions.tsx        (transition buttons per current status)
      ProductFormFields.tsx         (shared by create + edit)
      ImageUploader.tsx             (Cloudinary-backed, also reusable for store)
      KpiCard.tsx
      LowStockTable.tsx
  pages/
    vendor/
      VendorDashboard.tsx
      VendorOrders.tsx
      VendorOrderDetail.tsx
      VendorProducts.tsx
      VendorProductForm.tsx
      VendorStoreSettings.tsx
      VendorReviews.tsx
      VendorAnalytics.tsx           (Phase 2)
      VendorOnboarding.tsx
  hooks/
    use-vendor.ts                   (all vendor RQ hooks below)
  lib/
    vendor-api.ts                   (typed wrappers around existing fetch helpers)
    vendor-mock.ts                  (mock data used until backend gaps closed)
```

### 3.4 React Query hooks (in `use-vendor.ts`)

| Hook | Underlying endpoint | Status |
|---|---|---|
| `useMyStore()` | `GET /api/stores/me/` *(G2)* — fallback: list + filter by owner client-side | needs G2 |
| `useUpdateMyStore()` | `PATCH /api/stores/<id>/update/` | ✅ |
| `useVendorProducts(params)` | `GET /api/products/vendor/products/` *(G1)* | needs G1 |
| `useCreateVendorProduct()` | `POST /api/products/vendor/products/` | ✅ |
| `useUpdateVendorProduct(id)` | `PATCH /api/products/vendor/products/<id>/` | ✅ |
| `useDeleteVendorProduct(id)` | `DELETE /api/products/vendor/products/<id>/delete/` | ✅ |
| `useVendorOrders(params)` | `GET /api/orders/vendor/orders/?status=&from=&to=` *(G5)* | partial |
| `useVendorOrder(id)` | `GET /api/orders/vendor/orders/<id>/` *(G3)* | needs G3 |
| `useUpdateVendorOrderStatus()` | `PATCH /api/orders/vendor/orders/<id>/` | ✅ |
| `useVendorAnalytics()` | `GET /api/vendor/analytics/` *(G4)* | mock first |
| `useStoreReviews(storeId)` | `GET /api/products/stores/<id>/reviews/` | ✅ |
| `useCategories()` | `GET /api/categories/` | ✅ (already exists) |

---

## 4. Page-by-Page Plan

### 4.1 VendorOnboarding `/vendor/onboarding`

- Show when `useMyStore()` returns 404 (no store yet).
- Form: name, name_ar, district (KSA city dropdown), phone, address pin (mock map for now), delivery_zone km, avg_delivery_min, banner image, description.
- Submit → `useCreateStore()` → redirect `/vendor` with toast "Store submitted for approval".
- Pending approval state: read-only banner "Awaiting admin approval" if `is_active=false`.

### 4.2 VendorDashboard `/vendor`

KPI cards (uses **mock data** until G4 lands):
- Today's orders / revenue
- Pending orders count (link → `/vendor/orders?status=PENDING`)
- Out-for-delivery count
- Low-stock products count (link → `/vendor/products?low_stock=true`)
- Recent 5 orders table (real data via `useVendorOrders({ limit: 5 })`)
- Top 5 products this week (mock)

### 4.3 VendorOrders `/vendor/orders`

- Table columns: Order # · Customer · Items · Total · Status · Placed at · Actions.
- Tabs by status: All / Pending / Confirmed / Preparing / Out for Delivery / Delivered / Cancelled.
- Search by order id or customer name (client-side until backend search added).
- Row click → detail page.
- Realtime polling: `refetchInterval: 30s` for `Pending`/`Confirmed` tabs.

### 4.4 VendorOrderDetail `/vendor/orders/:id`

- Header: status badge + transition buttons (`OrderStatusActions` knows allowed next states from backend `ALLOWED_TRANSITIONS`).
- Sections: Items list · Subtotal/Delivery/Total · Customer info · Delivery address · Payment method/status · Notes.
- Cancel dialog with reason field (reason stored client-side for now; future: add `cancel_reason` field).
- Print receipt (window.print + dedicated CSS).

### 4.5 VendorProducts `/vendor/products`

- Table: Image · Name · Category · Price · Stock · Deal · Active · Actions.
- Top toolbar: search, category filter, low-stock toggle, "Add product" button.
- Inline stock edit (pencil → number input → `useUpdateVendorProduct({ stock })`).
- Delete with confirm dialog (`AlertDialog`).
- Bulk actions (P1): toggle active, mark as deal.

### 4.6 VendorProductForm `/vendor/products/new` & `/:id/edit`

Fields (matches `ProductCreateSerializer`):
- Category (select from `useCategories()`)
- Name, name_tl, name_ar (tabs for languages)
- Description (textarea)
- Price, sale_price, currency (default SAR), unit
- Stock (number)
- Image upload (`ImageUploader` → multipart to `image` field; preview)
- `is_deal` toggle → if on, show `deal_type` (ONE_RIYAL / FIVE_RIYAL)
- Validation: Zod schema (price > 0, stock ≥ 0, sale_price < price).

### 4.7 VendorStoreSettings `/vendor/store`

Tabs:
- **Profile**: name, name_ar, phone, district, description, banner image.
- **Delivery**: delivery_zone (km slider), avg_delivery_min, *(P1)* opening hours JSON.
- **Location**: lat/lng (mock map picker for now — wire `AddressPickerMap` once Phase 3.1 lands).
- **Status** (read-only): approval status, joined date, rating.

### 4.8 VendorReviews `/vendor/reviews`

- List of reviews on store and its products.
- Filter by rating (1–5 stars) and target (store / product).
- Read-only for MVP. *(P1)*: vendor reply.

### 4.9 VendorAnalytics `/vendor/analytics` *(P1)*

- Recharts-based: orders/day (last 30d), revenue/day, top categories.
- Backend: requires G4.

---

## 5. Mock Data Strategy

While backend gaps (G1–G7) are open, build the UI against `vendor-mock.ts`:

```ts
// src/lib/vendor-mock.ts
export const MOCK_VENDOR_ANALYTICS = { todayOrders: 14, todayRevenue: 612, pending: 3, outForDelivery: 2, lowStockCount: 5, topProducts: [...], salesLast7Days: [...] };
export const MOCK_LOW_STOCK_PRODUCTS = [...];
export const MOCK_VENDOR_PAYOUTS = [...];
```

Hooks fall back to mock when endpoint 404s, similar to the (now-removed) `api.ts` pattern but **gated by an env flag** so we can easily tear them out:

```ts
const USE_MOCK = import.meta.env.VITE_VENDOR_USE_MOCK === "true";
```

Keep mock usage to *aggregations and computed views only* — never mock raw orders/products (use real endpoints for those).

---

## 6. Order Status Flow (frontend mirror of backend)

```
PENDING ─┬─► CONFIRMED ─┬─► PREPARING ──► OUT_FOR_DELIVERY ──► DELIVERED
         │              │
         └─► CANCELLED  └─► CANCELLED
```

`OrderStatusActions` renders only the buttons allowed for the current status:

| Current | Buttons |
|---|---|
| PENDING | "Accept" → CONFIRMED · "Reject" → CANCELLED |
| CONFIRMED | "Start preparing" → PREPARING · "Cancel" → CANCELLED |
| PREPARING | "Out for delivery" → OUT_FOR_DELIVERY |
| OUT_FOR_DELIVERY | "Mark delivered" → DELIVERED |
| DELIVERED / CANCELLED | (none, terminal) |

On every transition: optimistic update + invalidate `["vendor","orders"]` + toast.

---

## 7. End-to-End Vendor Flow

```
Sign up (role=CUSTOMER by default)
   │
   ▼  (admin promotes to VENDOR  OR  user requests vendor access — TBD)
Login → header shows "Vendor portal" link → /vendor
   │
   ▼
First visit: no store → /vendor/onboarding → create store (is_active=false)
   │
   ▼
Wait for admin approval (banner shown). Once is_active=true → full access.
   │
   ▼
Add categories' products via /vendor/products/new (uploads image, sets stock).
   │
   ▼
Customer places order → appears in /vendor/orders (PENDING).
   │
   ▼
Vendor accepts → PREPARING → OUT_FOR_DELIVERY → DELIVERED.
   │           ├── stock decremented at order creation (backend)
   │           └── stock restored on cancel (backend)
   ▼
Reviews appear in /vendor/reviews after DELIVERED.
   │
   ▼
Vendor checks /vendor (dashboard) for daily KPIs.
```

**Open question — vendor sign-up:** currently no public way for a customer to become a vendor. Options:
- (a) Admin-only role flip (current behaviour)
- (b) "Become a vendor" CTA → submits a vendor application → admin approves → role changes to VENDOR + lands on `/vendor/onboarding`.

Recommend **(b)** for MVP. Requires a small backend addition (`POST /api/vendor/apply/` + admin review). Track as G9 (P1).

---

## 8. Implementation Order

### Sprint A — Foundation (Day 1)

| # | Task | Where | Effort |
|---|---|---|---|
| A1 | Add backend gaps G1, G2, G3, G5 (small, copy-paste of existing patterns) | `backend/products/views.py`, `backend/stores/views.py`, `backend/orders/views.py` + urls | 1 hr |
| A2 | `VendorRoute` + `VendorLayout` + `VendorSidebar` | `src/components/vendor/` | 45 min |
| A3 | `use-vendor.ts` hooks (skeleton, point at real + mock) | `src/hooks/` | 45 min |
| A4 | Wire all routes in `App.tsx` | `src/App.tsx` | 15 min |
| A5 | Add "Vendor portal" link in user menu (when `role==='VENDOR'`) | `src/components/Navbar.tsx` | 15 min |

### Sprint B — Order Management (Day 2)

| # | Task | Effort |
|---|---|---|
| B1 | `VendorOrders` page (table, status tabs, polling) | 1 hr |
| B2 | `VendorOrderDetail` page (status actions, items, customer panel) | 1.5 hr |
| B3 | `OrderStatusBadge` + `OrderStatusActions` shared components | 30 min |

### Sprint C — Product Management (Day 3)

| # | Task | Effort |
|---|---|---|
| C1 | `VendorProducts` page (table, filters, inline stock edit, delete) | 1.5 hr |
| C2 | `VendorProductForm` (create + edit shared) with Zod | 1.5 hr |
| C3 | `ImageUploader` component (multipart) | 45 min |

### Sprint D — Store & Onboarding (Day 4)

| # | Task | Effort |
|---|---|---|
| D1 | `VendorOnboarding` (create-store flow) | 1 hr |
| D2 | `VendorStoreSettings` (profile/delivery/location/status tabs) | 1.5 hr |
| D3 | Pending-approval banner state | 15 min |

### Sprint E — Dashboard & Reviews (Day 5)

| # | Task | Effort |
|---|---|---|
| E1 | `VendorDashboard` with KPI cards (mock data + real recent orders) | 1.5 hr |
| E2 | `VendorReviews` list page | 30 min |
| E3 | Backend G4 (analytics endpoint) — replace mock | 1 hr |

### Sprint F — Polish (Day 6)

| # | Task | Effort |
|---|---|---|
| F1 | Empty states + loading skeletons for every page | 45 min |
| F2 | Mobile responsive checks (sidebar drawer) | 30 min |
| F3 | Error boundaries on `/vendor/*` | 20 min |
| F4 | Smoke tests (Vitest + RTL) for guard, status transitions, product create | 1 hr |

### Phase 2 (later)

- Vendor application flow (G9)
- Analytics charts (Recharts)
- Payouts (G7)
- Bulk CSV product import
- WebSocket order pings (depends on Channels rollout)
- Cloudinary signed uploads (currently uses Django default storage)

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Image upload requires multipart; existing `authFetch` may set JSON content-type | Add `apiUploadForm()` helper in `lib/api.ts` that omits `Content-Type` so the browser sets the boundary |
| Vendor with no `store` yet calling vendor product/order endpoints will 500 (`request.user.store` missing) | Frontend always checks `useMyStore()` first; add defensive 404 handling on backend create |
| Admin approval bottleneck on staging | Seed at least one pre-approved vendor in `seed_data.py` for E2E testing |
| Status transition race (two vendor tabs) | Backend already enforces transition graph and returns 400; surface error toast |
| Mock data drifting from real shape | Keep mock in `vendor-mock.ts` typed with the same `Product` / `Order` interfaces from `api.ts` |

---

## 10. Definition of Done (MVP)

- [ ] Vendor with `role=VENDOR` and an approved store can: log in → see dashboard → list products → create product with image → see incoming order → accept and progress it through to DELIVERED → see review afterwards.
- [ ] All page-level loading and empty states render (no white screens).
- [ ] No hardcoded data on Orders, Products, OrderDetail, StoreSettings pages.
- [ ] Dashboard KPIs may use mock data until G4 ships.
- [ ] Mobile (375 px) layout works for Orders + Products tables (horizontal scroll OK).
- [ ] Vendor cannot access another vendor's products/orders (verified by 404 from backend scope).

---

*This plan is a living document. Update status per sprint.*
