const fs = require('fs');

const replacements = {
  // Jasmine Rice
  "https://etcheteras.com/wp-content/uploads/2022/09/299988533_637251320907759_5581874151244384039_n.jpeg": "https://images.openfoodfacts.org/images/products/885/135/138/1797/front_en.21.400.jpg",
  // Century Tuna
  "https://goodies.ph/wp-content/uploads/2024/04/334293383_2514388595379402_3918627583726256989_n.jpg": "https://images.openfoodfacts.org/images/products/074/848/510/0401/front_en.54.400.jpg",
  // Century Tuna x12 (maybe another URL to be safe, but they use axs-768x241) Let's replace the axs-768x241 as well
  "https://centurytuna.net/wp-content/uploads/2023/01/axs-768x241.png": "https://images.openfoodfacts.org/images/products/074/848/510/0401/front_en.54.400.jpg",
  // Milo Sachet
  "https://shoprite.ng/wp-content/uploads/2023/05/Beverage-Sachet-Milo-800G-3199.99-2899.99.jpg": "https://images.openfoodfacts.org/images/products/885/001/105/5375/front_en.3.400.jpg",
  // UFC Banana Ketchup - there are two different URLs:
  "https://www.carlsbadcravings.com/wp-content/uploads/2016/09/UFC-banana-ketchup-419x640.png": "https://images.openfoodfacts.org/images/products/480/777/012/2194/front_en.16.400.jpg",
  "https://down-th.img.susercontent.com/file/e4e1b1c75c9d26f04e58a7e9e15d5da8": "https://images.openfoodfacts.org/images/products/480/777/012/2194/front_en.16.400.jpg",
  // Safeguard Soap
  "https://i0.wp.com/www.sandronlinepilipinofoodsupplies.com/wp-content/uploads/2022/10/IMG-0608-scaled.jpg?fit=2560%2C1727&ssl=1": "https://images.openfoodfacts.org/images/products/490/243/081/4364/front_en.12.400.jpg",
  // Puregold Rice 5kg
  "https://lemcon-philippines.com/wp-content/uploads/2023/03/PUREGOLD-SUPERMARKETS-1280x1024.jpg": "https://images.openfoodfacts.org/images/products/480/488/182/6305/front_en.4.400.jpg"
};

const files = [
  "src/components/FlashDeals.tsx",
  "src/pages/CategoriesPage.tsx",
  "src/pages/OneSarDeals.tsx",
  "src/pages/FiveSarDeals.tsx",
  "src/components/FeaturedProducts.tsx",
  "src/pages/RemittancePage.tsx"
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [oldUrl, newUrl] of Object.entries(replacements)) {
      if (content.includes(oldUrl)) {
         content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
         changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
}
