/* ==========================================================================
   CHRONO — rolador de dados
   Não rola só o número: lê o resultado pela regra certa do livro.
   Exposto em window.CHRONO para a ficha e o painel do mestre reaproveitarem.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- dados */

  const d = (faces) => 1 + Math.floor(Math.random() * faces);

  /** "2d6+4", "d20", "1d100" -> { qtd, faces, mod } */
  function analisar(notacao) {
    const m = String(notacao).trim().toLowerCase().replace(/\s+/g, "")
      .match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (!m) return null;
    const qtd = Math.min(20, Math.max(1, m[1] === "" ? 1 : Number(m[1])));
    const faces = Math.min(1000, Math.max(2, Number(m[2])));
    return { qtd, faces, mod: m[3] ? Number(m[3]) : 0 };
  }

  /* ------------------------------------------------------- leitura por regra */

  const FALHA_CRITICA = {
    1: ["Ruído", "Alguém da época notou algo impossível. +5 IP."],
    2: ["Perda", "Um item seu quebra ou fica para trás. Você escolhe qual, e dói."],
    3: ["Trava", "Você perde sua próxima ação."],
    4: ["Exposto", "Inimigos têm vantagem contra você até o fim da cena."],
    5: ["Rastro", "A Instabilidade do Fluxo sobe 5%."],
    6: ["Eco", "Role Ressonância imediatamente."],
  };

  const TABELAS = {
    ressonancia: (r) =>
      r <= 2 ? ["Eco", "Algo pequeno se repete no ambiente. Estético — na primeira vez.", ""]
      : r <= 8 ? ["Nada", "O Fluxo não notou.", ""]
      : r === 9 ? ["Atrito", "+5 IP.", "custo"]
      : ["Rasgo", "Um fantasma percebeu você. Chega na próxima cena.", "pifia"],

    paradoxo: (r) =>
      r <= 2 ? ["Colapso local", "IF sobe 10%. Fantasmas na cena, agora.", "pifia"]
      : r <= 4 ? ["Correção", "O Fluxo desfaz o que vocês fizeram. Ação perdida, EP não volta.", "pifia"]
      : r <= 6 ? ["Testemunha", "Alguém viu, e essa pessoa vira problema permanente.", "custo"]
      : r <= 8 ? ["Cicatriz", "Funcionou, mas IF sobe 5%.", "custo"]
      : r <= 10 ? ["Passou", "Nada acontece.", ""]
      : ["Absorvido", "O Fluxo aceita. IF desce 5%. O tempo queria isso.", "critico"],

    sequela: (r) =>
      r === 1 ? ["Voz atrasada", "Sua fala chega meio segundo depois. Desvantagem em Presença.", ""]
      : r === 2 ? ["Mão de outro ano", "Uma das mãos tem a idade errada. Desvantagem em Reflexo.", ""]
      : r === 3 ? ["Sombra fora de hora", "Sua sombra faz o que você fez 10 s atrás. Se um nativo notar: +5 IP.", ""]
      : ["Sem eco", "Não aparece em espelho, água ou retrato. Vantagem em Furtividade; fantasmas te acham de longe.", ""],

    chegada: (r) =>
      r === 1 ? ["Longe", "Dias e quilômetros fora do alvo. Perdem tempo: IF sobe 5%.", "custo"]
      : r === 2 ? ["Cedo demais", "Chegam antes do evento e não podem interferir ainda. Esperar é uma cena.", "custo"]
      : r === 3 ? ["Tarde demais", "O ato já aconteceu. IF sobe 10%.", "pifia"]
      : r === 4 ? ["Espalhados", "Cada agente chega num lugar diferente, sozinho, sem saber dos outros.", "pifia"]
      : r === 5 ? ["Barulhenta", "Chegam à vista de gente da época. +10 IP em cada um.", "pifia"]
      : ["Rachada", "A Janela não fechou direito e algo passou junto: um fantasma, um objeto, um animal.", "pifia"],
  };

  /**
   * Aplica a leitura do teste (2.2) e devolve { titulo, texto, tom, cascata }.
   */
  function ler(tipo, { natural, total, alvo, faces }) {
    if (tipo === "acao") {
      if (natural === 20) return { titulo: "Crítico", texto: "Acontece, e acontece com estilo. O mestre concede um benefício extra de graça.", tom: "critico" };
      if (natural === 1) return { titulo: "Falha crítica", texto: "Role 1d6 na tabela.", tom: "pifia", cascata: "falhaCritica" };
      if (alvo == null) return { titulo: "", texto: "Sem ND definido — informe o ND para ler o resultado.", tom: "" };
      if (total >= alvo) return { titulo: "Sucesso", texto: "Acontece como você descreveu.", tom: "critico" };
      if (total >= alvo - 2) return { titulo: "Sucesso com custo", texto: "Acontece, mas o Fluxo cobra: ruído, tempo perdido, item quebrado, +5 IP, ou um inimigo chega. O mestre fala o preço em voz alta antes de você confirmar.", tom: "custo" };
      return { titulo: "Falha", texto: "Não acontece. A cena avança mesmo assim.", tom: "pifia" };
    }

    if (tipo === "salvaguarda") {
      if (alvo == null) return { titulo: "", texto: "Informe o limiar (4 leve, 6 média, 8 severa, 10 extrema).", tom: "" };
      if (total >= alvo) return { titulo: "Passou", texto: "Você segurou.", tom: "critico" };
      const falta = alvo - total;
      return {
        titulo: "Falhou",
        texto: `Faltaram ${falta}. Dá para somar +1d6 por 2 de Esforço, quantas vezes você aguentar — e você pode decidir isso agora.`,
        tom: "pifia",
      };
    }

    if (tipo === "perseguicao") {
      if (natural === 8) return { titulo: "A época entra em cena", texto: "Carroça, procissão, feira, guarda confuso — a favor de quem rolou. Compare com o outro lado: a Distância muda em 1, ou em 2 se a diferença for 5 ou mais.", tom: "critico" };
      return { titulo: "", texto: "Compare com o outro lado. Quem rolar mais alto muda a Distância em 1 — em 2 se a diferença for 5 ou mais. Distância 0 alcançou, 10 escapou.", tom: "" };
    }

    if (tipo === "deriva") {
      if (alvo == null) return { titulo: "", texto: "Informe a IF final da missão.", tom: "" };
      if (total > alvo) return { titulo: "Presente limpo", texto: `${total} contra IF ${alvo}. O presente voltou como devia.`, tom: "critico" };
      return { titulo: "Deriva", texto: `${total} contra IF ${alvo}. Ficou uma diferença pequena, permanente e irreversível: uma música que ninguém lembra, uma rua com outro nome, alguém com outro sobrenome. Anote e só mostre a lista no fim da campanha.`, tom: "pifia" };
    }

    if (TABELAS[tipo]) {
      const [titulo, texto, tom] = TABELAS[tipo](natural);
      return { titulo, texto, tom: tom || "" };
    }

    if (alvo != null) {
      return total >= alvo
        ? { titulo: "Passou", texto: `${total} contra ${alvo}.`, tom: "critico" }
        : { titulo: "Não passou", texto: `${total} contra ${alvo}.`, tom: "pifia" };
    }
    return null;
  }

  /* ------------------------------------------------------------- a rolagem */

  /**
   * @param {object} spec
   * @param {string} spec.notacao  "1d20", "2d6+4"
   * @param {string} [spec.nome]   rótulo mostrado no log
   * @param {string} [spec.tipo]   acao | salvaguarda | ressonancia | paradoxo | sequela | perseguicao | deriva | chegada
   * @param {number} [spec.mod]    modificador extra somado ao dado
   * @param {number} [spec.alvo]   ND, limiar ou IF
   * @param {number} [spec.vant]   1 vantagem, -1 desvantagem, 0 normal
   */
  function rolar(spec) {
    const p = analisar(spec.notacao || "1d20");
    if (!p) return null;

    const vant = spec.vant || 0;
    const mod = (p.mod || 0) + (Number(spec.mod) || 0);

    let dados = Array.from({ length: p.qtd }, () => d(p.faces));
    let descartados = [];

    // vantagem/desvantagem só faz sentido num dado só (2.9)
    if (vant !== 0 && p.qtd === 1) {
      const par = [dados[0], d(p.faces)];
      const escolhido = vant > 0 ? Math.max(...par) : Math.min(...par);
      descartados = [par[0] === escolhido ? par[1] : par[0]];
      dados = [escolhido];
    }

    const soma = dados.reduce((a, b) => a + b, 0);
    const total = soma + mod;
    const natural = p.qtd === 1 ? dados[0] : soma;

    const alvo = spec.alvo === "" || spec.alvo == null || Number.isNaN(Number(spec.alvo))
      ? null
      : Number(spec.alvo);

    const leitura = ler(spec.tipo, { natural, total, alvo, faces: p.faces });

    const resultado = {
      nome: spec.nome || `${p.qtd}d${p.faces}`,
      notacao: `${p.qtd}d${p.faces}${mod ? (mod > 0 ? "+" + mod : mod) : ""}`,
      dados, descartados, mod, soma, total, natural, alvo, vant,
      tipo: spec.tipo || "",
      leitura,
    };

    // uma falha crítica puxa a tabela 1d6 atrás dela
    if (leitura && leitura.cascata === "falhaCritica") {
      const r = d(6);
      const [titulo, texto] = FALHA_CRITICA[r];
      resultado.filho = { nome: "Falha crítica · 1d6", natural: r, total: r, dados: [r], notacao: "1d6", leitura: { titulo, texto, tom: "pifia" }, mod: 0, descartados: [], alvo: null };
    }

    registrar(resultado);
    return resultado;
  }

  /* ------------------------------------------------------------- o registro */

  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function conta(r) {
    const partes = [];
    partes.push(r.dados.join(" + "));
    if (r.descartados.length) partes.push(`<s>${r.descartados.join(" ")}</s>`);
    let txt = `${r.notacao} → ${partes.join("  ")}`;
    if (r.mod) txt += `  ${r.mod > 0 ? "+" : "−"} ${Math.abs(r.mod)}`;
    if (r.alvo != null) txt += `  vs ${r.alvo}`;
    if (r.vant) txt += r.vant > 0 ? "  · vantagem" : "  · desvantagem";
    return txt;
  }

  function bloco(r) {
    const l = r.leitura;
    const leitura = l && (l.titulo || l.texto)
      ? `<p class="rolagem-leitura">${l.titulo ? `<b>${esc(l.titulo)}.</b> ` : ""}${esc(l.texto)}</p>`
      : "";
    return `<div class="rolagem-topo">
        <span class="rolagem-nome">${esc(r.nome)}</span>
        <span class="rolagem-total">${r.total}</span>
      </div>
      <p class="rolagem-conta">${conta(r)}</p>
      ${leitura}`;
  }

  function registrar(r) {
    const log = document.getElementById("dados-log");
    if (!log) return;

    const li = document.createElement("li");
    li.className = "rolagem";
    if (r.leitura && r.leitura.tom) li.dataset.tom = r.leitura.tom;
    li.innerHTML = bloco(r) + (r.filho ? `<div class="rolagem-filho">${bloco(r.filho)}</div>` : "");

    log.prepend(li);
    while (log.children.length > 40) log.lastElementChild.remove();

    const painel = document.getElementById("dados-painel");
    if (painel && painel.hidden) abrirPainel(true);
  }

  /* --------------------------------------------------------------- o painel */

  const ATALHOS = [
    { chave: "acao", nome: "Ação", notacao: "1d20", rotulo: "Ação" },
    { chave: "salvaguarda", nome: "Salvaguarda", notacao: "1d6", rotulo: "Salvag." },
    { chave: "perseguicao", nome: "Perseguição", notacao: "1d8", rotulo: "Perseg." },
    { chave: "ressonancia", nome: "Ressonância", notacao: "1d10", rotulo: "Resson." },
    { chave: "paradoxo", nome: "Paradoxo", notacao: "1d12", rotulo: "Paradoxo" },
    { chave: "sequela", nome: "Sequela", notacao: "1d4", rotulo: "Sequela" },
    { chave: "chegada", nome: "Deriva de chegada", notacao: "1d6", rotulo: "Chegada" },
    { chave: "deriva", nome: "Deriva final", notacao: "1d100", rotulo: "Deriva" },
  ];

  function abrirPainel(abrir) {
    const painel = document.getElementById("dados-painel");
    const botao = document.getElementById("abrir-dados");
    if (!painel || !botao) return;
    painel.hidden = !abrir;
    botao.setAttribute("aria-expanded", String(abrir));
  }

  function montarPainel() {
    const atalhos = document.getElementById("dados-atalhos");
    const form = document.getElementById("dados-form");
    const botao = document.getElementById("abrir-dados");
    if (!atalhos || !form) return;

    const campoNotacao = document.getElementById("dados-notacao");
    const campoAlvo = document.getElementById("dados-alvo");

    atalhos.innerHTML = ATALHOS.map(
      (a) => `<button type="button" data-chave="${a.chave}" title="${a.nome}">${a.rotulo}</button>`
    ).join("");

    atalhos.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-chave]");
      if (!b) return;
      const a = ATALHOS.find((x) => x.chave === b.dataset.chave);
      campoNotacao.value = a.notacao;
      rolar({ ...a, tipo: a.chave, alvo: campoAlvo.value, vant: vantagemAtual() });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const notacao = campoNotacao.value.trim() || "1d20";
      const alvo = campoAlvo.value;
      // um d20 com ND informado é quase sempre um teste de Ação
      const tipo = /^\d*d20$/i.test(notacao) && alvo !== "" ? "acao" : "";
      rolar({ notacao, alvo, tipo, nome: tipo === "acao" ? "Ação" : notacao, vant: vantagemAtual() });
    });

    if (botao) {
      botao.addEventListener("click", () =>
        abrirPainel(document.getElementById("dados-painel").hidden)
      );
    }
    document.querySelectorAll("[data-fechar-dados]").forEach((b) =>
      b.addEventListener("click", () => abrirPainel(false))
    );
    const limpar = document.getElementById("limpar-dados");
    if (limpar) limpar.addEventListener("click", () => {
      document.getElementById("dados-log").innerHTML = "";
    });
  }

  function vantagemAtual() {
    const v = document.querySelector('[name="vantagem"]:checked');
    return v ? Number(v.value) : 0;
  }

  /* -------------------------------------- dados clicáveis no texto do livro */

  function ligarTexto() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".dado[data-d]");
      if (!b) return;
      e.preventDefault();
      const notacao = b.dataset.d;
      const tipo = b.dataset.tipo || tipoPorContexto(notacao, b);
      rolar({
        notacao,
        tipo,
        nome: b.dataset.nome || nomePorTipo(tipo) || notacao,
        mod: b.dataset.mod,
        alvo: b.dataset.alvo,
        vant: vantagemAtual(),
      });
    });
  }

  const NOMES = {
    acao: "Ação", salvaguarda: "Salvaguarda", ressonancia: "Ressonância",
    paradoxo: "Paradoxo", sequela: "Sequela", perseguicao: "Perseguição",
    deriva: "Deriva", chegada: "Deriva de chegada",
  };
  const nomePorTipo = (t) => NOMES[t] || "";

  /** Deduz o tipo pelo dado e pelo texto ao redor — d12 é sempre Paradoxo, etc. */
  function tipoPorContexto(notacao, el) {
    const p = analisar(notacao);
    if (!p) return "";
    const contexto = (el.closest("p, li, td, th, div") || el).textContent.toLowerCase();

    if (p.faces === 12 && p.qtd === 1) return "paradoxo";
    if (p.faces === 10 && p.qtd === 1) return "ressonancia";
    if (p.faces === 100) return "deriva";
    if (p.faces === 4 && p.qtd === 1 && /sequela|descoagul/.test(contexto)) return "sequela";
    if (p.faces === 8 && p.qtd === 1 && /persegui|distância|despist/.test(contexto)) return "perseguicao";
    if (p.faces === 6 && p.qtd === 1 && /salvaguarda|limiar/.test(contexto)) return "salvaguarda";
    if (p.faces === 20) return "acao";
    return "";
  }

  /* ------------------------------------------------------------------ saída */

  window.CHRONO = window.CHRONO || {};
  window.CHRONO.rolar = rolar;
  window.CHRONO.d = d;
  window.CHRONO.analisar = analisar;
  window.CHRONO.abrirDados = abrirPainel;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { montarPainel(); ligarTexto(); });
  } else {
    montarPainel();
    ligarTexto();
  }
})();
