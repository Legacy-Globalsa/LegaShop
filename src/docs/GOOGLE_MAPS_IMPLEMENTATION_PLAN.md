# 🗺️ Google Maps Integration — Implementation Plan

### *Baqala Store Discovery, Distance-Based Delivery ETA & Dynamic Fees*

**Version:** 1.0
**Date:** April 20, 2026
**Status:** Planning
**Scope:** No real-time GPS tracking — ETA is calculated once at order time using Google Distance Matrix (driving distance + live traffic).

---

## Table of Contents

1. [Overview](#1-overview)
2. [Google Maps APIs Required](#2-google-maps-apis-required)
3. [API Key Strategy](#3-api-key-strategy)
4. [ETA Calculation Logic](#4-eta-calculation-logic)
5. [Delivery Fee Tiers](#5-delivery-fee-tiers)
6. [Backend Implementation](#6-backend-implementation)
7. [Frontend Implementation](#7-frontend-implementation)
8. [Page-by-Page Integration](#8-page-by-page-integration)
9. [Files Affected](#9-files-affected)
10. [Cost Estimate](#10-cost-estimate)
11. [Verification & Testing](#11-verification--testing)
12. [Decisions & Trade-offs](#12-decisions--trade-offs)
13. [Fallbacks & Edge Cases](#13-fallbacks--edge-cases)
14. [Implementation Order](#14-implementation-order)

---

## 1. Overview

### What We Want

1. **Show baqala stores on a Google Map** — markers for each store, click for details.
2. **Calculate delivery ETA based on real driving distance + live traffic** — not straight-line, not real-time GPS.
3. **Dynamic delivery fees** — tiered by distance instead of the current flat 5 SAR.
4. **Validate delivery zone** — reject orders where the customer address is outside the store's delivery radius.
5. **Address picker with map** — drag-pin + Places Autocomplete for setting delivery address lat/lng.

### What We're NOT Doing

- ❌ Real-time rider GPS tracking (no live location streaming).
- ❌ Turn-by-turn route rendering (no Directions API polylines).
- ❌ Rider app or GPS ping infrastructure.
- ❌ PostGIS — we use Haversine SQL on existing `latitude`/`longitude` FloatFields (sufficient for < 1 K stores).

### How ETA Works (High Level)

```
Customer selects delivery address
        │
        ▼
Frontend calls: GET /api/stores/<id>/delivery-estimate/?lat=&lng=
        │
        ▼
Backend calls Google Distance Matrix API
  (origin = store lat/lng, destination = customer lat/lng)
  (departure_time = now, traffic_model = best_guess)
        │
        ▼
Google returns: { distance_km, duration_min, duration_in_traffic_min }
        │
        ▼
Backend calculates:
  estimated_delivery_min = duration_in_traffic_min + store.avg_delivery_min (prep time)
  delivery_fee = tier based on distance_km
        │
        ▼
Frontend displays: "~45 min · 3.2 km · 7 SAR delivery"
```

---

## 2. Google Maps APIs Required

| API | Purpose | Used By | Billing Model |
|---|---|---|---|
| **Maps JavaScript API** | Render interactive maps with store markers, info windows, delivery zone circles | Frontend | Per map load (~$7 / 1,000 loads) |
| **Distance Matrix API** | Calculate **driving distance (km)** and **duration with traffic** between store and customer address | Backend (server-side proxy) | $5 / 1,000 elements |
| **Geocoding API** | **Reverse-geocode** lat/lng → human-readable address (when user drags map pin); **forward-geocode** text address → lat/lng | Backend (server-side proxy) | $5 / 1,000 requests |
| **Places API (Autocomplete)** | Address search/autocomplete when adding a delivery address (restricted to `country: 'sa'`) | Frontend (via Maps JS) | $2.83 / 1,000 sessions |

### APIs We Do NOT Need

| API | Why Not Needed |
|---|---|
| **Directions API** | We only need distance + duration, not turn-by-turn route polylines |
| **Roads API** | No GPS snapping — we're not tracking riders |
| **Geolocation API** (Google's paid one) | Browser's free `navigator.geolocation.getCurrentPosition()` is sufficient |
| **Routes API** | Newer replacement for Directions — same reason, not needed |
| **Street View API** | No street-level imagery required |

---

## 3. API Key Strategy

We need **two separate API keys** to prevent billing abuse and follow Google's security best practices:

| Key | Restrictions | Used For | Stored In |
|---|---|---|---|
| **Browser key** | HTTP referrer restricted (`legashop.com`, `*.legashop.com`, `localhost:*`) | Maps JavaScript API, Places Autocomplete | `VITE_GOOGLE_MAPS_KEY` in frontend `.env` |
| **Server key** | IP restricted (server IPs only) | Distance Matrix API, Geocoding API | `GOOGLE_MAPS_SERVER_KEY` in backend `.env` (or AWS Secrets Manager in prod) |

### Why Two Keys?

- The **browser key** is visible in client-side JavaScript — referrer restrictions prevent anyone from stealing it and running up our bill.
- The **server key** is never exposed to the browser — all Distance Matrix and Geocoding calls go through our Django backend as a proxy, using the IP-restricted key.

### Google Cloud Console Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable: **Maps JavaScript API**, **Distance Matrix API**, **Geocoding API**, **Places API**.
3. Create two API keys with the restrictions above.
4. Set a **daily budget cap** ($25/day for MVP) to prevent runaway costs.
5. Enable billing alerts at 50%, 80%, 100% of budget.

---

## 4. ETA Calculation Logic

### Formula

```
estimated_delivery_min = google_duration_in_traffic_min + store.avg_delivery_min
```

| Component | Source | Description |
|---|---|---|
| `google_duration_in_traffic_min` | Google Distance Matrix API response (`duration_in_traffic.value / 60`) | Driving time from store to customer, accounting for **current traffic conditions** |
| `store.avg_delivery_min` | `Store.avg_delivery_min` field (default: 30) | Preparation/packaging time at the baqala — set by vendor or admin |

### Distance Matrix API Request

```
GET https://maps.googleapis.com/maps/api/distancematrix/json
  ?origins=24.6330,46.7200          ← store lat,lng
  &destinations=24.7100,46.6750    ← customer lat,lng
  &mode=driving
  &departure_time=now              ← enables traffic-aware duration
  &traffic_model=best_guess        ← realistic estimate (vs pessimistic/optimistic)
  &language=en
  &units=metric
  &key=GOOGLE_MAPS_SERVER_KEY
```

### Distance Matrix API Response (relevant fields)

```json
{
  "rows": [{
    "elements": [{
      "status": "OK",
      "distance": {
        "text": "5.2 km",
        "value": 5200           // meters
      },
      "duration": {
        "text": "12 mins",
        "value": 720            // seconds (no traffic)
      },
      "duration_in_traffic": {
        "text": "18 mins",
        "value": 1080           // seconds (with traffic)
      }
    }]
  }]
}
```

### Example Calculation

```
Store: "Abu Khalid Baqala" in Al Batha
  - avg_delivery_min = 20 (fast prep)
  - delivery_zone = 5 km

Customer: address in Al Olaya (5.2 km away)

Google returns:
  - distance = 5.2 km
  - duration (no traffic) = 12 min
  - duration_in_traffic = 18 min (rush hour)

Result:
  - estimated_delivery_min = 18 + 20 = 38 min
  - delivery_fee = 7 SAR (5.2 km falls in 3–5 km tier)
  - Display: "~38 min · 5.2 km · 7 SAR delivery"

⚠️ 5.2 km > 5 km (store.delivery_zone) → order REJECTED as OUT_OF_DELIVERY_ZONE
```

### Traffic Models Available

| Model | Behavior | When to Use |
|---|---|---|
| `best_guess` ✅ | Most likely travel time based on historical + live traffic | Default for LEGASHOP — balanced estimate |
| `pessimistic` | Worst-case travel time | Could use for SLA guarantees |
| `optimistic` | Best-case travel time | Not recommended for customer-facing ETA |

We use **`best_guess`** for MVP. Can offer `pessimistic` as a buffer for premium delivery guarantees later.

---

## 5. Delivery Fee Tiers

Replace the current **flat 5 SAR** delivery fee with distance-based tiers:

| Distance (driving) | Delivery Fee | Rationale |
|---|---|---|
| ≤ 3 km | **5 SAR** | Walking distance, minimal fuel |
| 3.1 – 5 km | **7 SAR** | Short drive |
| 5.1 – 8 km | **10 SAR** | Medium distance |
| 8.1 – 12 km | **13 SAR** | Longer delivery |
| > 12 km | **15 SAR** | Maximum fee (if within delivery zone) |

### Backend Implementation

```python
def calculate_delivery_fee(distance_km: float) -> Decimal:
    """Distance-based delivery fee tiers (SAR)."""
    if distance_km <= 3:
        return Decimal('5.00')
    elif distance_km <= 5:
        return Decimal('7.00')
    elif distance_km <= 8:
        return Decimal('10.00')
    elif distance_km <= 12:
        return Decimal('13.00')
    else:
        return Decimal('15.00')
```

### Notes

- Tiers are **platform-wide** for MVP. Per-store fee customization is a post-MVP feature.
- The fee is based on **driving distance** (from Distance Matrix), not straight-line distance.
- If Distance Matrix is unavailable, fall back to Haversine × 1.3 (road correction factor).
- Vendor can set `delivery_zone` (max km). Orders beyond this are rejected, not just charged more.
- Free delivery promotions (e.g., first order, orders > 100 SAR) are applied as discounts on top of the calculated fee.

---

## 6. Backend Implementation

### 6.1 Settings — Add Google Maps Server Key

**File:** `backend/config/settings.py`

```python
# Google Maps (server-side — IP-restricted key)
GOOGLE_MAPS_SERVER_KEY = env('GOOGLE_MAPS_SERVER_KEY', default='')
GOOGLE_MAPS_CACHE_TTL = 300  # 5 minutes
```

### 6.2 Nearby Stores Endpoint (Haversine)

**File:** `backend/stores/views.py` — New `NearbyStoresView`

**Endpoint:** `GET /api/stores/nearby/?lat=<lat>&lng=<lng>&radius_km=<r>`

Uses a **Haversine SQL formula** on the existing `latitude` and `longitude` FloatFields. No PostGIS extension needed.

```python
from django.db.models import F, FloatField, Value
from django.db.models.functions import ACos, Cos, Radians, Sin

class NearbyStoresView(generics.ListAPIView):
    """
    Returns active stores within `radius_km` of the given lat/lng,
    sorted by distance (nearest first).
    
    Query params:
      - lat (required): customer latitude
      - lng (required): customer longitude
      - radius_km (optional, default=5): search radius in km
    """
    serializer_class = NearbyStoreSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        lat = float(self.request.query_params['lat'])
        lng = float(self.request.query_params['lng'])
        radius = float(self.request.query_params.get('radius_km', 5))

        # Haversine formula in SQL
        # distance_km = 6371 * acos(
        #   cos(radians(lat)) * cos(radians(store.lat)) *
        #   cos(radians(store.lng) - radians(lng)) +
        #   sin(radians(lat)) * sin(radians(store.lat))
        # )
        haversine = Value(6371.0) * ACos(
            Cos(Radians(Value(lat))) * Cos(Radians(F('latitude'))) *
            Cos(Radians(F('longitude')) - Radians(Value(lng))) +
            Sin(Radians(Value(lat))) * Sin(Radians(F('latitude'))),
            output_field=FloatField()
        )

        return (
            Store.objects
            .filter(is_active=True)
            .annotate(distance_km=haversine)
            .filter(distance_km__lte=radius)
            .order_by('distance_km')
        )
```

**Serializer addition:** `NearbyStoreSerializer` extends `StoreSerializer` with a read-only `distance_km` field.

### 6.3 Delivery Estimate Endpoint (Distance Matrix Proxy)

**File:** `backend/stores/views.py` — New `DeliveryEstimateView`

**Endpoint:** `GET /api/stores/<store_id>/delivery-estimate/?lat=<lat>&lng=<lng>`

```python
import requests
from django.core.cache import cache

class DeliveryEstimateView(APIView):
    """
    Calculates delivery ETA and fee for a store → customer address pair.
    
    Uses Google Distance Matrix API with live traffic data.
    Results cached for 5 minutes by (store_id, rounded_lat, rounded_lng).
    
    Returns:
      - distance_km: driving distance
      - duration_min: driving time (no traffic)
      - duration_in_traffic_min: driving time (with traffic)
      - prep_time_min: store preparation time
      - estimated_delivery_min: total ETA (traffic + prep)
      - delivery_fee: SAR fee based on distance tier
      - within_delivery_zone: boolean
    """

    def get(self, request, store_id):
        store = get_object_or_404(Store, id=store_id, is_active=True)
        lat = float(request.query_params['lat'])
        lng = float(request.query_params['lng'])

        # Cache key with 3-decimal rounding (~110m precision)
        cache_key = f"delivery_est:{store_id}:{lat:.3f}:{lng:.3f}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        # Call Google Distance Matrix API
        result = self._call_distance_matrix(store, lat, lng)

        # Calculate delivery fee
        result['delivery_fee'] = str(calculate_delivery_fee(result['distance_km']))
        result['prep_time_min'] = store.avg_delivery_min
        result['estimated_delivery_min'] = (
            result['duration_in_traffic_min'] + store.avg_delivery_min
        )
        result['within_delivery_zone'] = (
            result['distance_km'] <= store.delivery_zone
        )

        cache.set(cache_key, result, timeout=settings.GOOGLE_MAPS_CACHE_TTL)
        return Response(result)

    def _call_distance_matrix(self, store, dest_lat, dest_lng):
        resp = requests.get(
            'https://maps.googleapis.com/maps/api/distancematrix/json',
            params={
                'origins': f'{store.latitude},{store.longitude}',
                'destinations': f'{dest_lat},{dest_lng}',
                'mode': 'driving',
                'departure_time': 'now',
                'traffic_model': 'best_guess',
                'units': 'metric',
                'key': settings.GOOGLE_MAPS_SERVER_KEY,
            },
            timeout=5,
        )
        data = resp.json()
        element = data['rows'][0]['elements'][0]

        if element['status'] != 'OK':
            # Fallback to Haversine estimate
            return self._haversine_fallback(store, dest_lat, dest_lng)

        return {
            'distance_km': round(element['distance']['value'] / 1000, 1),
            'duration_min': round(element['duration']['value'] / 60),
            'duration_in_traffic_min': round(
                element.get('duration_in_traffic', element['duration'])['value'] / 60
            ),
        }

    def _haversine_fallback(self, store, dest_lat, dest_lng):
        """Straight-line distance × 1.3 road correction factor."""
        from math import radians, sin, cos, asin, sqrt
        R = 6371
        dlat = radians(dest_lat - store.latitude)
        dlng = radians(dest_lng - store.longitude)
        a = sin(dlat/2)**2 + cos(radians(store.latitude)) * \
            cos(radians(dest_lat)) * sin(dlng/2)**2
        km = 2 * R * asin(sqrt(a))
        road_km = round(km * 1.3, 1)  # road correction
        est_min = round(road_km / 30 * 60)  # assume 30 km/h avg
        return {
            'distance_km': road_km,
            'duration_min': est_min,
            'duration_in_traffic_min': est_min,
            'is_estimate': True,  # flag that this is approximate
        }
```

### 6.4 Order Model — Add ETA Fields

**File:** `backend/orders/models.py`

```python
# New fields on Order model:
estimated_delivery_min = models.IntegerField(null=True, blank=True,
    help_text="Estimated delivery time in minutes (traffic + prep), set at order creation")
distance_km = models.FloatField(null=True, blank=True,
    help_text="Driving distance from store to customer in km, set at order creation")
```

Migration required.

### 6.5 Order Creation — Dynamic Fee + Zone Validation

**File:** `backend/orders/views.py` — Modify `OrderCreateView.create()`

```python
def create(self, request, *args, **kwargs):
    # ... existing validation ...

    # Get delivery estimate from Google Distance Matrix
    estimate = get_delivery_estimate(store, address.latitude, address.longitude)

    # Validate delivery zone
    if not estimate['within_delivery_zone']:
        return Response(
            {
                'error': 'OUT_OF_DELIVERY_ZONE',
                'detail': f'Address is {estimate["distance_km"]} km away. '
                          f'Store delivers within {store.delivery_zone} km.',
                'distance_km': estimate['distance_km'],
                'max_distance_km': store.delivery_zone,
            },
            status=400,
        )

    # Calculate delivery fee from distance
    delivery_fee = calculate_delivery_fee(estimate['distance_km'])

    # Create order with ETA data
    order = Order.objects.create(
        # ... existing fields ...
        delivery_fee=delivery_fee,
        estimated_delivery_min=estimate['estimated_delivery_min'],
        distance_km=estimate['distance_km'],
    )
```

### 6.6 Reverse Geocoding Proxy

**File:** `backend/stores/views.py` — New `ReverseGeocodeView`

**Endpoint:** `GET /api/geo/reverse/?lat=<lat>&lng=<lng>`

```python
class ReverseGeocodeView(APIView):
    """
    Reverse-geocode a lat/lng to a human-readable address.
    Used by the frontend AddressPickerMap when user drags the pin.
    Results cached 24h by rounded coordinates.
    """
    def get(self, request):
        lat = float(request.query_params['lat'])
        lng = float(request.query_params['lng'])

        cache_key = f"geocode:{lat:.3f}:{lng:.3f}"
        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        resp = requests.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            params={
                'latlng': f'{lat},{lng}',
                'language': 'en',
                'key': settings.GOOGLE_MAPS_SERVER_KEY,
            },
            timeout=5,
        )
        data = resp.json()

        if data['status'] != 'OK' or not data['results']:
            return Response({'error': 'GEOCODING_FAILED'}, status=400)

        result = data['results'][0]
        components = {c['types'][0]: c['long_name']
                      for c in result['address_components']
                      if c['types']}

        parsed = {
            'formatted_address': result['formatted_address'],
            'street': components.get('route', ''),
            'district': components.get('sublocality', components.get('locality', '')),
            'city': components.get('administrative_area_level_1', ''),
            'country': components.get('country', ''),
            'postal_code': components.get('postal_code', ''),
            'place_id': result['place_id'],
        }

        cache.set(cache_key, parsed, timeout=86400)  # 24h
        return Response(parsed)
```

### 6.7 New URL Routes

**File:** `backend/stores/urls.py`

```python
urlpatterns += [
    path('stores/nearby/', NearbyStoresView.as_view()),
    path('stores/<int:store_id>/delivery-estimate/', DeliveryEstimateView.as_view()),
    path('geo/reverse/', ReverseGeocodeView.as_view()),
]
```

---

## 7. Frontend Implementation

### 7.1 Install Dependencies

```bash
bun add @vis.gl/react-google-maps
```

Add to `frontend/.env`:

```
VITE_GOOGLE_MAPS_KEY=AIza...your-browser-restricted-key
```

### 7.2 MapsProvider Component (New)

**File:** `frontend/src/components/maps/MapsProvider.tsx`

```tsx
import { APIProvider } from '@vis.gl/react-google-maps';

export function MapsProvider({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
      libraries={['places', 'geometry']}
      region="SA"
      language="en"  // switch dynamically when i18n is implemented
    >
      {children}
    </APIProvider>
  );
}
```

Wrap the app in `App.tsx`:

```tsx
<MapsProvider>
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
</MapsProvider>
```

### 7.3 useGeolocation Hook (New)

**File:** `frontend/src/hooks/use-geolocation.ts`

```tsx
import { useState, useEffect, useCallback } from 'react';

const RIYADH_CENTER = { latitude: 24.7136, longitude: 46.6753 };

interface GeolocationState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
  isDefault: boolean;           // true if using Riyadh fallback
  requestPermission: () => void;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    ...RIYADH_CENTER,
    loading: true,
    error: null,
    isDefault: true,
    requestPermission: () => {},
  });

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
      return;
    }
    setState(prev => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setState(prev => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        loading: false,
        error: null,
        isDefault: false,
      })),
      (err) => setState(prev => ({
        ...prev,
        loading: false,
        error: err.message,
        isDefault: true,
      })),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => { requestPermission(); }, [requestPermission]);

  return { ...state, requestPermission };
}
```

### 7.4 API Hooks (New)

**File:** `frontend/src/hooks/use-api.ts` — Add these hooks:

```tsx
// Nearby stores sorted by distance
export function useNearbyStores(lat: number, lng: number, radiusKm = 5) {
  return useQuery({
    queryKey: ['stores', 'nearby', lat, lng, radiusKm],
    queryFn: () => fetchNearbyStores(lat, lng, radiusKm),
    enabled: lat !== 0 && lng !== 0,
    staleTime: 60_000,  // 1 min
  });
}

// Delivery estimate (distance, ETA with traffic, fee)
export function useDeliveryEstimate(storeId: number, lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ['delivery-estimate', storeId, lat, lng],
    queryFn: () => fetchDeliveryEstimate(storeId, lat!, lng!),
    enabled: !!storeId && lat != null && lng != null,
    staleTime: 300_000,  // 5 min (matches backend cache)
  });
}
```

**File:** `frontend/src/lib/api.ts` — Add these functions:

```tsx
export async function fetchNearbyStores(lat: number, lng: number, radiusKm: number) {
  const res = await api.get(`/stores/nearby/?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`);
  return res.data;
}

export async function fetchDeliveryEstimate(storeId: number, lat: number, lng: number) {
  const res = await api.get(`/stores/${storeId}/delivery-estimate/?lat=${lat}&lng=${lng}`);
  return res.data;
}

export async function reverseGeocode(lat: number, lng: number) {
  const res = await api.get(`/geo/reverse/?lat=${lat}&lng=${lng}`);
  return res.data;
}

export interface DeliveryEstimate {
  distance_km: number;
  duration_min: number;
  duration_in_traffic_min: number;
  prep_time_min: number;
  estimated_delivery_min: number;
  delivery_fee: string;
  within_delivery_zone: boolean;
  is_estimate?: boolean;  // true if Google API was unavailable (Haversine fallback)
}
```

### 7.5 StoreMap Component (New)

**File:** `frontend/src/components/maps/StoreMap.tsx`

An interactive Google Map that displays store markers. Clicking a marker opens an info window with store name, district, distance, estimated delivery time, and rating.

**Props:**

```tsx
interface StoreMapProps {
  stores: StoreWithDistance[];         // stores with distance_km
  userLocation?: { lat: number; lng: number };
  selectedStoreId?: number;
  onStoreSelect?: (storeId: number) => void;
  height?: string;                    // default "400px"
  showDeliveryZones?: boolean;        // show radius circles per store
}
```

**Features:**

- Centered on user location (or Riyadh default)
- Custom baqala marker icons
- Info window on click: name, district, distance, ETA, rating, "Browse Store" link
- Optional delivery zone circles (radius = `store.delivery_zone` km)
- Responsive height

### 7.6 AddressPickerMap Component (New)

**File:** `frontend/src/components/maps/AddressPickerMap.tsx`

A map with a draggable pin for setting delivery address coordinates, plus a Places Autocomplete search box.

**Props:**

```tsx
interface AddressPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    formatted_address: string;
    street: string;
    district: string;
    city: string;
  }) => void;
}
```

**Features:**

- Draggable marker pin — on drag end, reverse-geocodes via our backend proxy (`GET /api/geo/reverse/`)
- Places Autocomplete search box (restricted to `country: 'sa'`)
- Fills address form fields from geocoding response
- Shows "Use my current location" button (triggers `navigator.geolocation`)

---

## 8. Page-by-Page Integration

### 8.1 StoresPage — Map View + Nearby Sorting

**File:** `frontend/src/pages/StoresPage.tsx`

**Changes:**

- Add a **list/map toggle** button (default: list view, current behavior preserved)
- Map view shows `StoreMap` component with all stores as markers
- Use `useGeolocation()` to get user position
- Use `useNearbyStores(lat, lng)` instead of `useStores()` when location is available — stores sorted by distance
- Each store card shows: **distance** (e.g., "3.2 km") and **estimated delivery time** (e.g., "~35 min")
- "Allow location" prompt if geolocation is denied

```
┌─────────────────────────────────────────────┐
│  🏪 Stores Near You          [List] [Map]   │
│  📍 Al Batha, Riyadh · 12 stores nearby     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Abu      │  │ Al Noor │  │ Pinoy   │     │
│  │ Khalid   │  │ Mini    │  │ Corner  │     │
│  │ 0.3 km   │  │ 0.5 km  │  │ 1.2 km  │     │
│  │ ~15 min  │  │ ~20 min │  │ ~30 min │     │
│  │ ⭐ 4.8   │  │ ⭐ 4.6  │  │ ⭐ 4.9  │     │
│  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────┘
```

### 8.2 StorePage — Mini Map + Delivery Zone

**File:** `frontend/src/pages/StorePage.tsx`

**Changes:**

- Add a small (200 px) map showing the store's location pin
- Draw a circle around the store showing the `delivery_zone` radius
- Show "Delivers within X km" label

### 8.3 NearbyStoresSection (Homepage) — Real Data + Map

**File:** `frontend/src/components/NearbyStoresSection.tsx`

**Changes:**

- Replace hardcoded mock data with `useNearbyStores()` + `useGeolocation()`
- Show top 4 nearest stores with real distance + ETA
- Add a small map strip above the cards (optional, ~200 px) showing store pins
- "View all stores" links to `/stores`
- Graceful fallback if location denied: show featured stores without distance

### 8.4 CheckoutPage — Delivery Estimate Display

**File:** `frontend/src/pages/CheckoutPage.tsx`

**Changes:**

- After user selects a delivery address, call `useDeliveryEstimate(storeId, lat, lng)`
- Display in the order summary section:

```
┌─────────────────────────────────────┐
│  📦 Order Summary                   │
│                                     │
│  Subtotal              45.00 SAR    │
│  Delivery (3.2 km)      7.00 SAR    │
│  ─────────────────────────────────  │
│  Total                 52.00 SAR    │
│                                     │
│  🕐 Estimated delivery: ~38 min    │
│     (18 min drive + 20 min prep)    │
│                                     │
│  ⚠️  Traffic is moderate right now  │
└─────────────────────────────────────┘
```

- If address is outside delivery zone, show warning:

```
┌─────────────────────────────────────┐
│  ⚠️  Out of Delivery Zone           │
│  Your address is 7.3 km away.       │
│  This store delivers within 5 km.   │
│  [Change Address] [Browse Other     │
│                    Stores]           │
└─────────────────────────────────────┘
```

- Replace hardcoded 5 SAR delivery fee with dynamic fee from estimate

### 8.5 use-cart.tsx — Dynamic Delivery Fee

**File:** `frontend/src/hooks/use-cart.tsx`

**Changes:**

- Add `setDeliveryFee(fee: number)` to the cart context
- Default stays 5 SAR until a delivery estimate is loaded
- `CheckoutPage` calls `setDeliveryFee()` when `useDeliveryEstimate` returns
- Fee resets to default 5 SAR when cart is cleared

### 8.6 AddressFormDialog — Map Pin Picker

**File:** Address creation/editing dialog (wherever `AddressFormDialog` is defined)

**Changes:**

- Embed `AddressPickerMap` component
- When user drags pin or searches via autocomplete, auto-fill: street, district, city, lat, lng
- "Use my current location" button

---

## 9. Files Affected

### Backend — Modify

| File | Changes |
|---|---|
| `backend/config/settings.py` | Add `GOOGLE_MAPS_SERVER_KEY`, `GOOGLE_MAPS_CACHE_TTL` |
| `backend/stores/views.py` | Add `NearbyStoresView`, `DeliveryEstimateView`, `ReverseGeocodeView` |
| `backend/stores/urls.py` | Register 3 new endpoints |
| `backend/stores/serializers.py` | Add `NearbyStoreSerializer` with `distance_km` |
| `backend/orders/models.py` | Add `estimated_delivery_min`, `distance_km` fields |
| `backend/orders/views.py` | Dynamic delivery fee, zone validation, store ETA on order |
| `backend/orders/serializers.py` | Expose `estimated_delivery_min`, `distance_km` |

### Backend — New

| File | Purpose |
|---|---|
| `backend/orders/migrations/XXXX_add_eta_fields.py` | Auto-generated migration for new Order fields |
| `backend/stores/utils.py` | `calculate_delivery_fee()`, `get_delivery_estimate()` helpers |

### Frontend — New

| File | Purpose |
|---|---|
| `frontend/src/components/maps/MapsProvider.tsx` | Google Maps API provider wrapper |
| `frontend/src/components/maps/StoreMap.tsx` | Interactive map with store markers + info windows |
| `frontend/src/components/maps/AddressPickerMap.tsx` | Draggable pin + Places Autocomplete for address |
| `frontend/src/hooks/use-geolocation.ts` | Browser geolocation wrapper with fallback |

### Frontend — Modify

| File | Changes |
|---|---|
| `frontend/src/App.tsx` | Wrap with `MapsProvider` |
| `frontend/src/lib/api.ts` | Add `fetchNearbyStores`, `fetchDeliveryEstimate`, `reverseGeocode`, `DeliveryEstimate` type |
| `frontend/src/hooks/use-api.ts` | Add `useNearbyStores`, `useDeliveryEstimate` hooks |
| `frontend/src/hooks/use-cart.tsx` | Add `setDeliveryFee` to cart context |
| `frontend/src/pages/StoresPage.tsx` | Map toggle, nearby stores, distance + ETA display |
| `frontend/src/pages/StorePage.tsx` | Mini-map with delivery zone circle |
| `frontend/src/pages/CheckoutPage.tsx` | Delivery estimate display, dynamic fee, zone validation |
| `frontend/src/components/NearbyStoresSection.tsx` | Replace mock data with real API + map |

---

## 10. Cost Estimate

### Per-API Pricing (Google Maps Platform, as of 2026)

| API | Free Tier | After Free Tier | Our Volume (month 6) | Est. Monthly Cost |
|---|---|---|---|---|
| Maps JavaScript API | $200/mo credit | $7 / 1,000 loads | ~30,000 loads | ~$10 |
| Distance Matrix API | $200/mo credit shared | $5 / 1,000 elements | ~10,000 elements | ~$50 |
| Geocoding API | (shared credit) | $5 / 1,000 requests | ~5,000 requests | ~$25 |
| Places Autocomplete | (shared credit) | $2.83 / 1,000 sessions | ~3,000 sessions | ~$8.50 |
| **Total** | **$200 credit applied** | | | **~$93.50** → **~$0** after credit |

Google gives a **$200/month free credit** that covers all Maps APIs. At MVP volume, we stay well within the free tier.

### Cost Controls

1. **Cache Distance Matrix results** (5-min TTL) — same store→address pair won't be re-queried.
2. **Cache Geocoding results** (24-hour TTL) — same coordinates won't be re-geocoded.
3. **Server-side proxy** — all paid API calls go through backend, never directly from browser (except Maps JS loads).
4. **Daily budget cap** ($25/day) in Google Cloud Console.
5. **Billing alerts** at 50%, 80%, 100% of monthly budget.

---

## 11. Verification & Testing

### Backend Tests

| # | Test | Expected Result |
|---|---|---|
| 1 | Haversine with known coords: Al Batha (24.633, 46.720) → Al Olaya (24.690, 46.685) | ~7 km (± 0.5) |
| 2 | `GET /api/stores/nearby/?lat=24.63&lng=46.72&radius_km=5` | Returns stores within 5 km, sorted by `distance_km` asc |
| 3 | `GET /api/stores/nearby/?lat=24.63&lng=46.72&radius_km=0.1` | Returns empty list (no stores within 100 m) |
| 4 | `GET /api/stores/<id>/delivery-estimate/?lat=24.71&lng=46.67` | Returns `distance_km`, `duration_in_traffic_min`, `estimated_delivery_min`, `delivery_fee`, `within_delivery_zone` |
| 5 | Delivery estimate — same params twice within 5 min | Second call hits cache (verify with Django cache stats) |
| 6 | Order creation with address **within** delivery zone | Order created with `estimated_delivery_min`, `distance_km`, dynamic `delivery_fee` |
| 7 | Order creation with address **outside** delivery zone | `400 OUT_OF_DELIVERY_ZONE` with distance info |
| 8 | Delivery fee: 2 km → 5 SAR, 4 km → 7 SAR, 6 km → 10 SAR, 10 km → 13 SAR, 14 km → 15 SAR | Correct tier applied |
| 9 | Google API unavailable (mock timeout) | Haversine fallback used, `is_estimate: true` in response |
| 10 | Reverse geocode `GET /api/geo/reverse/?lat=24.7&lng=46.7` | Returns parsed address components |

### Frontend Tests (Manual)

| # | Test | Expected Result |
|---|---|---|
| 1 | Open StoresPage → "Allow location" prompt → accept | Map centers on user location; stores sorted by distance |
| 2 | StoresPage → deny location | Falls back to Riyadh center; stores shown without distance |
| 3 | StoresPage → toggle to map view | Google Map renders with store markers |
| 4 | Click store marker on map | Info window shows: name, district, distance, ETA, rating |
| 5 | Homepage NearbyStoresSection | Shows top 4 nearest stores with real distance + ETA |
| 6 | StorePage → mini-map | Shows store pin + delivery zone circle |
| 7 | CheckoutPage → select address | Delivery estimate appears: distance, ETA, dynamic fee |
| 8 | CheckoutPage → address outside zone | "Out of delivery zone" warning with options |
| 9 | AddressPickerMap → drag pin | Address fields auto-fill from reverse geocoding |
| 10 | AddressPickerMap → search "Al Olaya" | Autocomplete suggestions; selecting one moves pin + fills fields |

---

## 12. Decisions & Trade-offs

| Decision | Rationale |
|---|---|
| **No PostGIS** | Haversine on existing `latitude`/`longitude` FloatFields is sufficient for < 1 K stores. PostGIS adds deployment complexity (extension install, geo-Django config). Revisit if store count exceeds 5 K or we need polygon-based delivery zones. |
| **No real-time GPS** | ETA is calculated once at order creation. Live tracking requires: WebSocket infra, rider app, GPS streaming — out of scope for this feature. The ETA at order time is accurate enough for 15-min to same-day delivery. |
| **No Directions API** | We only need distance + duration (Distance Matrix), not turn-by-turn routes or polyline rendering. Directions API costs more and adds no value for our use case. |
| **Two API keys** | Browser key is visible in JS source — must be referrer-restricted. Server key stays hidden — must be IP-restricted. Never use one key for both. |
| **Server-side Distance Matrix** | All distance/geocoding calls go through Django proxy. Prevents client-side API key abuse and enables caching. |
| **5-min cache for Distance Matrix** | Traffic changes, but not second-by-second. 5-min TTL balances accuracy vs. cost. A store→address pair queried once won't be re-queried for 5 min. |
| **24-hour cache for Geocoding** | Addresses don't change. Same coordinates always resolve to the same address. |
| **Haversine × 1.3 fallback** | If Google API is down, we estimate using straight-line distance × 1.3 (typical road correction factor in urban areas). Marked with `is_estimate: true` so the UI can show a disclaimer. |
| **Platform-wide fee tiers** | Per-store delivery fee customization adds complexity. MVP uses platform-wide tiers. Stores can only control `delivery_zone` (max distance). Per-store fees are a post-MVP feature. |
| **`departure_time=now`** | This parameter activates traffic-aware duration in Distance Matrix. Without it, Google only returns base duration (no traffic). Using `now` gives real-time traffic conditions. |

---

## 13. Fallbacks & Edge Cases

| Scenario | Handling |
|---|---|
| **Google Maps API unavailable / timeout** | Backend falls back to Haversine × 1.3 estimate. Response includes `is_estimate: true`. Frontend shows: "Estimated delivery: ~40 min (approximate)" |
| **User denies geolocation** | Frontend falls back to Riyadh center (24.7136, 46.6753). Stores shown without distance sorting. Prompt: "Allow location access for better results" |
| **Browser doesn't support geolocation** | Same as denied — use Riyadh fallback |
| **Address has no lat/lng** | CheckoutPage disables the "Place Order" button and shows: "Please select an address with a map location" |
| **Store has no lat/lng** | Shouldn't happen (required fields), but if so, store is excluded from nearby results and delivery estimate returns error |
| **Distance Matrix returns `ZERO_RESULTS`** | No driving route exists (e.g., island). Fall back to Haversine estimate with `is_estimate: true` |
| **Customer exactly at store location** | distance = 0 km, fee = 5 SAR (minimum), ETA = prep time only |
| **Multiple stores in cart** (multi-store order) | Currently not supported (CheckoutPage warns). When supported, each store gets its own delivery estimate and fee |
| **API key quota exceeded** | Google returns 403. Backend catches this and uses Haversine fallback. Alert fires via Sentry + daily budget monitoring |
| **Arabic locale** | Maps JS supports `language: 'ar'` — map labels render in Arabic. Connect to i18n locale when implemented |

---

## 14. Implementation Order

### Phase 1 — Backend Foundation (can be done first, independently)

```
Step 1: settings.py — add GOOGLE_MAPS_SERVER_KEY
Step 2: stores/utils.py — calculate_delivery_fee(), haversine helpers
Step 3: stores/views.py — NearbyStoresView (Haversine, no Google API needed)
Step 4: stores/serializers.py — NearbyStoreSerializer
Step 5: stores/urls.py — register /stores/nearby/
Step 6: Test nearby endpoint with existing seed data
```

### Phase 2 — Backend Google Integration

```
Step 7:  stores/views.py — DeliveryEstimateView (calls Distance Matrix)
Step 8:  stores/views.py — ReverseGeocodeView (calls Geocoding API)
Step 9:  stores/urls.py — register both endpoints
Step 10: orders/models.py — add estimated_delivery_min, distance_km + migration
Step 11: orders/views.py — dynamic delivery fee, zone validation, store ETA
Step 12: orders/serializers.py — expose new fields
Step 13: Test with real Google API key
```

### Phase 3 — Frontend Maps Setup

```
Step 14: Install @vis.gl/react-google-maps + .env key
Step 15: Create MapsProvider.tsx + wrap in App.tsx
Step 16: Create use-geolocation.ts hook
Step 17: Add API functions + hooks (useNearbyStores, useDeliveryEstimate)
```

### Phase 4 — Frontend Components

```
Step 18: Create StoreMap.tsx component
Step 19: Create AddressPickerMap.tsx component
Step 20: Test both components in isolation
```

### Phase 5 — Page Integration

```
Step 21: StoresPage — map toggle + nearby sorting + distance/ETA display
Step 22: NearbyStoresSection — replace mock data + add map
Step 23: StorePage — mini-map + delivery zone circle
Step 24: CheckoutPage — delivery estimate + dynamic fee + zone validation
Step 25: use-cart.tsx — dynamic delivery fee
Step 26: AddressFormDialog — embed AddressPickerMap
```

### Phase 6 — Polish & Test

```
Step 27: Backend unit tests (Haversine, fee tiers, zone validation)
Step 28: Frontend manual testing (all scenarios from §11)
Step 29: Cost monitoring dashboard (Google Cloud Console)
Step 30: Update business plan §19 status
```

---

*End of document — Google Maps Implementation Plan v1.*
