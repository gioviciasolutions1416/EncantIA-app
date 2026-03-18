const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1545631899-277ba5ce95ee?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1525626242-cf3feffa05bc?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1521124446342-a8c6ebf8b656?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1518199268324-5412762e3657?auto=format&fit=crop&q=80&w=1400'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
        console.log(`${url} -> HTTP ${res.statusCode} | ${res.headers['content-type']}`);
        resolve();
    }).on('error', (e) => {
        console.log(`${url} -> Error: ${e.message}`);
        resolve();
    });
  });
}

(async () => {
    for(const u of urls) {
        await checkUrl(u);
    }
})();
