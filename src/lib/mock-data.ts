/**
 * Mock data used as fallback when the backend API is unreachable.
 * Matches the shape of backend serializers (ProductSerializer, CategorySerializer, StoreSerializer).
 */

import type { Product, Category, Store } from "./api";

export interface MockAddress {
  id: number;
  label: "HOME" | "WORK" | "OTHER";
  street: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
}

export interface MockOrder {
  id: number;
  store: number;
  store_name: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  order_type: "LOCAL_RIYADH" | "PH_REMITTANCE";
  subtotal: string;
  delivery_fee: string;
  total: string;
  notes: string;
  created_at: string;
  items: MockOrderItem[];
  payment: MockPayment;
}

export interface MockOrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
}

export interface MockPayment {
  method: "COD" | "MADA" | "VISA" | "APPLE_PAY";
  status: "PENDING" | "PAID" | "FAILED";
  reference: string;
}

export const mockAddresses: MockAddress[] = [
  { id: 1, label: "HOME", street: "Building 12, Apt 3, Street 15", district: "Al Batha", city: "Riyadh", latitude: 24.6350, longitude: 46.7100, is_default: true },
  { id: 2, label: "WORK", street: "King Fahd Road, Tower B, Floor 5", district: "Al Olaya", city: "Riyadh", latitude: 24.6900, longitude: 46.6850, is_default: false },
];

