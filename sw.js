importScripts('js/sw-utils.js')

const CACHE_STATIC = 'static-v1'
const CACHE_DYNAMIC = 'dynamic-v1'
const CACHE_INMUTABLE = 'inmutable-v1'

const APP_SHELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/spiderman.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/wolverine.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/hulk.jpg',
  'js/app.js',
  'js/sw-utils.js'
]

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
]

self.addEventListener('install', e => {

  const promiseOpenCacheInmutable = caches.open(CACHE_INMUTABLE).then(cache => cache.addAll(APP_SHELL_INMUTABLE))
  const promiseOpenCacheStatic = caches.open(CACHE_STATIC).then(cache => cache.addAll(APP_SHELL))

  e.waitUntil(Promise.all([
    promiseOpenCacheInmutable,
    promiseOpenCacheStatic
  ]))
})

self.addEventListener('activate', e => {
  const deleteOldCachePromise = caches.keys()
    .then(keys => {
      const isNewCache = (key) => key !== CACHE_DYNAMIC && key !== CACHE_INMUTABLE && key !== CACHE_STATIC
      const cachesOlds = keys.filter(key =>  isNewCache(key) ? key : null)
      cachesOlds.map(cacheOldKey => caches.delete(cacheOldKey))
      console.log(cachesOlds)
    })
  e.waitUntil(deleteOldCachePromise)
})

self.addEventListener('fetch', e =>  {
  const responseCaches = caches.match(e.request)
    .then(res => res ? res: fetch(e.request).then(newRes => updateCacheDynamic(CACHE_DYNAMIC, e.request, newRes)))
  e.respondWith(responseCaches)
})