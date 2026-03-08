
# 🇵🇭 LEGASHOP — Executive Summary
### *Affordable Filipino Grocery E-Commerce for Riyadh, Saudi Arabia*

**Version:** 1.0 | **Date:** March 7, 2026 | **Confidentiality:** Investor / Partner Ready

---

## 📌 What is LEGASHOP?

**LEGASHOP** (from the Filipino word *"lega"* meaning affordable or bargain) is a **grocery e-commerce platform** built specifically for the **Filipino diaspora and diverse residents in Riyadh, Saudi Arabia**.

It connects customers with **baqala stores** — Saudi Arabia's neighborhood convenience shops, the local equivalent of Filipino sari-sari stores — enabling ultra-fast grocery delivery at unbeatable prices. It also allows **Overseas Filipino Workers (OFWs)** to send groceries directly to their families in the Philippines through a **Puregold** store partnership.

> **In simple terms:** LEGASHOP is the bridge between the corner store down the street in Riyadh and the family kitchen back home in the Philippines.

### The Two Pillars

| Pillar | What It Does |
|--------|-------------|
| 🛒 **Riyadh Local Marketplace** | Order daily essentials from nearby baqala stores — delivered in minutes to same-day. Focus on **1 Riyal (~₱15)** and **5 Riyal (~₱75)** deals for maximum affordability. |
| 🇵🇭 **OFW Remittance Grocery** | Filipino workers in Riyadh order groceries from Puregold's catalog, pay in Saudi Riyals, and their families pick up or receive delivery in the Philippines — turning remittance money directly into groceries. |

---

## 🎯 Core Features (MVP)

### For Customers (OFWs & Residents)
- **Find Nearby Baqalas** — Map-based store discovery showing distance and estimated delivery time
- **Browse & Search Products** — Category navigation with Filipino, English, and Arabic language support
- **1 & 5 Riyal Deals** — Dedicated deals section highlighting the most affordable everyday essentials
- **Shopping Cart & Checkout** — Simple ordering flow with support for multiple payment methods
- **Order Tracking** — Real-time status updates from order placement to doorstep delivery via SMS
- **Send Groceries to Philippines** — Browse Puregold products, pay in SAR, family receives in PHP value

### For Baqala Store Owners (Vendors)
- **Digital Storefront** — Create an online presence with product listings, photos, and pricing
- **Order Management** — Accept or reject incoming orders, mark as preparing/delivered
- **Inventory Tracking** — Monitor stock levels and get low-stock alerts
- **Sales Dashboard** — View daily/weekly sales performance and popular products

### For Platform Administrators
- **Store Approvals** — Review and approve new baqala partner applications
- **Order Oversight** — Monitor all platform orders and resolve disputes
- **Platform Analytics** — Track total GMV, user growth, fulfillment rates, and vendor performance

---

## 📊 Market Research Highlights

### The Opportunity

| Fact | Figure |
|------|--------|
| Filipino population in Saudi Arabia | **~2.3 million** |
| Filipinos concentrated in Riyadh | **~800,000 – 1,000,000** |
| Annual remittances from KSA to Philippines | **~$2.5 billion USD** |
| Percentage of remittance spent on groceries | **30–40%** |
| Saudi e-commerce market size (2025) | **$12.4 billion USD** |
| Saudi internet/smartphone penetration | **98–99%** |
| Baqala stores in Riyadh alone | **12,000–15,000** |
| Baqalas currently selling online | **Near zero** |

