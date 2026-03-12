import { motion } from "framer-motion";
import { Star, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  { name: "CDO Karne Norte 150g", price: "3", oldPrice: "5", image: "https://images.freshop.ncrcloud.com/1564405684702539926/6104e49b211569587b50b3bd5f32d422_large.png", rating: 4.8, sold: 1240, tag: "Best Seller" },
  { name: "Argentina Corned Beef 260g", price: "5", oldPrice: "8", image: "https://sdcglobalchoice.com/wp-content/uploads/2021/07/arg-corned-beef-260g-e1626175755764.jpg", rating: 4.7, sold: 980, tag: "Popular" },
  { name: "Knorr Sinigang Mix", price: "1", oldPrice: "2.5", image: "https://pinoywarehouse.com.au/wp-content/uploads/2023/12/knorr-sinigang-sa-sampalok-mix-gabi-tamarind-soup-mix-with-taro-44g-600x600.jpg", rating: 4.9, sold: 2100, tag: "Top Pick" },
  { name: "Del Monte Tomato Sauce", price: "3", oldPrice: "4.5", image: "https://filipino.is/wp-content/uploads/2022/07/450540_7727140b-f115-44e5-8315-acff0e708571.jpg", rating: 4.6, sold: 756, tag: "" },
  { name: "Bear Brand Milk 300g", price: "5", oldPrice: "8", image: "http://cdn.shopify.com/s/files/1/0358/1335/9748/products/4800361410892_7a524b56-0e5c-480d-a2b3-8247103d881c_1024x.jpg?v=1678679069", rating: 4.8, sold: 1580, tag: "Popular" },
  { name: "UFC Banana Ketchup", price: "3", oldPrice: "5", image: "https://images.openfoodfacts.org/images/products/480/777/012/2194/front_en.16.400.jpg", rating: 4.5, sold: 892, tag: "" },
  { name: "Joy Dishwashing Liquid", price: "2", oldPrice: "3.5", image: "https://medias.watsons.com.ph/publishing/WTCPH-50050841-front-zoom.jpg?version=1734338211", rating: 4.4, sold: 1340, tag: "" },
  { name: "Nescafe 3-in-1 x10", price: "5", oldPrice: "9", image: "https://shopmetro.ph/itpark-supermarket/wp-content/uploads/2023/05/SM102724911-8.jpg", rating: 4.7, sold: 2340, tag: "Best Seller" },
  { name: "Magic Sarap 8g x12", price: "2", oldPrice: "3", image: "https://d11qgm9a5k858y.cloudfront.net/maut2sfax6i57sab5fva8lxqbipa", rating: 4.9, sold: 3200, tag: "Top Pick" },
  { name: "Oishi Prawn Crackers", price: "1", oldPrice: "2", image: "https://www.oishi.com.ph/wp-content/uploads/2017/04/oishi-prawn-crackers-100g-copy.png", rating: 4.3, sold: 670, tag: "" },
  { name: "Coconut Cream 400ml", price: "3", oldPrice: "5", image: "http://acemarket.ph/cdn/shop/products/E-comm-JollyCoconutCream-400ml_38ec17b8-d0c3-4d82-9041-d68f4a9baf6d.jpg?v=1740979531", rating: 4.6, sold: 445, tag: "" },
  { name: "Purefoods Hotdog 500g", price: "5", oldPrice: "8", image: "https://smmarkets.ph/media/catalog/product/h/t/httpsshop.smmarkets.phpubmediawysiwygro_photos10262010220455002-1.png", rating: 4.7, sold: 1120, tag: "Popular" },
];

const FeaturedProducts = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Filipino Favorites</h2>
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group bg-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-primary/20"
            >
              <div className="relative">
                <div className="w-full aspect-square bg-white flex items-center justify-center overflow-hidden p-4 group-hover:bg-slate-50 transition-colors duration-300">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                {product.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">
                    {product.tag}
                  </span>
                )}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-primary z-10 text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 duration-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 space-y-1.5 flex-1 flex flex-col">
                <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="pt-1 mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-base text-destructive leading-none">
                      {product.price} <span className="text-[10px] font-bold">SAR</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground line-through">
                      {product.oldPrice}
                    </span>
                  </div>
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
      </div>
    </section>
  );
};

export default FeaturedProducts;
