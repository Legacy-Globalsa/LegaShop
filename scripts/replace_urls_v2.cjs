const fs = require('fs');

const replacements = {
  // Jasmine Rice
  "https://etcheteras.com/wp-content/uploads/2022/09/299988533_637251320907759_5581874151244384039_n.jpeg": "https://m.media-amazon.com/images/I/81I-u8sI+bL._AC_UF894,1000_QL80_.jpg",
  // Century Tuna
  "https://goodies.ph/wp-content/uploads/2024/04/334293383_2514388595379402_3918627583726256989_n.jpg": "https://m.media-amazon.com/images/I/71wLpW8-KqL._SL1500_.jpg",
  "https://centurytuna.net/wp-content/uploads/2023/01/axs-768x241.png": "https://m.media-amazon.com/images/I/71wLpW8-KqL._SL1500_.jpg",
  // Milo Sachet
  "https://shoprite.ng/wp-content/uploads/2023/05/Beverage-Sachet-Milo-800G-3199.99-2899.99.jpg": "https://m.media-amazon.com/images/I/61b7X-A6T1L._SL1500_.jpg",
  // UFC Banana Ketchup
  "https://www.carlsbadcravings.com/wp-content/uploads/2016/09/UFC-banana-ketchup-419x640.png": "https://m.media-amazon.com/images/I/412p1x9V2XL.jpg",
  "https://down-th.img.susercontent.com/file/e4e1b1c75c9d26f04e58a7e9e15d5da8": "https://m.media-amazon.com/images/I/412p1x9V2XL.jpg",
  // Safeguard Soap
  "https://i0.wp.com/www.sandronlinepilipinofoodsupplies.com/wp-content/uploads/2022/10/IMG-0608-scaled.jpg?fit=2560%2C1727&ssl=1": "https://m.media-amazon.com/images/I/61r59SXYp8L._SL1500_.jpg",
  // Puregold Rice 5kg
  "https://lemcon-philippines.com/wp-content/uploads/2023/03/PUREGOLD-SUPERMARKETS-1280x1024.jpg": "https://m.media-amazon.com/images/I/81wndD34-dL._AC_SL1500_.jpg"
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
    for (let [oldUrl, newUrl] of Object.entries(replacements)) {
      if (content.includes(oldUrl)) {
         content = content.split(oldUrl).join(newUrl);
         changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(file, content);
      console.log(`Updated ${file}`);
    }
  }
}
