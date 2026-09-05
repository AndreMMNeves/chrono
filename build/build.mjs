#!/usr/bin/env node
/**
 * CHRONO — gerador do site.
 *
 *   node build/build.mjs
 *
 * Lê os markdowns de fontes/, monta as páginas dos livros, monta as páginas
 * escritas à mão a partir de build/paginas/ e gera o índice de busca.
 * Sem dependências: só Node 18+.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = (p) => readFileSync(join(RAIZ, p), "utf8");
const escrever = (p, txt) => {
  mkdirSync(dirname(join(RAIZ, p)), { recursive: true });
  writeFileSync(join(RAIZ, p), txt, "utf8");
  console.log("  ·", p, `(${(Buffer.byteLength(txt) / 1024).toFixed(1)} KB)`);
};

/* ==========================================================================
   Configuração do site
   ========================================================================== */

const SITE = {
  titulo: "CHRONO",
  descricao:
    "RPG de mesa de viagem no tempo. Você morreu, e é por isso que consegue andar pelo passado. Livro de regras, bestiário, guia de épocas, ficha interativa e painel de mestre.",
  url: "https://andremmneves.github.io/chrono/",
  autor: "CHRONO",
  versao: new Date().toISOString().slice(0, 10),
};

const LIVROS = [
  {
    id: "regras",
    fonte: "CHRONO_Livro_de_Regras.md",
    arquivo: "regras.html",
    nav: "Regras",
    titulo: "Livro de Regras",
    resumo:
      "O motor de dados, a criação de personagem, Esforço e Instabilidade, Discernimento, as cinco classes, trauma, sacrifício, viagem e a Agência.",
    ref: "VOL. I",
  },
  {
    id: "inimigos",
    fonte: "CHRONO_Livro_dos_Inimigos.md",
    arquivo: "inimigos.html",
    nav: "Inimigos",
    titulo: "Livro dos Inimigos",
    resumo:
      "A régua de Grau, dezoito fichas em cinco famílias e quatro anomalias prontas para rodar hoje à noite.",
    ref: "VOL. II",
  },
  {
    id: "epocas",
    fonte: "CHRONO_Guia_de_Epocas.md",
    arquivo: "epocas.html",
    nav: "Épocas",
    titulo: "Guia de Épocas",
    resumo:
      "Onze épocas jogáveis: o que existe, o que denuncia um agente, o que vale mais que dinheiro e o gancho de anomalia de cada século.",
    ref: "VOL. III",
  },
];

const NAV = [
  { href: "index.html", rotulo: "Início", id: "inicio" },
  { href: "regras.html", rotulo: "Regras", id: "regras" },
  { href: "inimigos.html", rotulo: "Inimigos", id: "inimigos" },
  { href: "epocas.html", rotulo: "Épocas", id: "epocas" },
  { href: "ficha.html", rotulo: "Ficha", id: "ficha" },
  { href: "mesa.html", rotulo: "Mesa", id: "mesa" },
];

/* ==========================================================================
   Utilidades de texto
   ========================================================================== */

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const ROMANOS = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10,
  XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16, XVII: 17, XVIII: 18,
  XIX: 19, XX: 20,
};

/* ==========================================================================
   Inline: negrito, itálico, código e notação de dado clicável
   ========================================================================== */

// 2d6+4 · 1d100 · d20 · 3d8 — a ordem da alternância importa (100 antes de 10).
const RE_DADO = /(?<![\w.])(\d{0,2})d(100|20|12|10|8|6|4)(?![\w.])(\s*[+-]\s*\d+)?/g;

function marcarDados(html) {
  return html.replace(RE_DADO, (todo, qtd, faces, mod) => {
    const q = qtd === "" ? 1 : Number(qtd);
    if (q > 12) return todo; // "d100" já coberto; nada absurdo vira botão
    const m = mod ? mod.replace(/\s+/g, "") : "";
    const notacao = `${q}d${faces}${m}`;
    return `<button type="button" class="dado" data-d="${notacao}" title="Rolar ${notacao}">${todo}</button>`;
  });
}

function inline(txt, { dados = true } = {}) {
  const codigos = [];
  let s = esc(txt);

  // trechos em `código` saem de cena para não sofrerem as demais regras
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    codigos.push(c);
    return `\ue000${codigos.length - 1}\ue000`;
  });

  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");

  if (dados) s = marcarDados(s);

  s = s.replace(/\ue000(\d+)\ue000/g, (_, i) => `<code>${codigos[Number(i)]}</code>`);
  return s;
}

