//fonti: 
//https://www.youtube.com/watch?v=Vz1D28zshaI&ab_channel=NetNinja
//https://www.youtube.com/watch?v=kT3qSf7jG5c&ab_channel=NetNinja
//https://www.youtube.com/watch?v=0mAw9Na6hyM&ab_channel=NetNinja

const CACHE_NAME = 'my-pwa-cache-v2';
var urlsToCache = [
    '/',
    '/index.html',
    '/script/script.js',
    '/style/style.css',
    'img/GIF-Disco.gif',
    'img/GIF-Multicolor.gif',
    'img/IMG-(1).jpg',
    'img/IMG-(2).jpg',
    'img/IMG-(3).jpg',
    'img/IMG-(4).jpg',
    'img/IMG-(5).jpg',
    'img/IMG-(6).jpg',
    'img/IMG-(7).jpg',
    'img/IMG-(8).jpg',
    'img/IMG-(9).jpg',
    'img/IMG-(10).jpg',
    'img/IMG-(11).jpg',
    'img/IMG-(12).jpg',
    'img/IMG-(13).jpg',
    'img/IMG-(14).jpg',
    'img/IMG-(15).jpg',
    'img/IMG-(16).jpg',
    'img/ico/light.ico'
];


// Evento di installazione del service worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("caching....")
            cache.addAll(urlsToCache);
        })
    );    
});


// Evento di attivazione del service worker
self.addEventListener('activate', function(event) {

});

// Evento di fetch delle risorse
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(response => {
        // Se la risorsa è già in cache, restituisci la copia dalla cache
        if (response) {
          return response;
        }

        // Altrimenti se non è presente cache restituisce esegui una richiesta di rete per recuperare la risorsa
        return fetch(event.request);
      }
    )
  );
});
