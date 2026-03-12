import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "Rice & Grains", image: "https://thairiceandfoods.com/wp-content/uploads/2017/07/rice-grains-4.jpg", count: 45, slug: "rice-grains", bg: "bg-amber-50" },
  { name: "Canned Goods", image: "https://img.lazcdn.com/g/p/104d717f25c8edb8b032046b7d6e52b1.jpg_720x720q80.jpg", count: 120, slug: "canned-goods", bg: "bg-red-50" },
  { name: "Noodles", image: "https://image.shutterstock.com/shutterstock/photos/1626667372/display_1500/stock-photo-instant-noodles-product-design-concept-idea-for-advertising-and-packaging-hot-cooked-instant-1626667372.jpg", count: 38, slug: "noodles", bg: "bg-yellow-50" },
  { name: "Snacks", image: "https://firstbase.in/phpfiles/2020/05/Indian_Snacks_tea_food_Packaging_Design_Agency_Delhi_Mumbai_India_London.jpg", count: 85, slug: "snacks", bg: "bg-orange-50" },
  { name: "Beverages", image: "https://cdn.dribbble.com/userupload/10815913/file/original-ba06d917a302ebfbcb6b76c28c5e1b87.jpg?resize=808x632", count: 60, slug: "beverages", bg: "bg-green-50" },
  { name: "Condiments", image: "https://img.thrivemarket.com/catalog/category/condiments_and_sauces_mobile_1.jpg", count: 55, slug: "condiments", bg: "bg-purple-50" },
  { name: "Frozen Foods", image: "https://cdn.frozen-packaging.com/category/7/image/2024/02/23/717043c6514322c9837ae09d666c834d.png", count: 30, slug: "frozen", bg: "bg-cyan-50" },
  { name: "Personal Care", image: "https://benchmarkingcompany.com/wp-content/uploads/2022/06/shutterstock_2161999287.jpg", count: 40, slug: "personal-care", bg: "bg-pink-50" },
  { name: "Bread & Bakery", image: "https://d2gg9evh47fn9z.cloudfront.net/1600px_COLOURBOX4488041.jpg", count: 22, slug: "bread-bakery", bg: "bg-amber-50" },
  { name: "Dairy & Eggs", image: "https://thedairydish.com/wp-content/uploads/2016/07/094-6.jpg", count: 35, slug: "dairy-eggs", bg: "bg-blue-50" },
];

const CategoryGrid = () => {
  return (
    <section className="py-8 bg-card border-y border-border">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Categories</h2>
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-x-2 gap-y-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Link
                to={`/categories`}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg ${cat.bg} border border-border flex items-center justify-center overflow-hidden group-hover:shadow-md group-hover:border-primary/40 group-hover:scale-105 transition-all duration-200`}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-[10px] sm:text-xs text-foreground/80 group-hover:text-primary transition-colors text-center leading-tight">
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
