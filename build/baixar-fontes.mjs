/**
 * Traz as fontes para dentro do projeto.
 *
 *   node build/baixar-fontes.mjs
 *
 * Duas razões, e as duas importam:
 *  1. Offline. O service worker só guarda o que é do próprio domínio; com as
 *     fontes no Google, o site abre no porão sem sinal com a tipografia errada.
 *  2. A página parava de pular. Servidas daqui, elas chegam junto com o CSS.
 *
 * Roda uma vez. Só precisa rodar de novo se você trocar de família.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(RAIZ, "assets", "fontes");

// UA de navegador atual, senão o Google devolve TTF em vez de WOFF2
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

const FAMILIAS = [
  { nome: "Archivo", consulta: "Archivo:wdth,wght@62..125,100..900" },
  { nome: "Newsreader", consulta: "Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400" },
  { nome: "Courier Prime", consulta: "Courier+Prime:wght@400;700" },
];

// só os alfabetos que o português usa
const SUBCONJUNTOS = ["latin", "latin-ext"];

mkdirSync(DESTINO, { recursive: true });

const arquivo = (s) => s.split("/").pop().split("?")[0];
const nomeSeguro = (familia, i, italico) =>
  `${familia.toLowerCase().replace(/\s+/g, "-")}${italico ? "-italico" : ""}-${i}.woff2`;

let css = [
  "@charset \"utf-8\";",
  "/* Gerado por build/baixar-fontes.mjs — não edite à mão. */",
  "",
];
let baixados = 0;

for (const familia of FAMILIAS) {
  const url = `https://fonts.googleapis.com/css2?family=${familia.consulta}&display=swap`;
  const resp = await fetch(url, { headers: { "user-agent": UA } });
  if (!resp.ok) throw new Error(`Google respondeu ${resp.status} para ${familia.nome}`);
  const fonte = await resp.text();

  /* O comentário com o nome do subconjunto vem ANTES do @font-face, não
     dentro dele. Casar os dois juntos evita pegar o rótulo do bloco anterior
     e acabar baixando alfabeto que o português não usa. */
  const blocos = [...fonte.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)];
  let i = 0;

  for (const [, nomeSub, bloco] of blocos) {
    if (!SUBCONJUNTOS.includes(nomeSub)) continue;

    const src = bloco.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!src) continue;

    const italico = /font-style:\s*italic/.test(bloco);
    const peso = (bloco.match(/font-weight:\s*([^;]+);/) || [, "400"])[1].trim();
    const largura = (bloco.match(/font-stretch:\s*([^;]+);/) || [, ""])[1].trim();
    const faixa = (bloco.match(/unicode-range:\s*([^;]+);/) || [, ""])[1].trim();

    const alvo = nomeSeguro(familia.nome, i++, italico);
    const bin = await fetch(src[1], { headers: { "user-agent": UA } });
    writeFileSync(join(DESTINO, alvo), Buffer.from(await bin.arrayBuffer()));
    baixados++;

    css.push(
      "@font-face {",
      `  font-family: "${familia.nome}";`,
      `  src: url("../fontes/${alvo}") format("woff2");`,
      `  font-weight: ${peso};`,
      italico ? "  font-style: italic;" : "  font-style: normal;",
      largura ? `  font-stretch: ${largura};` : "",
      "  font-display: swap;",
      faixa ? `  unicode-range: ${faixa};` : "",
      "}",
      ""
    );
    console.log(`  ${alvo}  (${familia.nome} ${peso}${italico ? " itálico" : ""}${nomeSub ? " · " + nomeSub : ""})`);
  }
}

writeFileSync(join(RAIZ, "assets", "css", "fontes.css"), css.filter((l) => l !== "").join("\n") + "\n", "utf8");
console.log(`\n${baixados} arquivos em assets/fontes/ e o assets/css/fontes.css gerado.`);
