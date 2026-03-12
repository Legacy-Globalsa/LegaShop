const http = require('https');
const urls = [
  "https://ph-test-11.slatic.net/p/eec131846bada270dd719a6b22b79e7c.jpg",
  "https://down-ph.img.susercontent.com/file/5ce451e06fa66f917b1ad7d88fbfaebb",
  "https://m.media-amazon.com/images/I/51bA+M9PzBL._SX300_SY300_QL70_FM27_.jpg",
  "https://m.media-amazon.com/images/I/71wLpW8-KqL._SY879_.jpg",
  "https://m.media-amazon.com/images/I/61r59SXYp8L._SX679_.jpg",
  "https://m.media-amazon.com/images/I/41DXYL7H3dL.jpg"
];
urls.forEach(u => {
  http.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => console.log(res.statusCode, u)).on('error', e => console.log('Error', u));
});
