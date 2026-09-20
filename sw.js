const CACHE='eusem-bmpm-2026-09-20-4';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const isDoc = req.mode==='navigate' || req.destination==='document';
  if(isDoc){
    // network-first so updates show immediately; fall back to cache offline
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));return r;})
      .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  } else {
    // cache-first for static assets, refresh in background
    e.respondWith(caches.match(req).then(r=> r || fetch(req).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(req,c));return res;})));
  }
});
