import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allCategories = [
  {
    name: "Rice & Grains",
    image: "https://thairiceandfoods.com/wp-content/uploads/2017/07/rice-grains-4.jpg",
    count: 45,
    bg: "from-amber-400 to-yellow-500",
    products: [
      { name: "Jasmine Rice 1kg", price: "1", image: "https://m.media-amazon.com/images/I/81x%2BQ20uX6L._AC_UL320_.jpg", rating: 4.8, sold: 3240 },
      { name: "Thai Jasmine Rice 2kg", price: "5", image: "https://sunnywoodrice.com/wp-content/uploads/2019/05/Harvesters-Thai-Jasmine-2019-5kg-Final-01.jpg", rating: 4.9, sold: 4200 },
      { name: "Sinandomeng Rice 5kg", price: "12", image: "https://sunnywoodrice.com/wp-content/uploads/2018/05/4809010955401_Farmboy-Sinandomeng-5kg-FRONT.jpg", rating: 4.7, sold: 1890 },
    ],
  },
  {
    name: "Canned Goods",
    image: "https://img.lazcdn.com/g/p/104d717f25c8edb8b032046b7d6e52b1.jpg_720x720q80.jpg",
    count: 120,
    bg: "from-red-400 to-rose-500",
    products: [
      { name: "Century Tuna 155g", price: "1", image: "https://images.openfoodfacts.org/images/products/074/848/510/0401/front_en.54.400.jpg", rating: 4.7, sold: 2180 },
      { name: "Argentina Corned Beef", price: "5", image: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Argentina-Corned-Beef.png", rating: 4.7, sold: 980 },
      { name: "Ligo Sardines 155g", price: "1", image: "https://cf.shopee.ph/file/sg-11134201-22110-hdbgd983npjv83", rating: 4.4, sold: 980 },
    ],
  },
  {
    name: "Noodles",
    image: "https://image.shutterstock.com/shutterstock/photos/1626667372/display_1500/stock-photo-instant-noodles-product-design-concept-idea-for-advertising-and-packaging-hot-cooked-instant-1626667372.jpg",
    count: 38,
    bg: "from-yellow-400 to-orange-500",
    products: [
      { name: "Lucky Me Pancit Canton x3", price: "5", image: "https://luckyme.ph/static/uploads/products/product_12_4e90b3e9.webp", rating: 4.7, sold: 2840 },
      { name: "Pancit Canton Classic", price: "1", image: "https://ph-test-11.slatic.net/p/9ad58e4c4f5079c1ee802f8fde01b9cc.jpg", rating: 4.7, sold: 2840 },
      { name: "Cup Noodles Mini", price: "1", image: "https://sc04.alicdn.com/kf/H170a33b511c3412b90ebfb943c041f2b1.jpg", rating: 4.5, sold: 2010 },
    ],
  },
  {
    name: "Snacks",
    image: "https://firstbase.in/phpfiles/2020/05/Indian_Snacks_tea_food_Packaging_Design_Agency_Delhi_Mumbai_India_London.jpg",
    count: 85,
    bg: "from-orange-400 to-red-500",
    products: [
      { name: "Oishi Prawn Crackers", price: "1", image: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Oishi-Prawn.png", rating: 4.3, sold: 670 },
      { name: "Boy Bawang Cornick", price: "1", image: "http://cdn.shopify.com/s/files/1/0620/7881/2340/products/boy-bawang-cornick-garlic-flavour-100g-snack-foods-745_grande.png?v=1662141671", rating: 4.5, sold: 1450 },
      { name: "Piattos Cheese 85g", price: "1", image: "https://down-ph.img.susercontent.com/file/sg-11134201-22110-6ccoavbgovjv60_tn.webp", rating: 4.6, sold: 1340 },
    ],
  },
  {
    name: "Beverages",
    image: "https://cdn.dribbble.com/userupload/10815913/file/original-ba06d917a302ebfbcb6b76c28c5e1b87.jpg?resize=808x632",
    count: 60,
    bg: "from-green-400 to-emerald-500",
    products: [
      { name: "Milo Sachet x10", price: "5", image: "https://images.openfoodfacts.org/images/products/885/001/105/5375/front_en.3.400.jpg", rating: 4.8, sold: 3120 },
      { name: "Nescafe 3in1 x10", price: "5", image: "https://www.nescafe.com/mena/sites/default/files/2023-08/AE_ae_NES_3.0 Website_3in1 Classic_IMG-1_960by960px_230713_1_1689313729902_1.png", rating: 4.7, sold: 2340 },
      { name: "C2 Green Tea 500ml", price: "1", image: "https://www.oceanicsupermarket.com/wp-content/uploads/2021/07/C2-Green-Tea-500ml.jpg", rating: 4.3, sold: 1560 },
    ],
  },
  {
    name: "Condiments",
    image: "https://img.thrivemarket.com/catalog/category/condiments_and_sauces_mobile_1.jpg",
    count: 55,
    bg: "from-purple-400 to-violet-500",
    products: [
      { name: "Silver Swan Soy Sauce", price: "5", image: "https://kwalityphilfoodinc.com/wp-content/uploads/2023/12/Silver-Swan-Soy-Sauce.png", rating: 4.6, sold: 1560 },
      { name: "Datu Puti Vinegar", price: "1", image: "https://thumbs.dreamstime.com/z/datu-puti-vinegar-supermarket-shelf-datu-puti-vinegar-liter-container-supermarket-shelf-product-philippines-310322551.jpg", rating: 4.6, sold: 1120 },
      { name: "UFC Banana Ketchup", price: "3", image: "https://images.openfoodfacts.org/images/products/480/777/012/2194/front_en.16.400.jpg", rating: 4.4, sold: 760 },
    ],
  },
  {
    name: "Frozen Foods",
    image: "https://cdn.frozen-packaging.com/category/7/image/2024/02/23/717043c6514322c9837ae09d666c834d.png",
    count: 30,
    bg: "from-cyan-400 to-blue-500",
    products: [
      { name: "Purefoods Hotdog 500g", price: "5", image: "https://down-ph.img.susercontent.com/file/4f5e3cccfe4d22cf8cdb8b8dc6dcd467_tn.webp", rating: 4.7, sold: 1120 },
      { name: "CDO Karne Norte 260g", price: "5", image: "https://www.srssulit.com/wp-content/uploads/products/8867-1.png", rating: 4.5, sold: 890 },
      { name: "Tender Juicy Hotdog", price: "5", image: "https://image.shutterstock.com/z/stock-photo--camarines-sur-philippines-jan-a-close-up-photo-a-pack-tender-juicy-hotdog-cocktail-1234725046.jpg", rating: 4.6, sold: 2100 },
    ],
  },
  {
    name: "Personal Care",
    image: "https://benchmarkingcompany.com/wp-content/uploads/2022/06/shutterstock_2161999287.jpg",
    count: 40,
    bg: "from-pink-400 to-rose-500",
    products: [
      { name: "Joy Dishwashing Liquid", price: "2", image: "https://cf.shopee.ph/file/d0096425ab848b2cf138dd85b1132b0c", rating: 4.4, sold: 1340 },
      { name: "Safeguard Soap", price: "1", image: "https://images.openfoodfacts.org/images/products/490/243/081/4364/front_en.12.400.jpg", rating: 4.5, sold: 2230 },
      { name: "Palmolive Shampoo 15ml x6", price: "1", image: "https://api.watsons.com.ph/medias/cat-front-BP-10087946.jpg?context=bWFzdGVyfGltYWdlc3w0MjI0ODV8aW1hZ2UvanBlZ3xhREZtTDJneU5DOHhNVFV6TnpVME5qTXhNemMxT0M5WFZFTlFTQzFDVUY4eE1EQTROemswTmkxbWNtOXVkQzVxY0djfDUxMTA0OGUzZGE4NWMwOTM0YTQ1MmZkYjZkM2Q2ZjNhZmNlOWYzZDMxOGQxZmNjYjEzYTUyNTFjOGUwNjUzN2Y", rating: 4.3, sold: 890 },
    ],
  },
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-sky-500 to-cyan-600 py-10 md:py-14">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Browse All Categories
            </h1>
            <p className="text-white/80 text-base max-w-md mx-auto">
              Find your favorite Filipino products across all categories
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-8">
        <div className="container space-y-10">
          {allCategories.map((cat, catIdx) => (
            <div key={cat.name}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.bg} flex items-center justify-center text-xl overflow-hidden`}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">{cat.name}</h2>
                  <p className="text-xs text-muted-foreground">{cat.count} products</p>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {cat.products.map((product, i) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
                  >
                    <div className="relative">
                      <div className="w-full aspect-square bg-slate-50 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
                      </div>
                      <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-200">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <div className="pt-1 mt-auto">
                        <span className="font-extrabold text-base text-destructive leading-none">
                          {product.price} <span className="text-[10px] font-bold">SAR</span>
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {product.rating} | {product.sold.toLocaleString()} sold
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {catIdx < allCategories.length - 1 && (
                <div className="border-b border-border mt-8" />
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoriesPage;
