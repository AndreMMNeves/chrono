#!/usr/bin/env node
/**
 * CHRONO — sincroniza o cofre do Obsidian.
 *
 *   node build/sincronizar-cofre.mjs
 *
 * Gera, dentro do cofre, as notas que vêm dos livros: conceitos do sistema,
 * classes, inimigos, épocas, anomalias e a cópia integral dos três livros.
 *
 * REGRA DE OURO: este script só escreve dentro de CHRONO/ e Modelos/, e só
 * sobrescreve arquivos que ele mesmo gerou (os que têm `gerado: true` nas
 * propriedades). Qualquer nota sua — personagens, sessões, ideias — nunca é
 * tocada, mesmo que esteja numa dessas pastas.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONCEITOS, CLASSES } from "./cofre/conceitos.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

const COFRE =
  process.env.COFRE || "C:\\Users\\bsanb\\Documents\\André - TI\\Obsidian";

const SITE = "https://andremmneves.github.io/chrono";
const BASE = join(COFRE, "CHRONO");

if (!existsSync(COFRE)) {
  console.error(`\nNão achei o cofre em:\n  ${COFRE}\n\nPasse o caminho em COFRE=... se ele mudou.\n`);
  process.exit(1);
}

/* ==========================================================================
   Escrita segura
   ========================================================================== */

let escritas = 0, preservadas = 0;
const escritasNesteRun = new Set();

const ehGerado = (caminho) => {
  if (!existsSync(caminho)) return true; // não existe, pode criar
  const txt = readFileSync(caminho, "utf8");
  return /^---\n(?:.*\n)*?gerado: true\n/m.test(txt);
};

function nota(caminhoRelativo, conteudo) {
  const alvo = join(BASE, caminhoRelativo + ".md");
  if (!ehGerado(alvo)) {
    preservadas++;
    console.log("  · preservada (é sua):", caminhoRelativo);
    return;
  }
  mkdirSync(dirname(alvo), { recursive: true });
  writeFileSync(alvo, conteudo, "utf8");
  escritasNesteRun.add(alvo);
  escritas++;
}

/**
 * Nota gerada que este run não escreveu virou lixo: veio de um inimigo, época
 * ou agente que não existe mais. Some com ela — e só com ela, porque nota sua
 * não tem `gerado: true` e nunca entra nesta conta.
 */
function limparObsoletas() {
  if (!existsSync(BASE)) return [];
  const removidas = [];
  (function varrer(dir) {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) { varrer(p); continue; }
      if (!f.endsWith(".md")) continue;
      if (escritasNesteRun.has(p)) continue;
      const txt = readFileSync(p, "utf8");
      if (!/^---\n(?:.*\n)*?gerado: true\n/m.test(txt)) continue; // é sua, fica
      rmSync(p);
      removidas.push(p.slice(BASE.length + 1));
    }
  })(BASE);
  return removidas;
}

function notaLivre(caminhoAbsoluto, conteudo) {
  if (existsSync(caminhoAbsoluto)) { preservadas++; return; }
  mkdirSync(dirname(caminhoAbsoluto), { recursive: true });
  writeFileSync(caminhoAbsoluto, conteudo, "utf8");
  escritas++;
}

/* ==========================================================================
   Texto
   ========================================================================== */

const ler = (p) => readFileSync(join(RAIZ, p), "utf8");

/** "O ANIMAL GRANDE" -> "O Animal Grande" (nome de arquivo legível) */
function capitalizar(s) {
  const minusculas = new Set(["de", "da", "do", "das", "dos", "e", "o", "a", "os", "as", "que", "em", "no", "na", "um", "uma", "para", "por", "com", "só"]);
  return s
    .toLocaleLowerCase("pt-BR")
    .split(/\s+/)
    .map((p, i) => (i > 0 && minusculas.has(p) ? p : p.charAt(0).toLocaleUpperCase("pt-BR") + p.slice(1)))
    .join(" ");
}

const seguro = (s) => s.replace(/[\\/:*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").trim();

function frontmatter(props) {
  const linhas = ["---"];
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      if (!v.length) continue;
      linhas.push(`${k}:`);
      v.forEach((i) => linhas.push(`  - ${i}`));
    } else linhas.push(`${k}: ${v}`);
  }
  linhas.push("---", "");
  return linhas.join("\n");
}

const rodape = (fonte, ancora, livro = "regras") =>
  `\n\n---\n\n*Gerado de \`fontes/${fonte}\`. Edite lá e rode \`node build/sincronizar-cofre.mjs\`.*` +
  (ancora ? `\n*No site: [${livro}#${ancora}](${SITE}/${livro}.html#${ancora})*` : "");

/* --------------------------------------------------------- interligação --- */

/* Termos que viram [[link]] na primeira aparição de cada nota. Os maiores
   primeiro, senão "Paradoxo" comeria "Paradoxista". */
const GLOSSARIO = [
  "Instabilidade do Fluxo", "Instabilidade Pessoal", "A Regra das Brasas",
  "Regra das Brasas", "A Zona Fantasma", "Zona Fantasma", "Ato de Âncora",
  "Leitura do teste", "Falha crítica", "Escada de Dados", "Zonas Cegas",
  "Itens da Agência", "Descompressão", "Discernimento", "Ressonância",
  "Anacronismo", "Paradoxista", "Corrompidos", "Salvaguarda", "Renegados", "Ancorador",
  "Revelações", "Descoagular", "Fantasmas", "Sacrifício", "Memórias",
  "Suspeita", "Sequela", "Viajante", "Paradoxo", "Esforço", "Patente",
  "Camadas", "Favores", "Trauma", "Deriva", "Janela", "Fluxo", "Grau",
  "Agência", "Viga",
];

