/**
 * Confere a saúde do cofre: links quebrados, notas órfãs e o que é gerado.
 *
 *   node build/verificar-cofre.mjs
 */

import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, basename, relative } from "node:path";

const COFRE = process.env.COFRE || "C:/Users/bsanb/Documents/André - TI/Obsidian";

const arquivos = [];
(function varrer(d) {
  for (const f of readdirSync(d)) {
    if (f === ".obsidian") continue;
    const p = join(d, f);
    if (statSync(p).isDirectory()) varrer(p);
    else if (f.endsWith(".md")) arquivos.push(p);
  }
})(COFRE);

const nomeDe = (p) => basename(p, ".md");
const existentes = new Set(arquivos.map(nomeDe));

const quebrados = new Map();
const apontadas = new Set();
let totalLinks = 0, gerados = 0, seus = 0;

for (const p of arquivos) {
  const txt = readFileSync(p, "utf8");
  if (/^---\n(?:.*\n)*?gerado: true\n/m.test(txt)) gerados++; else seus++;

  for (const m of txt.matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)) {
    const alvo = m[1].trim();
    totalLinks++;
    apontadas.add(alvo);
    if (!existentes.has(alvo)) {
      if (!quebrados.has(alvo)) quebrados.set(alvo, []);
      quebrados.get(alvo).push(nomeDe(p));
    }
  }
}

const orfas = arquivos.map(nomeDe).filter((n) => !apontadas.has(n));

console.log(`\n${arquivos.length} notas · ${totalLinks} links internos`);
console.log(`  ${gerados} geradas pelo sincronizador · ${seus} suas\n`);

if (!quebrados.size) console.log("Links quebrados: nenhum.");
else {
  console.log(`LINKS QUEBRADOS — ${quebrados.size} alvo(s):\n`);
  [...quebrados.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([alvo, origens]) =>
      console.log(`  [[${alvo}]]  ${origens.length}x   ex.: ${origens[0]}`));
}

if (orfas.length) {
  console.log(`\nNOTAS QUE NINGUÉM CITA — ${orfas.length}:`);
  orfas.slice(0, 25).forEach((n) => console.log("  ·", n));
  if (orfas.length > 25) console.log(`  … e mais ${orfas.length - 25}`);
}
console.log("");
