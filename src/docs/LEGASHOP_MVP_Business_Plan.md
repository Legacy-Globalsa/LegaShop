
# 🇵🇭 LEGASHOP — MVP Business Plan
### *Affordable Filipino Grocery E-Commerce for OFWs & Residents in Riyadh, Saudi Arabia*

**Version:** 1.0 — MVP  
**Date:** March 7, 2026  
**Prepared by:** LEGASHOP Founding Team  
**Confidentiality:** Internal / Investor-Ready

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Market Research & Analysis](#2-market-research--analysis)
3. [Problem Statement](#3-problem-statement)
4. [Solution Overview](#4-solution-overview)
5. [Target Users & Personas](#5-target-users--personas)
6. [MVP Feature Scope](#6-mvp-feature-scope)
7. [System Architecture](#7-system-architecture)
8. [UI/UX Design & Brand Identity](#8-uiux-design--brand-identity)
9. [Technology Stack](#9-technology-stack)
10. [Database Schema](#10-database-schema)
11. [API Architecture](#11-api-architecture)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)
13. [Payment & Compliance](#13-payment--compliance)
14. [Operations & Fulfillment Model](#14-operations--fulfillment-model)
15. [Go-to-Market Strategy](#15-go-to-market-strategy)
16. [Revenue Model](#16-revenue-model)
17. [KPIs & Success Metrics](#17-kpis--success-metrics)
18. [Roadmap & Phasing](#18-roadmap--phasing)
19. [Risk Analysis & Mitigation](#19-risk-analysis--mitigation)
20. [Budget Estimate](#20-budget-estimate)
21. [Appendix](#21-appendix)

---

## 1. Executive Summary

**LEGASHOP** (from Filipino *"lega"* — affordable/bargain) is a grocery e-commerce platform purpose-built for the **2.3 million+ Overseas Filipino Workers (OFWs)** and diverse residents in Riyadh, Saudi Arabia. It combines two powerful value propositions:

- **Riyadh Local Marketplace:** Ultra-fast fulfillment (15 minutes to same-day) from partnered neighborhood **baqala** stores — Saudi Arabia's equivalent of Filipino sari-sari stores — offering daily essentials at **1 Riyal (~₱15)** and **5 Riyal (~₱75)** price points.
- **OFW Remittance Grocery:** Filipino workers in Riyadh (or anywhere abroad) can order grocery packages delivered to their families in the Philippines through a **Puregold** store partnership, merging remittance and grocery shopping into a single workflow.

The MVP launches **web-first in Riyadh** with 10-20 baqala partners, targeting 500 orders/month within 3 months and 80%+ same-day fulfillment rate.

**The platform's visual identity draws from the Philippine flag** — using sophisticated, modern pastel interpretations of blue, red, yellow, and white — creating an instantly recognizable brand for the Filipino diaspora while maintaining a premium, contemporary aesthetic.

---

## 2. Market Research & Analysis

### 2.1 Saudi Arabia E-Commerce Landscape

| Metric | Value | Source |
|--------|-------|--------|
| Saudi e-commerce market size (2025) | $12.4B USD | Statista |
| Projected CAGR (2025-2030) | 11.2% | Euromonitor |
| Online grocery penetration (KSA) | ~4.5%, rapidly growing | Gulf Business |
| Smartphone penetration (KSA) | 98%+ | MCIT Saudi |
| Internet penetration (KSA) | 99% | MCIT Saudi |
| Digital payment adoption | 70%+ (Vision 2030 cashless push) | SAMA |

### 2.2 OFW Population in Saudi Arabia

| Metric | Value |
|--------|-------|
| Total Filipino population in KSA | ~2.3 million |
| Concentrated in Riyadh | ~800,000-1,000,000 |
| Average monthly remittance per OFW | ₱15,000-25,000 (~$270-450 USD) |
| Total PH remittances from KSA (annual) | ~$2.5B USD |
| OFWs using digital remittance channels | ~65% and growing |
| Grocery share of remittance spending | ~30-40% of received funds |

### 2.3 Competitive Landscape

| Competitor | Category | Strengths | LEGASHOP Differentiator |
|-----------|----------|-----------|------------------------|
| **Nana Direct** | KSA grocery delivery | Established, wide coverage | No OFW/Filipino focus, higher prices |
| **HungerStation** | Food/grocery delivery | Saudi market leader | General platform, not essentials-focused |
| **Jahez** | Food delivery | Fast delivery network | No grocery/remittance integration |
| **Carrefour (MAF)** | Hypermarket online | Brand trust, large catalog | Minimum orders high, no baqala speed |
| **Puregold Online** | PH grocery | Filipino trust, nationwide PH | No KSA-side marketplace |
| **LBC/Cebuana Padala** | Remittance to grocery | Existing OFW trust | No real-time marketplace, limited selection |

### 2.4 Baqala Store Ecosystem in Riyadh

Saudi baqalas are small neighborhood convenience stores (similar to Filipino sari-sari stores) numbering **50,000+ across KSA** with approximately **12,000-15,000 in Riyadh alone**. Key characteristics:

- **Hyperlocal:** Average 200-500m from residential clusters
- **Product Range:** 200-500 SKUs — snacks, beverages, toiletries, bread, instant noodles, canned goods
- **Operating Hours:** Often 16-20 hours/day
- **Current Tech Adoption:** Very low — manual inventory, cash-dominant
- **Pain Points:** Limited customer reach, no online presence, competition from delivery apps
- **Filipino Product Availability:** Many Riyadh baqalas already stock Lucky Me, Century Tuna, CDO, and other PH brands due to OFW demand

---

## 3. Problem Statement

### For OFWs in Riyadh:
1. **Scattered access to affordable essentials** — No dedicated platform aggregates baqala-level prices with delivery convenience
2. **Remittance-to-grocery friction** — Sending money home and ensuring it's spent on groceries requires multiple steps across different platforms
3. **Cultural disconnect** — Major Saudi delivery platforms don't cater to Filipino product preferences or language

### For Baqala Store Owners:
1. **Zero online presence** — Missing the e-commerce wave entirely
2. **Declining foot traffic** — Losing customers to larger delivery platforms
3. **No inventory management tools** — Operating on pen-and-paper or basic POS

### For OFW Families in the Philippines:
1. **Uncertainty about remittance usage** — Senders can't ensure money goes to groceries
2. **Limited choice** — Existing remittance-to-grocery services offer preset packages, not custom selection

---

## 4. Solution Overview

LEGASHOP solves these problems with a **dual-marketplace** model:

```
┌─────────────────────────────────────────────────────────────────┐
│                        LEGASHOP PLATFORM                        │
│                                                                 │
│  ┌──────────────────────┐     ┌──────────────────��───────────┐ │
│  │  RIYADH MARKETPLACE  │     │   OFW REMITTANCE GROCERY     │ │
│  │                      │     │                              │ │
│  │  • Browse baqalas    │     │  • Select Puregold items     │ │
│  │  • 1/5 Riyal deals   │     │  • Pay in SAR               │ │
│  │  • Quick delivery    │     │  • Family picks up in PH     │ │
│  │  • Filipino products │     │  • Real-time tracking        │ │
│  └──────────────────────┘     └──────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              VENDOR / BAQALA DASHBOARD                    │  │
│  │  • List products  • Manage inventory  • Track orders     │  │
│  │  • View analytics • Manage delivery zones                │  │
│  └─────────────────────────────────────────────────���────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Target Users & Personas

### Persona 1: **Maria — OFW Domestic Worker in Riyadh**
- **Age:** 32 | **Income:** SAR 2,000-3,000/month
- **Behavior:** Buys essentials from nearby baqala on rest day, sends ₱10,000/month home
- **Pain:** Limited time to shop, wants to order Filipino products easily, ensure family gets groceries
- **LEGASHOP Use:** Orders weekly essentials from nearest baqala via phone; monthly sends grocery package to family in Bulacan via Puregold

### Persona 2: **Ahmed — Baqala Owner, Al Batha District**
- **Age:** 45 | **Store Size:** ~30sqm, 400 SKUs
- **Behavior:** Serves 200+ walk-in customers/day, many Filipino
- **Pain:** Losing customers to Nana/HungerStation, no way to reach customers online
- **LEGASHOP Use:** Lists top 100 products on LEGASHOP, receives 15-20 online orders/day, uses vendor dashboard for inventory

### Persona 3: **Jun — OFW Construction Worker, Sends Money Home**
- **Age:** 38 | **Income:** SAR 3,500/month
- **Behavior:** Sends ₱20,000/month to wife in Pangasinan via GCash
- **Pain:** Worries money won't be used for family essentials; wife spends 2 hours going to Puregold
- **LEGASHOP Use:** Browses Puregold catalog on LEGASHOP, selects rice/canned goods/school supplies, pays in SAR, wife picks up at Puregold Dagupan

### Persona 4: **Elena — OFW Wife in Philippines**
- **Age:** 35 | **Location:** Dagupan, Pangasinan
- **Behavior:** Receives remittance monthly, does weekly grocery at Puregold
- **Pain:** Receives cash and has to manage budget alone; husband wants more control over grocery spending
- **LEGASHOP Use:** Receives SMS notification, picks up pre-packed groceries at Puregold, or opts for home delivery

---

## 6. MVP Feature Scope

### 6.1 In-Scope (MVP Launch)

| Module | Features | Priority |
|--------|----------|----------|
| **User Auth** | Email/phone registration, OTP verification, profile (OFW/Resident/Vendor), JWT sessions | P0 |
| **Product Browsing** | Category navigation, search with Filipino/Arabic terms, product detail pages, 1/5 Riyal deal tags | P0 |
| **Baqala Discovery** | Map-based nearby store finder (Riyadh), store profiles with ratings, distance/delivery time estimate | P0 |
| **Shopping Cart** | Multi-store cart with split-order logic, delivery fee calculator, promo code support | P0 |
| **Checkout & Payment** | SAR payment via Stripe/PayTabs, order summary, delivery address with Riyadh zone validation | P0 |
| **Order Tracking** | Real-time status updates (Placed → Preparing → Out for Delivery → Delivered), SMS notifications | P0 |
| **Vendor Dashboard** | Product listing CRUD, inventory management, order acceptance/rejection, basic sales analytics | P0 |
| **Admin Panel** | User management, store approval, product moderation, order oversight, platform analytics | P0 |
| **PH Remittance Grocery** | Puregold catalog browsing, SAR-to-PHP conversion display, order placement for PH delivery, recipient notification | P1 |
| **Reviews & Ratings** | Post-delivery store/product ratings, text reviews | P1 |
| **Multi-language** | English (default), Filipino (Tagalog), Arabic (basic) | P1 |

### 6.2 Out-of-Scope (Post-MVP)

| Feature | Phase |
|---------|-------|
| Native mobile apps (iOS/Android) | Phase 2 |
| Nationwide KSA expansion | Phase 2 |
| AI-driven dynamic pricing engine | Phase 2 |
| AI personalized recommendations | Phase 2 |
| Subscription boxes (weekly essentials) | Phase 2 |
| In-app chat (buyer ↔ vendor) | Phase 2 |
| Loyalty/rewards program | Phase 3 |
| Puregold API deep integration | Phase 3 |
| Multi-country remittance (beyond PH) | Phase 3 |

---

## 7. System Architecture

### 7.1 High-Level Architecture Diagram

```
                            ┌─────────────────────────────┐
                            │        CLOUDFLARE CDN        │
                            │    (SSL, DDoS, Edge Cache)   │
                            └──────────────┬──────────────┘
                                           │
                            ┌──────────────▼──────────────┐
                            │     LOAD BALANCER (ALB)      │
                            │   AWS Application LB         │
                            │   Region: me-south-1         │
                            │   (Bahrain — nearest to      │
                            │    Riyadh, ~350km)           │
                            └──────────┬───────────────────┘
                                       │
                    ┌──────────────────┼──────────────────────┐
                    │                  │                      │
         ┌──────────▼──────┐  ┌───────▼────────┐  ┌─────────▼────────┐
         │  FRONTEND (SSR) │  │  API GATEWAY   │  │  ADMIN FRONTEND  │
         │  Next.js 14     │  │  Express.js    │  │  Next.js 14      │
         │  (Vercel or     │  │  Rate Limiting │  │  (Internal)      │
         │   ECS Fargate)  │  │  Auth Middleware│  │                  │
         └────────┬────────┘  └───────┬────────┘  └──────────────────┘
                  │                   │
                  │          ┌────────▼──────────────────────────────┐
                  │          │         MICROSERVICES LAYER           │
                  │          │  (ECS Fargate / Docker Containers)    │
                  │          │                                       │
                  │          │  ┌─────────┐  ┌──────────┐  ┌──────┐│
                  │          │  │  AUTH    │  │ PRODUCT  │  │ ORDER││
                  │          │  │ SERVICE  │  │ SERVICE  │  │ SVC  ││
                  │          │  └─────────┘  └──────────┘  └──────┘│
                  │          │  ┌─────────┐  ┌──────────┐  ┌──────┐│
                  │          │  │ PAYMENT  │  │  STORE   │  │NOTIF ││
                  │          │  │ SERVICE  │  │ SERVICE  │  │ SVC  ││
                  │          │  └─────────┘  └──────────┘  └──────┘│
                  │          │  ┌──────────────────┐  ┌───────────┐│
                  │          │  │  PH REMITTANCE   │  │  SEARCH   ││
                  │          │  │  SERVICE          │  │  SERVICE  ││
                  │          │  └──────────────────┘  └───────────┘│
                  │          └──────────────────────────────────────┘
                  │                         │
      ┌───────────┴─────────────────────────┼──────────────────┐
      │                                     │                  │
┌─────▼────────┐  ┌────────────────┐  ┌─────▼──────┐  ┌───────▼──────┐
│ AWS S3       │  │ REDIS CLUSTER  │  │ PostgreSQL │  │ ELASTICSEARCH│
│ (Product     │  │ (Session,      │  │ (RDS)      │  │ (Product     │
│  Images,     │  │  Cart Cache,   │  │ Primary DB │  │  Search)     │
│  Assets)     │  │  Rate Limit)   │  │            │  │              │
└──────────────┘  └────────────────┘  └────────────┘  └──────────────┘
                                           │
                                    ┌──────▼──────┐
                                    │  RDS READ   │
                                    │  REPLICA    │
                                    └─────────────┘

      ┌──────────────────────────────────────────────────────────┐
      │                   EXTERNAL INTEGRATIONS                  │
      │                                                          │
      │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
      │  │  STRIPE  │  │ PAYTABS  │  │ GOOGLE   │  │ TWILIO  │ │
      │  │  (Intl   │  │ (SAR     │  │ MAPS API │  │  / SMS  │ │
      │  │  Cards)  │  │ Local)   │  │ (Riyadh) │  │  (OTP/  │ │
      │  │          │  │          │  │          │  │  Notif)  │ │
      │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
      │  ┌──────────┐  ┌──────────────────────────────────────┐ │
      │  │ PUREGOLD │  │  CURRENCY EXCHANGE API (SAR→PHP)     │ │
      │  │ API      │  │  (Open Exchange Rates / XE)          │ │
      │  │ (Future) │  │                                      │ │
      │  └──────────┘  └──────────────────────────────────────┘ │
      └──────────────────────────────────────────────────────────┘
```

### 7.2 Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Region** | AWS `me-south-1` (Bahrain) | Closest AWS region to Riyadh (~350km, <10ms latency). Compliant with Saudi data regulations. |
| **Frontend** | Next.js 14 (App Router, SSR) | SEO for marketplace, fast initial load on low-end devices, React ecosystem |
| **Backend** | Node.js + Express.js (modular monolith → microservices) | JavaScript full-stack consistency, fast MVP dev, easy to decompose later |
| **Database** | PostgreSQL (RDS) | Relational integrity for orders/payments, JSON support for flexible product attributes |
| **Cache** | Redis (ElastiCache) | Cart sessions, OTP codes, rate limiting, product catalog caching |
| **Search** | Elasticsearch (OpenSearch) | Multilingual product search (English/Filipino/Arabic), fuzzy matching |
| **File Storage** | AWS S3 + CloudFront | Product images, vendor documents, receipts |
| **Auth** | JWT + Refresh Tokens + OTP (phone) | Stateless, mobile-friendly, phone-first for OFW users |
| **Payments** | PayTabs (SAR primary) + Stripe (international) | PayTabs is Saudi-licensed for local SAR, Stripe for international cards |
| **Maps** | Google Maps Platform | Riyadh baqala geolocation, delivery zone calculation, routing |
| **SMS/Notifications** | Twilio (international) + Unifonic (Saudi local) | Reliable OTP and order notifications in KSA and PH |
| **CI/CD** | GitHub Actions → ECR → ECS | Automated build, test, deploy pipeline |
| **Monitoring** | AWS CloudWatch + Sentry | Error tracking, performance monitoring, uptime alerts |

### 7.3 Service Communication

```
┌─────────────────────────────────────────────────┐
│              MVP: MODULAR MONOLITH               │
│                                                  │
│  Single Node.js application with internal        │
│  module boundaries. Each module has its own:     │
│  • Routes (/api/v1/auth, /api/v1/products, ...) │
│  • Service layer                                 │
│  • Repository layer                              │
│  • Validation schemas                            │
│                                                  │
│  Modules communicate via direct function calls.  │
│  Event bus (Bull/BullMQ) for async operations:   │
│  • Order placed → Notify vendor                  │
│  • Payment confirmed → Update order status       │
│  • Order delivered → Trigger review request       │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │            BULL/BULLMQ QUEUES               │ │
│  │  order.placed | payment.confirmed |         │ │
│  │  notification.send | inventory.update       │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  POST-MVP: Extract to microservices when         │
│  scaling requires independent deployment.        │
└───────���─────────────────────────────────────────┘
```

---

## 8. UI/UX Design & Brand Identity

### 8.1 Philippine Flag Color System — Pastel Modern Interpretation

The Philippine flag colors (Royal Blue `#0038A8`, Crimson Red `#CE1126`, Golden Yellow `#FCD116`, White `#FFFFFF`) are reinterpreted into a **soft, modern, pastel palette** that is professional, accessible, and not overwhelming.

#### Primary Palette

| Color Role | Name | Hex Code | Usage |
|-----------|------|----------|-------|
| **Primary Blue** | *Kalayaan Blue* | `#6B8FCC` | Headers, primary buttons, navigation bar, links |
| **Primary Blue (Light)** | *Langit* | `#B3C7E6` | Card backgrounds, hover states, info panels |
| **Primary Blue (Dark)** | *Dagat* | `#3A5A8C` | Text on light, active states, focus rings |
| **Accent Red** | *Tapang Red* | `#D4726A` | Sale badges, "Deal" tags, error states, CTA accents |
| **Accent Red (Light)** | *Sampaguita Rose* | `#F0C4C0` | Notification backgrounds, promo banners |
| **Accent Yellow** | *Tala Gold* | `#F2D06B` | Star ratings, discount badges, "1 Riyal" / "5 Riyal" deal highlights |
| **Accent Yellow (Light)** | *Bukang Liwayway* | `#FBF0D0` | Featured product backgrounds, rewards |
| **White** | *Malinis White* | `#FAFBFC` | Page backgrounds, card surfaces |
| **Neutral Gray** | *Batong Gray* | `#6B7280` | Body text, secondary labels |
| **Dark** | *Gabi Dark* | `#1F2937` | Headings, primary text |

#### Semantic Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Success (Order confirmed) | Soft Green | `#7BC47F` |
| Warning (Low stock) | Warm Amber | `#E8A945` |
| Error (Payment failed) | Coral Red | `#D4726A` |
| Info (Tracking update) | Sky Blue | `#6B8FCC` |

### 8.2 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings (H1-H3) | **Inter** | 700 (Bold) | 32/24/20px |
| Subheadings | **Inter** | 600 (Semi-bold) | 18px |
| Body Text | **Inter** | 400 (Regular) | 16px |
| Small/Labels | **Inter** | 500 (Medium) | 14px |
| Price Display | **Space Grotesk** | 700 (Bold) | 24-36px |
| Filipino/Tagalog Text | **Inter** | 400 | 16px |

### 8.3 Design Principles

1. **Soft & Approachable:** Rounded corners (8-12px radius), soft shadows (`0 2px 8px rgba(0,0,0,0.06)`), generous whitespace
2. **Mobile-First:** 80%+ of OFW users access via phone — all layouts designed for 375px minimum
3. **Culturally Resonant:** Subtle Philippine elements — three stars and sun motif in logo, Filipino-named color tokens, Tagalog UI option
4. **Speed-Focused:** Skeleton loaders, optimistic UI updates, minimal page weight (<200KB initial JS)
5. **Accessibility:** WCAG 2.1 AA — all pastel colors pass 4.5:1 contrast ratio against backgrounds

### 8.4 Key Page Wireframe Descriptions

#### Homepage
```
┌────────────────────────────────────────────────────────┐
│  🇵🇭 LEGASHOP       [Search...]        [🛒] [👤 Login] │
│  ─────────────────────────────────────────────────────  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │          🌟 TODAY'S DEALS — 1 & 5 RIYAL 🌟       │  │
│  │    [Hero Banner: Rotating deal products on        │  │
│  │     soft yellow gradient background]              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  📍 Baqalas Near You (Al Batha, Riyadh)               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │Store │ │Store │ │Store │ │Store │  → See All       │
│  │Card  │ │Card  │ │Card  │ │Card  │                  │
│  │⭐4.5 │ │⭐4.8 │ │⭐4.2 │ │⭐4.6 │                  │
│  │5 min │ │8 min │ │3 min │ │12min │                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                        │
│  🇵🇭 Filipino Favorites                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │Lucky │ │C2    │ │CDO   │ │Birch │                  │
│  │Me    │ │Cool  │ │Liver │ │Tree  │                  │
│  │1 SAR │ │1 SAR │ │5 SAR │ │5 SAR │                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                        │
│  🇵🇭 Send Groceries to Philippines →                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Puregold Banner: "Padala ng pagmamahal —      │  │
│  │   Order groceries for your family back home"]    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ─────────────────────────────────────────────────────  │
│  [Home] [Deals] [Stores] [PH Padala] [Orders] [More]  │
└────────────────────────────────────────────────────────┘
```

---

## 9. Technology Stack

### 9.1 Complete Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Framework:     Next.js 14 (App Router, Server Components)  │
│  Language:      TypeScript 5.x                              │
│  Styling:       Tailwind CSS 3.x + custom design tokens     │
│  State:         Zustand (client) + React Query (server)     │
│  Forms:         React Hook Form + Zod validation            │
│  Maps:          @react-google-maps/api                      │
│  Charts:        Recharts (vendor/admin dashboards)          │
│  i18n:          next-intl (EN/TL/AR)                        │
│  PWA:           next-pwa (offline-capable for low network)  │
├─────────────────────────────────────────────────────────────┤
│                      BACKEND LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Runtime:       Node.js 20 LTS                              │
│  Framework:     Express.js 4.x (modular monolith)           │
│  Language:      TypeScript 5.x                              │
│  ORM:           Prisma (PostgreSQL)                         │
│  Validation:    Zod                                         │
│  Auth:          Passport.js + JWT + phone OTP               │
│  Queue:         BullMQ (Redis-backed job queues)            │
│  Search:        OpenSearch (AWS managed Elasticsearch)      │
│  File Upload:   Multer → AWS S3 SDK                        │
│  Email:         AWS SES (transactional)                     │
│  SMS:           Twilio (international) + Unifonic (KSA)     │
│  API Docs:      Swagger/OpenAPI 3.0                         │
│  Testing:       Jest + Supertest (API) + Playwright (E2E)   │
├─────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                           │
├─────────────────────────────────────────────────────────────┤
│  Cloud:         AWS (me-south-1, Bahrain)                   │
│  Compute:       ECS Fargate (containerized)                 │
│  Database:      RDS PostgreSQL 15 (Multi-AZ)                │
│  Cache:         ElastiCache Redis 7.x                       │
│  Storage:       S3 + CloudFront CDN                         │
│  DNS/CDN:       Cloudflare (edge caching, DDoS)             │
│  CI/CD:         GitHub Actions → ECR → ECS                  │
│  Monitoring:    CloudWatch + Sentry + Uptime Robot          │
│  Logging:       CloudWatch Logs + structured JSON logging   │
│  Secrets:       AWS Secrets Manager                         │
│  IaC:           Terraform (infrastructure as code)          │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Development Tools

| Tool | Purpose |
|------|---------|
| GitHub | Source control, issues, project management |
| GitHub Actions | CI/CD pipelines |
| ESLint + Prettier | Code quality & formatting |
| Husky + lint-staged | Pre-commit hooks |
| Docker + Docker Compose | Local development environment |
| Postman / Thunder Client | API testing |
| Figma | UI/UX design & prototyping |
| Linear / GitHub Projects | Sprint tracking |

---

## 10. Database Schema

### 10.1 Entity Relationship Overview

```
┌──────────┐    ┌──────────────┐    ┌──────────┐
│  USERS   │───<│ ADDRESSES    │    │  STORES  │
│          │    └──────────────┘    │  (Baqala)│
│  - id    │                        │          │
│  - email │    ┌──────────────┐    │  - id    │
│  - phone │───<│   ORDERS     │>───│  - name  │
│  - role  │    │              │    │  - lat   │
│  - lang  │    │  - id        │    │  - lng   │
└──────────┘    │  - status    │    │  - zone  │
                │  - total     │    └────┬─────┘
                │  - type      │         │
                │  (local/ph)  │    ┌────▼─────┐
                └──────┬───────┘    │ PRODUCTS │
                       │            │          │
                ┌──────▼───────┐    │  - id    │
                │ ORDER_ITEMS  │>───│  - name  │
                │              │    │  - price │
                │  - qty       │    │  - stock │
                │  - price     │    │  - image │
                └──────────────┘    └──────────┘

                ┌──────────────┐    ┌──────────────┐
                │   REVIEWS    │    │  CATEGORIES  │
                │              │    │              │
                │  - rating    │    │  - name      │
                │  - comment   │    │  - parent_id │
                └──────────────┘    └──────────────┘

                ┌──────────────┐    ┌──────────────┐
                │   PAYMENTS   │    │ PH_ORDERS    │
                │              │    │ (Puregold)   │
                │  - method    │    │              │
                │  - status    │    │  - recipient │
                │  - ref       │    │  - ph_store  │
                └──────────────┘    │  - sar_amt   │
                                    │  - php_amt   │
                                    └──────────────┘
```

### 10.2 Key Tables (Prisma Schema Summary)

```prisma
// Core Models

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  phone         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          UserRole  @default(CUSTOMER)
  language      Language  @default(EN)
  avatarUrl     String?
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses     Address[]
  orders        Order[]
  reviews       Review[]
  store         Store?    // If vendor
}

model Store {
  id            String    @id @default(cuid())
  ownerId       String    @unique
  name          String
  nameAr        String?
  description   String?
  phone         String
  latitude      Float
  longitude     Float
  deliveryZone  Float     @default(3.0) // km radius
  avgDeliveryMin Int      @default(30)
  rating        Float     @default(0)
  isActive      Boolean   @default(false)
  imageUrl      String?
  district      String    // Riyadh district
  createdAt     DateTime  @default(now())

  owner         User      @relation(fields: [ownerId], references: [id])
  products      Product[]
  orders        Order[]
}

model Product {
  id            String    @id @default(cuid())
  storeId       String
  name          String
  nameTl        String?   // Tagalog name
  nameAr        String?   // Arabic name
  description   String?
  price         Decimal   @db.Decimal(10, 2)
  salePrice     Decimal?  @db.Decimal(10, 2)
  currency      Currency  @default(SAR)
  stock         Int       @default(0)
  unit          String    @default("piece")
  imageUrl      String?
  categoryId    String
  isDeal        Boolean   @default(false)
  dealType      DealType? // ONE_RIYAL, FIVE_RIYAL
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())

  store         Store     @relation(fields: [storeId], references: [id])
  category      Category  @relation(fields: [categoryId], references: [id])
  orderItems    OrderItem[]
}

enum DealType {
  ONE_RIYAL
  FIVE_RIYAL
}

enum UserRole {
  CUSTOMER
  VENDOR
  ADMIN
}

enum OrderType {
  LOCAL_RIYADH
  PH_REMITTANCE
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  PH_PROCESSING
  PH_READY_PICKUP
  PH_DELIVERED
}
```

---

## 11. API Architecture

### 11.1 RESTful API Endpoints

```
BASE URL: https://api.legashop.com/v1

┌──────────────────────────────────────────────────────────────────┐
│  AUTH                                                            │
├──────────────────────────────────────────────────────────────────┤
│  POST   /auth/register          Register new user               │
│  POST   /auth/login             Login (email/phone + password)   │
│  POST   /auth/otp/send          Send OTP to phone               │
│  POST   /auth/otp/verify        Verify OTP code                 │
│  POST   /auth/refresh           Refresh JWT token               │
│  POST   /auth/logout            Invalidate session              │
│  GET    /auth/me                Get current user profile         │
│  PUT    /auth/me                Update profile                  │
├──────────────────────────────────────────────────────────────────┤
│  PRODUCTS                                                        │
├──────────────────────────────────────────────────────────────────┤
│  GET    /products               List products (paginated/filter) │
│  GET    /products/:id           Get product detail               │
│  GET    /products/deals         Get 1/5 Riyal deals              │
│  GET    /products/search?q=     Search products (Elasticsearch)  │
│  GET    /categories             List all categories              │
├───────────────────────────────────────��──────────────────────────┤
│  STORES                                                          │
├──────────────────────────────────────────────────────────────────┤
│  GET    /stores                 List stores (geo-filter)         │
│  GET    /stores/nearby?lat&lng  Find nearest baqalas             │
│  GET    /stores/:id             Get store detail                 │
│  GET    /stores/:id/products    Get store's products             │
├──────────────────────────────────────────────────────────────────┤
│  CART & CHECKOUT                                                 │
├──────────────────────────────────────────────────────────────────┤
│  GET    /cart                   Get current cart                 │
│  POST   /cart/items             Add item to cart                 │
│  PUT    /cart/items/:id         Update cart item quantity         │
│  DELETE /cart/items/:id         Remove item from cart            │
│  POST   /cart/checkout          Create order from cart           │
├──────────────────────────────────────────────────────────────────┤
│  ORDERS                                                          │
├─────────────────────────���────────────────────────────────────────┤
│  POST   /orders                 Place new order                  │
│  GET    /orders                 List user's orders               │
│  GET    /orders/:id             Get order detail + tracking      │
│  PUT    /orders/:id/cancel      Cancel order (if eligible)       │
├──────────────────────────────────────────────────────────────────┤
│  PH REMITTANCE                                                   │
├──────────────────────────────────────────────────────────────────┤
│  GET    /ph/catalog             Browse Puregold catalog          │
│  GET    /ph/exchange-rate       Current SAR→PHP rate             │
│  POST   /ph/orders              Place PH grocery order           │
│  GET    /ph/orders              List PH orders                   │
│  GET    /ph/orders/:id          PH order tracking                │
├──────────────────────────────────────────────────────────────────┤
│  VENDOR DASHBOARD                                                │
├──────────────────────────────────────────────────────────────────┤
│  POST   /vendor/products        Create product listing           │
│  PUT    /vendor/products/:id    Update product                   │
│  DELETE /vendor/products/:id    Remove product                   │
│  GET    /vendor/orders          Get store's incoming orders      │
│  PUT    /vendor/orders/:id      Update order status              │
│  GET    /vendor/analytics       Sales & performance metrics      │
│  PUT    /vendor/store           Update store profile             │
├──────────────────────────────────────────────────────────────────┤
│  ADMIN                                                           │
├──────────────────────────────────────────────────────────────────┤
│  GET    /admin/users            List all users                   │
│  GET    /admin/stores           List/approve stores              │
│  PUT    /admin/stores/:id       Approve/suspend store            │
│  GET    /admin/orders           All orders overview              │
│  GET    /admin/analytics        Platform-wide metrics            │
├──────────────────────────────────────────────────────────────────┤
│  REVIEWS                                                         │
├──────────────────────────────────────────────────────────────────┤
│  POST   /reviews                Submit review                    │
│  GET    /stores/:id/reviews     Get store reviews                │
│  GET    /products/:id/reviews   Get product reviews              │
├──────────────────────────────────────────────────────────────────┤
│  PAYMENTS (Webhook Receivers)                                    │
├──────────────────────────────────────────────────────────────────┤
│  POST   /webhooks/paytabs       PayTabs payment callback         │
│  POST   /webhooks/stripe        Stripe payment callback          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 12. Deployment & Infrastructure

### 12.1 AWS Architecture (me-south-1, Bahrain)

```
┌─────────────────────────── VPC ──────────────────────────────┐
│                                                              │
│  ┌─── Public Subnet (AZ-a) ───┐ ┌─── Public Subnet (AZ-b) ─┐│
│  │  NAT Gateway               │ │  NAT Gateway              ││
│  │  ALB (Application LB)      │ │  ALB (standby)            ││
│  └────────────────────────────┘ └────────────────────────────┘│
│                                                              │
│  ┌─── Private Subnet (AZ-a) ──┐ ┌─── Private Subnet (AZ-b) ┐│
│  │  ECS Fargate Tasks:        │ │  ECS Fargate Tasks:       ││
│  │  • Frontend (Next.js) x2   │ │  • Frontend (Next.js) x2  ││
│  │  • Backend (API) x2        │ │  • Backend (API) x2       ││
│  │  • Worker (BullMQ) x1      │ │  • Worker (BullMQ) x1     ││
│  └────────────────────────────┘ └────────────────────────────┘│
│                                                              │
│  ┌─── Data Subnet (AZ-a) ─────┐ ┌─── Data Subnet (AZ-b) ───┐│
│  │  RDS PostgreSQL (Primary)  │ │  RDS PostgreSQL (Replica)  ││
│  │  ElastiCache Redis         │ │  ElastiCache Redis (repl)  ││
│  │  OpenSearch                │ │                            ││
│  └────────────────────────────┘ └────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

External:
  ├── S3 Bucket: legashop-assets-prod (product images)
  ├── CloudFront Distribution (CDN for S3 + frontend assets)
  ├── Route53 (DNS: legashop.com → ALB)
  ├── ACM (SSL certificates)
  ├── SES (Transactional emails)
  ├── Secrets Manager (API keys, DB credentials)
  └── CloudWatch (Monitoring, Alarms, Logs)
```

### 12.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy LEGASHOP

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: me-south-1
      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2
      - name: Build & Push Docker Images
        run: |
          docker build -t legashop-api ./backend
          docker build -t legashop-web ./frontend
          docker tag legashop-api:latest $ECR_REGISTRY/legashop-api:$GITHUB_SHA
          docker tag legashop-web:latest $ECR_REGISTRY/legashop-web:$GITHUB_SHA
          docker push $ECR_REGISTRY/legashop-api:$GITHUB_SHA
          docker push $ECR_REGISTRY/legashop-web:$GITHUB_SHA
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster legashop-prod \
            --service legashop-api --force-new-deployment
          aws ecs update-service --cluster legashop-prod \
            --service legashop-web --force-new-deployment
```

### 12.3 Environment Strategy

| Environment | Purpose | Infrastructure |
|-------------|---------|---------------|
| **Local** | Developer machines | Docker Compose (PG + Redis + API + Web) |
| **Staging** | QA, demo, partner testing | AWS (single-AZ, smaller instances) |
| **Production** | Live platform | AWS (multi-AZ, auto-scaling, full redundancy) |

---

## 13. Payment & Compliance

### 13.1 Payment Flow

```
RIYADH LOCAL ORDER:
Customer → [Select Items] → [Cart] → [Checkout]
  → PayTabs (SAR debit/credit/mada) → Webhook → Order Confirmed
  → Alternative: Cash on Delivery (COD) for MVP

PH REMITTANCE ORDER:
OFW → [Select Puregold Items] → [SAR Price + PHP Equivalent]
  → Stripe/PayTabs (SAR charge) → Webhook → Order Confirmed
  → Internal: SAR → PHP conversion at daily rate + margin
  → Puregold Fulfillment Notification → PH Recipient SMS
```

### 13.2 Supported Payment Methods (MVP)

| Method | Provider | Market | Notes |
|--------|----------|--------|-------|
| **Mada (Saudi Debit)** | PayTabs | KSA | Most popular in KSA |
| **Visa/Mastercard** | PayTabs + Stripe | KSA/Intl | International cards |
| **Apple Pay** | PayTabs | KSA | Growing adoption |
| **Cash on Delivery** | Internal | KSA | Essential for MVP trust-building |
| **STC Pay** | PayTabs | KSA | Popular Saudi e-wallet (Post-MVP) |

### 13.3 Regulatory Compliance

| Requirement | Details | Status |
|-------------|---------|--------|
| **Saudi E-Commerce License** | MCIT registration for online retail | Required before launch |
| **CR (Commercial Registration)** | Saudi business license | Required |
| **VAT Registration** | 15% VAT on goods (ZATCA) | Required if revenue > SAR 375K |
| **PDPL (Saudi Data Protection)** | Data storage in KSA/approved regions, consent management | AWS Bahrain compliant |
| **PCI DSS** | Payment card data — handled by PayTabs/Stripe (Level 1 PCI) | Compliant via providers |
| **BSP (Philippines)** | Remittance regulations — partner with licensed remittance entity | Via Puregold partnership |

---

## 14. Operations & Fulfillment Model

### 14.1 Riyadh Local Fulfillment

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  CUSTOMER   │     │   LEGASHOP   │     │  BAQALA STORE   │
│  Places     │────>│   PLATFORM   │────>│  Receives Order  │
│  Order      │     │              │     │  via Dashboard   │
└─────────────┘     └──────────────┘     │  + SMS Alert     │
                                          └────────┬────────┘
                                                   │
                                          ┌────────▼────────┐
                                          │  STORE PREPARES  │
                                          │  Order (5-10min) │
                                          └────────┬────────┘
                                                   │
                                     ┌─────────────▼──────────────┐
                                     │      DELIVERY OPTIONS       │
                                     │                             │
                                     │  Option A: Store's own      │
                                     │  delivery boy (most baqalas │
                                     │  have 1-2 delivery staff)   │
                                     │                             │
                                     │  Option B: Customer pickup  │
                                     │  (order ready notification) │
                                     │                             │
                                     │  Option C: Third-party      │
                                     │  (future: Marsool/Mrsool    │
                                     │   integration)              │
                                     └─────────────┬──────────────┘
                                                   │
                                          ┌────────▼────────��
                                          │   DELIVERED!     │
                                          │   Customer gets  │
                                          │   SMS + in-app   │
                                          │   confirmation   │
                                          └─────────────────┘
```

### 14.2 PH Remittance Fulfillment

```
┌─────────────┐     ┌──────────────┐     ┌───────────────────┐
│  OFW IN     │     │   LEGASHOP   │     │  PUREGOLD         │
│  RIYADH     │────>│   PLATFORM   │────>│  COORDINATION     │
│  Orders     │     │              │     │  (Email/API)      │
│  Groceries  │     │  Converts    │     │                   │
│  in SAR     │     │  SAR → PHP   │     │  Fulfills at      │
└─────────────┘     └──────────────┘     │  designated store │
                                          └────────┬──────────┘
                                                   │
                                          ┌────────▼──────────┐
                                          │  PH RECIPIENT     │
                                          │  Gets SMS:        │
                                          │  "Your groceries  │
                                          │   are ready at    │
                                          │   Puregold [City]"│
                                          │                   │
                                          │  Option: Pickup   │
                                          │  or PG Delivery   │
                                          └───────────────────┘
```

### 14.3 Riyadh Zone Coverage (MVP)

**Priority Districts** (highest OFW concentration):

| District | OFW Population | Baqala Density | Priority |
|----------|---------------|----------------|----------|
| **Al Batha** | Very High | Very High | 🟢 Launch Zone |
| **Al Olaya** | High | High | 🟢 Launch Zone |
| **Al Murabba** | High | Medium | 🟢 Launch Zone |
| **Al Malaz** | Medium-High | High | 🟡 Month 2 |
| **Al Naseem** | Medium | Medium | 🟡 Month 2 |
| **Al Sulay** | Medium | Medium | 🟡 Month 3 |
| **Al Shifa** | Medium | Medium | 🟡 Month 3 |
| **Al Rawdah** | Medium | Low | 🔵 Month 4+ |

---

## 15. Go-to-Market Strategy

### 15.1 Pre-Launch (Weeks 1-4)

| Activity | Details | Owner |
|----------|---------|-------|
| **Baqala Recruitment** | Door-to-door in Al Batha, Al Olaya, Al Murabba — target 20 stores | Operations |
| **Store Onboarding Kit** | Printed QR codes, mini tablet/phone stand, Tagalog+Arabic guide | Operations |
| **Social Media Setup** | Facebook Page, Instagram, TikTok — Filipino community targeting | Marketing |
| **OFW Community Outreach** | Partner with Filipino community leaders, embassy contacts | Marketing |
| **Beta Tester Group** | 50 OFWs for closed beta — friends/family, community leaders | Product |
| **Puregold Outreach** | Formal partnership proposal to Puregold management | Business Dev |

### 15.2 Launch (Weeks 5-8)

| Activity | Details |
|----------|---------|
| **Soft Launch** | Open to beta group + Al Batha district |
| **Free Delivery Promo** | First 3 orders free delivery (up to 3km) |
| **1 Riyal Deals Week** | 10 curated products at 1 SAR to drive trial |
| **Facebook Group Campaign** | Posts in "OFW Saudi Arabia", "Pinoy sa Riyadh" groups |
| **Referral Program** | "Refer a kababayan, both get 5 SAR credit" |
| **WhatsApp Community** | Create LEGASHOP Riyadh WhatsApp group for updates |

### 15.3 Growth (Weeks 9-16)

| Activity | Details |
|----------|---------|
| **Expand to 50 baqalas** | Add Al Malaz, Al Naseem districts |
| **TikTok Content** | "Tingi-tingi sa Saudi" series — showing 1/5 Riyal finds |
| **Padala Feature Launch** | PH remittance grocery goes live with Puregold |
| **Influencer Partnerships** | 3-5 Saudi-based Filipino micro-influencers |
| **Community Events** | Sponsor Filipino community gatherings in Riyadh |
| **Google Ads** | Target "Filipino grocery Riyadh", "OFW grocery delivery" |

### 15.4 Marketing Channels & Budget (MVP Phase)

| Channel | Monthly Budget (SAR) | Expected Reach |
|---------|---------------------|----------------|
| Facebook/Instagram Ads | 2,000 | 50,000 OFWs/month |
| TikTok Organic + Boosted | 1,000 | 30,000 views/month |
| WhatsApp Community | Free | 500 members |
| Google Search Ads | 1,500 | 10,000 clicks/month |
| Referral Credits | 2,500 | 200 new users/month |
| Influencer Gifting | 1,000 | 20,000 reach |
| **Total** | **8,000 SAR/mo (~$2,130)** | |

---

## 16. Revenue Model

### 16.1 Revenue Streams

| Stream | Description | MVP Pricing |
|--------|-------------|-------------|
| **Delivery Fee** | Charged per order based on distance | 2-5 SAR per order |
| **Commission** | % of order value from vendor | 8-12% per order |
| **Remittance Margin** | Spread on SAR→PHP conversion | 1.5-2.5% of transaction |
| **Featured Listings** | Vendors pay for product visibility | 50-100 SAR/week |
| **Promotional Placement** | Brand deals on homepage banners | 500-2,000 SAR/month |

### 16.2 Unit Economics (Per Order)

| Metric | Local Riyadh | PH Remittance |
|--------|-------------|---------------|
| Average Order Value (AOV) | 25 SAR | 200 SAR (in PHP equiv.) |
| Commission (10%) | 2.50 SAR | 20 SAR |
| Delivery Fee | 3 SAR | N/A (Puregold handles) |
| Payment Processing (~2.5%) | -0.63 SAR | -5 SAR |
| FX Margin (2%) | N/A | 4 SAR |
| SMS/Notification Cost | -0.20 SAR | -0.50 SAR |
| **Gross Margin per Order** | **~4.67 SAR** | **~18.50 SAR** |

### 16.3 Financial Projections (Year 1)

| Quarter | Monthly Orders | Revenue (SAR) | Costs (SAR) | Net (SAR) |
|---------|---------------|---------------|-------------|-----------|
| Q1 (Launch) | 200 → 500 | 3,500 | 25,000 | -21,500 |
| Q2 | 500 → 1,500 | 12,000 | 30,000 | -18,000 |
| Q3 | 1,500 → 3,000 | 30,000 | 35,000 | -5,000 |
| Q4 | 3,000 → 5,000 | 55,000 | 40,000 | +15,000 |

**Projected breakeven: Month 9-10**

---

## 17. KPIs & Success Metrics

### 17.1 Primary KPIs (MVP — First 90 Days)

| KPI | Target | Measurement |
|-----|--------|-------------|
| **Monthly Active Users (MAU)** | 1,000 | Unique logged-in users/month |
| **Monthly Orders** | 500 | Completed orders/month |
| **Same-Day Fulfillment Rate** | 80%+ | Orders delivered within 24hrs |
| **Average Delivery Time (Riyadh)** | < 45 min | Order placed → delivered |
| **Customer Retention (30-day)** | 40%+ | Users who reorder within 30 days |
| **Vendor Onboarded** | 20 baqalas | Active stores with listings |
| **NPS Score** | > 40 | Monthly survey |

### 17.2 Secondary KPIs

| KPI | Target |
|-----|--------|
| Average Order Value | 25+ SAR (local), 150+ SAR (PH) |
| Cart Abandonment Rate | < 30% |
| App Crash Rate | < 0.5% |
| API Response Time (p95) | < 500ms |
| Uptime | 99.5%+ |
| Customer Support Response Time | < 2 hours |
| Vendor Order Acceptance Rate | > 90% |
| PH Remittance Orders (if launched) | 50/month by end of Q1 |

---

## 18. Roadmap & Phasing

### Phase 1: MVP (Months 1-3) — *"Tindahan"*
> Build, launch, validate in Riyadh

| Month | Milestone |
|-------|-----------|
| **Month 1** | Core platform development (auth, product, cart, checkout). Baqala recruitment starts. |
| **Month 2** | Vendor dashboard, order management, payment integration, map-based discovery. Closed beta with 50 users, 10 baqalas. |
| **Month 3** | Public launch in Al Batha + Al Olaya. SMS notifications, review system. Marketing push. |

### Phase 2: Growth (Months 4-6) — *"Palengke"*
> Expand coverage, add PH remittance, improve UX

| Month | Milestone |
|-------|-----------|
| **Month 4** | PH Remittance Grocery launch (Puregold). Expand to 40 baqalas, 5 Riyadh districts. |
| **Month 5** | PWA optimization, push notifications, advanced search. Loyalty program beta. |
| **Month 6** | Basic AI recommendations (frequently bought together). STC Pay integration. 50+ baqalas. |

### Phase 3: Scale (Months 7-12) — *"Supermarket"*
> Profitability, mobile app, KSA expansion prep

| Month | Milestone |
|-------|-----------|
| **Month 7-8** | Native mobile app (React Native). Jeddah pilot. Subscription boxes. |
| **Month 9-10** | AI dynamic pricing. Multi-city launch (Jeddah, Dammam). Break-even target. |
| **Month 11-12** | Full KSA platform. Advanced vendor analytics. Puregold API integration. Investor readiness. |

```
TIMELINE VISUALIZATION

Month:  1    2    3    4    5    6    7    8    9    10   11   12
        ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
Phase 1 ████████████████
        [Dev] [Beta] [Launch]
Phase 2              ████████████████
                     [PH] [PWA] [AI v1]
Phase 3                               ████████████████████████
                                      [App] [Multi-city] [Scale]

Key Milestones:
  ⭐ Month 1: Development kickoff
  ⭐ Month 3: Public launch (Riyadh)
  ⭐ Month 4: PH Remittance goes live
  ⭐ Month 7: Mobile app beta
  ⭐ Month 10: Breakeven
  ⭐ Month 12: Full KSA + Investor round
```

---

## 19. Risk Analysis & Mitigation

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | **Baqala adoption resistance** — Owners reluctant to go digital | High | High | Hands-on onboarding, free first 3 months, show competitor threat, Tagalog-speaking field agents |
| 2 | **Low initial order volume** — Not enough demand to retain vendors | High | High | Subsidize delivery, run aggressive 1 SAR deals, focus on 3 high-density districts first |
| 3 | **Puregold partnership delays** — PH fulfillment not ready for MVP | Medium | Medium | Launch Riyadh-local first (P0), treat PH as P1; prepare alternative PH grocery partners (SM, Robinsons) |
| 4 | **Payment gateway issues in KSA** — PayTabs onboarding delays | Medium | High | Apply early, have Stripe as fallback, support COD from day 1 |
| 5 | **Saudi regulatory compliance** — E-commerce license delays | Medium | High | Engage local PRO/sponsor early, budget 2 months for CR + MCIT registration |
| 6 | **Delivery quality** — Late/wrong orders damage trust | Medium | High | Strict SLAs with baqalas, real-time tracking, penalty system for consistent failures |
| 7 | **Competition** — Nana/HungerStation adds Filipino category | Low | Medium | Deepen Filipino community trust, unique remittance feature as moat, lower prices |
| 8 | **Currency volatility** — SAR/PHP rate fluctuation | Low | Medium | Daily rate updates, 2% margin buffer, hedging at scale (post-MVP) |
| 9 | **Data breach / security** — User data compromised | Low | Very High | AWS security best practices, encryption at rest/transit, regular penetration testing, PDPL compliance |
| 10 | **Team burnout** — Small team, aggressive timeline | Medium | Medium | Realistic sprint planning, outsource non-core (design, QA), clear MVP scope boundaries |

---

## 20. Budget Estimate

### 20.1 MVP Development Budget (3 Months)

| Category | Monthly (SAR) | 3-Month Total (SAR) | Notes |
|----------|-------------- |---------------------|-------|
| **Development Team** | | | |
| Full-Stack Developer (2x) | 20,000 | 60,000 | Contract/remote Filipino devs |
| UI/UX Designer (1x) | 8,000 | 24,000 | Part-time/contract |
| Project Manager (1x) | 10,000 | 30,000 | Full-time |
| **Infrastructure** | | | |
| AWS (me-south-1) | 2,500 | 7,500 | ECS, RDS, Redis, S3, CloudFront |
| Domain + Cloudflare | 200 | 600 | legashop.com + Pro plan |
| Third-party APIs | 500 | 1,500 | Maps, SMS, OpenSearch |
| **Operations** | | | |
| Baqala Onboarding Kit (20x) | 1,000 | 3,000 | Tablets, stands, printed materials |
| Field Operations (1 person) | 5,000 | 15,000 | Baqala recruitment in Riyadh |
| **Marketing** | | | |
| Pre-launch + Launch | 3,000 | 9,000 | Social media, promos, influencers |
| Promotional Credits | 2,000 | 6,000 | Free delivery, 1 SAR deals |
| **Legal & Compliance** | | | |
| CR + E-Commerce License | — | 5,000 | One-time registration |
| Legal Consultation | — | 3,000 | Contract review, compliance |
| **Contingency (15%)** | — | 24,690 | |
| | | | |
| **TOTAL MVP BUDGET** | | **~189,290 SAR (~$50,500 USD)** | |

### 20.2 Monthly Operating Cost (Post-Launch)

| Category | Monthly (SAR) |
|----------|--------------|
| AWS Infrastructure | 3,000-5,000 |
| Team (ongoing) | 38,000 |
| Marketing | 8,000 |
| SMS/Communications | 500-1,000 |
| Payment Processing Fees | Variable (2.5% of GMV) |
| Office/Co-working | 2,000 |
| **Total Monthly OpEx** | **~53,000 SAR (~$14,100 USD)** |

---

## 21. Appendix

### A. Glossary

| Term | Definition |
|------|-----------|
| **OFW** | Overseas Filipino Worker — Filipino citizens working abroad |
| **Baqala** (بقالة) | Small Saudi neighborhood convenience store, similar to Filipino sari-sari store |
| **Sari-sari store** | Filipino neighborhood micro-retail store |
| **Puregold** | Major Philippine grocery chain (500+ stores), offers remittance-to-grocery services |
| **Pure Padala** | Puregold's remittance service allowing OFWs to send grocery credits |
| **SAR** | Saudi Riyal — Saudi Arabia's currency (~₱15 per 1 SAR) |
| **Mada** | Saudi Arabia's national debit card network |
| **ZATCA** | Saudi tax authority (Zakat, Tax and Customs Authority) |
| **PDPL** | Saudi Personal Data Protection Law |
| **Tingi** | Filipino term for buying items in small, individual quantities |

### B. Technical Glossary

| Term | Definition |
|------|-----------|
| **SSR** | Server-Side Rendering — pages rendered on server for SEO and fast load |
| **JWT** | JSON Web Token — stateless authentication mechanism |
| **OTP** | One-Time Password — phone-based verification |
| **CDN** | Content Delivery Network — edge caching for fast asset delivery |
| **ECS Fargate** | AWS serverless container hosting |
| **RDS** | AWS Relational Database Service |
| **BullMQ** | Redis-based job queue for Node.js |

### C. Competitive Research Sources

- Statista: Saudi Arabia E-Commerce Report 2025
- Euromonitor: Online Grocery in Middle East & Africa
- Philippine Statistics Authority: OFW Statistics 2025
- Bangko Sentral ng Pilipinas: Remittance Data
- MCIT Saudi Arabia: Digital Economy Report
- Puregold Price Club: Annual Report 2025

### D. Contact & Links

| Resource | Link |
|----------|------|
| Website (future) | https://legashop.com |
| GitHub Repository | https://github.com/legashop |
| Design System (Figma) | [To be created] |
| API Documentation | https://api.legashop.com/docs |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 7, 2026 | LEGASHOP Team | Initial MVP business plan |

---

*"Lega lang, kababayan." — Your affordable grocery, wherever you are.* 🇵🇭

---

© 2026 LEGASHOP. All rights reserved.
