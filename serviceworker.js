var CACHE_NAME = 'latihan-pwa-cahce-v1';

var urlToCache = [
    '/',
    '/css/main.css',
    '/image/g5.png',
    '/js/jquery.min.js',
    '/js/main.js',
    '/manifest.json',
    '/fallback.json'
];

self.addEventListener('install', function(event){
    event.waitUntil(
            caches.open(CACHE_NAME).then(
                function(cahce) {
                    console.log("service worker do install...");
                    return cahce.addAll(urlToCache);
                }
            )
    )
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName !== CACHE_NAME;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);

    // memisahkan cache  file dengan cache data API
    if (url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function (response) {
                return response || fetch(request);
            })
        )
    } else{
        event.respondWith(
            caches.open('list-mahasiswa-cache-v1')
                .then(function (cache) {
                return fetch(request).then(function (liveRequest) {
                    cache.put(request, liveRequest.clone());
                    return liveRequest;
                }).catch(function () {
                    return caches.match(request)
                        .then(function (response) {
                        if (response) return response;
                        return caches.match('/fallback.json');
                    })
                })
            })
        )
    }

    /*
    event.respondWith(
        caches.match(event.request).then(function(response){
            console.log(response);
            if (response){
                return response;
            }
            return fetch(event.request);
        })
    )
    */
});


self.addEventListener('notificationclose',function (n) {
    var notification = n.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed Notification : ' + primaryKey);
});

self.addEventListener('notificationclick',function (n) {
    var notification = n.notification;
    var primaryKey = notification.data.primaryKey;
    var action = n.action;

    console.log('Notification : ' + primaryKey);
    if(action === 'close'){
        notification.close();
    }else {
        clients.openWindow('https://www.youtube.com/');
        notification.close();
    }
});