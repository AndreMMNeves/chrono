/* ==========================================================================
   CHRONO — painel do mestre
   Relógios da missão, ordem da rodada e a régua de Grau.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const CHAVE = "chrono:mesa";

  /* ================================================================ tabelas */

  const CONQUISTAS = [
    ["Descobrir a natureza real da anomalia", 5, 10],
    ["Neutralizar um efeito colateral", 5, 15],
    ["Remover o objeto ou ser deslocado da época", 15, 25],
    ["Corrigir o ato central da divergência", 25, 40],
    ["Apagar rastros e testemunhas do grupo", 5, 10],
  ];

  const SUSPEITA = {
    3: "Observação. Um segundo agente acompanha as missões. Simpático, competente, e relata tudo.",
    5: "Restrição. Patente congelada para o grupo inteiro. Sem requisição acima de Anacronismo 2.",
    7: "Teste. Chega uma missão que é claramente uma armadilha. Recusar sobe +2. Aceitar é a única forma de baixar.",
    10: "Corte. A Agência tenta reancorar o grupo à força e apagar as Camadas conquistadas. Isso é um arco inteiro.",
  };

  const GRAUS = [
    { g: 1, def: 12, pv: 20, atq: 3, dano: "1d6+2", salv: 1, nivel: "1–4" },
    { g: 2, def: 15, pv: 45, atq: 6, dano: "1d8+4", salv: 3, nivel: "5–8" },
    { g: 3, def: 18, pv: 90, atq: 9, dano: "2d6+6", salv: 5, nivel: "9–12" },
    { g: 4, def: 21, pv: 170, atq: 12, dano: "3d6+8", salv: 7, nivel: "13–17" },
    { g: 5, def: 24, pv: 300, atq: 15, dano: "4d6+10", salv: 9, nivel: "18–20" },
  ];

  const TRACOS = {
    1: "",
    2: "",
    3: "Presença Pesada: a cena inteira sobe +5 IP em quem ficar perto por uma cena inteira.",
    4: "Presença Pesada. Resiliência: nenhum golpe único tira mais que 20 PV — Ataque Extra ajuda, nuke não funciona. Duas Ações: age duas vezes por rodada, em iniciativas diferentes.",
    5: "Presença Pesada, Resiliência e Duas Ações. Não Se Mata Assim: reduzir a 0 PV não resolve. Só a solução correta da ficha resolve.",
  };

  /* ================================================================= estado */

  let e = { missao: "", IF: 100, suspeita: 0, grau: 1, ini: [], vez: 0, rodada: 1 };

  function ler() {
    try {
      const cru = localStorage.getItem(CHAVE);
      if (cru) e = Object.assign(e, JSON.parse(cru));
    } catch (err) {}
    if (!Array.isArray(e.ini)) e.ini = [];
  }

  function gravar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(e)); } catch (err) {}
  }

  const rolar = (spec) => (window.CHRONO && window.CHRONO.rolar ? window.CHRONO.rolar(spec) : null);
  const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ============================================================== montagem */

  function montar() {
    $("ifConquistas").innerHTML = CONQUISTAS.map(
      ([nome, min, max]) =>
        `<div class="conquista">
          <span>${nome}</span>
          <span class="conquista-botoes">
            <button type="button" class="btn btn-fantasma btn-mini" data-if="-${min}">−${min}%</button>
            ${min !== max ? `<button type="button" class="btn btn-fantasma btn-mini" data-if="-${max}">−${max}%</button>` : ""}
          </span>
        </div>`
    ).join("");

    $("suspeita").innerHTML = Array.from({ length: 11 }, (_, i) =>
      `<button type="button" class="susp-passo${SUSPEITA[i] ? " limiar" : ""}" data-v="${i}" aria-label="Suspeita ${i}">${i}</button>`
    ).join("");

    $("grauEscolha").innerHTML = GRAUS.map(
      (g) => `<button type="button" class="grau-btn" data-g="${g.g}" aria-pressed="false">Grau ${g.g}</button>`
    ).join("");
  }

  /* ============================================================== desenhar */

  function desenhar() {
    $("m_missao").value = e.missao || "";

    // Instabilidade do Fluxo
    e.IF = Math.max(0, Math.min(100, Math.round(e.IF)));
    $("ifValor").textContent = e.IF;
    $("ifPreenchida").style.width = e.IF + "%";
    const fechada = e.IF <= 15;
    $("ifEstado").textContent = fechada
      ? "Resolvida. O Fluxo se conserta sozinho a partir daqui — sumam, ou fiquem e empurrem mais para baixo."
      : "Missão em aberto. Fecha em 15% ou menos.";
    $("ifEstado").classList.toggle("bom", fechada);
    $("m-deriva").disabled = !fechada;
    $("ifNotaDeriva").textContent = fechada
      ? `Role 1d100 na frente de todos. ${e.IF} ou menos, e fica uma Deriva permanente — ${e.IF}% de chance de estragar alguma coisa.`
      : "A Deriva só se rola com a missão fechada, em 15% ou menos.";

    // Suspeita
    e.suspeita = Math.max(0, Math.min(10, e.suspeita));
    document.querySelectorAll(".susp-passo").forEach((b) => {
      b.classList.toggle("cheio", Number(b.dataset.v) <= e.suspeita && Number(b.dataset.v) > 0);
      b.setAttribute("aria-pressed", String(Number(b.dataset.v) === e.suspeita));
    });
    const limiar = [10, 7, 5, 3].find((n) => e.suspeita >= n);
    $("suspeitaEstado").textContent = limiar
      ? SUSPEITA[limiar]
      : "A Agência ainda não está olhando para vocês.";
    $("suspeitaEstado").classList.toggle("alerta", e.suspeita >= 7);

    // Régua de Grau
    const g = GRAUS.find((x) => x.g === e.grau) || GRAUS[0];
    $("g_def").textContent = g.def;
    $("g_pv").textContent = g.pv;
    $("g_atq").textContent = "+" + g.atq;
    $("g_atq").dataset.mod = String(g.atq);
    $("g_dano").textContent = g.dano;
    $("g_dano").dataset.d = g.dano;
    $("g_salv").textContent = "+" + g.salv;
    $("g_nivel").textContent = g.nivel;
    $("grauTracos").textContent = TRACOS[g.g] || "Sem traços automáticos neste Grau.";
    document.querySelectorAll(".grau-btn").forEach((b) => {
      const on = Number(b.dataset.g) === e.grau;
      b.classList.toggle("ativo", on);
      b.setAttribute("aria-pressed", String(on));
    });

    desenharIniciativa();
  }

  function desenharIniciativa() {
    const lista = $("ini-lista");
    if (!e.ini.length) {
      lista.innerHTML = `<li class="ini-vazio">Ninguém na ordem ainda. Iniciativa é d20 + Reflexo + patente, uma vez por combate.</li>`;
      $("ini-rodada").textContent = "";
      return;
    }
    if (e.vez >= e.ini.length) e.vez = 0;
    lista.innerHTML = e.ini
      .map(
        (p, i) =>
          `<li class="ini-item${i === e.vez ? " vez" : ""}">
            <span class="ini-valor">${p.v}</span>
            <span class="ini-nome">${escapar(p.nome)}</span>
            <button type="button" class="btn btn-fantasma btn-mini" data-remover="${i}" aria-label="Tirar ${escapar(p.nome)} da ordem">Sair</button>
          </li>`
      )
      .join("");
    $("ini-rodada").textContent = `Rodada ${e.rodada} · é a vez de ${e.ini[e.vez].nome}`;
  }

  /* ================================================================= ações */

  function ligar() {
    $("m_missao").addEventListener("input", () => { e.missao = $("m_missao").value; gravar(); });

    document.addEventListener("click", (ev) => {
      const bif = ev.target.closest("[data-if]");
      if (bif) { e.IF += Number(bif.dataset.if); gravar(); desenhar(); return; }

      const bs = ev.target.closest("[data-susp]");
      if (bs) { e.suspeita += Number(bs.dataset.susp); gravar(); desenhar(); return; }

      const sp = ev.target.closest(".susp-passo");
      if (sp) { e.suspeita = Number(sp.dataset.v); gravar(); desenhar(); return; }

      const bg = ev.target.closest(".grau-btn");
      if (bg) { e.grau = Number(bg.dataset.g); gravar(); desenhar(); return; }

      const rem = ev.target.closest("[data-remover]");
      if (rem) {
        const i = Number(rem.dataset.remover);
        e.ini.splice(i, 1);
        if (e.vez > i) e.vez--;
        gravar(); desenharIniciativa(); return;
      }
    });

    $("m-deriva").addEventListener("click", () => {
      rolar({ notacao: "1d100", tipo: "deriva", nome: "Deriva final", alvo: e.IF });
    });

    $("m-zerar").addEventListener("click", () => {
      if (!confirm("Começar uma missão nova? Zera a Instabilidade do Fluxo em 100% e limpa a ordem da rodada. A Suspeita fica, porque ela é da campanha.")) return;
      e.IF = 100;
      e.ini = [];
      e.vez = 0;
      e.rodada = 1;
      e.missao = "";
      gravar(); desenhar();
    });

    $("ini-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const nome = $("ini-nome").value.trim();
      if (!nome) { $("ini-nome").focus(); return; }
      const mod = Number($("ini-mod").value) || 0;
      const r = rolar({ notacao: "1d20", mod, nome: `Iniciativa · ${nome}` });
      e.ini.push({ nome, v: r ? r.total : 0 });
      e.ini.sort((a, b) => b.v - a.v);
      $("ini-nome").value = "";
      $("ini-nome").focus();
      gravar(); desenharIniciativa();
    });

    $("ini-proximo").addEventListener("click", () => {
      if (!e.ini.length) return;
      e.vez++;
      if (e.vez >= e.ini.length) { e.vez = 0; e.rodada++; }
      gravar(); desenharIniciativa();
    });

    $("ini-limpar").addEventListener("click", () => {
      e.ini = []; e.vez = 0; e.rodada = 1;
      gravar(); desenharIniciativa();
    });
  }

  /* ================================================================ início */

  montar();
  ler();
  ligar();
  desenhar();
})();
