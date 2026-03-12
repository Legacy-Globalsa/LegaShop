const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getBingImageURL(query) {
  try {
    const res = await axios.get('https://www.bing.com/images/search?q=' + encodeURIComponent(query + ' product philippines'), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
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
  "Sinandomeng Rice 5kg", "Pancit Canton Classic", "Cup Noodles Mini", "Piattos Cheese 85g", "C2 Green Tea 500ml", "Datu Puti Vinegar",
  "Tender Juicy Hotdog", "Joy Dishwashing Liquid", "Safeguard Soap", "Palmolive Shampoo 15ml x6",
  "Puregold Rice 5kg", "Lucky Me Noodles x24", "Century Tuna x12", "Argentina Corned Beef x6", "Bear Brand Milk 1kg",
  "Nescafe 3in1 x30", "Safeguard Soap x6", "Joy Dishwashing 500ml", "Del Monte Ketchup 1L", "Silver Swan Soy 1L",
  "CDO Ulam Burger x8", "Purefoods TJ Hotdog 1kg", "Thai Jasmine Rice 2kg", "Argentina Corned Beef"
];

async function run() {
  const result = {};
  for (const p of products) {
    console.log('Fetching', p);
    const url = await getBingImageURL(p);
    result[p] = url;
    await new Promise(r => setTimeout(r, 500));
  }
  fs.writeFileSync('images2_scraped.json', JSON.stringify(result, null, 2));
  console.log('Done!');
}

run();