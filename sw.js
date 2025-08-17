const CACHE_NAME = 'idol-diary-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/backend.js',
  './js/config.js',
  './js/demo-data.js',
  './js/third-party.js',
  './img/bg.jpg',
  './img/11.jpg',
  './img/22.jpg',
  './img/33.jpg',
  './img/44.jpg',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/icon-144.jpg',
  './img/icon-192.jpg',
  './img/icon-512.jpg',
  './img/icon.jpg',
  './img/default-avatar.jpg',
  './img/bg_music.mp3',
  './manifest.json'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有响应，返回缓存的响应
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request).then(
          response => {
            // 检查响应是否有效
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      }
    )
  );
});

// 处理推送通知
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '你有新的偶像动态！',
    icon: './img/icon.jpg',
    badge: './img/icon.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: './img/icon.jpg'
      },
      {
        action: 'close',
        title: '关闭',
        icon: './img/icon.jpg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('再一，再二，再三', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});
