/* gerado por build/build.mjs — service worker do CHRONO */
const CACHE = "chrono-2026-09-08-mtsns94m";
const ARQUIVOS = [
  "./",
  "regras.html",
  "inimigos.html",
  "epocas.html",
  "index.html",
  "ficha.html",
  "mesa.html",
  "assets/css/fontes.css",
  "assets/css/chrono.css",
  "assets/css/paginas.css",
  "assets/css/formularios.css",
  "assets/js/indice.js",
  "assets/js/dados.js",
  "assets/js/app.js",
  "assets/js/agentes.js",
  "assets/js/ficha.js",
  "assets/js/mesa.js",
  "assets/selo.svg",
  "manifest.webmanifest",
  "assets/fontes/archivo-0.woff2",
  "assets/fontes/archivo-1.woff2",
  "assets/fontes/courier-prime-0.woff2",
  "assets/fontes/courier-prime-1.woff2",
  "assets/fontes/courier-prime-2.woff2",
  "assets/fontes/courier-prime-3.woff2",
  "assets/fontes/newsreader-2.woff2",
  "assets/fontes/newsreader-3.woff2",
  "assets/fontes/newsreader-italico-0.woff2",
  "assets/fontes/newsreader-italico-1.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function guardar(req, resp) {
  if (resp && resp.status === 200 && resp.type === "basic") {
    const copia = resp.clone();
    caches.open(CACHE).then((c) => c.put(req, copia));
  }
  return resp;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Páginas: rede primeiro, para que uma regra corrigida apareça na hora.
  // Sem rede, o cache responde — é a mesa no porão sem sinal.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((resp) => guardar(req, resp))
        .catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
    );
    return;
  }

  // Estilo, script e imagem: responde do cache na hora e atualiza por trás.
  e.respondWith(
    caches.match(req).then((guardado) => {
      const rede = fetch(req).then((resp) => guardar(req, resp)).catch(() => guardado);
      return guardado || rede;
    })
  );
});
