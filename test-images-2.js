const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1400',
  'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&q=80&w=1400'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
        console.log(`${url} -> HTTP ${res.statusCode}`);
        resolve();
    }).on('error', (e) => {
        resolve();
    });
  });
}

(async () => {
    for(const u of urls) {
        await checkUrl(u);
    }
})();