/* ==========================================================================
   Blocos: markdown → HTML
   ========================================================================== */

function ehSeparadorTabela(linha) {
  return /^\|?[\s:|-]+\|[\s:|-]*$/.test(linha) && linha.includes("-");
}

function celulas(linha) {
  return linha
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function tabela(linhas) {
  const cab = celulas(linhas[0]);
  const corpo = linhas.slice(2).map(celulas);
  // "| d6 | |" — cabeçalho sem conteúdo útil vira tabela de resultado
  const semCabecalho = cab.slice(1).every((c) => c === "");
  const cls = semCabecalho ? ' class="resultado"' : "";

  const thead = `<thead><tr>${cab
    .map((c) => `<th scope="col">${inline(c, { dados: false })}</th>`)
    .join("")}</tr></thead>`;

  const tbody = `<tbody>${corpo
    .map(
      (linha) =>
        `<tr>${linha
          .map((c, i) =>
            i === 0
              ? `<th scope="row">${inline(c)}</th>`
              : `<td>${inline(c)}</td>`
          )
          .join("")}</tr>`
    )
    .join("")}</tbody>`;

  return `<div class="tabela-rolo"><table${cls}>${thead}${tbody}</table></div>`;
}

function lista(itens, ordenada) {
  const tag = ordenada ? "ol" : "ul";
  return `<${tag}>${itens.map((i) => `<li>${inline(i)}</li>`).join("")}</${tag}>`;
}

/**
 * Converte o markdown de um livro numa árvore de partes e seções.
 */
function converter(md, livro) {
  const linhas = md.split(/\r?\n/);
  const partes = [];
  const idsUsados = new Set();

  let parteAtual = null;
  let secaoAtual = null;
  let subtitulo = "";
  let i = 0;

  const idUnico = (base) => {
    let id = base || "s";
    let n = 2;
    while (idsUsados.has(id)) id = `${base}-${n++}`;
    idsUsados.add(id);
    return id;
  };

  const alvo = () => {
    if (secaoAtual) return secaoAtual.blocos;
    if (parteAtual) return parteAtual.intro;
    if (!partes.length) {
      parteAtual = { id: idUnico("abertura"), titulo: "", numero: "", intro: [], secoes: [] };
      partes.push(parteAtual);
    }
    return parteAtual.intro;
  };

  const empurrar = (html) => alvo().push(html);

  while (i < linhas.length) {
    const linha = linhas[i];
    const cru = linha.trim();

    // --- vazio ---
    if (!cru) { i++; continue; }

    // --- bloco de código ---
    if (cru.startsWith("```")) {
      const buffer = [];
      i++;
      while (i < linhas.length && !linhas[i].trim().startsWith("```")) {
        buffer.push(linhas[i]);
        i++;
      }
      i++;
      empurrar(`<pre><code>${esc(buffer.join("\n"))}</code></pre>`);
      continue;
    }

    // --- régua ---
    if (/^-{3,}$/.test(cru)) { i++; continue; }

    // --- títulos ---
    const t = cru.match(/^(#{1,4})\s+(.*)$/);
    if (t) {
      const nivel = t[1].length;
      const texto = t[2].trim();

      if (nivel === 1) { i++; continue; } // "# CHRONO" — já está no cabeçalho

      if (nivel === 3 && !subtitulo && !partes.length) {
        subtitulo = texto.replace(/^#+\s*/, ""); // "Livro de Regras — v2.0"
        i++;
        continue;
      }

      if (nivel === 2) {
        const m = texto.match(/^PARTE\s+([IVXL]+)\s*[—–-]\s*(.*)$/i);
        const numero = m ? `PARTE ${m[1]}` : "";
        const titulo = m ? m[2].trim() : texto;
        const base = m ? `parte-${String(ROMANOS[m[1].toUpperCase()] ?? m[1]).padStart(2, "0")}` : slug(texto);
        parteAtual = { id: idUnico(base), numero, titulo, intro: [], secoes: [] };
        secaoAtual = null;
        partes.push(parteAtual);
        i++;
        continue;
      }

      // nível 3 e 4 — seções
      if (!parteAtual) {
        parteAtual = { id: idUnico("abertura"), numero: "", titulo: "", intro: [], secoes: [] };
        partes.push(parteAtual);
      }
      const num = texto.match(/^(\d+\.\d+)\s+(.*)$/);
      const rotulo = num ? num[1] : "";
      const titulo = num ? num[2].trim() : texto;
      const base = num ? `s-${num[1].replace(".", "-")}` : slug(texto);
      secaoAtual = {
        id: idUnico(base),
        numero: rotulo,
        titulo,
        nivel,
        blocos: [],
      };
      parteAtual.secoes.push(secaoAtual);
      i++;
      continue;
    }

    // --- tabela ---
    if (cru.startsWith("|") && ehSeparadorTabela((linhas[i + 1] || "").trim())) {
      const buffer = [];
      while (i < linhas.length && linhas[i].trim().startsWith("|")) {
        buffer.push(linhas[i].trim());
        i++;
      }
      empurrar(tabela(buffer));
      continue;
    }

    // --- citação ---
    if (cru.startsWith(">")) {
      const buffer = [];
      while (i < linhas.length && linhas[i].trim().startsWith(">")) {
        buffer.push(linhas[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const paras = buffer
        .join("\n")
        .split(/\n{2,}/)
        .map((p) => `<p>${inline(p.replace(/\n/g, " "))}</p>`)
        .join("");
      empurrar(`<blockquote>${paras}</blockquote>`);
      continue;
    }

    // --- listas ---
    const marcador = cru.match(/^([-*]|\d+\.)\s+(.*)$/);
    if (marcador) {
      const ordenada = /^\d+\./.test(marcador[1]);
      const itens = [];
      while (i < linhas.length) {
        const l = linhas[i].trim();
        const m = l.match(/^([-*]|\d+\.)\s+(.*)$/);
        if (m && /^\d+\./.test(m[1]) === ordenada) {
          itens.push(m[2]);
          i++;
        } else if (l && !l.startsWith("|") && itens.length && linhas[i].startsWith("  ")) {
          itens[itens.length - 1] += " " + l; // continuação indentada
          i++;
        } else break;
      }
      empurrar(lista(itens, ordenada));
      continue;
    }

    // --- parágrafo ---
    const buffer = [];
    while (i < linhas.length) {
      const l = linhas[i].trim();
      if (!l || /^(#{1,4}\s|```|>|\||-{3,}$)/.test(l) || /^([-*]|\d+\.)\s/.test(l)) break;
      buffer.push(l);
      i++;
    }
    const texto = buffer.join(" ");
    // lema de classe: "*Você é a razão pela qual a coisa para.* — Corpo, Reflexo"
    const ehLema = /^\*[^*]+\*\s*[—–]/.test(texto);
    empurrar(`<p${ehLema ? ' class="lema"' : ""}>${inline(texto)}</p>`);
  }

  return { partes: partes.filter((p) => p.intro.length || p.secoes.length), subtitulo };
}

/* ==========================================================================
   Montagem do HTML
   ========================================================================== */

const ICONE_SELO = `<svg class="selo" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="1.4" y="1.4" width="13.2" height="13.2"/><path d="M8 4.4V8l2.6 1.7"/></svg>`;

function cabecalho(atual) {
  const links = NAV.filter((n) => n.id !== "inicio")
    .map(
      (n) =>
        `<a href="${n.href}"${n.id === atual ? ' aria-current="page"' : ""}>${n.rotulo}</a>`
    )
    .join("");

  return `<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="barra">
  <a class="barra-marca" href="index.html">${ICONE_SELO}<span class="marca">Chrono</span></a>
  <nav class="barra-nav" aria-label="Livros e ferramentas">${links}</nav>
  <div class="barra-acoes">
    <div class="barra-busca">
      <button type="button" class="barra-btn" id="abrir-busca" aria-label="Buscar nos três livros" aria-keyshortcuts="Control+K">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/></svg>
        <span class="rotulo">Buscar</span>
      </button>
      <kbd class="barra-atalho" aria-hidden="true">Ctrl K</kbd>
    </div>
    <button type="button" class="barra-btn" id="alternar-tema" aria-label="Alternar entre papel e Zona">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="8" r="5"/><path d="M8 3v10" /><path d="M8 3a5 5 0 0 1 0 10" fill="currentColor" stroke="none"/></svg>
      <span class="rotulo" data-rotulo-tema>Zona</span>
    </button>
  </div>
</header>`;
}

function rodape() {
  const links = NAV.map((n) => `<a href="${n.href}">${n.rotulo}</a>`).join("");
  return `<footer class="rodape">
  <p>CHRONO · sistema autoral · faça o que quiser com ele na sua mesa.</p>
  <nav aria-label="Rodapé">${links}</nav>
</footer>`;
}

const BUSCA = `<div class="busca-fundo" id="busca" hidden>
  <div class="busca" role="dialog" aria-modal="true" aria-label="Buscar nos livros">
    <div class="busca-topo">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/></svg>
      <input type="search" id="busca-campo" placeholder="Buscar regra, inimigo, época…" autocomplete="off" spellcheck="false" aria-label="Termo de busca" aria-controls="busca-lista">
      <button type="button" class="btn btn-fantasma btn-mini" data-fechar-busca>Esc</button>
    </div>
    <ul class="busca-lista" id="busca-lista" role="listbox" aria-label="Resultados"></ul>
    <div class="busca-rodape">
      <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
      <span><kbd>↵</kbd> abrir</span>
      <span><kbd>esc</kbd> fechar</span>
    </div>
  </div>
</div>`;

const DADOS = `<button type="button" class="dados-botao" id="abrir-dados" aria-expanded="false" aria-controls="dados-painel" aria-label="Abrir rolador de dados" title="Rolador de dados">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2.4 21 7.2v9.6L12 21.6 3 16.8V7.2z"/><path d="M3 7.2 12 12l9-4.8M12 12v9.6"/></svg>
</button>
<div class="dados-painel" id="dados-painel" hidden>
  <div class="dados-cab">
    <span class="etiqueta">Rolador</span>
    <span>
      <button type="button" class="btn btn-fantasma btn-mini" id="limpar-dados">Limpar</button>
      <button type="button" class="btn btn-fantasma btn-mini" data-fechar-dados aria-label="Fechar rolador">Fechar</button>
    </span>
  </div>
  <div class="dados-atalhos" id="dados-atalhos"></div>
  <form class="dados-form" id="dados-form">
    <div><label for="dados-notacao">Dado</label><input type="text" id="dados-notacao" value="1d20" inputmode="text" spellcheck="false"></div>
    <div><label for="dados-alvo">ND / limiar</label><input type="number" id="dados-alvo" placeholder="—" inputmode="numeric"></div>
    <button type="submit" class="btn btn-mini" style="height:2.1rem">Rolar</button>
  </form>
  <ul class="dados-log" id="dados-log" aria-live="polite" aria-label="Histórico de rolagens"></ul>
</div>`;

/** Nome do arquivo de uma página, para canonical e og:url. */
function arquivoDe(id) {
  const n = NAV.find((x) => x.id === id);
  return n ? n.href : `${id}.html`;
}

function pagina({ id, titulo, descricao, corpo, classe = "", extraCabeca = "", extraScript = "", dados = true }) {
  const tituloCompleto = id === "inicio" ? `${SITE.titulo} — RPG de mesa de viagem no tempo` : `${titulo} · ${SITE.titulo}`;
  return `<!doctype html>
<html lang="pt-BR" data-pagina="${id}"${classe ? ` class="${classe}"` : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escAttr(tituloCompleto)}</title>
<meta name="description" content="${escAttr(descricao)}">
<meta name="author" content="${escAttr(SITE.autor)}">
<meta name="theme-color" content="#1E1710" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F0E8D6" media="(prefers-color-scheme: light)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CHRONO">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${escAttr(tituloCompleto)}">
<meta property="og:description" content="${escAttr(descricao)}">
<meta property="og:url" content="${escAttr(SITE.url + (id === "inicio" ? "" : arquivoDe(id)))}">
<meta property="og:image" content="${escAttr(SITE.url)}assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="CHRONO — RPG de mesa sobre consertar o tempo depois de morrer">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${escAttr(SITE.url + (id === "inicio" ? "" : arquivoDe(id)))}">
<link rel="icon" href="assets/selo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/selo.svg">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&family=Courier+Prime:wght@400;700&display=swap">
<link rel="stylesheet" href="assets/css/chrono.css">
<link rel="stylesheet" href="assets/css/paginas.css">
<link rel="stylesheet" href="assets/css/formularios.css">
<script>
/* tema e classe "js" antes da pintura: sem piscar e sem a página pular */
(function () {
  var raiz = document.documentElement;
  raiz.classList.add("js");
  var padrao = ${id === "inicio" || id === "mesa" ? '"zona"' : '"papel"'};
  var fixo = ${id === "inicio" || id === "mesa" ? "true" : "false"};
  try {
    raiz.dataset.tema = fixo ? padrao : (localStorage.getItem("chrono:tema") || padrao);
  } catch (e) { raiz.dataset.tema = padrao; }
})();
</script>
${extraCabeca}</head>
<body>
${cabecalho(id)}
${corpo}
${rodape()}
${BUSCA}
${dados ? DADOS : ""}
<script src="assets/js/indice.js" defer></script>
<script src="assets/js/dados.js" defer></script>
<script src="assets/js/app.js" defer></script>
${extraScript}</body>
</html>
`;
}

/* ==========================================================================
   Página de livro
   ========================================================================== */

function paginaLivro(livro, arvore) {
  const { partes } = arvore;

  // --- sumário ---
  const trilho = partes
    .map((p) => {
      const titulo = p.titulo || p.numero || "Abertura";
      const filhos = p.secoes.length
        ? `<ol>${p.secoes
            .map(
              (s) =>
                `<li><a href="#${s.id}">${
                  s.numero ? `<span class="ref">${s.numero}</span> ` : ""
                }${esc(s.titulo)}</a></li>`
            )
            .join("")}</ol>`
        : "";
      return `<li class="trilho-parte"><a href="#${p.id}">${esc(titulo)}</a>${filhos}</li>`;
    })
    .join("");

  // --- corpo ---
  const corpoLivro = partes
    .map((p) => {
      const rotulo = p.numero ? `<span class="parte-n">${esc(p.numero)}</span>` : "";
      const titulo = p.titulo || p.numero;
      const cab = titulo
        ? `<h2 id="${p.id}">${rotulo}<span>${esc(titulo)}</span><a class="ancora" href="#${p.id}" aria-label="Link para esta parte">§</a></h2>`
        : "";
      const secoes = p.secoes
        .map((s) => {
          const n = s.numero ? `<span class="sec-n">${s.numero}</span>` : "";
          const tag = s.nivel === 4 ? "h4" : "h3";
          return `<${tag} id="${s.id}">${n}${esc(s.titulo)}<a class="ancora" href="#${s.id}" aria-label="Link para esta seção">§</a></${tag}>\n${s.blocos.join("\n")}`;
        })
        .join("\n");
      return `${cab}\n${p.intro.join("\n")}\n${secoes}`;
    })
    .join("\n");

  const corpo = `<main class="livro" id="conteudo">
  <nav class="trilho" aria-label="Sumário do ${esc(livro.titulo)}">
    <p class="trilho-titulo">${esc(livro.titulo)}</p>
    <button type="button" class="btn btn-fantasma btn-mini trilho-gaveta nao-imprime" aria-expanded="false" aria-controls="trilho-conteudo">Sumário</button>
    <div class="trilho-conteudo" id="trilho-conteudo"><ol>${trilho}</ol></div>
  </nav>
  <article class="corpo">
    <header class="livro-capa">
      <p class="etiqueta">Agência do Fluxo · documento de campo</p>
      <h1>${esc(livro.titulo)}</h1>
      <p class="resumo">${esc(livro.resumo)}</p>
      <p class="ref">${esc(livro.ref)} · ${arvore.subtitulo ? esc(arvore.subtitulo.split("—").pop().trim()) : ""} · ${partes.length} partes</p>
    </header>
${corpoLivro}
  </article>
</main>`;

  return pagina({
    id: livro.id,
    titulo: livro.titulo,
    descricao: livro.resumo,
    corpo,
  });
}

/* ==========================================================================
   Índice de busca
   ========================================================================== */

function entradasBusca(livro, arvore) {
  const limpar = (html) =>
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

  const saida = [];
  for (const p of arvore.partes) {
    const parte = p.titulo || p.numero;
    if (p.intro.length && parte) {
      saida.push({
        l: livro.nav,
        u: `${livro.arquivo}#${p.id}`,
        t: parte,
        p: "",
        c: limpar(p.intro.join(" ")).slice(0, 600),
      });
    }
    for (const s of p.secoes) {
      saida.push({
        l: livro.nav,
        u: `${livro.arquivo}#${s.id}`,
        t: (s.numero ? s.numero + " " : "") + s.titulo,
        p: parte,
        c: limpar(s.blocos.join(" ")).slice(0, 900),
      });
    }
  }
  return saida;
}

/* ==========================================================================
   Execução
   ========================================================================== */

console.log("\nCHRONO — gerando o site\n");

const indice = [];
const TOKENS = {};

for (const livro of LIVROS) {
  const md = ler(join("fontes", livro.fonte));
  const arvore = converter(md, livro);
  escrever(livro.arquivo, paginaLivro(livro, arvore));
  indice.push(...entradasBusca(livro, arvore));

  const nPartes = arvore.partes.length;
  const nSecoes = arvore.partes.reduce((n, p) => n + p.secoes.length, 0);
  TOKENS[`${livro.id}.partes`] = String(nPartes);
  TOKENS[`${livro.id}.secoes`] = String(nSecoes);
  console.log(`    ${nPartes} partes, ${nSecoes} seções`);
}

// páginas escritas à mão (hub, ficha, mesa)
const PAGINAS = [
  { id: "inicio", arquivo: "index.html", titulo: "CHRONO", descricao: SITE.descricao, frag: "index.html" },
  { id: "ficha", arquivo: "ficha.html", titulo: "Ficha de Agente", descricao: "Ficha interativa de CHRONO: calcula PV, Esforço, Defesa e as travas de Camada sozinha, salva no navegador e imprime em A4.", frag: "ficha.html" },
  { id: "mesa", arquivo: "mesa.html", titulo: "Mesa", descricao: "Painel do mestre de CHRONO: relógios de Instabilidade do Fluxo e Suspeita, ordem de iniciativa, régua de Grau e as tabelas mais consultadas.", frag: "mesa.html" },
];

/** Resolve <!--INCLUIR:arquivo.svg--> e {{livro.contagem}} dentro dos fragmentos. */
function resolver(txt) {
  return txt
    .replace(/<!--INCLUIR:([\w.-]+)-->/g, (_, arq) =>
      ler(join("build", "paginas", arq)).trim()
    )
    .replace(/\{\{([\w.]+)\}\}/g, (todo, chave) => {
      if (!(chave in TOKENS)) throw new Error(`token desconhecido: ${todo}`);
      return TOKENS[chave];
    });
}

for (const p of PAGINAS) {
  const frag = resolver(ler(join("build", "paginas", p.frag)));
  const [cabeca, corpo] = frag.includes("<!--CORPO-->")
    ? frag.split("<!--CORPO-->")
    : ["", frag];
  const scripts = {
    ficha: '<script src="assets/js/ficha.js" defer></script>\n',
    mesa: '<script src="assets/js/mesa.js" defer></script>\n',
  };
  escrever(
    p.arquivo,
    pagina({
      id: p.id,
      titulo: p.titulo,
      descricao: p.descricao,
      corpo: corpo.trim(),
      extraCabeca: cabeca.trim() ? cabeca.trim() + "\n" : "",
      extraScript: scripts[p.id] || "",
      dados: p.dados !== false,
    })
  );
}

// índice de busca — emitido como JS para funcionar até em file://
escrever(
  join("assets", "js", "indice.js"),
  `/* gerado por build/build.mjs — não edite à mão */\nwindow.CHRONO_INDICE=${JSON.stringify(indice)};\n`
);

/* ---------------------------------------------------- uso offline na mesa */

const ARQUIVOS = [
  "./", ...LIVROS.map((l) => l.arquivo), ...PAGINAS.map((p) => p.arquivo),
  "assets/css/chrono.css", "assets/css/paginas.css", "assets/css/formularios.css",
  "assets/js/indice.js", "assets/js/dados.js", "assets/js/app.js",
  "assets/js/ficha.js", "assets/js/mesa.js", "assets/selo.svg",
  "manifest.webmanifest",
];

const VERSAO = `${SITE.versao}-${Date.now().toString(36)}`;

escrever(
  "sw.js",
  `/* gerado por build/build.mjs — service worker do CHRONO */
const CACHE = "chrono-${VERSAO}";
const ARQUIVOS = ${JSON.stringify(ARQUIVOS, null, 2)};

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
`
);

escrever(
  "manifest.webmanifest",
  JSON.stringify(
    {
      name: "CHRONO — RPG de viagem no tempo",
      short_name: "CHRONO",
      description: SITE.descricao,
      lang: "pt-BR",
      start_url: "./index.html",
      scope: "./",
      display: "standalone",
      orientation: "any",
      background_color: "#1E1710",
      theme_color: "#1E1710",
      categories: ["games", "books", "entertainment"],
      icons: [
        { src: "assets/selo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        { src: "assets/selo.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
      ],
      shortcuts: [
        { name: "Ficha de agente", url: "./ficha.html" },
        { name: "Mesa do mestre", url: "./mesa.html" },
        { name: "Livro de Regras", url: "./regras.html" },
      ],
    },
    null,
    2
  ) + "\n"
);

// cartão de compartilhamento: página pronta para capturar em 1200x630
escrever(
  join("build", "og.render.html"),
  resolver(ler(join("build", "og.html")))
);

console.log(`\n  ${indice.length} seções indexadas para a busca.`);
console.log("\nPronto.\n");
