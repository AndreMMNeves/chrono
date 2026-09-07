/* ==========================================================================
   CHRONO — comportamento comum: tema, busca, sumário e uso offline.
   ========================================================================== */

(function () {
  "use strict";

  const raiz = document.documentElement;
  const pagina = raiz.dataset.pagina || "";
  const TEMA_FIXO = pagina === "inicio" || pagina === "mesa";

  /* ==================================================================== tema */

  (function tema() {
    const botao = document.getElementById("alternar-tema");
    if (!botao) return;

    // o hub e a mesa foram desenhados no escuro; lá o botão não tem o que fazer
    if (TEMA_FIXO) { botao.hidden = true; return; }

    const rotulo = botao.querySelector("[data-rotulo-tema]");
    const pintar = () => {
      const zona = raiz.dataset.tema === "zona";
      if (rotulo) rotulo.textContent = zona ? "Papel" : "Zona";
      botao.setAttribute("aria-label", zona ? "Voltar ao tema papel" : "Ler no tema Zona, escuro");
    };

    botao.addEventListener("click", () => {
      const novo = raiz.dataset.tema === "zona" ? "papel" : "zona";
      raiz.dataset.tema = novo;
      try { localStorage.setItem("chrono:tema", novo); } catch (e) {}
      pintar();
    });

    pintar();
  })();

  /* =================================================================== busca */

  (function busca() {
    const fundo = document.getElementById("busca");
    const campo = document.getElementById("busca-campo");
    const lista = document.getElementById("busca-lista");
    const abrirBtn = document.getElementById("abrir-busca");
    if (!fundo || !campo || !lista) return;

    const INDICE = (window.CHRONO_INDICE || []).map((e) => ({
      ...e,
      _t: normal(e.t),
      _p: normal(e.p || ""),
      _c: normal(e.c || ""),
    }));

    let resultados = [];
    let ativo = 0;
    let ultimoFoco = null;

    function normal(s) {
      return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function pontuar(entrada, termos) {
      let total = 0;
      for (const termo of termos) {
        let p = 0;
        const it = entrada._t.indexOf(termo);
        if (it === 0) p += 60;
        else if (it > 0) p += 40;
        if (entrada._p.includes(termo)) p += 12;

        const ic = entrada._c.indexOf(termo);
        if (ic >= 0) p += 10 + Math.max(0, 8 - Math.floor(ic / 90));

        if (p === 0) return 0; // todos os termos precisam aparecer
        total += p;
      }
      // seções curtas e específicas ganham da parte inteira
      return total + (entrada.t.length < 34 ? 4 : 0);
    }

    function trecho(entrada, termos) {
      const texto = entrada.c || "";
      if (!texto) return "";
      const alvo = normal(texto);
      let i = -1;
      for (const t of termos) {
        const j = alvo.indexOf(t);
        if (j >= 0 && (i < 0 || j < i)) i = j;
      }
      const inicio = i < 0 ? 0 : Math.max(0, i - 55);
      let corte = texto.slice(inicio, inicio + 190);
      if (inicio > 0) corte = "…" + corte;
      if (inicio + 190 < texto.length) corte += "…";
      return realcar(corte, termos);
    }

    function realcar(texto, termos) {
      const alvo = normal(texto);
      const marcas = [];
      for (const t of termos) {
        let i = alvo.indexOf(t);
        while (i >= 0) { marcas.push([i, i + t.length]); i = alvo.indexOf(t, i + t.length); }
      }
      if (!marcas.length) return esc(texto);
      marcas.sort((a, b) => a[0] - b[0]);
      let saida = "", fim = 0;
      for (const [a, b] of marcas) {
        if (a < fim) continue;
        saida += esc(texto.slice(fim, a)) + "<mark>" + esc(texto.slice(a, b)) + "</mark>";
        fim = b;
      }
      return saida + esc(texto.slice(fim));
    }

    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

    function buscar(consulta) {
      const termos = normal(consulta).split(/\s+/).filter((t) => t.length > 1);
      if (!termos.length) return [];
      return INDICE
        .map((e) => ({ e, n: pontuar(e, termos) }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n)
        .slice(0, 24)
        .map((x) => ({ ...x.e, _trecho: trecho(x.e, termos) }));
    }

    function desenhar() {
      if (!campo.value.trim()) {
        lista.innerHTML = `<li class="busca-vazio">Digite para buscar nos três livros ao mesmo tempo.</li>`;
        return;
      }
      if (!resultados.length) {
        lista.innerHTML = `<li class="busca-vazio">Nada com esse termo. Tente “instabilidade”, “paradoxo” ou “costurador”.</li>`;
        return;
      }
      lista.innerHTML = resultados
        .map(
          (r, i) => `<li role="option" aria-selected="${i === ativo}"><a class="busca-item" href="${r.u}"${i === ativo ? " data-ativo" : ""}>
            <span class="b-topo"><span class="b-titulo">${esc(r.t)}</span><span class="b-livro">${esc(r.l)}</span></span>
            ${r._trecho ? `<p class="b-trecho">${r._trecho}</p>` : ""}
          </a></li>`
        )
        .join("");
      const alvo = lista.querySelector("[data-ativo]");
      if (alvo) alvo.scrollIntoView({ block: "nearest" });
    }

    function abrir() {
      ultimoFoco = document.activeElement;
      fundo.hidden = false;
      campo.value = "";
      resultados = [];
      ativo = 0;
      desenhar();
      campo.focus();
    }

    function fechar() {
      fundo.hidden = true;
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    function mover(passo) {
      if (!resultados.length) return;
      ativo = (ativo + passo + resultados.length) % resultados.length;
      desenhar();
    }

    campo.addEventListener("input", () => {
      resultados = buscar(campo.value);
      ativo = 0;
      desenhar();
    });

    campo.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); mover(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); mover(-1); }
      else if (e.key === "Enter") {
        const alvo = lista.querySelector("[data-ativo]");
        if (alvo) { e.preventDefault(); location.href = alvo.getAttribute("href"); }
      }
    });

    fundo.addEventListener("click", (e) => {
      if (e.target === fundo || e.target.closest("[data-fechar-busca]")) fechar();
    });

    if (abrirBtn) abrirBtn.addEventListener("click", abrir);

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrir(); }
      else if (e.key === "Escape" && !fundo.hidden) fechar();
      else if (e.key === "/" && fundo.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
        e.preventDefault(); abrir();
      }
    });
  })();

  /* ================================================================= sumário */

  (function sumario() {
    const trilho = document.querySelector(".trilho");
    if (!trilho) return;

    const links = [...trilho.querySelectorAll('a[href^="#"]')];
    if (!links.length) return;

    const porId = new Map(links.map((a) => [decodeURIComponent(a.getAttribute("href").slice(1)), a]));
    const titulos = [...document.querySelectorAll(".corpo h2[id], .corpo h3[id], .corpo h4[id]")]
      .filter((h) => porId.has(h.id));

    let atual = null;
    const marcar = (id) => {
      if (id === atual) return;
      atual = id;
      links.forEach((a) => a.removeAttribute("aria-current"));
      const a = porId.get(id);
      if (!a) return;
      a.setAttribute("aria-current", "true");

      /* Só arrasta o trilho, e só se o item saiu de vista. Nada de
         scrollIntoView aqui: ele rola todos os ancestrais roláveis, inclusive
         a página, e o texto pula sozinho debaixo de quem está lendo. */
      if (trilho.scrollHeight <= trilho.clientHeight) return;
      const r = a.getBoundingClientRect();
      const t = trilho.getBoundingClientRect();
      if (r.top < t.top + 24 || r.bottom > t.bottom - 24) {
        trilho.scrollTop += r.top - t.top - (t.height - r.height) / 2;
      }
    };

    /* A seção atual é a última cujo título já passou pela barra. Uma faixa de
       IntersectionObserver erra quando o leitor pula direto para uma âncora:
       o título fica no topo, fora da faixa, e o destaque vai para o seguinte. */
    let agendado = false;

    const atualizar = () => {
      agendado = false;
      /* O limite acompanha o scroll-padding-top do html: é exatamente onde um
         título para quando alguém abre um link de âncora. */
      const recuo = parseFloat(getComputedStyle(raiz).scrollPaddingTop) || 76;
      const limite = recuo + 12;
      let escolhido = titulos[0];
      for (const h of titulos) {
        if (h.getBoundingClientRect().top <= limite) escolhido = h;
        else break;
      }
      // no fim da página o último título é sempre o assunto
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) {
        escolhido = titulos[titulos.length - 1];
      }
      if (escolhido) marcar(escolhido.id);
    };

    const agendar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizar);
    };

    addEventListener("scroll", agendar, { passive: true });
    addEventListener("resize", agendar, { passive: true });
    atualizar();

    // no celular o sumário é uma gaveta — o botão já veio no HTML, recolhido
    const gaveta = trilho.querySelector(".trilho-gaveta");
    const conteudo = trilho.querySelector(".trilho-conteudo");
    if (!gaveta || !conteudo) return;

    const fechar = () => {
      trilho.removeAttribute("data-aberto");
      gaveta.setAttribute("aria-expanded", "false");
    };

    gaveta.addEventListener("click", () => {
      const abrindo = !trilho.hasAttribute("data-aberto");
      if (abrindo) trilho.dataset.aberto = "";
      else trilho.removeAttribute("data-aberto");
      gaveta.setAttribute("aria-expanded", String(abrindo));
    });

    conteudo.addEventListener("click", (e) => {
      if (e.target.closest("a")) fechar();
    });
  })();

  /* ================================================================= offline */

  /* Em localhost o worker não entra: durante o desenvolvimento ele serve a
     versão guardada e você fica olhando para um CSS que já mudou. Se já houver
     um registrado da última vez, ele sai de cena e leva o cache junto. */
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    if (local) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        if (!regs.length) return;
        regs.forEach((r) => r.unregister());
        if (window.caches) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
      });
    } else {
      addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }
})();
