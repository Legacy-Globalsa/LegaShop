const fs = require('fs');

const images1 = JSON.parse(fs.readFileSync('images_scraped.json', 'utf8'));
const images2 = JSON.parse(fs.readFileSync('images2_scraped.json', 'utf8'));

const allImages = { ...images1, ...images2 };

let categoriesContent = fs.readFileSync('src/pages/CategoriesPage.tsx', 'utf8');

// Replace { name: "...", price: "...", emoji: "...", rating: ...} with image: "..."
// We use a regex.
categoriesContent = categoriesContent.replace(/name:\s*"([^"]+)",([^}]+?)emoji:\s*"[^"]+"/g, (match, name, contentBeforeEmoji) => {
  const imageUrl = allImages[name];
  if (imageUrl) {
    return `name: "${name}",${contentBeforeEmoji}image: "${imageUrl}"`;
  }
  return match; // fallback
});

// Update the render
categoriesContent = categoriesContent.replace(
  /{product\.emoji}/g,
  '<img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />'
);
fs.writeFileSync('src/pages/CategoriesPage.tsx', categoriesContent);

let remittanceContent = fs.readFileSync('src/pages/RemittancePage.tsx', 'utf8');
remittanceContent = remittanceContent.replace(/name:\s*"([^"]+)",([^}]+?)emoji:\s*"[^"]+"/g, (match, name, contentBeforeEmoji) => {
  const imageUrl = allImages[name];
  if (imageUrl) {
    return `name: "${name}",${contentBeforeEmoji}image: "${imageUrl}"`;
  }
  return match; // fallback
});

remittanceContent = remittanceContent.replace(
  /{product\.emoji}/g,
  '<img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />'
);
fs.writeFileSync('src/pages/RemittancePage.tsx', remittanceContent);

console.log('Done!');
