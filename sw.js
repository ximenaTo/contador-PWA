//Definir el arreglo CACHE_ELEMENTS con todas las rutas que existan en el sitio web.
const CACHE_ELEMENTS = ["./","https://unpkg.com/react@17/umd/react.development.js",
"https://unpkg.com/react-dom@17/umd/react-dom.development.js",
"https://unpkg.com/@babel/standalone/babel.min.js","./style.css","./components/Contador.js"]
//Definimos el nombredel Cache
const CACHE_NAME = "v1_cache_contador_react";
self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(CACHE_ELEMENTS).then(() => {
            self.skipWaiting();
        }).catch(console.log);
    }));
});

//Trabajando con el siguiente evento del service worker llamado activate, en el que se define que hacer cuando se activa el service worker.
//El método keys devuelve todas las llaves en caso de que tengamos másde un cache instalado.
//Una vez que ya se activótodo mi caché y ya se está utilizando hay que reclamarlo
self.addEventListener("activate", (e) => {
    const cacheWhitelist = [CACHE_NAME];
    e.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map(cacheName => {
            return (cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName));
        }))
    })
    //Una vez que ya se activótodo mi caché y ya se está utilizando hay que reclamarlo
    .then(() => self.clients.claim()));
});

//Trabajando con el siguiente evento del service worker llamado fetch, 
//es el evento que se va a disparar cada que nosotros abramos el sitio,
// por ejemplo, lo que va a hacer buscará una nueva versión de nuestros archivos en cache, 
//y va a retornar las respuestas que tengan el caché activado. En caso de que se vaya a crear
// una nueva abra que hacer la petición y respondernos una nueva cosa.

self.addEventListener("fetch", (e) => {
    //Lo que haremos es comparar si es que ya existe el contenido de la ruta en el cache y si no lo agregamos al cache.
    e.respondWith(caches.match(e.request).then((res) => {
        if(res) {return res;
}return fetch(e.request);
}));
}
);