export const mockOrders: MockOrder[] = [
  {
    id: 1001, store: 1, store_name: "Abu Khalid Baqala",
    status: "DELIVERED", order_type: "LOCAL_RIYADH",
    subtotal: "12.00", delivery_fee: "3.00", total: "15.00", notes: "",
    created_at: "2026-04-07T14:30:00Z",
    items: [
      { id: 1, product: 1, product_name: "Jasmine Rice 1kg", product_image: "https://m.media-amazon.com/images/I/81x%2BQ20uX6L._AC_UL320_.jpg", quantity: 2, price: "1.00" },
      { id: 2, product: 9, product_name: "Lucky Me Pancit Canton x3", product_image: "https://www.oishi.com.ph/wp-content/uploads/2019/05/lm-pancit-canton-original.png", quantity: 2, price: "5.00" },
    ],
    payment: { method: "COD", status: "PAID", reference: "COD-1001" },
  },
  {
    id: 1002, store: 3, store_name: "Pinoy Corner Store",
    status: "PREPARING", order_type: "LOCAL_RIYADH",
    subtotal: "7.00", delivery_fee: "3.00", total: "10.00", notes: "Please deliver to gate 2",
    created_at: "2026-04-09T09:15:00Z",
    items: [
      { id: 3, product: 5, product_name: "Oishi Prawn Crackers", product_image: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Oishi-Prawn.png", quantity: 2, price: "1.00" },
      { id: 4, product: 12, product_name: "Argentina Corned Beef 260g", product_image: "https://cf.shopee.ph/file/sg-11134201-22120-1nq4qh4r6mkv19", quantity: 1, price: "5.00" },
    ],
    payment: { method: "MADA", status: "PAID", reference: "MADA-20260409-1002" },
  },
  {
    id: 1003, store: 2, store_name: "Al Noor Mini Mart",
    status: "PENDING", order_type: "LOCAL_RIYADH",
    subtotal: "25.00", delivery_fee: "3.00", total: "28.00", notes: "",
    created_at: "2026-04-09T10:45:00Z",
    items: [
      { id: 5, product: 14, product_name: "Nescafe Classic 100g", product_image: "https://m.media-amazon.com/images/I/61JHkrMFyjL._AC_UL320_.jpg", quantity: 1, price: "15.00" },
      { id: 6, product: 10, product_name: "Silver Swan Soy Sauce 1L", product_image: "https://cf.shopee.ph/file/34b7cda3929c41d7d37d6fb2bf8d2564", quantity: 2, price: "5.00" },
    ],
    payment: { method: "COD", status: "PENDING", reference: "" },
  },
];

export const mockProducts: Product[] = [
  // ── 1 SAR Deals ──
  {
    id: 1, store: 1, store_name: "Abu Khalid Baqala", category: 1, category_name: "Rice & Grains",
    name: "Jasmine Rice 1kg", name_tl: "Jasmine Rice 1kg", name_ar: "أرز ياسمين 1 كجم",
    description: "Premium jasmine rice, 1kg pack", price: "3.00", sale_price: "1.00", currency: "SAR",
    stock: 50, unit: "piece", image_url: "https://m.media-amazon.com/images/I/81x%2BQ20uX6L._AC_UL320_.jpg",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2, store: 1, store_name: "Abu Khalid Baqala", category: 2, category_name: "Canned Goods",
    name: "Century Tuna 155g", name_tl: "Century Tuna 155g", name_ar: "تيونة سنشري 155 جم",
    description: "Century tuna flakes in oil", price: "2.50", sale_price: "1.00", currency: "SAR",
    stock: 100, unit: "piece", image_url: "https://images.openfoodfacts.org/images/products/074/848/510/0401/front_en.54.400.jpg",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 3, store: 2, store_name: "Al Noor Mini Mart", category: 4, category_name: "Snacks",
    name: "Skyflakes Crackers", name_tl: "Skyflakes Crackers", name_ar: "سكايفلكس كراكرز",
    description: "M.Y. San Skyflakes crackers", price: "2.00", sale_price: "1.00", currency: "SAR",
    stock: 80, unit: "piece", image_url: "https://down-my.img.susercontent.com/file/f41385d87567b769131b8b1db3e25878",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 4, store: 1, store_name: "Abu Khalid Baqala", category: 6, category_name: "Condiments",
    name: "Knorr Sinigang Mix", name_tl: "Knorr Sinigang Mix", name_ar: "كنور سينيجانج مكس",
    description: "Knorr Sinigang sa Sampalok mix", price: "2.50", sale_price: "1.00", currency: "SAR",
    stock: 120, unit: "piece", image_url: "https://assets.unileversolutions.com/v1/1648400.png",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 5, store: 3, store_name: "Pinoy Corner Store", category: 4, category_name: "Snacks",
    name: "Oishi Prawn Crackers", name_tl: "Oishi Prawn Crackers", name_ar: "أويشي بروان كراكرز",
    description: "Oishi prawn crackers original flavor", price: "2.00", sale_price: "1.00", currency: "SAR",
    stock: 60, unit: "piece", image_url: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Oishi-Prawn.png",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 6, store: 1, store_name: "Abu Khalid Baqala", category: 6, category_name: "Condiments",
    name: "Magic Sarap 8g x12", name_tl: "Magic Sarap 8g x12", name_ar: "ماجيك ساراب 8 جم × 12",
    description: "Maggi Magic Sarap all-in-one seasoning", price: "3.00", sale_price: "1.00", currency: "SAR",
    stock: 200, unit: "piece", image_url: "https://clt-enterprise.com/wp-content/uploads/2020/09/magic-sarap-scaled.jpg",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 7, store: 2, store_name: "Al Noor Mini Mart", category: 4, category_name: "Snacks",
    name: "Boy Bawang Cornick", name_tl: "Boy Bawang Cornick", name_ar: "بوي باوانج كورنيك",
    description: "KSK Boy Bawang garlic flavor", price: "2.00", sale_price: "1.00", currency: "SAR",
    stock: 90, unit: "piece", image_url: "http://cdn.shopify.com/s/files/1/0620/7881/2340/products/boy-bawang-cornick-garlic-flavour-100g-snack-foods-745_grande.png?v=1662141671",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 8, store: 3, store_name: "Pinoy Corner Store", category: 2, category_name: "Canned Goods",
    name: "Ligo Sardines 155g", name_tl: "Ligo Sardines 155g", name_ar: "ليجو سردين 155 جم",
    description: "Ligo sardines in tomato sauce", price: "2.50", sale_price: "1.00", currency: "SAR",
    stock: 75, unit: "piece", image_url: "https://cf.shopee.ph/file/sg-11134201-22110-hdbgd983npjv83",
    is_deal: true, deal_type: "ONE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },

  // ── 5 SAR Deals ──
  {
    id: 9, store: 1, store_name: "Abu Khalid Baqala", category: 3, category_name: "Noodles",
    name: "Lucky Me Pancit Canton x3", name_tl: "Lucky Me Pancit Canton x3", name_ar: "لاكي مي بانسيت كانتون × 3",
    description: "Lucky Me instant pancit canton sweet & spicy", price: "9.00", sale_price: "5.00", currency: "SAR",
    stock: 40, unit: "piece", image_url: "https://www.oishi.com.ph/wp-content/uploads/2019/05/lm-pancit-canton-original.png",
    is_deal: true, deal_type: "FIVE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 10, store: 2, store_name: "Al Noor Mini Mart", category: 6, category_name: "Condiments",
    name: "Silver Swan Soy Sauce 1L", name_tl: "Silver Swan Soy Sauce 1L", name_ar: "سيلفر سوان صويا صوص 1 لتر",
    description: "Silver Swan soy sauce special", price: "8.00", sale_price: "5.00", currency: "SAR",
    stock: 30, unit: "piece", image_url: "https://cf.shopee.ph/file/34b7cda3929c41d7d37d6fb2bf8d2564",
    is_deal: true, deal_type: "FIVE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 11, store: 1, store_name: "Abu Khalid Baqala", category: 5, category_name: "Beverages",
    name: "Milo 300g", name_tl: "Milo 300g", name_ar: "ميلو 300 جم",
    description: "Nestlé Milo chocolate energy drink mix", price: "10.00", sale_price: "5.00", currency: "SAR",
    stock: 55, unit: "piece", image_url: "https://m.media-amazon.com/images/I/71xXaREDuaL._AC_UL320_.jpg",
    is_deal: true, deal_type: "FIVE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 12, store: 3, store_name: "Pinoy Corner Store", category: 2, category_name: "Canned Goods",
    name: "Argentina Corned Beef 260g", name_tl: "Argentina Corned Beef 260g", name_ar: "أرجنتينا كورنيد بيف 260 جم",
    description: "Argentina corned beef classic", price: "9.00", sale_price: "5.00", currency: "SAR",
    stock: 45, unit: "piece", image_url: "https://cf.shopee.ph/file/sg-11134201-22120-1nq4qh4r6mkv19",
    is_deal: true, deal_type: "FIVE_RIYAL", is_active: true, created_at: "2026-01-01T00:00:00Z",
  },

  // ── Regular products (not deals) ──
  {
    id: 13, store: 1, store_name: "Abu Khalid Baqala", category: 5, category_name: "Beverages",
    name: "Bear Brand Milk 300g", name_tl: "Bear Brand Milk 300g", name_ar: "بير براند حليب 300 جم",
    description: "Nestlé Bear Brand powdered milk", price: "12.00", sale_price: null, currency: "SAR",
    stock: 60, unit: "piece", image_url: "https://m.media-amazon.com/images/I/61kXdC-Z4CL._AC_UL320_.jpg",
    is_deal: false, deal_type: null, is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 14, store: 2, store_name: "Al Noor Mini Mart", category: 5, category_name: "Beverages",
    name: "Nescafe Classic 100g", name_tl: "Nescafe Classic 100g", name_ar: "نسكافيه كلاسيك 100 جم",
    description: "Nescafé classic instant coffee", price: "15.00", sale_price: null, currency: "SAR",
    stock: 40, unit: "piece", image_url: "https://m.media-amazon.com/images/I/61JHkrMFyjL._AC_UL320_.jpg",
    is_deal: false, deal_type: null, is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 15, store: 3, store_name: "Pinoy Corner Store", category: 2, category_name: "Canned Goods",
    name: "Purefoods Corned Beef 210g", name_tl: "Purefoods Corned Beef 210g", name_ar: "بيورفودز كورنيد بيف 210 جم",
    description: "San Miguel Purefoods corned beef", price: "8.00", sale_price: null, currency: "SAR",
    stock: 35, unit: "piece", image_url: "https://cf.shopee.ph/file/sg-11134201-22120-0i8lqq4r6mkv31",
    is_deal: false, deal_type: null, is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 16, store: 1, store_name: "Abu Khalid Baqala", category: 2, category_name: "Canned Goods",
    name: "CDO Karne Norte 150g", name_tl: "CDO Karne Norte 150g", name_ar: "سي دي أو كارني نورتي 150 جم",
    description: "CDO Karne Norte canned meat", price: "7.00", sale_price: null, currency: "SAR",
    stock: 45, unit: "piece", image_url: "https://cf.shopee.ph/file/ph-11134207-7qukz-ljn1z0q8kz1xc3",
    is_deal: false, deal_type: null, is_active: true, created_at: "2026-01-01T00:00:00Z",
  },
];

export const mockCategories: Category[] = [
  { id: 1, name: "Rice & Grains", name_tl: "Bigas at Butil", name_ar: "أرز وحبوب", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 2, name: "Canned Goods", name_tl: "De Lata", name_ar: "معلبات", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 3, name: "Noodles", name_tl: "Noodles", name_ar: "نودلز", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 4, name: "Snacks", name_tl: "Snacks", name_ar: "وجبات خفيفة", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 5, name: "Beverages", name_tl: "Inumin", name_ar: "مشروبات", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 6, name: "Condiments", name_tl: "Pampalasa", name_ar: "توابل", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 7, name: "Frozen Foods", name_tl: "Frozen Foods", name_ar: "أطعمة مجمدة", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
  { id: 8, name: "Personal Care", name_tl: "Pangangalaga sa Sarili", name_ar: "عناية شخصية", parent: null, image_url: null, is_active: true, subcategories: [], created_at: "2026-01-01T00:00:00Z" },
];

export const mockStores: Store[] = [
  { id: 1, owner: 1, owner_name: "Khalid", name: "Abu Khalid Baqala", name_ar: "بقالة أبو خالد", description: "Your trusted neighborhood baqala since 2018", phone: "+966501234567", latitude: 24.6350, longitude: 46.7100, delivery_zone: 3.0, avg_delivery_min: 15, rating: 4.8, is_active: true, image_url: null, district: "Al Batha", created_at: "2026-01-01T00:00:00Z" },
  { id: 2, owner: 2, owner_name: "Ahmed", name: "Al Noor Mini Mart", name_ar: "ميني مارت النور", description: "Fresh products daily", phone: "+966502345678", latitude: 24.6370, longitude: 46.7120, delivery_zone: 3.0, avg_delivery_min: 20, rating: 4.6, is_active: true, image_url: null, district: "Al Batha", created_at: "2026-01-01T00:00:00Z" },
  { id: 3, owner: 3, owner_name: "Jun", name: "Pinoy Corner Store", name_ar: "متجر ركن بينوي", description: "Filipino products specialist", phone: "+966503456789", latitude: 24.6900, longitude: 46.6850, delivery_zone: 5.0, avg_delivery_min: 30, rating: 4.9, is_active: true, image_url: null, district: "Al Olaya", created_at: "2026-01-01T00:00:00Z" },
  { id: 4, owner: 4, owner_name: "Mario", name: "Riyadh Sari-Sari", name_ar: "ساري ساري الرياض", description: "Bringing the sari-sari store experience to Riyadh", phone: "+966504567890", latitude: 24.6550, longitude: 46.7200, delivery_zone: 4.0, avg_delivery_min: 35, rating: 4.7, is_active: true, image_url: null, district: "Al Murabba", created_at: "2026-01-01T00:00:00Z" },
  { id: 5, owner: 5, owner_name: "Abdullah", name: "King Baqala", name_ar: "بقالة الملك", description: "Quality groceries at affordable prices", phone: "+966505678901", latitude: 24.6380, longitude: 46.7080, delivery_zone: 3.0, avg_delivery_min: 22, rating: 4.5, is_active: true, image_url: null, district: "Al Batha", created_at: "2026-01-01T00:00:00Z" },
  { id: 6, owner: 6, owner_name: "Rey", name: "Manila Market", name_ar: "سوق مانيلا", description: "Authentic Filipino groceries and snacks", phone: "+966506789012", latitude: 24.6920, longitude: 46.6900, delivery_zone: 5.0, avg_delivery_min: 32, rating: 4.8, is_active: true, image_url: null, district: "Al Olaya", created_at: "2026-01-01T00:00:00Z" },
  { id: 7, owner: 7, owner_name: "Samir", name: "Al Rashid Grocery", name_ar: "بقالة الراشد", description: "Serving Al Murabba since 2015", phone: "+966507890123", latitude: 24.6600, longitude: 46.7250, delivery_zone: 3.5, avg_delivery_min: 40, rating: 4.4, is_active: true, image_url: null, district: "Al Murabba", created_at: "2026-01-01T00:00:00Z" },
  { id: 8, owner: 8, owner_name: "Dong", name: "Kabayan Store", name_ar: "متجر كبايان", description: "For our fellow Kabayans in Riyadh", phone: "+966508901234", latitude: 24.6360, longitude: 46.7090, delivery_zone: 3.0, avg_delivery_min: 18, rating: 4.7, is_active: true, image_url: null, district: "Al Batha", created_at: "2026-01-01T00:00:00Z" },
];

export interface MockReview {
  id: number;
  user: number;
  reviewer_name: string;
  store: number;
  product: number | null;
  rating: number;
  comment: string;
  created_at: string;
}

export const mockReviews: MockReview[] = [
  // Product reviews
  { id: 1, user: 10, reviewer_name: "Maria Santos", store: 1, product: 1, rating: 5, comment: "Best jasmine rice at this price! Sulit na sulit.", created_at: "2026-03-15T10:00:00Z" },
  { id: 2, user: 11, reviewer_name: "Jun Reyes", store: 1, product: 1, rating: 4, comment: "Good quality for 1 SAR. Will buy again.", created_at: "2026-03-18T14:30:00Z" },
  { id: 3, user: 12, reviewer_name: "Elena Cruz", store: 1, product: 2, rating: 5, comment: "Century Tuna never disappoints. Great deal!", created_at: "2026-03-20T09:15:00Z" },
  { id: 4, user: 13, reviewer_name: "Ahmed Ali", store: 2, product: 3, rating: 4, comment: "Skyflakes is a staple, happy to find it here.", created_at: "2026-03-22T16:00:00Z" },
  { id: 5, user: 14, reviewer_name: "Dong Villanueva", store: 1, product: 4, rating: 5, comment: "Perfect for sinigang! Lasa ng bahay.", created_at: "2026-03-25T11:45:00Z" },
  { id: 6, user: 15, reviewer_name: "Rey Magno", store: 3, product: 5, rating: 4, comment: "Crunchy and tasty. My kids love it.", created_at: "2026-03-28T08:20:00Z" },
  { id: 7, user: 10, reviewer_name: "Maria Santos", store: 1, product: 9, rating: 5, comment: "Pancit Canton is life! Best instant noodle.", created_at: "2026-04-01T12:00:00Z" },
  { id: 8, user: 11, reviewer_name: "Jun Reyes", store: 2, product: 10, rating: 5, comment: "Silver Swan is the only soy sauce for Filipino cooking.", created_at: "2026-04-02T15:30:00Z" },
  { id: 9, user: 16, reviewer_name: "Carlo Mendoza", store: 1, product: 11, rating: 4, comment: "Milo for energy! Good price.", created_at: "2026-04-03T09:00:00Z" },
  { id: 10, user: 12, reviewer_name: "Elena Cruz", store: 3, product: 12, rating: 5, comment: "Argentina corned beef is the best. Perfect for sinangag.", created_at: "2026-04-04T13:15:00Z" },
  { id: 11, user: 17, reviewer_name: "Grace Tan", store: 1, product: 13, rating: 4, comment: "Bear Brand for my daily milk. Affordable here.", created_at: "2026-04-05T07:45:00Z" },
  { id: 12, user: 13, reviewer_name: "Ahmed Ali", store: 2, product: 14, rating: 5, comment: "Perfect coffee for morning shift. Strong flavor.", created_at: "2026-04-06T06:30:00Z" },
  { id: 13, user: 14, reviewer_name: "Dong Villanueva", store: 2, product: 7, rating: 4, comment: "Boy Bawang is addictive!", created_at: "2026-04-07T18:00:00Z" },
  { id: 14, user: 15, reviewer_name: "Rey Magno", store: 3, product: 8, rating: 5, comment: "Ligo sardines reminds me of home. Masarap!", created_at: "2026-04-08T10:30:00Z" },
  { id: 15, user: 18, reviewer_name: "Mario de Leon", store: 1, product: 6, rating: 5, comment: "Magic Sarap makes everything taste better.", created_at: "2026-04-09T14:00:00Z" },
  // Store-only reviews (no product)
  { id: 16, user: 10, reviewer_name: "Maria Santos", store: 1, product: null, rating: 5, comment: "Abu Khalid always has fresh Filipino products. Fast delivery!", created_at: "2026-03-10T09:00:00Z" },
  { id: 17, user: 11, reviewer_name: "Jun Reyes", store: 1, product: null, rating: 4, comment: "Good selection, fair prices. My go-to baqala.", created_at: "2026-03-12T11:30:00Z" },
  { id: 18, user: 12, reviewer_name: "Elena Cruz", store: 2, product: null, rating: 4, comment: "Al Noor has nice variety. Delivery could be faster.", created_at: "2026-03-14T08:45:00Z" },
  { id: 19, user: 13, reviewer_name: "Ahmed Ali", store: 2, product: null, rating: 5, comment: "Great store with helpful staff. Always a pleasant experience.", created_at: "2026-03-16T14:00:00Z" },
  { id: 20, user: 14, reviewer_name: "Dong Villanueva", store: 3, product: null, rating: 5, comment: "Pinoy Corner is the best for Filipino products! Parang nasa Pilipinas.", created_at: "2026-03-18T10:15:00Z" },
  { id: 21, user: 15, reviewer_name: "Rey Magno", store: 3, product: null, rating: 5, comment: "Amazing store! Everything a Kabayan needs.", created_at: "2026-03-20T16:30:00Z" },
  { id: 22, user: 16, reviewer_name: "Carlo Mendoza", store: 4, product: null, rating: 4, comment: "Riyadh Sari-Sari has that authentic feel. Love it.", created_at: "2026-03-22T12:00:00Z" },
  { id: 23, user: 17, reviewer_name: "Grace Tan", store: 5, product: null, rating: 4, comment: "King Baqala has good prices. Decent selection.", created_at: "2026-03-24T09:45:00Z" },
  { id: 24, user: 18, reviewer_name: "Mario de Leon", store: 6, product: null, rating: 5, comment: "Manila Market is like being back in Manila. So many choices!", created_at: "2026-03-26T15:00:00Z" },
  { id: 25, user: 10, reviewer_name: "Maria Santos", store: 7, product: null, rating: 4, comment: "Al Rashid is reliable. A bit far but worth it.", created_at: "2026-03-28T08:00:00Z" },
  { id: 26, user: 11, reviewer_name: "Jun Reyes", store: 8, product: null, rating: 5, comment: "Kabayan Store delivers quick. Great for emergencies.", created_at: "2026-03-30T11:00:00Z" },
];
