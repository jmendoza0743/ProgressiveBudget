const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';


//stores the info to the local machine
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  
  '/index.js',
  '/db.js',
  '/styles.css',
];

// installs the service worker
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      console.log('caching shell assets');
      return cache.addAll(FILES_TO_CACHE);
    })
  ); 
  self.skipWaiting();
});


//activates the service worker 
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
        return Promise.all(
            keyList.map( key => {
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                    console.log('Removing old cache data', key);
                    return caches.delete(key);
                }
            })
        );
    })
  );
  self.clients.claim();
});


// if the computer is offline then it will fetch off of the service worker
self.addEventListener("fetch", function(evt){
  if (evt.request.url.includes('/api/')) {
    console.log('[Service Worker] Fetch (data)', evt.request.url);

    evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
            return fetch(evt.request)
                .then(response  => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
        })
    );

    return;
}


// if online it will connect with the online db if no connection then it will fetch off of the local DB. 
evt.respondWith(
    caches.open(CACHE_NAME).then( cache => {
        return cache.match(evt.request).then(response => {
            return response || fetch(evt.request)
        });

    })
);
})