const CANONICO = {
  "Regra das Brasas": "A Regra das Brasas",
  "Zona Fantasma": "A Zona Fantasma",
  "Escada de Dados": "A Escada de Dados",
  Camadas: "As Camadas",
  Janela: "A Janela",
  Fluxo: "O Fluxo",
  Agência: "A Agência",
  Viga: "A Viga",
};

/**
 * Liga a primeira ocorrência de cada termo. Não entra em bloco de código,
 * em link que já existe, nem em título — e nunca liga a nota a ela mesma.
 */
function interligar(texto, proprioNome) {
  const pedacos = texto.split(/(```[\s\S]*?```|\[\[[^\]]*\]\]|^#{1,6} .*$)/gm);
  const usados = new Set();

  return pedacos
    .map((pedaco) => {
      if (/^(```|\[\[|#{1,6} )/.test(pedaco)) return pedaco;
      let s = pedaco;
      for (const termo of GLOSSARIO) {
        const alvo = CANONICO[termo] || termo;
        if (alvo === proprioNome || usados.has(alvo)) continue;
        const re = new RegExp(`(?<![\\w\\[|])${termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w\\]|])`);
        if (!re.test(s)) continue;
        s = s.replace(re, alvo === termo ? `[[${termo}]]` : `[[${alvo}|${termo}]]`);
        usados.add(alvo);
      }
      return s;
    })
    .join("");
}

/* ------------------------------------------------- extrair seção do livro -- */

const LIVROS_MD = {
  regras: ler("fontes/CHRONO_Livro_de_Regras.md"),
  inimigos: ler("fontes/CHRONO_Livro_dos_Inimigos.md"),
};

/**
 * Devolve o corpo de uma seção do Livro de Regras, sem o título.
 * `de` corta tudo antes de um marcador — serve para pegar só um pedaço.
 *
 * As tabelas vêm inteiras: é assim que o dano das armas e o bônus de Defesa
 * das proteções chegam ao cofre, em vez de um resumo em prosa.
 */
function secaoDoLivro(numero, de, livro = "regras") {
  const md = LIVROS_MD[livro];
  const i = md.indexOf(`### ${numero} `);
  if (i < 0) throw new Error(`seção ${numero} não encontrada em ${livro}`);
  const resto = md.slice(i);
  const fim = resto.slice(1).search(/\n(?:###? )/);
  let corpo = (fim < 0 ? resto : resto.slice(0, fim + 1));
  corpo = corpo.replace(/^### [^\n]*\n/, "").trim();
  if (de) {
    const j = corpo.indexOf(de);
    if (j < 0) throw new Error(`marcador "${de}" não encontrado em ${numero}`);
    corpo = corpo.slice(j).trim();
  }
  return corpo;
}

/* ==========================================================================
   1. Conceitos e classes
   ========================================================================== */

console.log("\nCHRONO — sincronizando o cofre\n");
console.log("  cofre:", COFRE, "\n");

for (const c of CONCEITOS) {
  // conceito com `extrair` traz as tabelas do livro em vez de um resumo
  const fonte = c.extrair
    ? c.resumo + "\n\n" + secaoDoLivro(c.extrair.secao, c.extrair.de, c.extrair.livro)
    : c.resumo;
  const corpo = interligar(fonte, c.nome);
  const relacionados = (c.relacionados || []).map((r) => `- [[${r}]]`).join("\n");
  nota(
    `${c.pasta}/${seguro(c.nome)}`,
    frontmatter({
      tipo: "conceito",
      gerado: true,
      tags: ["chrono", ...(c.tags || [])],
    }) +
      `# ${c.nome}\n\n${corpo}\n` +
      (relacionados ? `\n## Ligado a\n\n${relacionados}\n` : "") +
      rodape(c.livro === "inimigos" ? "CHRONO_Livro_dos_Inimigos.md" : "CHRONO_Livro_de_Regras.md", c.ancora, c.livro || "regras")
  );
}

for (const k of CLASSES) {
  const trilhas = k.trilhas
    .map(([n, d]) => `### ${n}\n\n${interligar(d, k.nome)}\n`)
    .join("\n");
  nota(
    `Sistema/Classes/${k.nome}`,
    frontmatter({
      tipo: "classe",
      gerado: true,
      atributos: k.atributos,
      papel: k.papel,
      tags: ["chrono", "classe"],
    }) +
      `# ${k.nome}\n\n> *${k.lema}*\n> — ${k.atributos}\n\n` +
      `**Papel:** ${k.papel}. Em analogia, ${k.analogia}.\n\n` +
      `${interligar(k.ideia, k.nome)}\n\n## As três Trilhas\n\n` +
      `Escolhe-se **uma** na [[As Camadas|Camada 1]], e a escolha é definitiva.\n\n${trilhas}\n` +
      `## Ligado a\n\n- [[Classes]]\n- [[Progressão]]\n- [[Enxerto]]\n` +
      rodape("CHRONO_Livro_de_Regras.md", k.nome.toLowerCase(), "regras")
  );
}

console.log(`  ${CONCEITOS.length} conceitos e ${CLASSES.length} classes`);

/* ==========================================================================
   2. Inimigos e anomalias, extraídos do Livro dos Inimigos
   ========================================================================== */

const mdInimigos = ler("fontes/CHRONO_Livro_dos_Inimigos.md");

function fatiar(md) {
  const linhas = md.split("\n");
  const partes = [];
  let parte = null, item = null;

  for (const l of linhas) {
    const p = l.match(/^## (?:PARTE [IVXL]+ — )?(.+)$/);
    if (p) { parte = { titulo: p[1].trim(), itens: [] }; partes.push(parte); item = null; continue; }
    const i = l.match(/^### (.+)$/);
    if (i && parte) { item = { titulo: i[1].trim(), linhas: [] }; parte.itens.push(item); continue; }
    if (item) item.linhas.push(l);
  }
  return partes;
}

const partesInimigos = fatiar(mdInimigos);
let nInimigos = 0, nAnomalias = 0;

for (const parte of partesInimigos) {
  const familia = capitalizar(parte.titulo);
  const ehAnomalia = /ANOMALIAS PRONTAS/i.test(parte.titulo);
  if (!parte.itens.length) continue;
  if (/COMO LER|MONTANDO/i.test(parte.titulo)) continue;

  for (const item of parte.itens) {
    const nome = capitalizar(item.titulo);
    // o separador --- que fecha a seção no livro não faz sentido dentro da nota
    const corpo = item.linhas.join("\n").trim().replace(/\n*-{3,}\s*$/, "");

    // seção de regras da família (7.1 O que é um Corrompido) não é criatura
    const regraDeFamilia = /^\d+\.\d+\s/.test(item.titulo);
    if (regraDeFamilia) {
      const limpo = item.titulo.replace(/^\d+\.\d+\s+/, "");
      nota(
        `Bestiário/${seguro(familia)}/${seguro(limpo)}`,
        frontmatter({ tipo: "regra", gerado: true, familia, tags: ["chrono", "inimigo", "regra"] }) +
          `# ${limpo}\n\n${interligar(corpo, limpo)}\n\n## Ligado a\n\n- [[As seis famílias]]\n- [[Grau]]\n` +
          rodape("CHRONO_Livro_dos_Inimigos.md", null, "inimigos")
      );
      continue;
    }

    // o primeiro bloco ``` é a ficha
    const ficha = (corpo.match(/```\n([\s\S]*?)```/) || [, ""])[1].trim();
    const [l1 = "", l2 = "", l3 = ""] = ficha.split("\n");

    const grau = (ficha.match(/GRAU\s+(\d)|Grau (\d)/i) || []).slice(1).find(Boolean);
    const peso = (corpo.match(/\*\*PESO\*\*\s*—\s*([^\n.]+)/) || [])[1];
    /* Âncora no começo da linha: sem isso, "Gente da época" no nome da família
       casava com o campo ÉPOCA das anomalias e trazia lixo junto. */
    let epoca = (ficha.match(/^ÉPOCA\s+(.+)$/im) || [])[1];

    /* A primeira linha é "Grau X · Família · Selo · nível N, Patente, Camada C".
       Sem separar, o campo selo engolia a carreira inteira do sujeito. */
    const campos = l1.split("·").map((p) => p.trim());
    const selo = (ficha.match(/SELO\s+(\w+)/i) || [])[1] ||
      campos.slice(2).find((p) => /^(Contido|Ativo|Terminal)/i.test(p))?.split(/\s|,/)[0];
    const nivel = (l1.match(/n[íi]vel (\d+)/i) || [])[1];
    const patente = (l1.match(/n[íi]vel \d+,\s*([^,·]+)/i) || [])[1];
    const camada = (l1.match(/Camada (\d)/i) || [])[1];
    const quantos = campos.find((p) => /aparece em grupo|\d+ a \d+/i.test(p));

    // gente de época e bicho trazem a época na própria linha da ficha
    if (!epoca && /Gente da|Bichos/i.test(familia)) {
      epoca = campos.slice(2).find(
        (p) => !/^(Contido|Ativo|Terminal)/i.test(p) && !/\d+ a \d+|aparece em grupo|é um lugar|vem com/i.test(p)
      );
    }

    // "Defesa 15 · PV 45 · Iniciativa +5 · Salvaguardas +3"
    const n = (re) => { const m = l2.match(re); return m ? m[1] : undefined; };
    const defesa = n(/Defesa\s+(\d+)/i);
    const pv = n(/PV\s+(\d+)/i);
    const iniciativa = n(/Iniciativa\s+([+-]?\d+)/i);
    const salvaguardas = n(/Salvaguardas\s+([+-]?\d+)/i);
    const dano = (l3.match(/·\s*(\d+d\d+(?:\s*[+-]\s*\d+)?)/) || [])[1];

    const equipamento = (corpo.match(/\*\*EQUIPAMENTO\*\*\s*—\s*([^\n]+)/) || [])[1];
    const texto = interligar(corpo, nome);

    // links úteis: a família, e a época quando ela existe
    const ligados = ehAnomalia
      ? ["[[Anomalia]]", "[[A Viga]]", "[[Instabilidade do Fluxo]]", "[[A Leitura]]"]
      : ["[[As seis famílias]]", "[[Grau]]",
         /Corrompid/i.test(familia) ? "[[Corrompidos]]" : null,
         /Fantasma/i.test(familia) ? "[[Fantasmas]]" : null,
         /Renegad/i.test(familia) ? "[[Renegados]]" : null,
         equipamento ? "[[Arsenal]]" : null,
         /Gente da/i.test(familia) ? "[[Épocas]]" : null].filter(Boolean);

    nota(
      ehAnomalia ? `Anomalias/${seguro(nome)}` : `Bestiário/${seguro(familia)}/${seguro(nome)}`,
      frontmatter({
        tipo: ehAnomalia ? "anomalia" : "inimigo",
        gerado: true,
        grau: grau ? Number(grau) : undefined,
        familia: ehAnomalia ? undefined : familia,
        selo: selo || undefined,
        defesa: defesa ? Number(defesa) : undefined,
        pv: pv ? Number(pv) : undefined,
        iniciativa,
        salvaguardas,
        dano,
        nivel: nivel ? Number(nivel) : undefined,
        patente: patente ? patente.trim() : undefined,
        camada: camada ? Number(camada) : undefined,
        quantos,
        epoca: epoca ? epoca.trim() : undefined,
        peso: peso ? peso.trim() : undefined,
        tags: ["chrono", ehAnomalia ? "anomalia" : "inimigo"],
      }) +
        `# ${nome}\n\n${texto}\n\n## Ligado a\n\n${ligados.map((l) => `- ${l}`).join("\n")}\n` +
        rodape("CHRONO_Livro_dos_Inimigos.md", null, "inimigos")
    );
    ehAnomalia ? nAnomalias++ : nInimigos++;
  }
}
console.log(`  ${nInimigos} inimigos e ${nAnomalias} anomalias`);

/* ==========================================================================
   3. Épocas
   ========================================================================== */

const mdEpocas = ler("fontes/CHRONO_Guia_de_Epocas.md");
const blocosEpoca = [...mdEpocas.matchAll(/^## PARTE [IVXL]+ — (.+?)\n([\s\S]*?)(?=\n## |\n?$)/gm)];
let nEpocas = 0;

for (const [, titulo, corpo] of blocosEpoca) {
  if (/COMO USAR/i.test(titulo)) continue;
  const m = titulo.match(/^(.+?)\s*\((.+)\)\s*$/);
  const nome = capitalizar((m ? m[1] : titulo).trim());
  const periodo = m ? m[2].trim() : "";

  const campo = (rot) => {
    const r = corpo.match(new RegExp(`\\*\\*${rot}\\*\\*\\s*—\\s*([^\\n]+)`));
    return r ? r[1].trim() : null;
  };

  nota(
    `Mundo/Épocas/${seguro(nome)}`,
    frontmatter({
      tipo: "época",
      gerado: true,
      periodo,
      tags: ["chrono", "época"],
    }) +
      `# ${nome}\n\n${periodo ? `**${periodo}**\n\n` : ""}${interligar(corpo.trim(), nome)}\n\n` +
      `## Ligado a\n\n- [[Épocas]]\n- [[Anacronismo]]\n- [[A Janela]]\n` +
      rodape("CHRONO_Guia_de_Epocas.md", null, "epocas")
  );
  nEpocas++;
}
console.log(`  ${nEpocas} épocas`);

/* ==========================================================================
   4. Os livros na íntegra — o backup
   ========================================================================== */

const LIVROS = [
  ["CHRONO_Livro_de_Regras.md", "Livro de Regras", "regras"],
  ["CHRONO_Livro_dos_Inimigos.md", "Livro dos Inimigos", "inimigos"],
  ["CHRONO_Guia_de_Epocas.md", "Guia de Épocas", "epocas"],
];

for (const [arquivo, titulo, pagina] of LIVROS) {
  const md = ler(`fontes/${arquivo}`).replace(/^# CHRONO\n/, "");
  nota(
    `Livros/${titulo}`,
    frontmatter({ tipo: "livro", gerado: true, tags: ["chrono", "livro"] }) +
      `> [!info] Cópia integral, para backup e busca.\n` +
      `> O original vive em \`fontes/${arquivo}\` e é o que gera o site.\n` +
      `> Editar aqui **não** muda o livro publicado.\n\n` +
      `# ${titulo}\n${md}` +
      rodape(arquivo, null, pagina)
  );
}
console.log(`  ${LIVROS.length} livros copiados na íntegra`);

/* ==========================================================================
   5. Índices
   ========================================================================== */

const listar = (pasta) => {
  const dir = join(BASE, pasta);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
};

const subpastas = (pasta) => {
  const dir = join(BASE, pasta);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory()).sort();
};

nota(
  "Bestiário/Bestiário",
  frontmatter({ tipo: "índice", gerado: true, tags: ["chrono", "índice"] }) +
    `# Bestiário\n\nSeis famílias de anomalia, gente de cada século e bichos. Comece por [[Grau]] e por [[As seis famílias]].\n\n` +
    `> [!tip] O campo mais importante de cada ficha é **Resolução**.\n> Metade destes não é para matar. Um grupo que só sabe atacar perde a missão ganhando o combate.\n\n` +
    subpastas("Bestiário")
      .map((f) => `## ${f}\n\n` + listar(`Bestiário/${f}`).map((n) => `- [[${n}]]`).join("\n") + "\n")
      .join("\n") +
    `\n## Anomalias prontas\n\n` + listar("Anomalias").map((n) => `- [[${n}]]`).join("\n") + "\n"
);

nota(
  "Mundo/Épocas",
  frontmatter({ tipo: "índice", gerado: true, tags: ["chrono", "índice"] }) +
    `# Épocas\n\nOnze séculos jogáveis. Cada verbete diz o que existe, o que denuncia um agente, o que vale mais que dinheiro e qual é o gancho de anomalia dali.\n\n` +
    `> [!tip] A regra que vale em toda época\n> [[Anacronismo]] não é sobre tecnologia. É sobre **o que aquela gente consegue explicar**.\n\n` +
    listar("Mundo/Épocas").map((n) => `- [[${n}]]`).join("\n") + "\n"
);

nota(
  "Sistema/Decisões em aberto",
  frontmatter({ tipo: "nota", gerado: true, tags: ["chrono", "pendência"] }) +
    `# Decisões em aberto

Coisas do sistema que ainda não foram resolvidas. Enquanto estiverem aqui, a
ficha do site segue a interpretação anotada em cada uma.

## 1. \`EP máx\` tem duas contas

A seção 3.3 dá \`EP máx = 10 + (Vontade × 2) + Nível + Patente + Camada\`, mas a
Parte V concede **+2 de EP máx** nas Camadas 1 e 3. Na Camada 3 uma conta dá +3
e a outra +4.

**A ficha segue a Parte V** (+2/+2), que era o comportamento da ficha original.

## 2. A Trilha II do nível 8 não existe

A tabela de [[Progressão]] promete **Trilha II** no nível 8 e **Trilha III** no
13. Mas cada Trilha só tem dois degraus escritos: Camada 1 e Camada 3.

Falta o degrau do meio, nas nove Trilhas.

## 3. O nível 1 ficou mais frágil

Com os [[Atributos]] na distribuição de Ordem Paranormal, o orçamento caiu de 15
para 9 pontos. Isso tirou cerca de 10 pontos percentuais de chance em todo teste
e deixou o personagem inicial mais mole:

| | antes | agora |
|---|---|---|
| PV | 22 | 18 |
| Defesa | 15 | 13 |
| rodadas até cair contra um [[Grau]] 1 | ~9 | ~6 |

Se doer na mesa, o conserto é baixar os ND ou a régua de Grau.

## 4. Poliglota Temporal virou opcional

Era passiva de nível 1 do antigo Camaleão: fala a língua de qualquer época.
Hoje está na Trilha Manipulador do [[Paradoxista]] — então **um grupo sem essa
Trilha não fala com ninguém em 1348**.

Talvez devesse ser regra geral da [[A Agência|Agência]], não habilidade de classe.

## 5. Catorze habilidades saíram na revisão de classes

Incluindo dois capstones de nível 20: **O Mapa Inteiro** (Rastreador) e **A
Máquina Errada** (Artífice). Também saíram Onisciência Local, Rastro Reverso,
Três Passos à Frente, Selo Provisório, Produção em Série, Rosto Emprestado,
Multidão, Sugestão, Nativo, Leitura de Objeto, Marcar Alvo e Reconstruir.

Se alguma fizer falta, cabe numa Trilha.`
);

nota(
  "Publicação/O site",
  frontmatter({ tipo: "nota", gerado: true, tags: ["chrono", "publicação"] }) +
    `# O site

**No ar:** ${SITE}/
**Código:** https://github.com/AndreMMNeves/chrono
**Na máquina:** \`C:\\Users\\bsanb\\chrono\`

## A regra de ouro

O texto dos livros vive em \`fontes/*.md\`. O HTML da raiz é **gerado** — editar
ele direto não adianta, a próxima geração sobrescreve.

\`\`\`sh
cd C:\\Users\\bsanb\\chrono
node build/build.mjs           # gera o site a partir de fontes/
node build/servir.mjs          # abre em http://localhost:4173
node build/sincronizar-cofre.mjs   # atualiza este cofre
\`\`\`

## O que o site tem

| Página | O quê |
|---|---|
| \`index.html\` | Hub: a premissa, o motor em duas rolagens, os volumes |
| \`regras.html\` | [[Livro de Regras]] |
| \`inimigos.html\` | [[Livro dos Inimigos]] |
| \`epocas.html\` | [[Guia de Épocas]] |
| \`ficha.html\` | Ficha que calcula sozinha, salva no navegador e imprime em A4 |
| \`mesa.html\` | Painel do mestre: relógios, iniciativa, régua de [[Grau]] |

Busca com <kbd>Ctrl</kbd>+<kbd>K</kbd> nos três livros ao mesmo tempo. Toda
notação de dado no texto é clicável e **lê o resultado pela regra certa**.
Funciona offline depois da primeira visita.

## Como este cofre se relaciona com o site

As notas de [[CHRONO|Sistema, Mundo e Bestiário]] são **geradas** a partir dos
mesmos \`fontes/*.md\` que fazem o site — por isso trazem \`gerado: true\` nas
propriedades. Rodar o sincronizador reescreve essas.

Tudo o que **você** criar — personagens, lugares, sessões, ideias — nunca é
tocado, mesmo dentro dessas pastas.`
);

/* ==========================================================================
   Os cinco agentes prontos — ficha fechada, pronta para jogar
   ========================================================================== */

const { AGENTES, derivados, conferir } = await import("./agentes/agentes.mjs");

const TRAUMAS = {
  "Sem Ar": ["Submersão, espaço fechado, sufoco", "Vantagem contra Medo e contra efeitos de pressa."],
  "A Coisa Quente": ["Fogo descontrolado, queimadura, fumaça", "Vantagem em salvaguardas contra dor e contra a condição Abalado."],
  "O Chão Vindo": ["Altura, beirada, estrutura cedendo", "Você sempre sabe quanto tempo tem: vantagem em Iniciativa."],
  "As Costas": ["Ser flanqueado, alguém atrás de você", "Vantagem em Percepção para detectar intenção hostil."],
  "O Lento": ["Contágio, apodrecimento, hospital, cheiro de doente", "Vantagem em Medicina e contra veneno, doença e contaminação."],
  "O Súbito": ["Barulho alto e repentino, maquinário pesado", "Por 2 EP, age normalmente mesmo estando Desprevenido."],
  "O Barulho": ["Combate em massa, explosão, muita gente gritando", "Vantagem em Luta quando enfrenta dois ou mais inimigos ao mesmo tempo."],
  "Sozinho": ["Ser separado do grupo, ficar isolado", "Enquanto estiver sozinho de verdade, +2 em todos os testes."],
  "A Mão Conhecida": ["Aliado te ferindo, promessa quebrada", "Vantagem em Enganação e em resistir a Persuasão."],
  "O Que Não Lembro": ["Alguém perguntar como você morreu", "A primeira salvaguarda contra fantasma em cada cena tem vantagem."],
};

const ATRIBUTO_DE = {
  Atletismo: "Corpo", Luta: "Corpo", "Resistência": "Corpo",
  Furtividade: "Reflexo", Pontaria: "Reflexo", Pilotagem: "Reflexo", Reflexos: "Reflexo",
  "História": "Intelecto", "Ciência": "Intelecto", Tecnologia: "Intelecto", "Investigação": "Intelecto", Medicina: "Intelecto",
  "Persuasão": "Presença", "Enganação": "Presença", "Intimidação": "Presença", Disfarce: "Presença",
  Autocontrole: "Vontade", "Percepção": "Vontade", Comando: "Vontade",
  "Leitura de Fluxo": "Sintonia", Ecos: "Sintonia", Ancoragem: "Sintonia",
};

for (const a of AGENTES) {
  const erros = conferir(a);
  if (erros.length) throw new Error(`Ficha inválida — ${a.nome}: ${erros.join("; ")}`);

  const d = derivados(a);
  const at = a.atributos;
  const [gatilho, compensacao] = TRAUMAS[a.trauma] || ["", ""];

  const tabelaAtributos =
    "| Corpo | Reflexo | Intelecto | Presença | Vontade | Sintonia |\n|---|---|---|---|---|---|\n" +
    `| **${at.Corpo}** | **${at.Reflexo}** | **${at.Intelecto}** | **${at["Presença"]}** | **${at.Vontade}** | ${at.Sintonia} |`;

  const tabelaPericias =
    "| Perícia | Treino | Atributo | Total no d20 |\n|---|---|---|---|\n" +
    Object.entries(a.pericias)
      .map(([p, v]) => {
        const base = at[ATRIBUTO_DE[p]] ?? 0;
        return `| ${p} | ${v} | ${ATRIBUTO_DE[p]} ${base} | **+${base + v}** |`;
      })
      .join("\n");

  const corpo =
`# ${a.nome}

> *${a.gancho}*

**[[${a.classe}]]** · Trilha pretendida **${a.trilha}** · ${a.papel}
Nível 1 · [[Patente]] Novato · [[As Camadas|Camada]] 0 · [[Instabilidade Pessoal|IP]] 0

## Como morreu

**${a.epoca}.** ${a.morte}

A época de origem dá vantagem em testes sociais e de [[Perícias|História]] naquele período.

## Atributos

${tabelaAtributos}

Somam 9, como manda a criação. [[Atributos|Sintonia]] começa em 0 e só sobe por [[Discernimento]].

## Derivados

| PV | EP máx | Defesa | Iniciativa | Carga | EP/rodada |
|---|---|---|---|---|---|
| **${d.pv}** | **${d.ep}** | **${d.defesa}** | **+${d.iniciativa}** | ${d.carga} | ${d.epRodada} |

## Perícias

${tabelaPericias}

## Habilidades de nível 1

${a.habilidades.map(([n, c, t]) => `**${n}** *(${c})* — ${t}`).join("\n\n")}

## [[Trauma]] — ${a.trauma}

**Gatilho:** ${gatilho}
**Compensação:** ${compensacao}

Quando o Gatilho aparece em cena: [[Salvaguarda]] de Autocontrole contra 6. Passou, +1 de [[Esforço]]. Falhou, Abalado e +5 de [[Instabilidade Pessoal|IP]].

## As cinco [[Memórias]]

${a.memorias.map((m, i) => `${i + 1}. ${m}`).join("\n")}

Queimar uma devolve todo o [[Esforço]], transforma um teste falhado em sucesso, ou anula um efeito que apagaria o agente. Custa −5 de EP máx, para sempre. **Leia em voz alta antes de riscar.**

## Equipamento

${a.equipamento.map((e) => `- ${e}`).join("\n")}

Atenção ao [[Anacronismo]]: se a soma do que ele carrega passar da Vontade (${at.Vontade}) e ele aparecer em público, são +5 de IP por cena.

## Como jogar

${a.dica}`;

  nota(
    `Personagens/Agentes Prontos/${seguro(a.nome)}`,
    frontmatter({
      tipo: "agente",
      gerado: true,
      classe: a.classe,
      trilha: a.trilha,
      nivel: 1,
      patente: "Novato",
      camada: 0,
      epoca: a.epoca,
      trauma: a.trauma,
      pv: d.pv,
      ep: d.ep,
      defesa: d.defesa,
      tags: ["chrono", "agente", "pronto"],
    }) + interligar(corpo, a.nome) +
      `\n\n---\n\n*Ficha fechada. Para jogar, abra a [[O site|ficha interativa]] e use **Agentes prontos**.*\n` +
      `*Gerado de \`build/agentes/agentes.mjs\`.*`
  );
}

nota(
  "Personagens/Agentes Prontos/Agentes prontos",
  frontmatter({ tipo: "índice", gerado: true, tags: ["chrono", "índice"] }) +
`# Agentes prontos

Cinco fichas fechadas, em nível 1, para escolher e jogar hoje. Dois de linha de frente, um de suporte, dois especialistas.

| Agente | Classe | Morreu em | PV | EP | Defesa |
|---|---|---|---|---|---|
${AGENTES.map((a) => {
  const d = derivados(a);
  return `| [[${a.nome}]] | ${a.classe} · ${a.trilha} | ${a.epoca} | ${d.pv} | ${d.ep} | ${d.defesa} |`;
}).join("\n")}

## Como usar na mesa

São **cinco para quatro jogadores**. O que sobrar fica com o mestre — e essa é a graça: ele não é um NPC qualquer, é alguém que morreu na mesma época, foi recrutado pela mesma [[A Agência|Agência]] e **treinou com o grupo**.

Use o que sobrou como quiser:

- O agente veterano que dá o briefing e sabe mais do que conta
- O que foi Devolvido numa missão anterior e volta mudado
- O primeiro a chegar à [[As Camadas|Camada]] 3, e a descobrir que a própria morte não foi como contaram
- O que vira [[Renegados|Renegado]] no meio da campanha, com a ficha que o grupo conhece de cor

## Para jogar

Abra a [[O site|ficha interativa]] e clique em **Agentes prontos**. Escolher um cria um personagem novo no elenco — nada do que já existe é apagado.`
);

console.log(`  ${AGENTES.length} agentes prontos`);

/* ---------------------------------------------- o hub e o espaço de criação */

notaLivre(
  join(COFRE, "Início.md"),
  frontmatter({ tipo: "hub", tags: ["hub"] }) +
    `# Início

Cofre do **[[CHRONO]]** — RPG de mesa de viagem no tempo.

## Começar por aqui

- [[CHRONO]] — o índice do jogo inteiro
- [[Decisões em aberto]] — o que ainda falta resolver no sistema
- [[O site]] — o que está publicado e como regerar

## Criar

- [[Modelo — Agente|Novo agente]]
- [[Modelo — NPC|Novo NPC]]
- [[Modelo — Lugar|Novo lugar]]
- [[Modelo — Sessão|Nova sessão]]
- [[Modelo — Inimigo|Novo inimigo]]
- [[Modelo — Anomalia|Nova anomalia]]

> [!note] Esta nota é sua
> O sincronizador não mexe nela. Reorganize à vontade.`
);

nota(
  "CHRONO",
  frontmatter({ tipo: "índice", gerado: true, tags: ["chrono", "índice"] }) +
    `# CHRONO

> *Você morreu. Isso não é reviravolta de campanha — é o ponto de partida da ficha.*

RPG de mesa sobre consertar o tempo depois de morrer. Publicado em ${SITE}/

## O mundo

- [[O Fluxo]] — o passado como estrutura
- [[Você morreu]] — por que só os mortos viajam
- [[A Zona Fantasma]] — o Lado de Fora
- [[A Agência]] — velha, cansada, e mente por conveniência
- [[A Viga]] · [[Anomalia]] — o que é uma missão

## O sistema

**Motor** — [[Ação]] · [[Salvaguarda]] · [[Leitura do teste]] · [[A Escada de Dados]] · [[Ressonância]] · [[Paradoxo]] · [[Deriva]]
**Personagem** — [[Atributos]] · [[Perícias]] · [[Derivados]] · [[Criação de personagem]]
**Classes** — [[Viajante]] · [[Ancorador]] · [[Paradoxista]]
**Recursos** — [[Esforço]] · [[Instabilidade Pessoal]] · [[Instabilidade do Fluxo]] · [[Rebobinar]] · [[Ato de Âncora]]
**Progressão** — [[Discernimento]] · [[As Camadas]] · [[Patente]] · [[Enxerto]]
**Peso** — [[Trauma]] · [[A Verdade da Morte]] · [[Memórias]] · [[Sacrifício]]
**Viagem** — [[A Janela]] · [[A Regra das Brasas]] · [[Extração]] · [[Anacronismo]]
**Agência** — [[Descompressão]] · [[Favores]] · [[Suspeita]]

## Rodar

- [[Estrutura de missão]] · [[As alavancas do mestre]] · [[Segurando o tom]]
- [[Bestiário]] — 18 fichas em [[As seis famílias|seis famílias]]
- [[Épocas]] — onze séculos jogáveis
- [[Anomalia|Anomalias prontas]]: [[A Peste Errada]] · [[O Bicho em São Paulo]] · [[O Presidente que Viveu]] · [[A Máquina de Princeton]]

## O que é seu

Estas pastas o sincronizador nunca toca:

- [[Agentes prontos]] — **cinco fichas fechadas, prontas para jogar**
- [[Agentes]] — os personagens dos jogadores
- [[NPCs]] — gente da Agência, das épocas e das anomalias
- [[Lugares]] — ruas, prédios, salas, Zonas Cegas
- [[Sessões]] — o diário da campanha
- [[Campanhas]] — arcos e ganchos

## Os livros

- [[Livro de Regras]] · [[Livro dos Inimigos]] · [[Guia de Épocas]]

## O que ainda falta

- [[Decisões em aberto]]`
);

/* ------------------------------------------------------------- modelos ---- */

const MODELOS = [
  ["Modelo — Agente", { tipo: "agente", classe: "", trilha: "", nivel: 1, patente: "Novato", camada: 0, jogador: "", tags: ["chrono", "agente"] },
`# {{title}}

**Jogador:**
**Classe:** · **Trilha:**
**Nível** 1 · **[[Patente]]** Novato · **[[As Camadas|Camada]]** 0

## Como morreu

Quando, onde e de quê. A época de origem dá vantagem em testes sociais e de História ali.

## [[Trauma]]

**Gatilho:**
**Compensação:**

## As cinco [[Memórias]]

1.
2.
3.
4.
5.

## Ficha

Atributos, perícias e derivados na [[O site|ficha interativa]].

## Na campanha

O que ele quer. De quem ele gosta. O que ele ainda não contou para o grupo.`],

  ["Modelo — NPC", { tipo: "npc", epoca: "", papel: "", tags: ["chrono", "npc"] },
`# {{title}}

**Época:** · **Papel:**

## Quem é

Uma frase que a mesa vai lembrar.

## O que quer

## O que sabe que o grupo não sabe

## Como reage ao grupo

## Ligado a`],

  ["Modelo — Lugar", { tipo: "lugar", epoca: "", tags: ["chrono", "lugar"] },
`# {{title}}

**Época:**

## O que se vê

## O que denuncia um forasteiro aqui

## Quem manda

## O que pode dar errado

## Ligado a`],

  ["Modelo — Sessão", { tipo: "sessão", data: "", missao: "", if_inicial: 100, if_final: "", suspeita: "", tags: ["chrono", "sessão"] },
`# {{title}}

**Missão:** · **Data:**

## Quem jogou

## O que aconteceu

## [[Instabilidade do Fluxo]]

Começou em % · Terminou em %

## [[Deriva]]

Rolagem: · Resultado:

## [[Discernimento]] concedido

Quem, e por qual [[Revelações|Revelação]].

## [[Suspeita]]

## Pontas soltas para a próxima`],

  ["Modelo — Inimigo", { tipo: "inimigo", grau: "", familia: "", selo: "", peso: "", tags: ["chrono", "inimigo"] },
`# {{title}}

\`\`\`
Grau · Família · Selo
Defesa · PV · Iniciativa · Salvaguardas
Ataque
\`\`\`

Uma frase que diz o que ele é.

- **TRAÇOS** — o que ele faz que quebra a regra.
- **RESOLUÇÃO** — como o grupo se livra dele **de verdade**. Este é o campo mais importante: metade dos inimigos não é para matar.
- **PESO** — quanto da [[Instabilidade do Fluxo]] ele segura.

Números pela régua de [[Grau]].`],

  ["Modelo — Anomalia", { tipo: "anomalia", grau: "", selo: "", epoca: "", tags: ["chrono", "anomalia"] },
`# {{title}}

\`\`\`
GRAU  ·  SELO  ·  ÉPOCA
VIGA  o ato que foi alterado, em uma frase
\`\`\`

## A dificuldade real

O que não se resolve batendo.

## Como derruba a [[Instabilidade do Fluxo|IF]]

| | |
|---|---|
| | −% |
| | −% |
| Cada sessão sem contenção | **+%** |

Distribua cerca de 40% na [[A Viga|Viga]], 30% nos efeitos colaterais, 20% na investigação e 10% na limpeza.

## Encontros

## A virada

O que a [[A Agência|Agência]] não contou. Vale 1 ponto de [[Discernimento]] quando o grupo achar.`],
];

for (const [nome, props, corpo] of MODELOS) {
  notaLivre(join(COFRE, "Modelos", nome + ".md"), frontmatter(props) + corpo);
}

for (const [pasta, titulo, texto] of [
  ["Personagens/Agentes", "Agentes", "Os personagens dos jogadores. Comece por [[Modelo — Agente]]."],
  ["Personagens/NPCs", "NPCs", "Gente da Agência, das épocas e das anomalias. Comece por [[Modelo — NPC]]."],
  ["Mundo/Lugares", "Lugares", "Ruas, prédios, salas e Zonas Cegas. Comece por [[Modelo — Lugar]]."],
  ["Mesa/Sessões", "Sessões", "O diário da campanha. Comece por [[Modelo — Sessão]]."],
  ["Mesa/Campanhas", "Campanhas", "Arcos, ganchos e o que a [[A Agência|Agência]] está escondendo desta vez."],
]) {
  notaLivre(
    join(BASE, pasta, titulo + ".md"),
    frontmatter({ tipo: "índice", tags: ["chrono", "índice"] }) +
      `# ${titulo}\n\n${texto}\n\n> [!note] Esta pasta é sua\n> O sincronizador nunca escreve aqui.\n`
  );
}

const obsoletas = limparObsoletas();
if (obsoletas.length) {
  console.log(`\n  ${obsoletas.length} nota(s) gerada(s) que deixaram de existir, removidas:`);
  obsoletas.forEach((o) => console.log("    ·", o));
}

console.log(`\n  ${escritas} notas escritas` + (preservadas ? `, ${preservadas} preservadas (suas)` : ""));
console.log("\nPronto.\n");
