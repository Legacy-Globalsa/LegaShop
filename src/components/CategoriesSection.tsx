import { motion } from "framer-motion";

const categories = [
  { name: "Rice & Grains", image: "https://thairiceandfoods.com/wp-content/uploads/2017/07/rice-grains-4.jpg", count: 45 },
  { name: "Canned Goods", image: "https://img.lazcdn.com/g/p/104d717f25c8edb8b032046b7d6e52b1.jpg_720x720q80.jpg", count: 120 },
  { name: "Noodles", image: "https://image.shutterstock.com/shutterstock/photos/1626667372/display_1500/stock-photo-instant-noodles-product-design-concept-idea-for-advertising-and-packaging-hot-cooked-instant-1626667372.jpg", count: 38 },
  { name: "Snacks", image: "https://firstbase.in/phpfiles/2020/05/Indian_Snacks_tea_food_Packaging_Design_Agency_Delhi_Mumbai_India_London.jpg", count: 85 },
  { name: "Beverages", image: "https://cdn.dribbble.com/userupload/10815913/file/original-ba06d917a302ebfbcb6b76c28c5e1b87.jpg?resize=808x632", count: 60 },
  { name: "Condiments", image: "https://img.thrivemarket.com/catalog/category/condiments_and_sauces_mobile_1.jpg", count: 55 },
  { name: "Frozen", image: "https://cdn.frozen-packaging.com/category/7/image/2024/02/23/717043c6514322c9837ae09d666c834d.png", count: 30 },
  { name: "Personal Care", image: "https://benchmarkingcompany.com/wp-content/uploads/2022/06/shutterstock_2161999287.jpg", count: 40 },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-16 bg-sky-50/50 border-b border-border">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-foreground mb-10 text-center"
        >
          Explore Categories
        </motion.h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-y-8 gap-x-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2, delay: 0 } }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-sm border border-border flex items-center justify-center overflow-hidden group-hover:shadow-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">{cat.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{cat.count} items</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
