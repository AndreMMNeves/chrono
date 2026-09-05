/**
 * Servidor estático mínimo para ver o site local.
 *
 *   node build/servir.mjs        →  http://localhost:4173
 *
 * Só para desenvolvimento. Em produção o site é arquivo estático puro.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORTA = Number(process.env.PORTA || 4173);

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".md": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

createServer(async (req, res) => {
  try {
    let caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (caminho.endsWith("/")) caminho += "index.html";
    const alvo = join(RAIZ, normalize(caminho).replace(/^(\.\.[/\\])+/, ""));
    if (!alvo.startsWith(RAIZ)) { res.writeHead(403).end("403"); return; }

    await stat(alvo);
    const corpo = await readFile(alvo);
    res.writeHead(200, {
      "content-type": TIPOS[extname(alvo).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-cache",
    });
    res.end(corpo);
  } catch (e) {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404</h1><p>Não achei esse arquivo. Rodou <code>node build/build.mjs</code>?</p>");
  }
}).listen(PORTA, () => console.log(`\n  CHRONO em http://localhost:${PORTA}\n`));