### Why Now?
1. **Saudi Vision 2030** is aggressively pushing digital payments and e-commerce adoption
2. **Online grocery in KSA** is only at ~4.5% penetration — massive room to grow
3. **No competitor** specifically serves the Filipino community with localized products and remittance integration
4. **Baqalas are underserved** — thousands of stores with zero digital presence losing customers to larger delivery apps
5. **OFW remittance-to-grocery** is a proven concept (Puregold's Pure Padala exists) but lacks a modern, user-friendly marketplace interface

### Competitive Edge

| Competitor | What They Do | What LEGASHOP Does Better |
|-----------|-------------|--------------------------|
| Nana Direct | General KSA grocery delivery | No Filipino focus, higher prices, no baqala network |
| HungerStation / Jahez | Food & grocery delivery | General platforms, no remittance feature, no cultural connection |
| Carrefour Online | Hypermarket delivery | High minimum orders, no neighborhood speed |
| Puregold Online | PH grocery | No Saudi-side marketplace — only serves Philippines |
| LBC / Cebuana Padala | Remittance to grocery | Limited product selection, no real-time browsing, preset packages only |

**LEGASHOP's moat:** The *only* platform that combines **hyperlocal Riyadh baqala delivery** with **cross-border grocery remittance to the Philippines** — all in one app, built for the Filipino community.

---

## 🏗️ System Architecture (Simplified)

The platform is built as a **modern web application** with three main layers:

```
  ┌────────────────────────────────────────────────┐
  │             WHAT USERS SEE                      │
  │                                                │
  │   Customer Website ──── Vendor Dashboard ────  │
  │   (Browse, Order,       (Manage Products,      │
  │    Track, Pay)           Accept Orders)         │
  │                                                │
  │            + Admin Panel (Internal)             │
  └────────────────────┬───────────────────────────┘
                       │
  ┌────────────────────▼───────────────────────────┐
  │          WHAT POWERS THE PLATFORM               │
  │                                                │
  │   Backend Server ─── handles all business      │
  │   logic: user accounts, product catalog,       │
  │   orders, payments, notifications, search      │
  └────────────────────┬───────────────────────────┘
                       │
  ┌────────────────────▼───────────────────────────┐
  │           WHERE DATA LIVES                      │
  │                                                │
  │   Database ─── all user, product, order data   │
  │   Cache ─── fast access for carts, sessions    │
  │   Search Engine ─── product search in 3 langs  │
  │   AWS S3 ─── product images, store photos,     │
  │              receipts, uploaded documents       │
  │   File CDN ─── fast image loading worldwide    │
  └────────────────────┬───────────────────────────┘
                       │
  ┌────────────────────▼───────────────────────────┐
  │        EXTERNAL SERVICES CONNECTED              │
  │                                                │
  │   💳 PayTabs / Stripe ─── payment processing   │
  │   📍 Google Maps ─── store locations & routing │
  │   📱 Twilio / Unifonic ─── SMS & OTP codes     │
  │   💱 Currency API ─── live SAR→PHP rates       │
  │   🛒 Puregold ─── PH grocery fulfillment      │
  └────────────────────────────────────────────────┘
```

### Key Architecture Decisions

| Decision | Why |
|----------|-----|
| **Hosted in AWS Bahrain** | Closest data center to Riyadh (~350km) for fast response times, and compliant with Saudi data privacy regulations |
| **Web-first (no mobile app for MVP)** | Faster to build, easier to update, works on every device — mobile app planned for Phase 3 |
| **AWS S3 for all images** | Reliable, scalable cloud storage for product photos, store images, and user uploads — served through a global CDN so images load fast even on slow connections |
| **Modular design** | Built as one application initially but designed with clear internal boundaries so it can be split into independent services as the platform grows |

---

## 🎨 UI/UX & Brand Identity

### Brand Concept
LEGASHOP's visual identity is rooted in the **Philippine flag** — but reinterpreted in a **modern, pastel, soft-toned palette** that feels premium and approachable rather than loud or overly nationalistic.

### Color Philosophy

| Philippine Flag Color | LEGASHOP Interpretation | Where It's Used |
|----------------------|------------------------|-----------------|
| 🔵 Royal Blue → | **Kalayaan Blue** (soft pastel blue `#6B8FCC`) | Navigation, buttons, headers |
| 🔴 Crimson Red → | **Tapang Red** (warm coral `#D4726A`) | Sale badges, deal tags, alerts |
| 🟡 Golden Yellow → | **Tala Gold** (soft gold `#F2D06B`) | Star ratings, "1 Riyal" deal highlights |
| ⬜ White → | **Malinis White** (clean off-white `#FAFBFC`) | Backgrounds, cards, breathing room |

### Design Personality
- **Soft & Modern** — Rounded corners, gentle shadows, lots of whitespace
- **Mobile-First** — Designed for the phone screen first (80%+ of OFW users browse on mobile)
- **Culturally Warm** — Filipino-named design tokens (Langit, Sampaguita, Bukang Liwayway), subtle three-stars-and-sun motif in the logo
- **Not Too Bright** — Pastel tones ensure the Philippine pride is felt without eye strain — the flag's spirit, not its intensity
- **Fast & Lightweight** — Pages load in under 2 seconds even on 3G connections common in labor camps

---

## 🔧 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Website** | Next.js (React) | Fast, SEO-friendly customer-facing pages |
| **Backend** | Node.js + Express | Handles all business logic and API requests |
| **Database** | PostgreSQL | Stores users, products, orders, reviews |
| **Cache** | Redis | Speeds up cart, sessions, and frequently accessed data |
| **Search** | Elasticsearch / OpenSearch | Multilingual product search (English, Filipino, Arabic) |
| **Image Storage** | **AWS S3 + CloudFront CDN** | Stores and delivers product images, store photos, and uploaded files globally with fast load times |
| **Payments** | PayTabs (Saudi) + Stripe (International) | Processes SAR and international card payments |
| **Maps** | Google Maps Platform | Locates nearby baqalas, calculates delivery zones |
| **SMS** | Twilio + Unifonic | OTP verification, order update notifications |
| **Currency** | Open Exchange Rates / XE | Real-time SAR-to-PHP conversion for remittance |
| **Hosting** | AWS Bahrain (me-south-1) | Closest cloud region to Riyadh for speed and compliance |
| **CI/CD** | GitHub Actions | Automated testing and deployment pipeline |
| **Monitoring** | CloudWatch + Sentry | Error tracking, uptime monitoring, performance alerts |

---

## 💳 Payments & Compliance

### How Payments Work

**Riyadh Local Orders:**
> Customer selects items → adds to cart → checks out → pays with **Mada debit card, Visa/Mastercard, Apple Pay, or Cash on Delivery** → baqala receives order → delivers

**PH Remittance Orders:**
> OFW browses Puregold catalog → sees prices in SAR with PHP equivalent → pays in SAR → LEGASHOP converts to PHP at daily rate → Puregold prepares order → family receives SMS → picks up at Puregold or gets delivery

### Accepted Payment Methods

| Method | Availability |
|--------|-------------|
| 🏦 Mada (Saudi debit card) | MVP Launch |
| 💳 Visa / Mastercard | MVP Launch |
| 📱 Apple Pay | MVP Launch |
| 💵 Cash on Delivery | MVP Launch |
| 📲 STC Pay (Saudi e-wallet) | Post-MVP |

### Regulatory Requirements

| Requirement | What It Means | Status |
|-------------|--------------|--------|
| Saudi E-Commerce License (MCIT) | Legal permission to sell online in KSA | Must obtain before launch |
| Commercial Registration (CR) | Official Saudi business license | Required |
| VAT Registration (ZATCA) | 15% VAT on goods if revenue exceeds SAR 375K | Required when threshold met |
| Saudi Data Protection (PDPL) | User data must be stored in approved regions with consent | ✅ AWS Bahrain compliant |
| Payment Security (PCI DSS) | Card data must be handled securely | ✅ Handled by PayTabs/Stripe |
| Philippines Remittance (BSP) | Cross-border transactions must go through licensed entities | Via Puregold partnership |

---

## 🚚 Operations & Fulfillment

### Riyadh Local Orders — How It Works

```
   Customer              LEGASHOP              Baqala Store
   ────────              ────────              ────────────
   Opens app         →   Shows nearby      →   Receives order
   Browses products      stores & deals        on dashboard +
   Places order      →   Processes payment →   SMS alert
   Waits (15-45min)      Tracks status     →   Prepares items
   Gets delivery     ←   Updates tracking  ←   Delivers via
   Rates experience      Sends SMS              store staff
```

### PH Remittance Orders — How It Works

```
   OFW in Riyadh         LEGASHOP              Puregold (PH)
   ──────────────         ────────              ─────────────
   Browses Puregold  →   Shows SAR prices  →   Receives order
   catalog online        + PHP equivalent       details
   Pays in SAR       →   Converts SAR→PHP  →   Prepares grocery
   Gets confirmation     Notifies recipient     package
                                            →   Family picks up
                                                or gets delivery
```

### Launch Zone: Riyadh's Filipino Heartland

The MVP focuses on **3 initial districts** in Riyadh with the highest OFW concentration:

| District | Why This Area | Launch Timeline |
|----------|--------------|-----------------|
| **Al Batha** | Highest Filipino/OFW population density, most baqalas | Day 1 |
| **Al Olaya** | Large Filipino community, commercial hub | Day 1 |
| **Al Murabba** | High baqala density, residential OFW area | Day 1 |
| Al Malaz, Al Naseem | Expanding Filipino population | Month 2 |
| Al Sulay, Al Shifa | Growing residential areas | Month 3 |

---

## ⚠️ Risk Analysis

| Risk | How Likely? | How Serious? | Our Plan |
|------|------------|-------------|----------|
| **Baqala owners resist going digital** | High | High | Free onboarding for 3 months, hands-on training in Tagalog/Arabic, show them how competitors are taking their customers |
| **Not enough orders at launch** | High | High | Subsidize delivery fees, run aggressive 1 SAR deal campaigns, concentrate on 3 dense districts first (not spread thin) |
| **Puregold partnership takes longer than expected** | Medium | Medium | Launch Riyadh-local marketplace first (it stands alone), keep PH remittance as Phase 2; prepare backup PH partners (SM, Robinsons) |
| **Payment gateway setup delays** | Medium | High | Apply for PayTabs early, keep Stripe as backup, support Cash on Delivery from day 1 |
| **Saudi business license delays** | Medium | High | Engage local PRO/sponsor 2 months before launch, budget for expedited processing |
| **Poor delivery experience** | Medium | High | Set strict SLAs with baqalas, real-time tracking for accountability, penalty system for repeated failures |
| **Big competitors add Filipino category** | Low | Medium | Our remittance feature is a unique moat; deepen community trust through cultural connection they can't replicate |
| **SAR/PHP currency fluctuation** | Low | Medium | Update rates daily, build 2% margin buffer into conversion, consider hedging at scale |
| **Security breach** | Low | Very High | Use AWS security best practices, encrypt all data, regular security audits, comply with Saudi PDPL |
| **Team burnout** | Medium | Medium | Set realistic sprint goals, outsource design and QA, protect MVP scope from feature creep |

---

## 📈 Business Projections at a Glance

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly Active Users | 1,000 | 3,000 | 10,000 |
| Monthly Orders | 500 | 2,000 | 5,000 |
| Partner Baqalas | 20 | 50 | 100+ |
| Riyadh Districts Covered | 3 | 6 | All major |
| PH Remittance Orders/month | — | 100 | 500 |
| Monthly Revenue (SAR) | 3,500 | 20,000 | 55,000 |
| **Projected Breakeven** | | | **Month 9–10** |

### MVP Budget Summary

| Category | 3-Month Total |
|----------|---------------|
| Development Team | 114,000 SAR |
| Infrastructure & Tech | 9,600 SAR |
| Operations & Onboarding | 18,000 SAR |
| Marketing & Promos | 15,000 SAR |
| Legal & Compliance | 8,000 SAR |
| Contingency (15%) | 24,690 SAR |
| **Total MVP Investment** | **~189,290 SAR (~$50,500 USD)** |

---

## 🗺️ Roadmap Summary

| Phase | Timeline | Codename | Focus |
|-------|----------|----------|-------|
| **Phase 1** | Months 1–3 | *"Tindahan"* (Small store) | Build MVP, launch in 3 Riyadh districts with 20 baqalas |
| **Phase 2** | Months 4–6 | *"Palengke"* (Market) | Add PH remittance grocery, expand to 50 baqalas, 6 districts |
| **Phase 3** | Months 7–12 | *"Supermarket"* | Mobile app, multi-city (Jeddah, Dammam), AI features, breakeven |

---

## 📎 Additional Sections for Your Presentation / PDF

Based on the full plan, here are **recommended additions** to make the document even more compelling for investors, partners, or internal stakeholders:

### ✅ Recommended Additions

| Section | Why Include It | Suggested Placement |
|---------|---------------|-------------------|
| **Founder / Team Profiles** | Investors fund teams, not just ideas — include bios, relevant experience, Filipino/Saudi connections | After Executive Summary |
| **Customer Journey Maps** | Visual flowcharts showing Maria, Jun, Ahmed's step-by-step experience using LEGASHOP | After Target Users |
| **Mockup Screenshots** | Even rough Figma wireframes make the vision 10x more tangible | After UI/UX section |
| **Testimonial Quotes** | Early beta tester quotes or community feedback from OFW Facebook groups | Go-to-Market section |
| **Partnership Pipeline** | Status of Puregold, baqala, payment provider, and community leader conversations | After Operations |
| **Comparable Exits / Valuations** | Reference similar startups (Nana's $180M Series C, Sary's $150M raise) to frame market value | After Revenue Model |
| **Funding Ask & Use of Funds** | If seeking investment: exact amount needed, breakdown of allocation, equity offered | New section before Appendix |
| **Legal Entity Structure** | Saudi CR details, Philippine entity (if needed), partnership structure | After Compliance |
| **Social Impact Statement** | How LEGASHOP empowers OFWs, supports baqala micro-entrepreneurs, strengthens family connections | Opening or closing page |
| **FAQ for Partners** | Common questions baqala owners and Puregold reps would ask, pre-answered | Appendix |
| **One-Page Visual Summary** | Single-page infographic version of the entire plan — ideal for quick sharing | First or last page |

### 🎨 Presentation Tips

- **Use the LEGASHOP pastel palette** throughout your PDF/slides — `#6B8FCC` blue headers, `#F2D06B` gold highlights, `#FAFBFC` white backgrounds
- **Include the Philippine flag subtly** — as a corner motif or in the header bar, not as a full background
- **Lead with emotion** — start with a story about Maria or Jun (from the personas) before diving into numbers
- **Keep slides to 1 idea per page** — the full technical plan is the backup document; the presentation should be visual and punchy
- **End with a clear ask** — whether it's investment, partnership, or team recruitment, make the next step obvious

---

*"Lega lang, kababayan." — Your affordable grocery, wherever you are.* 🇵🇭

© 2026 LEGASHOP. All rights reserved.
