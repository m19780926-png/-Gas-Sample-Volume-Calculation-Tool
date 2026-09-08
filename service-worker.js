const CACHE_NAME = "gas-tool-cache-v7";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./lel.csv"
];

// インストール
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// 新しいService Workerをすぐ有効化
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// HTMLとLEL.csvは「ネット優先」
self.addEventListener("fetch", event => {

  // GET以外は何もしない
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  // HTMLページ
  const isHTML =
    event.request.mode === "navigate" ||
    url.pathname.endsWith("/index.html");

  // LEL.csv
  const isLEL =
    url.pathname.endsWith("/lel.csv");

  // HTMLとLEL.csvはネット優先
  if (isHTML || isLEL) {

    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {

          // 最新データをキャッシュにも保存
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copy);
            });
          }

          return response;
        })
        .catch(() => {
          // オフラインならキャッシュを使用
          return caches.match(event.request);
        })
    );

    return;
  }

  // その他のファイルはキャッシュ優先
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
