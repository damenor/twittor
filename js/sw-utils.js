const updateCacheDynamic = (cacheName, req, res) => {
  if(res.ok){
    return caches.open(cacheName)
      .then(cache => {
        cache.put(req, res)
        return res.clone()
      })
  }else{
    return res
  }
}

const cleanCache = (cacheName, numeroItems) => {
  caches.open(cacheName)
    .then(cache => {
      cache.keys().then(keys => {
        if(keys.length > numeroItems){
          cache.delete(keys[0])
            .then(cleanCache(cacheName, numeroItems))
        }
      })
    })
}