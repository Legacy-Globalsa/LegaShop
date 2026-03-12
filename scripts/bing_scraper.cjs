const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getBingImageURL(query) {
  try {
    const res = await axios.get('https://www.bing.com/images/search?q=' + encodeURIComponent(query + ' product'), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
    // First try data-m
    const firstA = $('a.iusc').first();
    if (firstA.length) {
      const dataM = firstA.attr('m');
      if (dataM) {
         try {
           const parsed = JSON.parse(dataM);
           if (parsed.murl) return parsed.murl;
         } catch(e) {}
      }
    }
    
    const mimg = $('.mimg').first().attr('src');
    if (mimg && mimg.startsWith('http')) {
      return mimg;
    }
    
    return '';
  } catch(e) {
    return '';
  }
}

const products = [
  "Jasmine Rice 1kg", "Lucky Me Pancit Canton x3", "Century Tuna 155g", "Silver Swan Soy Sauce", "Milo Sachet x10", "Skyflakes Crackers",
  "Knorr Sinigang Mix", "Oishi Prawn Crackers", "Magic Sarap 8g x12", "Boy Bawang Cornick", "Ligo Sardines 155g",
  "Silver Swan Soy Sauce 1L", "Argentina Corned Beef 260g", "Bear Brand Milk 300g", "Nescafe 3in1 x10", "Purefoods Hotdog 500g", "CDO Karne Norte 260g",
  "Rice & Grains", "Canned Goods", "Noodles", "Snacks", "Beverages", "Condiments", "Frozen Foods", "Personal Care", "Bread & Bakery", "Dairy & Eggs"
];

async function run() {
  const result = {};
  for (const p of products) {
    console.log('Fetching', p);
    const url = await getBingImageURL(p);
    result[p] = url;
    // Delay to avoid ratelimit
    await new Promise(r => setTimeout(r, 500));
  }
  fs.writeFileSync('images_scraped.json', JSON.stringify(result, null, 2));
  console.log('Done!');
}

run();