# 🇵🇭 LEGASHOP — Business Plan (v2)
### *Affordable Filipino & Everyday Grocery E-Commerce for the Kingdom of Saudi Arabia*

**Version:** 2.0 — Nationwide MVP
**Date:** April 18, 2026
**Supersedes:** `LEGASHOP_MVP_Business_Plan.md` (v1, Riyadh-only)
**Status:** Investor / Engineering reference

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Market Research — Kingdom-Wide](#2-market-research--kingdom-wide)
3. [Problem & Solution](#3-problem--solution)
4. [Target Users & Personas](#4-target-users--personas)
5. [MVP Feature Scope](#5-mvp-feature-scope)
6. [Platform Flow (End-to-End)](#6-platform-flow-end-to-end)
7. [System Architecture](#7-system-architecture)
8. [Technology Stack (As Implemented)](#8-technology-stack-as-implemented)
9. [Technology Implementation Details](#9-technology-implementation-details)
10. [UI / UX & Brand Identity](#10-ui--ux--brand-identity)
11. [Database Schema](#11-database-schema)
12. [API Architecture](#12-api-architecture)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Payments & Compliance](#14-payments--compliance)
15. [Operations & Fulfillment (Nationwide)](#15-operations--fulfillment-nationwide)
16. [Go-to-Market Strategy](#16-go-to-market-strategy)
17. [Revenue Model & KPIs](#17-revenue-model--kpis)
18. [Roadmap & Phasing](#18-roadmap--phasing)
19. [Implementation Status — What's Done vs. Pending](#19-implementation-status--whats-done-vs-pending)
20. [Risk Analysis & Mitigation](#20-risk-analysis--mitigation)
21. [Budget Estimate](#21-budget-estimate)

---

## 1. Executive Summary

**LEGASHOP** (from Filipino *"lega"* — *affordable / bargain*) is a grocery e-commerce platform for the **Kingdom of Saudi Arabia (KSA)**, built around two tightly integrated value propositions:

1. **KSA Local Marketplace** — Ultra-fast grocery fulfillment (15 min – same-day) from partner *baqala* (neighborhood convenience stores) and mid-size grocers across Saudi Arabia's major urban regions: **Riyadh, Jeddah/Makkah, Dammam/Khobar/Dhahran, Madinah, Taif, Abha, Tabuk, Hail, Buraidah**, with **1 SAR** and **5 SAR** deal tiers on everyday essentials.
2. **OFW Remittance Grocery (Padala)** — Filipino workers anywhere in KSA can order grocery packages delivered to their families in the Philippines via a **Puregold** (and later SM Markets / Robinsons) partnership, converting remittance into goods at checkout.

v1 positioned this as a Riyadh-only pilot. **v2 expands the MVP scope to nationwide KSA** with a region-sharded rollout, and upgrades the platform to reflect the **actually-implemented** technology stack: **Django REST Framework + PostgreSQL (backend)** and **React 18 + Vite + TypeScript + Tailwind + shadcn/ui (frontend)**.

### v2 Targets (first 6 months)

| Metric | Target |
|---|---|
| Cities live | 6 (Riyadh → Jeddah → Dammam/Khobar → Makkah → Madinah → Taif) |
| Partner baqalas / grocers | 150 – 250 |
| Registered customers | 25,000 |
| Orders / month (steady) | 8,000 local + 600 PH remittance |
| On-time delivery (same-day) | ≥ 85 % |
| Average order value (local) | SAR 55 – 80 |
| GMV run-rate (month 6) | SAR 650 K |

---

## 2. Market Research — Kingdom-Wide

### 2.1 KSA E-Commerce Snapshot (2025 – 2026)

| Metric | Value | Source |
|---|---|---|
| E-commerce market size | USD 12.4 B | Statista |
| Projected CAGR (2025–2030) | 11.2 % | Euromonitor |
| Online-grocery penetration | ~4.5 % and accelerating | Gulf Business |
| Smartphone / internet penetration | 98 % / 99 % | MCIT KSA |
| Digital-payment share of retail | 70 %+ (Vision 2030) | SAMA |

### 2.2 Filipino Population Across KSA

| Region | Est. Filipino residents | Notes |
|---|---|---|
| Riyadh | 800 K – 1.0 M | Largest concentration, domestic + corporate |
| Jeddah + Makkah | 550 K – 700 K | Hajj/Umrah services, hospitality, healthcare |
| Eastern Province (Dammam / Khobar / Dhahran / Jubail) | 350 K – 450 K | Oil & gas, construction |
| Madinah | 120 K – 150 K | Healthcare, hospitality |
| Other (Taif, Tabuk, Abha, Hail, Buraidah, Yanbu) | 150 K – 250 K | Mixed sectors |
| **Total** | **≈ 2.1 – 2.5 M** | POLO/DFA estimates |

**Annual remittances from KSA to PH:** ≈ USD 2.5 B, of which an estimated **30 – 40 %** is ultimately spent on groceries and essentials for families back home.

### 2.3 Competitive Landscape (Nationwide)

| Competitor | Category | Strength | LEGASHOP Edge |
|---|---|---|---|
| **Nana Direct / HungerStation / Jahez / Mrsool** | Q-commerce & food | Wide fleet, brand recall | Not Filipino-focused, higher basket minimums, no remittance |
| **Carrefour MAF Online / Lulu / Panda / Tamimi** | Hypermarket | Trust, catalog depth | High minimums, slow last-mile outside capitals |
| **Puregold Online** | PH grocery | Nationwide PH footprint | No KSA side |
| **LBC Padala / Cebuana Padala** | Remittance-to-goods | OFW trust | Preset packages only, no live catalog |
| **Baqala POS apps (Foodics, Rewaa)** | Vendor tooling | Used by stores | B2B only, no consumer surface |

**White-space LEGASHOP owns:** *Filipino-aware catalog × baqala-speed delivery × live-catalog remittance*, unified on one checkout and one wallet.

### 2.4 Baqala & Mid-Grocer Opportunity

- **50,000+** baqalas nationwide (≈ 12–15 K Riyadh · 8–10 K Jeddah · 5–7 K Eastern Province).
- 200–500 SKUs typical; Filipino brands (Lucky Me, Century Tuna, CDO, Birch Tree, C2) already stocked in OFW-dense districts (Al Batha, Al Olaya, Al Balad, Al Khobar Corniche, Bahrah Road).
- Current tech adoption is low; LEGASHOP provides a turnkey vendor dashboard + demand channel.

---

## 3. Problem & Solution

### 3.1 Problems

**For OFWs & residents in KSA:**
- No dedicated platform aggregates baqala-level pricing with delivery.
- Remittance + grocery workflow is split across 3–4 apps.
- Filipino-brand discovery is word-of-mouth.

**For baqala owners & mid-grocers:**
- Zero online presence; losing share to Q-commerce giants.
- No inventory tooling beyond pen-and-paper POS.

**For OFW families in the Philippines:**
- No transparency that remittance is spent on groceries.
- Existing padala services force preset bundles rather than live catalog choice.

### 3.2 Solution — Dual Marketplace

```
┌──────────────────────────── LEGASHOP ────────────────────────────┐
│                                                                  │
│  ┌─────────────────────────┐   ┌──────────────────────────────┐  │
│  │   KSA LOCAL MARKETPLACE │   │   OFW REMITTANCE GROCERY     │  │
│  │  Browse baqala/grocer   │   │  Browse Puregold catalog     │  │
│  │  1/5 SAR deal tiers     │   │  Pay in SAR, view ≈ PHP       │  │
│  │  15 min – same-day ETA  │   │  Family pickup or delivery    │  │
│  │  Filipino-aware catalog │   │  SMS tracking both ends       │  │
│  └─────────────────────────┘   └──────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │     VENDOR DASHBOARD  (baqala / grocer / Puregold SM)    │    │
│  │     Products · Inventory · Orders · Analytics · Payouts   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │          ADMIN CONSOLE  (internal staff)                 │    │
│  │   Users · Stores · Categories · Orders · Disputes · KPIs  │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Target Users & Personas

| # | Persona | Snapshot | LEGASHOP Use |
|---|---|---|---|
| 1 | **Maria** — Domestic worker, Riyadh | SAR 2.5 K/mo, limited day-off time | Weekly 1/5-SAR essentials from nearest baqala; monthly PH padala |
| 2 | **Ahmed** — Baqala owner, Al Olaya | 400-SKU store, ~200 walk-ins/day | Lists top-100 SKUs, handles 15–25 online orders/day, tracks inventory |
| 3 | **Jun** — Construction worker, Jubail | SAR 3.5 K/mo, sends ₱20 K/mo | Buys Puregold bundle directly for wife in Pangasinan |
| 4 | **Elena** — OFW spouse, Dagupan | Receives padala monthly | Gets SMS + optional home delivery from Puregold Dagupan |
| 5 | **Ravi** — Indian tech worker, Khobar | SAR 8 K/mo, multicultural household | Orders pan-Asian SKUs, Apple Pay / mada, scheduled delivery |
| 6 | **Noura** — Saudi mom, Jeddah | Price-sensitive, prefers Arabic UI | Uses 1/5-SAR deals for pantry restock, Arabic interface |

---

## 5. MVP Feature Scope

### 5.1 In-Scope (v2 MVP — Nationwide launch wave)

| Module | Key Features | Priority |
|---|---|---|
| **Auth** | Email/phone register, JWT + refresh, Google OAuth, phone OTP, password reset | P0 |
| **Catalog** | Categories (nested), product detail, deals (1-SAR / 5-SAR), multilingual names (EN/TL/AR) | P0 |
| **Store Discovery** | Geo-based nearby stores, store profile, per-store product listings, delivery-zone check | P0 |
| **Cart & Checkout** | Multi-store cart (split-order), address picker with map, promo codes, SAR pricing | P0 |
| **Payments** | PayTabs (mada, Visa/MC, Apple Pay) + Stripe (intl) + COD | P0 |
| **Orders & Tracking** | Status machine, live tracking map, SMS + push notifications | P0 |
| **Vendor Dashboard** | Product CRUD, stock, order queue, accept/reject, analytics, payout statements | P0 |
| **Admin Console** | User/store moderation, category mgmt, fraud review, platform KPIs | P0 |
| **PH Remittance (Padala)** | Puregold catalog sync, SAR→PHP display, recipient SMS, PH-side status | P1 |
| **Reviews** | Product & store ratings after delivery | P1 |
| **i18n** | English / Tagalog / Arabic (with RTL support) | P1 |
| **Wallet / Saved Payment** | Tokenized cards via PayTabs vault | P1 |

### 5.2 Post-MVP

Native iOS/Android, AI personalization, subscription boxes, in-app buyer-vendor chat, loyalty points, STC Pay, Tamara/Tabby BNPL, multi-corridor remittance (UAE, Kuwait, Qatar).

---

## 6. Platform Flow (End-to-End)

### 6.1 Local Order Flow (KSA)

```
Customer opens app
   │
   ▼
Geolocation (browser/device) ──► Reverse-geocode to district
   │
   ▼
GET /api/stores/nearby?lat=&lng=&radius_km=5
   │          └──► Haversine SQL → top-N stores in delivery_zone
   ▼
Browse store → Add to cart (React Context, localStorage)
   │
   ▼
Checkout
   ├── Pick address (with map pin)
   ├── Pick payment method
   └── POST /api/orders/  {items, address, payment_method}
             │
             ├──► Validate stock (atomic SELECT ... FOR UPDATE)
             ├──► Create Order + OrderItems + Payment(PENDING)
             ├──► If mada/Visa/ApplePay: create PayTabs transaction, return payment_url
             └──► If COD: mark order PLACED, enqueue vendor notification
   │
   ▼
Customer completes PayTabs hosted checkout
   │
   ▼
PayTabs webhook → POST /api/webhooks/paytabs
             │
             ├──► Verify HMAC signature
             ├──► Idempotency check (tran_ref already processed?)
             ├──► Payment.status = PAID
             └──► Enqueue Celery: notify_vendor + notify_customer
   │
   ▼
Vendor dashboard receives push + email
   ├── Accept → status = PREPARING
   └── Reject → refund via PayTabs API
   │
   ▼
Rider assigned → status = OUT_FOR_DELIVERY
   ├── Rider location streamed via WebSocket (Django Channels)
   └── Customer sees live map with rider pin
   │
   ▼
Delivered → status = DELIVERED
   └── Trigger review request (24 h later, Celery beat)
```

### 6.2 PH Remittance (Padala) Flow

```
OFW browses Puregold-tagged catalog (store_type=PUREGOLD_PH)
   │
   ▼
Add items → Checkout with recipient details (PH phone, address, Puregold branch)
   │
   ▼
POST /api/orders/  {order_type: PH_REMITTANCE, recipient, items}
   ├── Convert SAR → PHP using live rate (cached 15 min)
   └── Payment in SAR via PayTabs
   │
   ▼
On payment success:
   ├── Send SMS to OFW (Unifonic, KSA)
   ├── Send SMS to recipient (Twilio, PH)
   └── Dispatch to Puregold branch (MVP: CSV/email bridge; Phase 2: Puregold API)
   │
   ▼
Puregold fulfills → staff updates status via vendor dashboard → recipient SMS
   └── Optional home delivery (PH logistics partner: LBC / J&T / 2GO)
```

---

## 7. System Architecture

### 7.1 High-Level Diagram

```
                       ┌───────────────────────────────┐
                       │     Cloudflare (SSL, WAF,     │
                       │       DDoS, edge cache)       │
                       └──────────────┬────────────────┘
                                      │
                       ┌──────────────▼────────────────┐
                       │   AWS ALB — me-south-1 (BAH)  │
                       └──┬─────────────────────────┬──┘
                          │                         │
       ┌──────────────────▼───────┐   ┌────────────▼─────────────┐
       │  Frontend (Vite build)   │   │  Django REST API (ECS)   │
       │  React 18 + TS           │   │  Gunicorn + Uvicorn      │
       │  Served via CloudFront   │   │  DRF + SimpleJWT         │
       │  or S3 static hosting    │   │  Django Channels (WS)    │
       └──────────────────────────┘   └──┬───────────────────────┘
                                         │
       ┌─────────────────────────────────┼────────────────────────────────┐
       │                                 │                                │
 ┌─────▼──────┐   ┌──────────────┐  ┌────▼─────────┐   ┌─────────────────▼┐
 │ RDS        │   │ ElastiCache  │  │ OpenSearch    │   │ S3 + CloudFront  │
 │ PostgreSQL │   │ Redis 7      │  │ (catalog      │   │ (images, vendor  │
 │ + PostGIS  │   │ cache / BQ   │  │  search,      │   │  docs, receipts) │
 │ Multi-AZ   │   │ broker       │  │  Arabic/TL)   │   │                  │
 └────────────┘   └──────────────┘  └───────────────┘   └──────────────────┘
                                         │
                  ┌──────────────────────┴─────────────────────────┐
                  │        Celery Workers (ECS Fargate)            │
                  │  notify · fulfill · refund · fx-refresh · seo  │
                  └────────────────────────────────────────────────┘

 External:  PayTabs · Stripe · Google Maps Platform · Twilio · Unifonic
            Open Exchange Rates · Puregold (CSV→API) · Sentry · CloudWatch
```

### 7.2 Key Architectural Decisions

| Area | Choice | Rationale |
|---|---|---|
| Region | AWS **me-south-1** (Bahrain) | < 10 ms to Riyadh/Jeddah/Dammam; PDPL-friendly |
| Backend | **Django 5 + DRF** (modular monolith) | Already implemented, batteries-included admin, auth, ORM, migrations |
| Realtime | **Django Channels + Redis pub/sub** | Live order tracking, vendor order pings |
| Frontend | **React 18 + Vite + TS + Tailwind + shadcn/ui** | Already implemented; SSR deferred post-MVP (Next.js migration optional) |
| Data | **PostgreSQL + PostGIS** | Geo queries (`ST_DWithin`) for nearby stores |
| Cache / Broker | **Redis (ElastiCache)** | Celery broker, session cache, FX rate cache, OTP store |
| Async jobs | **Celery + beat** | Notifications, FX refresh, review prompts, payout runs |
| Search | **Postgres FTS → OpenSearch** (Phase 2) | Start with `SearchVector` trigram; migrate once traffic justifies |
| Payments | **PayTabs** (KSA) + **Stripe** (intl) + COD | PayTabs is SAMA-licensed; Stripe for foreign cards |
| Maps | **Google Maps Platform** (JS, Places, Distance Matrix, Geocoding) | Best KSA coverage; alt: Mapbox GL |
| SMS | **Unifonic** (KSA) + **Twilio** (PH/intl) | CITC-registered sender IDs in KSA |
| Observability | **Sentry + CloudWatch + Prometheus/Grafana** | Errors, APM, infra metrics |

---

## 8. Technology Stack (As Implemented)

### 8.1 Frontend (actual)

```
React 18 · Vite 5 · TypeScript 5
Tailwind CSS 3 + custom design tokens
shadcn/ui (48 components already added)
Framer Motion (animations)
React Router v6 (routing)
TanStack React Query v5 (server state)
React Context (auth + cart — no Zustand)
React Hook Form + Zod (forms & validation)
@react-oauth/google (Google sign-in)
lucide-react (icons)
Vitest (unit tests)
```

**Planned additions (to complete MVP):**
```
@vis.gl/react-google-maps     ← maps in StoresPage + address picker
react-i18next + i18next       ← EN / TL / AR with RTL
@tanstack/react-virtual       ← long catalog lists
socket.io-client OR native WS ← live order tracking
@paytabs/paytabs-js           ← hosted-iframe tokenization (optional)
```

### 8.2 Backend (actual)

```
Python 3.12 · Django 5 · Django REST Framework
django-cors-headers
djangorestframework-simplejwt  (access 30 min · refresh 7 d)
drf-spectacular                (OpenAPI at /api/docs/)
google-auth                    (verifies Google id_token)
psycopg2-binary · dj-database-url · python-dotenv
```

**Planned additions (to complete MVP):**
```
djangorestframework-gis / django.contrib.gis  ← PostGIS nearby queries
celery · redis · django-celery-beat           ← background jobs
channels · channels-redis · daphne            ← WebSockets
stripe · paytabs-pt2                          ← payments
twilio · requests (Unifonic HTTP)             ← SMS / OTP
django-storages[boto3]                        ← S3 media
django-ratelimit · django-axes                ← brute-force & abuse
sentry-sdk                                    ← error tracking
pytest-django · factory-boy                   ← tests + fixtures
```

---

## 9. Technology Implementation Details

This section describes **how** each major capability is actually wired — not just which library to use.

### 9.1 Maps & Geolocation

**Goal:** "find the nearest baqalas", "pick delivery address on a map", "show rider live on map".

#### 9.1.1 Client integration (React)

Library: **`@vis.gl/react-google-maps`** (Google's officially maintained React wrapper).

```tsx
// src/lib/maps.ts
import { APIProvider } from '@vis.gl/react-google-maps';
export const MapsProvider = ({ children }: { children: React.ReactNode }) => (
  <APIProvider
    apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
    libraries={['places', 'geometry']}
    region="SA"
    language="en"  // switch to 'ar' when i18n locale = ar
  >
    {children}
  </APIProvider>
);
```

Three components consume it:

| Component | Purpose | Google APIs used |
|---|---|---|
| `<NearbyStoresMap />` on `StoresPage.tsx` | Plot stores + user pin | Maps JS, Markers, Geometry |
| `<AddressPickerMap />` in `AddressFormDialog.tsx` | Drag-pin to set lat/lng; autocomplete | Maps JS, **Places Autocomplete**, Geocoding |
| `<LiveTrackingMap />` on `OrderDetailPage.tsx` | Rider pin updated via WebSocket | Maps JS, Polyline |

**Geolocation prompt** uses the browser's `navigator.geolocation.getCurrentPosition` first; if denied, we fall back to IP-geo via a lightweight endpoint (`/api/geo/ip-hint/`) that returns the district centroid.

#### 9.1.2 Server-side "nearby stores" query

Use **PostGIS** on the existing `stores_store` table:

```python
# migrations: enable PostGIS
from django.contrib.postgres.operations import CreateExtension
class Migration(migrations.Migration):
    operations = [CreateExtension('postgis')]

# models.py (stores)
from django.contrib.gis.db import models as geo
class Store(models.Model):
    ...
    location = geo.PointField(srid=4326, null=True, blank=True)
    delivery_radius_km = models.FloatField(default=5)
```

Nearby endpoint:

```python
# stores/views.py
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D

class NearbyStoresView(generics.ListAPIView):
    serializer_class = StoreSerializer
    def get_queryset(self):
        lat = float(self.request.query_params['lat'])
        lng = float(self.request.query_params['lng'])
        radius = float(self.request.query_params.get('radius_km', 5))
        user_pt = Point(lng, lat, srid=4326)
        return (Store.objects
                .filter(location__distance_lte=(user_pt, D(km=radius)),
                        is_active=True)
                .annotate(distance=Distance('location', user_pt))
                .order_by('distance'))
```

Response includes `distance_m` and estimated `eta_min = ceil(distance_km / avg_rider_kmh * 60) + store.prep_time_min`.

If PostGIS adoption is deferred, a **Haversine fallback** using `Func`/`RawSQL` with a bounding-box prefilter on `(lat, lng)` indexed columns is acceptable for MVP (< 1 M store rows).

#### 9.1.3 Address Autocomplete & Geocoding

Places Autocomplete is restricted to `componentRestrictions: { country: 'sa' }`. When the user selects a prediction we store `{formatted_address, lat, lng, place_id, components}` in the `Address` model. For PH remittance recipient addresses, we restrict to `country: 'ph'` and do **not** require lat/lng (Puregold branch pickup is primary).

#### 9.1.4 Delivery zone check at checkout

Each store has a `delivery_radius_km` (or a `MultiPolygonField` zone for irregular shapes). On `POST /api/orders/`:

```python
if not store.location.distance(user_address.location) <= D(km=store.delivery_radius_km):
    raise ValidationError('OUT_OF_DELIVERY_ZONE')
```

#### 9.1.5 Key security & cost controls

- Maps JS key is **domain-referrer restricted** (`legashop.com`, `*.legashop.com`, `localhost`).
- Places/Geocoding/Distance-Matrix server-side calls go through a **single backend proxy** using a *server-IP-restricted* key to avoid client-side billing abuse.
- Requests are cached (Redis, 24 h) by `(lat,lng)` rounded to 3 decimals (~110 m) for reverse-geocoding.

---

### 9.2 Payments

#### 9.2.1 PayTabs (primary — KSA)

Flow: **Hosted Payment Page (HPP)** for MVP (PCI scope = SAQ-A).

```
Client                  Django                    PayTabs
  │  POST /orders/ ───────►│
  │                        │ create Order, Payment(PENDING)
  │                        │ POST https://secure.paytabs.sa/payment/request
  │                        │   { profile_id, tran_type=sale, tran_class=ecom,
  │                        │     cart_id=order.uuid, cart_amount, cart_currency=SAR,
  │                        │     return=https://legashop.com/payment/return?o=<uuid>,
  │                        │     callback=https://api.legashop.com/webhooks/paytabs }
  │                        │◄──── { redirect_url, tran_ref }
  │◄── { payment_url } ────│
  │─── browser redirect ──►│────────────────────────►│
  │                                                   │ customer pays (mada / Visa / Apple Pay)
  │                                                   │
  │◄─────────── return URL ──────────────────────────│
  │                        │◄─── callback POST (HMAC signed) ─────│
  │                        │ verify signature_hmac_sha256(secret, body)
  │                        │ idempotency: Payment(tran_ref=...) already PAID? → 200 OK
  │                        │ else: Payment.status=PAID, Order.status=PLACED
  │                        │ enqueue celery: notify_vendor, notify_customer
```

Security / reliability:
- Verify HMAC on every webhook (`X-Paytabs-Signature`) — reject on mismatch.
- Webhook endpoint is **idempotent** keyed on `tran_ref`.
- Enforce **server-side amount check** (never trust client total).
- Store raw webhook bodies for 90 days (audit).

#### 9.2.2 Stripe (international cards)

Used when the buyer's card issuer country ≠ SA. Flow: **PaymentIntents + Stripe Elements**.
- Create PI with `currency=sar`, `automatic_payment_methods=enabled`.
- Webhook: `payment_intent.succeeded` → same finalisation path as PayTabs.

#### 9.2.3 Cash on Delivery

Order moves to `PLACED` immediately; Payment stays `PENDING` until rider marks `COLLECTED` in the vendor app, which posts to `/api/orders/<id>/cod-collected/`.

#### 9.2.4 Refunds

Vendor-triggered cancellation or admin dispute calls `PayTabs: tran_type=refund` or `stripe.Refund.create`, persists the refund record, and emits `Payment.status=REFUNDED`.

---

### 9.3 Phone OTP & SMS Notifications

**KSA SMS** via **Unifonic** (CITC-compliant), **PH SMS** via **Twilio**.

```python
# utils/sms.py
def send_otp(phone: str) -> None:
    code = f'{secrets.randbelow(1_000_000):06d}'
    cache.set(f'otp:{phone}', make_password(code), timeout=300)  # 5 min
    provider = unifonic if phone.startswith('+966') else twilio
    provider.send(phone, f'LEGASHOP code: {code}')
```

- OTPs stored **hashed** in Redis, 5-minute TTL, max 5 tries, 60-second resend cooldown.
- Rate-limit by IP and by phone (`django-ratelimit`).
- Order status transitions trigger templated SMS via Celery task `send_status_sms.delay(order_id)`.

---

### 9.4 Real-Time Order Tracking

**Django Channels** + Redis layer:

```python
# orders/consumers.py
class OrderTrackingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope['url_route']['kwargs']['order_id']
        if not await self.user_owns_order(): return await self.close()
        await self.channel_layer.group_add(f'order_{self.order_id}', self.channel_name)
        await self.accept()

    async def order_update(self, event):
        await self.send_json(event['payload'])  # {status, rider_lat, rider_lng, eta}
```

- Rider mobile sends GPS every 10 s → `POST /api/rider/ping/` → broadcast to `order_{id}` group.
- Frontend opens `wss://api.legashop.com/ws/orders/<id>/` after authentication (JWT in query or first message).
- Fallback: polling `GET /api/orders/<id>/` every 15 s if WebSocket unavailable.

---

### 9.5 Internationalization (EN / TL / AR)

- **Frontend:** `react-i18next` with JSON resource files at `src/i18n/{en,tl,ar}/common.json`. Locale stored in `localStorage` and synced to `user.profile.language`. Direction toggled via `<html dir="rtl">` for Arabic; Tailwind `rtl:` variants handle layout mirroring.
- **Backend:** The `Product` model already stores `name`, `name_tl`, `name_ar` (same for `description_*`). A custom DRF serializer mixin picks the right field from the `Accept-Language` header:

```python
class LocalizedMixin:
    localized_fields = ()  # override
    def to_representation(self, instance):
        data = super().to_representation(instance)
        lang = self.context['request'].headers.get('Accept-Language', 'en')[:2]
        for f in self.localized_fields:
            data[f] = getattr(instance, f'{f}_{lang}', None) or data[f]
        return data
```

- **Currency / number formatting** uses `Intl.NumberFormat` (e.g. `ar-SA`).
- SMS templates are language-aware (customer's profile language).

---

### 9.6 Search

**MVP:** Postgres full-text search with `pg_trgm` for Arabic/Latin fuzzy matching.

```python
# products/views.py
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.contrib.postgres.indexes import GinIndex

class Product(models.Model):
    class Meta:
        indexes = [
            GinIndex(fields=['name'], name='prod_name_trgm', opclasses=['gin_trgm_ops']),
        ]

qs = Product.objects.annotate(
    rank=SearchRank(SearchVector('name', 'name_tl', 'name_ar', 'description'),
                    SearchQuery(q, search_type='websearch'))
).filter(rank__gt=0.05).order_by('-rank')
```

**Phase 2:** replace with **AWS OpenSearch** (Arabic analyzer + custom Tagalog synonym list e.g. `lucky me → pancit canton`).

---

### 9.7 Background Jobs (Celery)

```
celery_app = Celery('legashop', broker=REDIS_URL, backend=REDIS_URL)
celery_app.conf.beat_schedule = {
    'refresh-sar-php-rate':       {'task': 'orders.fx.refresh',     'schedule': crontab(minute='*/15')},
    'send-review-requests':       {'task': 'orders.reviews.remind', 'schedule': crontab(minute=0, hour='*/1')},
    'vendor-payout-run':          {'task': 'orders.payouts.run',    'schedule': crontab(minute=0, hour=2)},
    'cleanup-abandoned-carts':    {'task': 'orders.carts.cleanup',  'schedule': crontab(minute=30)},
}
```

Primary queues:
- `notifications` — SMS, email, push (high priority)
- `fulfillment` — vendor notifications, rider assignment
- `finance` — payouts, refunds, reconciliation
- `maintenance` — FX refresh, sitemap, housekeeping

---

### 9.8 Media / CDN

- Uploads (`Product.image`, vendor docs) use **django-storages** → **S3 bucket `legashop-media-prod`** behind **CloudFront**.
- Images are transformed client-side (resized + WebP) before upload where possible; server generates derivative sizes (`thumb-200`, `card-480`, `detail-1080`) via a Celery task using Pillow.
- HTTP caching: immutable 1-year `Cache-Control` on `/media/derivatives/*`.

---

### 9.9 Observability & Security

- **Sentry** for both frontend and backend (release-tagged via CI).
- **CloudWatch Logs** (structured JSON) + metric filters for error rate, webhook failures, 5xx.
- **Security baseline:**
  - HTTPS only, HSTS 6 months, secure+httpOnly cookies for refresh tokens (if migrated off `localStorage`).
  - Rate limits: `login`=5/min/IP, `otp/send`=3/hour/phone, `orders`=20/hour/user.
  - CSP header served by nginx; CSRF exempt only on webhook endpoints (which use HMAC).
  - `django-axes` locks accounts after 10 failed logins.
  - PayTabs/Stripe keys in **AWS Secrets Manager**; rotated quarterly.
  - DB backups: RDS automated + weekly snapshot to secondary region.

---

## 10. UI / UX & Brand Identity

### 10.1 Philippine-Flag-Inspired Palette (unchanged from v1, already tokenized)

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--primary` | Kalayaan Blue | `#10A1CF` | Nav, primary buttons |
| `--primary-light` | Langit | `#B8E4F5` | Card backgrounds |
| `--primary-dark` | Dagat | `#074B64` | Headings on light |
| `--accent` | Tapang Red | `#E52E3E` | Sale badges, errors |
| `--accent-light` | Sampaguita Rose | `#FADCDF` | Promo banners |
| `--gold` | Tala Gold | `#F5CA2B` | Ratings, 1/5-SAR chips |
| `--gold-light` | Bukang Liwayway | `#FDF3D0` | Featured tiles |
| `--bg` | Malinis White | `#FAFBFC` | Page bg |
| `--muted` | Batong Gray | `#6B7280` | Secondary text |
| `--fg` | Gabi Dark | `#1F2937` | Primary text |

Fonts (already configured in Tailwind): **Nunito** (display), **DM Sans** (body), **Space Grotesk** (prices).

Principles: mobile-first (375 px min); skeleton loaders on all data views; WCAG 2.1 AA contrast; RTL-ready for Arabic.

---

## 11. Database Schema

The actual implemented schema (Django models), summarized:

```
User (AbstractUser + email, phone, phone_verified, is_active, date_joined)
  └─ Profile (1-1)  role=CUSTOMER|VENDOR|ADMIN, avatar, language, pref_currency
  └─ Address (N)    label, street, district, city, country, postal_code, lat, lng, place_id, is_default

Category (self-FK parent; name, name_tl, name_ar, slug, icon, image, is_active, sort)
Product  (category FK, store FK null, name+_tl+_ar, description, price, sale_price,
          is_deal, deal_type=ONE_RIYAL|FIVE_RIYAL, stock, image, sku, weight_g, is_active)
Review   (product FK, user FK, rating 1-5, title, body, created_at)

Store    (owner=User FK, name, slug, description, logo, banner, phone, email,
          address, district, city, country=SA, lat, lng, location(PointField*),
          delivery_radius_km*, prep_time_min*, avg_rating, is_active, is_verified)
          * = to be added v2

Order    (uuid, user FK, store FK, order_type=LOCAL_KSA|PH_REMITTANCE,
          status=PENDING|PLACED|PREPARING|OUT_FOR_DELIVERY|DELIVERED|CANCELLED|PH_DELIVERED,
          subtotal, delivery_fee, discount, total, currency=SAR, address snapshot JSON,
          recipient_snapshot JSON (for padala), placed_at, delivered_at)
OrderItem(order FK, product FK, name_snapshot, price_snapshot, qty)
Payment  (order 1-1, method=COD|MADA|VISA|APPLE_PAY|STRIPE, status=PENDING|PAID|FAILED|REFUNDED,
          amount, currency, provider_tran_ref, raw_payload JSON, paid_at, refunded_at)
```

Indexes to add with v2 migration: `Store(location) GIST`, `Product(name gin_trgm)`, `Order(user, placed_at DESC)`, `OrderItem(order)`.

---

## 12. API Architecture

Base URL: `https://api.legashop.com/api/` (prod) · `http://127.0.0.1:8000/api/` (dev).
Auth: `Authorization: Bearer <access_jwt>`. Docs: `/api/docs/` (drf-spectacular).

```
AUTH
  POST   /signup/                POST   /login/              POST   /auth/google/
  POST   /auth/otp/send/*        POST   /auth/otp/verify/*   POST   /auth/refresh/
  GET    /profile/               PUT    /profile/            POST   /change-password/
  GET    /addresses/  POST  /addresses/  PUT/DELETE /addresses/<id>/

CATALOG
  GET    /categories/            GET    /categories/<id>/
  GET    /products/              GET    /products/<id>/      GET    /products/deals/?deal_type=
  GET    /products/search/?q=    GET    /reviews/?product=<id>    POST /reviews/

STORES
  GET    /stores/                GET    /stores/<id>/        GET    /stores/<id>/products/
  GET    /stores/nearby/?lat=&lng=&radius_km=*                (v2)

CART  (client-side; server is stateless)

ORDERS
  POST   /orders/                GET    /orders/             GET    /orders/<id>/
  POST   /orders/<id>/cancel/    POST   /orders/<id>/cod-collected/*   (v2)
  WS     /ws/orders/<id>/*                                    (v2)

PH REMITTANCE
  GET    /ph/catalog/*           GET    /ph/exchange-rate/*
  POST   /ph/orders/*            GET    /ph/orders/            GET /ph/orders/<id>/*      (v2)

VENDOR
  GET/POST/PUT/DELETE  /vendor/products/
  GET    /vendor/orders/         PUT    /vendor/orders/<id>/
  GET    /vendor/analytics/*     PUT    /vendor/store/                                     (v2)

ADMIN
  GET    /admin/users/           GET/PUT  /admin/stores/<id>/
  GET    /admin/orders/          GET    /admin/analytics/*                                 (v2)

WEBHOOKS
  POST   /webhooks/paytabs/*     POST   /webhooks/stripe/*                                 (v2)

* = planned for v2 (see §19)
```

---

## 13. Deployment & Infrastructure

### 13.1 AWS topology (me-south-1)

```
VPC 10.0.0.0/16
├─ public  subnet ×2 AZ   → ALB, NAT Gateways
├─ private subnet ×2 AZ   → ECS Fargate services
│     ├─ svc-api       (Django + gunicorn, 2 tasks, HPA CPU 60 %)
│     ├─ svc-ws        (Daphne for Channels, 1 task → 3)
│     ├─ svc-worker    (Celery workers, 2 tasks)
│     ├─ svc-beat      (Celery beat, 1 task singleton)
│     └─ svc-web       (nginx serving Vite build from S3, or CloudFront directly)
└─ data    subnet ×2 AZ   → RDS PostgreSQL 15 Multi-AZ, ElastiCache Redis cluster-mode off, OpenSearch
```

S3 buckets: `legashop-media-prod`, `legashop-backups-prod`, `legashop-logs-prod`.
Secrets: AWS Secrets Manager (`PAYTABS_*`, `STRIPE_*`, `GOOGLE_MAPS_*`, `TWILIO_*`, `UNIFONIC_*`, `DB_PASSWORD`).

### 13.2 CI/CD

GitHub Actions pipeline:

```
push → lint (ruff, eslint) → test (pytest, vitest) → build docker images
     → push to ECR → terraform plan/apply (infra) → ECS deploy (rolling)
     → smoke tests (health check, critical API) → Sentry release
```

### 13.3 Environments

| Env | Infra | Data | Use |
|---|---|---|---|
| local | Docker Compose | Synthetic seed | Dev |
| staging | ECS t3.small × 1, RDS t3.micro | Anonymized copy | QA, partner demos |
| prod | ECS Fargate multi-AZ, RDS m5.large | Live | Customers |

---

## 14. Payments & Compliance

| Requirement | Detail | Status |
|---|---|---|
| MCIT / ZATCA e-commerce registration | CR + Maroof listing, VAT registration | Pre-launch |
| SAMA-licensed payment partner | PayTabs (licensed PSP) | Partner-ready |
| PDPL (Saudi data protection) | Data residency me-south-1, DSAR endpoint, consent tracking | In design |
| PCI-DSS | SAQ-A via hosted PayTabs page | Scope minimized |
| Consumer protection e-commerce law | T&Cs, returns policy, 7-day cancellation | Drafted |
| WZEMS / wages-protection impact | N/A (marketplace, not employer) | — |
| VAT 15 % | Shown on all invoices; ZATCA e-invoicing Phase 2 integration | Integration pending |

---

## 15. Operations & Fulfillment (Nationwide)

### 15.1 City Rollout Waves

| Wave | Cities | Partner target | Timing |
|---|---|---|---|
| 1 | Riyadh | 60 stores | Month 0 – 2 |
| 2 | Jeddah + Makkah | 50 stores | Month 2 – 3 |
| 3 | Dammam / Khobar / Dhahran | 35 stores | Month 3 – 4 |
| 4 | Madinah · Taif | 25 stores | Month 4 – 5 |
| 5 | Tabuk · Abha · Hail · Buraidah | 30 stores | Month 5 – 6 |

### 15.2 Delivery Models

| Model | Who | When |
|---|---|---|
| **Vendor-fulfilled** | Baqala own runner | Small baskets, < 3 km |
| **LEGASHOP rider** | In-house or contracted (Jahez-like 3PL) | Medium, 3–8 km, SLA 45 min |
| **3PL partner** (Mrsool / Aramex Fleet) | B2B rate card | Larger orders, intercity |
| **Puregold PH fulfillment** | Puregold branch staff | Remittance (padala) orders |

### 15.3 Vendor Onboarding

1. Vendor signs up (`role=VENDOR`) → pending admin approval.
2. Uploads CR/VAT documents + bank details → `is_verified=true`.
3. Bulk CSV product import (template provided) + shelf-image helper.
4. Training webinar (Arabic + English) on the dashboard.

---

## 16. Go-to-Market Strategy

| Channel | Tactic |
|---|---|
| **Community** | Partner with Filipino community groups in Riyadh/Jeddah/Al Khobar; embassy bulletins |
| **Baqala Walk-ins** | Street team signs 10–15 stores/week with on-the-spot onboarding |
| **Facebook / TikTok KSA** | Video testimonials from OFWs showing 1 SAR / 5 SAR hauls |
| **Referral Program** | SAR 10 credit for both referrer and referee on first order |
| **Padala Launch Campaign** | "₱500 off your first Puregold padala" — timed around payday (25th) |
| **SEO** | Riyadh-district, Jeddah-district landing pages ("Al Batha grocery delivery") |

---

## 17. Revenue Model & KPIs

### 17.1 Revenue Streams

| Stream | Take | Notes |
|---|---|---|
| Commission on local orders | 8 – 12 % | Tiered by vendor volume |
| Delivery fee margin | SAR 2 – 4 / order | Keeps SAR 0 – 2 for platform |
| PH remittance fee | 1.5 – 2.5 % of SAR total | Competitive vs padala services |
| Sponsored listings | CPC / CPM | Post-MVP |
| Subscription "LEGASHOP Plus" | SAR 19 / mo, free delivery | Phase 2 |

### 17.2 North-Star & Guardrail Metrics

| Type | Metric | Target (month 6) |
|---|---|---|
| North-Star | Weekly Active Buyers | 12 K |
| Activation | % signups placing 1st order in 7 d | ≥ 45 % |
| Retention | M1 order-repeat rate | ≥ 35 % |
| Ops | On-time delivery | ≥ 85 % |
| Quality | Order defect rate (cancels + complaints) | ≤ 3 % |
| Economics | Contribution margin / order | ≥ SAR 4 |

---

## 18. Roadmap & Phasing

| Phase | Window | Deliverables |
|---|---|---|
| **0 · Foundations** (done) | M-2 → M0 | Auth, catalog, cart, orders, account, deals — see §19 |
| **1 · Nationwide MVP** | M0 → M3 | Payments live (PayTabs+Stripe+COD), Maps + nearby stores, Vendor dashboard UI, Admin console, OTP, SMS, i18n, Celery/Redis, basic WebSocket tracking |
| **2 · Padala & Scale** | M3 → M6 | Puregold integration (CSV→API), OpenSearch, PWA offline mode, Apple Pay, rider app (React Native), loyalty v0 |
| **3 · Platform** | M6 → M12 | AI recommendations, Tamara/Tabby BNPL, STC Pay, native apps, multi-corridor padala, ZATCA e-invoicing |

---

## 19. Implementation Status — What's Done vs. Pending

Legend: ✅ Done · 🟡 Partial · ⬜ Not started · (P0/P1/P2 = MVP priority)

### 19.1 Backend (Django · `/backend`)

| Area | Status | Detail |
|---|---|---|
| Django project & settings | ✅ | `config/` with dj-database-url, JWT, CORS, drf-spectacular |
| Apps: users, products, stores, orders | ✅ | Models, migrations in place |
| `User` + `Profile` (role CUSTOMER/VENDOR/ADMIN) | ✅ | `users/models.py` |
| `Address` (label, lat, lng, default) | ✅ | `users/migrations/0003_address.py` |
| `Category`, `Product`, `Review` | ✅ | incl. `name_tl`, `name_ar`, deal_type |
| `Store` (lat, lng, district, avg_delivery_min) | 🟡 | fields present; **PostGIS `PointField` + `delivery_radius_km` not yet added** (P0) |
| `Order`, `OrderItem`, `Payment` | ✅ | Stock-safe creation, methods COD/MADA/VISA/APPLE_PAY |
| JWT auth (SimpleJWT, refresh) | ✅ | 30-min access / 7-day refresh |
| Google OAuth (`/auth/google/`) | ✅ | verifies `id_token` server-side |
| Phone OTP (Unifonic/Twilio) | ⬜ | **P0** |
| Categories/Products/Stores/Orders CRUD endpoints | ✅ | Vendor & admin variants present |
| Nearby-stores endpoint (geo) | ⬜ | **P0** — needs PostGIS + view |
| Product search endpoint | ✅ | `GET /api/search/?q=` — server-side `icontains` across products, stores, categories. FTS/trigram index still **P1** |
| PayTabs integration + webhook | ⬜ | **P0** |
| Stripe integration + webhook | ⬜ | **P0** |
| COD confirmation endpoint | ⬜ | **P1** |
| PH remittance order flow | ⬜ | Order model supports `PH_REMITTANCE`; no endpoints/logic yet (**P1**) |
| FX rate (SAR→PHP) service + cache | ⬜ | **P1** |
| Celery + Redis + beat | ⬜ | Not in `Pipfile` (**P0**) |
| Django Channels / WebSocket order tracking | ⬜ | **P1** |
| Notifications (SMS/email templates + dispatch) | ⬜ | **P0** |
| Rate limiting / `django-axes` / Sentry | ⬜ | **P1** |
| Image storage (Cloudinary via `STORAGES`) | ✅ | `ImageField` on Product, Store, Category; served via Cloudinary CDN |
| Seed data / fixtures / `seed` management command | ✅ | `python manage.py seed_data` — 35 products, 3 stores, 8 categories, 4 test accounts |
| Tests (pytest, factories) | ⬜ | `tests.py` files empty (**P1**) |
| OpenAPI docs (Swagger) | ✅ | `/api/docs/` via drf-spectacular |

### 19.2 Frontend (React + Vite · `/frontend`)

| Page / Feature | Status | Detail |
|---|---|---|
| Homepage (`Index`) | ✅ | Hero, deals, categories, stores, remittance preview |
| Auth — Login / Signup / Google | ✅ | `LoginPage`, `SignupPage`, `use-auth` context |
| Categories browse | ✅ | `CategoriesPage` |
| Product detail | ✅ | `ProductPage` with reviews, add-to-cart, **review submission form** wired to `useCreateReview()` |
| 1-SAR / 5-SAR deals | ✅ | `OneSarDeals`, `FiveSarDeals` |
| Store list | ✅ | `StoresPage` connected to `useStores()` hook → `GET /api/stores/`; loading skeleton + error states; search filters on `name`, `name_ar`, `district` |
| Store detail | ✅ | `StorePage` |
| Search | ✅ | `SearchResults` — calls `searchAll(query)` → `GET /api/search/?q=` server-side; client-side tab sort/filter on results |
| Cart (drawer + context + persistence) | ✅ | `CartDrawer`, `use-cart` context, localStorage |
| Checkout | 🟡 | `CheckoutPage` — address + payment UI + `POST /orders/`, but **no payment provider** (**P0**) |
| Order confirmation | ✅ | `OrderConfirmationPage` |
| Orders list | ✅ | `OrdersPage` |
| Order detail + tracking | ✅ | `OrderDetailPage` — real API via `useOrder()` + `useCancelOrder()`, status timeline, payment display; live map still **P1** |
| Account — profile / addresses / security | ✅ | `AccountPage` + `account/*` sections; address has lat/lng fields but **no map picker** |
| Remittance landing | 🟡 | `RemittancePage` static UI only; no backend wiring (**P1**) |
| Google Maps (nearby, picker, tracking) | ⬜ | **P0** (`@vis.gl/react-google-maps`) |
| i18n (EN / TL / AR with RTL) | ⬜ | **P1** (`react-i18next`) |
| Vendor dashboard routes/pages | ⬜ | Backend endpoints exist; no UI (**P0**) |
| Admin console routes/pages | ⬜ | **P1** |
| Payment success/failure return pages | ⬜ | **P0** |
| Push / toast notifications on order status | ⬜ | **P1** |
| PWA (installable, offline shell) | ⬜ | **P2** |
| Error tracking (Sentry client) | ⬜ | **P1** |
| E2E tests (Playwright) | ⬜ | **P2** |

### 19.3 Infrastructure & DevOps

| Item | Status |
|---|---|
| Dockerfile (api, web, worker) | ⬜ P0 |
| docker-compose for local dev | ⬜ P0 |
| GitHub Actions CI (lint/test/build) | ⬜ P0 |
| Terraform for AWS me-south-1 | ⬜ P1 |
| CloudFront + S3 for frontend | ⬜ P1 |
| ECS task definitions + ALB | ⬜ P1 |
| RDS provisioning + backups | ⬜ P1 |
| Secrets Manager wiring | ⬜ P1 |
| Sentry project + release tagging | ⬜ P1 |

### 19.4 Consolidated "to finish the MVP" checklist

**P0 — blocking launch**
1. ~~Seed data / management command~~ ✅ Done (`seed_data`)
2. ~~Server-side search endpoint~~ ✅ Done (`GET /api/search/?q=`)
3. ~~Image storage~~ ✅ Done (Cloudinary via `STORAGES`)
4. ~~OrderDetailPage rebuild~~ ✅ Done (real API, status timeline, cancel order)
5. ~~Connect `StoresPage` to real API~~ ✅ Done — replaced hardcoded stores with `useStores()` hook + loading skeleton + error states.
6. ~~Wire review submission form~~ ✅ Done — `ProductPage.tsx` now has interactive star-rating + comment form wired to `useCreateReview()`.
7. ~~Fix delivery fee mismatch~~ ✅ Done — frontend cart updated from 3 SAR to 5 SAR to match backend.
8. ~~Fix cancelled orders stock restoration~~ ✅ Done — `OrderCancelView` now restores `product.stock` within `transaction.atomic`.
9. PostGIS migration + `Store.location`, `Store.delivery_radius_km`; `/stores/nearby/` endpoint.
10. Google Maps provider + `AddressPickerMap` + `NearbyStoresMap`.
11. PayTabs hosted-checkout integration + webhook + payment return page.
12. Stripe PaymentIntents fallback for intl cards.
13. Phone OTP (Unifonic + Twilio) + rate limiting.
14. Celery + Redis + beat; order-status notification tasks.
15. Vendor dashboard UI (products CRUD, order queue, accept/reject).
16. Docker + docker-compose + GitHub Actions.

**P1 — before public launch**
17. Migrate 6 pages from direct `useEffect` calls to React Query hooks (ProductPage, StorePage, CheckoutPage, AddressesSection, ProfileSection, SecuritySection).
18. ProfileSection should fetch fresh data via `useProfile()` instead of reading stale auth context.
19. OrderDetailPage address display — show real `delivery_address` instead of hardcoded "Riyadh, Saudi Arabia".
20. Remove mock-data fallbacks in `api.ts` catch blocks — add proper error boundary display.
21. Add product seed images (currently blank/placeholder).
22. i18n (EN/TL/AR, RTL).
23. PH remittance endpoints + FX cache + Puregold CSV ingest.
24. Admin console UI.
25. SMS templates + in-app toasts + Sentry integration.
26. Postgres FTS with trigram index for fuzzy/multilingual search.
27. Pytest smoke suite.

**P2 — stabilize & grow**
28. OpenSearch migration for multilingual search.
29. PWA manifest + offline shell.
30. Rider app (React Native) + live GPS ping.
31. BNPL (Tamara/Tabby), STC Pay, Apple Pay via PayTabs.

---

## 20. Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Payment provider outage | Med | High | Dual rails: PayTabs + Stripe + COD |
| Baqala stockouts causing cancellations | High | Med | Vendor-confirmed stock; auto-substitute flow; daily reconciliation |
| Rider/fleet shortage outside Riyadh | High | High | 3PL partnerships (Mrsool, Aramex) + vendor-fulfilled fallback |
| Puregold API unavailability | High | Med | MVP uses CSV/email bridge; only add direct API when partnership matures |
| KSA PDPL non-compliance | Low | Very high | Data stays in me-south-1; DSAR endpoint; DPIA before launch |
| Google Maps cost spike | Med | Med | Server-proxy geocoding + Redis cache; daily budget alerts |
| FX volatility on padala orders | Med | Med | 15-min rate lock on cart; hedge buffer in fee |
| Vendor onboarding bottleneck | High | High | Field team with tablet-based signup; Arabic-first training |

---

## 21. Budget Estimate (6-month MVP)

| Line | Estimate (USD) |
|---|---|
| Engineering (3 FE, 3 BE, 1 DevOps, 1 QA, 1 PM, 1 designer × 6 mo) | 280 K |
| AWS infrastructure (staging + prod) | 22 K |
| Google Maps + SMS + FX + Sentry | 14 K |
| Payment fees (pass-through) | — (variable) |
| Ops team (12 onboarders across 6 cities × 6 mo) | 90 K |
| Marketing & community | 60 K |
| Legal, compliance, CR, VAT, Maroof | 15 K |
| Contingency (10 %) | 48 K |
| **Total** | **≈ USD 529 K** |

---

*End of document — LEGASHOP Business Plan v2.*
