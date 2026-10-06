const V='sh-live-v1',SHELL=['./talp_react.html','./teacher_react.html','./manifest-student.json','./manifest-teacher.json','./icon-student-192.png','./icon-teacher-192.png'];
const LIBS=/^https:\/\/(cdnjs\.cloudflare\.com|www\.gstatic\.com\/firebasejs|unpkg\.com|fonts\.(googleapis|gstatic)\.com)\//;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // صفحات التطبيق: الشبكة أولاً ثم النسخة المخزنة عند انقطاع الاتصال
  if(u.origin===location.origin){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(s=>s.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('./talp_react.html'))));return}
  // مكتبات React وFirebase والخطوط: المخزن أولاً لتسريع الفتح
  if(LIBS.test(r.url)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(s=>s.put(r,c));return x})))}
  // البث والفيديو وقاعدة البيانات والتخزين: دائماً من الشبكة بدون تخزين
});
