/* ==========================================================================
   CHRONO — ficha de agente
   Calcula os derivados, guarda o elenco no navegador e conversa com o rolador.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const num = (id) => Number($(id)?.value || 0);

  /* ================================================================= tabelas */

  const ATRIBUTOS = ["Corpo", "Reflexo", "Intelecto", "Presença", "Vontade", "Sintonia"];

  const PERICIAS = [
    ["Atletismo", "Corpo"], ["Luta", "Corpo"], ["Resistência", "Corpo"],
    ["Furtividade", "Reflexo"], ["Pontaria", "Reflexo"], ["Pilotagem", "Reflexo"], ["Reflexos", "Reflexo"],
    ["História", "Intelecto"], ["Ciência", "Intelecto"], ["Tecnologia", "Intelecto"], ["Investigação", "Intelecto"], ["Medicina", "Intelecto"],
    ["Persuasão", "Presença"], ["Enganação", "Presença"], ["Intimidação", "Presença"], ["Disfarce", "Presença"],
    ["Autocontrole", "Vontade"], ["Percepção", "Vontade"], ["Comando", "Vontade"],
    ["Leitura de Fluxo", "Sintonia"], ["Ecos", "Sintonia"], ["Ancoragem", "Sintonia"],
  ];

  const PATENTES = ["Novato", "Recruta", "Soldado", "Veterano", "Elite", "Ancião"];

  // Cada classe tem três Trilhas, e a escolha é feita na Camada 1.
  const TRILHAS = {
    Viajante: ["Vanguarda", "Caçador Temporal", "Executor"],
    Ancorador: ["Médico Temporal", "Estabilizador", "Sincronizador"],
    Paradoxista: ["Manipulador", "Rupturista", "Anômalo"],
  };

  const CAMADAS = [
    ["Cego", "Você acha que a Agência é heroica. Só vê o fantasma depois que ele encostou, e as missões parecem episódios soltos."],
    ["Desperto", "+1 Sintonia · +2 EP máx · libera a Trilha. Você vê fantasmas antes de eles agirem — e percebe a mesma pessoa em missões separadas por séculos, sem envelhecer."],
    ["Leitor", "+1 ponto de perícia · libera Enxerto e o grau Expert. Você sente o peso de um evento. Fantasmas passam a conversar, e alguns esperavam você."],
    ["Divergente", "+1 Sintonia · +2 EP máx · +1 habilidade de classe · Trilha III. Você vê as linhas que não aconteceram — e lembra da própria morte de um jeito que não bate com o relatório."],
    ["Âncora", "Uma vez por sessão, ignore um efeito que te apagaria, devolveria ou reescreveria. O teto de Instabilidade sobe para 120. A Agência passa a te tratar como risco."],
    ["Ponto Fixo", "+1 Sintonia · libera o capstone de classe. Você não pode mais ser Devolvido. Consertar o Fluxo ou substituí-lo vira escolha sua."],
  ];

  const ESTADOS_IP = [
    [0, "Estável. O Fluxo não está olhando para você."],
    [25, "Marcado. Fantasmas te percebem à distância. −1 em Presença."],
    [50, "Atravessado. Um fantasma por sessão vem atrás. Desvantagem em Autocontrole."],
    [75, "Dissolvendo. Desvantagem em Corpo — e +2 em Sintonia, porque você está mais perto do Fluxo do que qualquer vivo consegue ficar."],
    [100, "Devolvido. O Fluxo te expulsou de volta ao presente, no meio da missão. Você não morreu: falhou."],
  ];

  const TRAUMAS = [
    ["Afogado, sufocado", "Sem Ar", "Submersão, espaço fechado, sufoco", "Você não entra em pânico com falta de tempo: vantagem contra Medo e contra efeitos de pressa."],
    ["Queimado", "A Coisa Quente", "Fogo descontrolado, queimadura, fumaça", "Vantagem em salvaguardas contra dor e contra a condição Abalado."],
    ["Queda, desabamento", "O Chão Vindo", "Altura, beirada, estrutura cedendo", "Você sempre sabe quanto tempo tem: vantagem em Iniciativa."],
    ["Assassinado, emboscado", "As Costas", "Ser flanqueado, alguém atrás de você", "Vantagem em Percepção para detectar intenção hostil. Nunca é pego por traição sem chance de reagir."],
    ["Doença, epidemia", "O Lento", "Contágio, apodrecimento, hospital, cheiro de doente", "Vantagem em Medicina e contra veneno, doença e contaminação."],
    ["Acidente, máquina", "O Súbito", "Barulho alto e repentino, maquinário pesado", "Por 2 EP, age normalmente mesmo estando Desprevenido."],
    ["Guerra, combate", "O Barulho", "Combate em massa, explosão, muita gente gritando", "Vantagem em Luta quando enfrenta dois ou mais inimigos ao mesmo tempo."],
    ["Frio, exposição, abandono", "Sozinho", "Ser separado do grupo, ficar isolado", "Enquanto estiver sozinho de verdade, +2 em todos os testes."],
    ["Traído por alguém próximo", "A Mão Conhecida", "Aliado te ferindo, promessa quebrada", "Você aprendeu a ler gente: vantagem em Enganação e em resistir a Persuasão."],
    ["Você não lembra", "O Que Não Lembro", "Alguém perguntar como você morreu", "Fantasmas hesitam antes de te tocar: a primeira salvaguarda contra fantasma em cada cena tem vantagem."],
  ];

  /* =============================================================== o estado */

  let IP = 0;
  let DIS = 0;

  const CAMPOS = [
    "f_nome", "f_jogador", "f_classe", "f_arquetipo", "f_nivel", "f_epoca", "f_morte",
    "f_pvnow", "f_trauma", "f_trauma_det", "f_pendencia", "f_habs", "f_enxertos",
    "f_kit", "f_armas", "f_poderes", "epNow",
    "mem1", "mem2", "mem3", "mem4", "mem5",
  ];

  /* ============================================================== montagem */

  function montar() {
    $("atributos").innerHTML = ATRIBUTOS.map((a) => {
      const travado = a === "Sintonia";
      return `<div class="atributo${travado ? " travado" : ""}">
        <label for="at_${a}">${a}</label>
        <input type="number" id="at_${a}" value="${travado ? 0 : 1}" min="0" max="6" inputmode="numeric"${travado ? " readonly tabindex=\"-1\" title=\"Só sobe por Discernimento, nas Camadas 1, 3 e 5\"" : ""}>
      </div>`;
    }).join("");

    $("pericias").innerHTML = PERICIAS.map(([p, a]) =>
      `<div class="pericia">
        <label for="sk_${p}">${p}<span class="pericia-attr">${a.slice(0, 3)}</span></label>
        <input type="number" id="sk_${p}" value="0" min="0" max="5" inputmode="numeric">
        <button type="button" class="dado pericia-total" id="tot_${p}" data-d="1d20" data-tipo="acao" data-nome="${p}" title="Rolar Ação com ${p}">0</button>
      </div>`
    ).join("");

    $("ipTrilha").innerHTML = Array.from({ length: 24 }, (_, i) => {
      const v = (i + 1) * 5;
      const limiar = [25, 50, 75, 100].includes(v);
      return `<button type="button" class="ip-passo${limiar ? " limiar" : ""}" data-v="${v}" aria-label="Instabilidade ${v}" title="${v}"></button>`;
    }).join("");

    $("camadas").innerHTML = CAMADAS.map((c, i) =>
      `<button type="button" class="camada" data-c="${i}" aria-pressed="false"><b>${i}</b><span>${c[0]}</span></button>`
    ).join("");

    $("memorias").innerHTML = [1, 2, 3, 4, 5].map((i) =>
      `<div class="memoria">
        <input type="checkbox" id="q${i}" aria-label="Queimar a memória ${i}">
        <input type="text" id="mem${i}" placeholder="memória ${i}" autocomplete="off">
      </div>`
    ).join("");

    $("f_trauma").innerHTML = '<option value="">—</option>' +
      TRAUMAS.map(([morte, nome]) => `<option value="${nome}">${morte} · ${nome}</option>`).join("");
  }

  /* =============================================================== o cálculo */

  function calcular() {
    // Sintonia não é comprada: sobe nas Camadas 1, 3 e 5.
    $("at_Sintonia").value = (DIS >= 1 ? 1 : 0) + (DIS >= 3 ? 1 : 0) + (DIS >= 5 ? 1 : 0);
    $("nota-sintonia").textContent =
      "Sintonia começa em 0 e não pode ser comprada. Ela sobe sozinha nas Camadas 1, 3 e 5 — no começo da campanha você é surdo para o tempo.";

    const nivel = Math.min(20, Math.max(1, num("f_nivel")));
    const patente = nivel >= 19 ? 5 : nivel >= 16 ? 4 : nivel >= 12 ? 3 : nivel >= 8 ? 2 : nivel >= 4 ? 1 : 0;
    $("f_patente").value = `${PATENTES[patente]} (+${patente})`;

    // as Camadas 1 e 3 dão +2 de EP máx cada (Parte V)
    const bonusCamada = (DIS >= 1 ? 2 : 0) + (DIS >= 3 ? 2 : 0);
    const queimadas = [1, 2, 3, 4, 5].filter((i) => $("q" + i).checked).length;

    const pv = 10 + num("at_Corpo") * 2 + nivel * 2 + patente * 3;
    const epMax = Math.max(0, 10 + num("at_Vontade") * 2 + nivel + patente + bonusCamada - queimadas * 5);

    $("d_pv").textContent = pv;
    $("pvMax").textContent = pv;
    $("d_ep").textContent = epMax;
    $("epMax").textContent = epMax;
    $("d_def").textContent = 10 + num("at_Reflexo") + patente;
    $("d_ini").textContent = "+" + (num("at_Reflexo") + patente);
    $("d_carga").textContent = 5 + num("at_Corpo") + patente;
    $("d_lim").textContent = 2 + Math.floor(nivel / 4);

    // ficha nova abre com os medidores cheios, não em zero
    if ($("epNow").value === "") $("epNow").value = epMax;
    if ($("f_pvnow").value === "") $("f_pvnow").value = pv;
    if (num("epNow") > epMax) $("epNow").value = epMax;
    if (num("f_pvnow") > pv) $("f_pvnow").value = pv;

    const pvAgora = num("f_pvnow");
    $("aviso-pv").textContent = pvAgora <= 0
      ? "Descoagulando: inconsciente e translúcido, +10 IP por rodada até ser estabilizado. Medicina ND 12, ou qualquer habilidade de Costurador. Ao voltar, role 1d4 de Sequela."
      : "";
    $("aviso-pv").classList.toggle("alerta", pvAgora <= 0);

    // perícias: o botão já mostra o total e é o modificador da rolagem
    PERICIAS.forEach(([p, a]) => {
      const total = num("at_" + a) + num("sk_" + p);
      const b = $("tot_" + p);
      b.textContent = total >= 0 ? "+" + total : String(total);
      b.dataset.mod = String(total);
    });

    // Instabilidade Pessoal
    const teto = DIS >= 4 ? 120 : 100;
    IP = Math.max(0, Math.min(teto, IP));
    $("ipTeto").textContent = teto;
    $("ipRead").textContent = IP;
    document.querySelectorAll("#ipTrilha .ip-passo").forEach((c) => {
      const v = Number(c.dataset.v);
      c.classList.toggle("cheio", v <= IP);
      c.hidden = v > teto;
    });
    let estado = ESTADOS_IP[0][1];
    ESTADOS_IP.forEach(([lim, txt]) => { if (IP >= lim) estado = txt; });
    $("ipEstado").textContent = estado;
    $("ipEstado").classList.toggle("alerta", IP >= 75);

    // Discernimento
    document.querySelectorAll(".camada").forEach((c) => {
      const on = Number(c.dataset.c) <= DIS;
      c.classList.toggle("cheia", on);
      c.setAttribute("aria-pressed", String(Number(c.dataset.c) === DIS));
    });
    $("camadaTexto").textContent = CAMADAS[DIS][1];

    const TRAVAS = [[5, 1], [9, 2], [13, 3], [17, 4], [20, 5]];
    const falta = TRAVAS.filter(([n, c]) => nivel >= n && DIS < c).pop();
    if (falta) {
      $("camadaTrava").textContent = `Travado no nível ${falta[0]}: subir exige Camada ${falta[1]}. Discernimento não sobe matando — sobe entendendo.`;
      $("camadaTrava").classList.add("alerta");
    } else {
      const proxima = TRAVAS.find(([n]) => n > nivel);
      $("camadaTrava").textContent = proxima
        ? `Próxima trava: o nível ${proxima[0]} vai exigir Camada ${proxima[1]}.`
        : "Nenhuma trava pela frente.";
      $("camadaTrava").classList.remove("alerta");
    }

    // Trilhas: só as da classe escolhida
    const classe = $("f_classe").value;
    const trilhas = TRILHAS[classe] || [];
    const trilhaAtual = $("f_arquetipo").value;
    $("f_arquetipo").disabled = !classe;
    $("f_arquetipo").innerHTML =
      '<option value="">' + (classe ? "—" : "escolha a classe antes") + "</option>" +
      trilhas.map((t) => `<option${t === trilhaAtual ? " selected" : ""}>${t}</option>`).join("");

    // Trauma
    const t = TRAUMAS.find(([, nome]) => nome === $("f_trauma").value);
    $("traumaTexto").innerHTML = t
      ? `<strong>${t[1]}.</strong> <em>Gatilho:</em> ${t[2]}. <em>Compensação:</em> ${t[3]}`
      : "Escolha o Trauma que corresponde à sua morte. A Compensação é o ponto: você é bom nisso porque foi isso que te matou.";

    // Memórias
    $("memoriaAviso").textContent = queimadas === 0
      ? "Queimar uma memória: EP totalmente restaurado, ou um teste falhado vira sucesso, ou anula um efeito que te apagaria. Custa −5 de EP máx, para sempre."
      : queimadas >= 5
      ? "As cinco queimaram. Não sobrou o suficiente de você: o agente vira fantasma e passa para as mãos do mestre."
      : `${queimadas} de 5 queimadas · −${queimadas * 5} de EP máx, permanente. Leia a memória em voz alta antes de riscar.`;
    $("memoriaAviso").classList.toggle("alerta", queimadas >= 4);

    [1, 2, 3, 4, 5].forEach((i) => {
      $("mem" + i).classList.toggle("queimada", $("q" + i).checked);
    });
  }

  /* ================================================================ guardar */

  const CHAVE = "chrono:fichas";
  let elenco = { ativa: "", fichas: {} };
  let guardando = null;

  function coletar() {
    const d = { IP, DIS, campos: {}, atributos: {}, pericias: {} };
    CAMPOS.forEach((c) => { if ($(c)) d.campos[c] = $(c).value; });
    d.queimadas = [1, 2, 3, 4, 5].map((i) => $("q" + i).checked);
    ATRIBUTOS.forEach((a) => { d.atributos[a] = $("at_" + a).value; });
    PERICIAS.forEach(([p]) => { d.pericias[p] = $("sk_" + p).value; });
    return d;
  }

  function aplicar(d) {
    IP = Number(d.IP) || 0;
    DIS = Number(d.DIS) || 0;
    CAMPOS.forEach((c) => { if ($(c)) $(c).value = ""; });
    ATRIBUTOS.forEach((a) => { $("at_" + a).value = a === "Sintonia" ? 0 : 1; });
    PERICIAS.forEach(([p]) => { $("sk_" + p).value = 0; });
    [1, 2, 3, 4, 5].forEach((i) => { $("q" + i).checked = false; });

    Object.entries(d.campos || {}).forEach(([k, v]) => { if ($(k)) $(k).value = v; });
    Object.entries(d.atributos || {}).forEach(([k, v]) => { if ($("at_" + k)) $("at_" + k).value = v; });
    Object.entries(d.pericias || {}).forEach(([k, v]) => { if ($("sk_" + k)) $("sk_" + k).value = v; });
    (d.queimadas || []).forEach((v, i) => { if ($("q" + (i + 1))) $("q" + (i + 1)).checked = !!v; });
    if (!$("f_nivel").value) $("f_nivel").value = 1;
    calcular();
  }

  function lerElenco() {
    try {
      const cru = localStorage.getItem(CHAVE);
      if (cru) elenco = JSON.parse(cru);
    } catch (e) {}
    if (!elenco || typeof elenco !== "object" || !elenco.fichas) elenco = { ativa: "", fichas: {} };
    if (!Object.keys(elenco.fichas).length) {
      const id = novoId();
      elenco.fichas[id] = { nome: "Agente sem nome", dados: { IP: 0, DIS: 0, campos: {}, atributos: {}, pericias: {} } };
      elenco.ativa = id;
    }
    if (!elenco.fichas[elenco.ativa]) elenco.ativa = Object.keys(elenco.fichas)[0];
  }

  const novoId = () => "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function gravarElenco(aviso) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(elenco));
      if (aviso !== false) sinalizar("Salvo neste navegador.");
    } catch (e) {
      sinalizar("Não foi possível salvar: o navegador bloqueou o armazenamento. Use Exportar.", true);
    }
  }

  function guardarAtual() {
    const f = elenco.fichas[elenco.ativa];
    if (!f) return;
    f.dados = coletar();
    f.nome = ($("f_nome").value || "").trim() || "Agente sem nome";
    clearTimeout(guardando);
    guardando = setTimeout(() => { gravarElenco(); desenharElenco(); }, 500);
  }

  function sinalizar(txt, erro) {
    const el = $("ficha-salvo");
    el.textContent = txt;
    el.classList.toggle("alerta", !!erro);
    clearTimeout(sinalizar._t);
    sinalizar._t = setTimeout(() => { el.textContent = ""; }, 2600);
  }

  function desenharElenco() {
    const sel = $("elenco");
    sel.innerHTML = Object.entries(elenco.fichas)
      .map(([id, f]) => `<option value="${id}"${id === elenco.ativa ? " selected" : ""}>${escapar(f.nome)}</option>`)
      .join("");
  }

  const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function trocarPara(id) {
    if (!elenco.fichas[id]) return;
    elenco.ativa = id;
    aplicar(elenco.fichas[id].dados || {});
    gravarElenco(false);
    desenharElenco();
  }

  /* ================================================================== ações */

  function rolar(spec) {
    if (window.CHRONO && window.CHRONO.rolar) return window.CHRONO.rolar(spec);
    return null;
  }

  function ligarAcoes() {
    // vida e esforço
    document.addEventListener("click", (e) => {
      const pv = e.target.closest("[data-pv]");
      if (pv) {
        const max = Number($("pvMax").textContent);
        $("f_pvnow").value = Math.min(max, num("f_pvnow") + Number(pv.dataset.pv));
        calcular(); guardarAtual(); return;
      }
      const ep = e.target.closest("[data-ep]");
      if (ep) {
        const max = Number($("epMax").textContent);
        $("epNow").value = Math.max(0, Math.min(max, num("epNow") + Number(ep.dataset.ep)));
        guardarAtual(); return;
      }
      const ip = e.target.closest("[data-ip]");
      if (ip) {
        IP += Number(ip.dataset.ip);
        if (Number(ip.dataset.ip) < 0) registrar("Ato de Âncora: −5 de Instabilidade. Uma vez por sessão, e precisa ser uma cena.");
        calcular(); guardarAtual(); return;
      }
      const passo = e.target.closest(".ip-passo");
      if (passo) {
        const v = Number(passo.dataset.v);
        IP = IP === v ? v - 5 : v;
        calcular(); guardarAtual(); return;
      }
      const camada = e.target.closest(".camada");
      if (camada) {
        DIS = Number(camada.dataset.c);
        calcular(); guardarAtual(); return;
      }
    });

    $("btn-descompressao").addEventListener("click", () => {
      $("epNow").value = $("epMax").textContent;
      $("f_pvnow").value = $("pvMax").textContent;
      IP = Math.max(0, IP - 20);
      calcular(); guardarAtual();
      registrar("Descompressão na Agência: Esforço e vida cheios, −20 de Instabilidade. Você tem 3 Ações de Base.");
    });

    $("btn-respiro").addEventListener("click", () => {
      const ganho = Math.ceil(num("at_Vontade") / 2);
      const max = Number($("epMax").textContent);
      $("epNow").value = Math.min(max, num("epNow") + ganho);
      guardarAtual();
      registrar(`Respiro em campo, dez minutos seguros: +${ganho} de Esforço (metade da Vontade, arredondando para cima).`);
    });

    $("btn-sacar").addEventListener("click", () => {
      const r = rolar({ notacao: "1d6", nome: "Sacar do Fluxo" });
      const ganho = r ? r.total : 1 + Math.floor(Math.random() * 6);
      const max = Number($("epMax").textContent);
      $("epNow").value = Math.min(max, num("epNow") + ganho);
      IP += 5;
      calcular(); guardarAtual();
      registrar(`Sacou do Fluxo: +${ganho} de Esforço e +5 de Instabilidade. Você ficou um pouco mais parecido com um fantasma.`);
    });

    $("btn-rebobinar").addEventListener("click", () => {
      const max = Number($("epMax").textContent);
      if (num("epNow") < 3) { registrar("Sem Esforço para rebobinar: custa 3 EP.", true); return; }
      $("epNow").value = Math.max(0, num("epNow") - 3);
      guardarAtual();
      rolar({ notacao: "1d20", tipo: "acao", nome: "Rebobinar" });
      registrar("Rebobinar: −3 de Esforço. Repetir o mesmo teste de novo custa +5 de Instabilidade, e a terceira vez +10.");
    });

    $("btn-trauma").addEventListener("click", () => {
      const r = rolar({ notacao: "1d6", tipo: "salvaguarda", nome: "Trauma · Autocontrole", mod: num("sk_Autocontrole") + patenteAtual(), alvo: 6 });
      if (!r) return;
      if (r.total >= 6) {
        $("epNow").value = Math.min(Number($("epMax").textContent), num("epNow") + 1);
        registrar("Encarou de frente: +1 de Esforço.");
      } else {
        IP += 5;
        registrar("Abalado até o fim da cena e +5 de Instabilidade. Cada falha na mesma missão sobe o limiar em 2.");
      }
      calcular(); guardarAtual();
    });

    function patenteAtual() {
      const n = Math.min(20, Math.max(1, num("f_nivel")));
      return n >= 18 ? 4 : n >= 13 ? 3 : n >= 9 ? 2 : n >= 5 ? 1 : 0;
    }

    function registrar(txt, erro) {
      const el = $("ficha-log");
      el.textContent = txt;
      el.classList.toggle("alerta", !!erro);
    }

    // elenco
    $("elenco").addEventListener("change", (e) => trocarPara(e.target.value));

    $("ficha-nova").addEventListener("click", () => {
      guardarAtual();
      const id = novoId();
      elenco.fichas[id] = { nome: "Agente sem nome", dados: { IP: 0, DIS: 0, campos: {}, atributos: {}, pericias: {} } };
      trocarPara(id);
      $("f_nome").focus();
    });

    $("ficha-duplicar").addEventListener("click", () => {
      const id = novoId();
      const atual = coletar();
      elenco.fichas[id] = { nome: (($("f_nome").value || "Agente") + " (cópia)"), dados: atual };
      elenco.fichas[id].dados.campos.f_nome = elenco.fichas[id].nome;
      trocarPara(id);
    });

    $("ficha-apagar").addEventListener("click", () => {
      const nome = elenco.fichas[elenco.ativa]?.nome || "este agente";
      if (!confirm(`Apagar ${nome} deste navegador? Não dá para desfazer — exporte antes se quiser guardar.`)) return;
      delete elenco.fichas[elenco.ativa];
      if (!Object.keys(elenco.fichas).length) {
        const id = novoId();
        elenco.fichas[id] = { nome: "Agente sem nome", dados: { IP: 0, DIS: 0, campos: {}, atributos: {}, pericias: {} } };
      }
      trocarPara(Object.keys(elenco.fichas)[0]);
    });

    $("ficha-exportar").addEventListener("click", () => {
      const d = coletar();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }));
      a.download = (($("f_nome").value || "").trim().toLowerCase().replace(/\s+/g, "-") || "agente") + "-chrono.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    $("ficha-importar").addEventListener("click", () => $("ficha-arquivo").click());

    $("ficha-arquivo").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        let d;
        try { d = JSON.parse(r.result); } catch (err) { d = null; }
        if (!d || typeof d !== "object" || !d.campos) {
          sinalizar("Esse arquivo não é uma ficha do CHRONO. Escolha o .json exportado daqui.", true);
          return;
        }
        const id = novoId();
        elenco.fichas[id] = { nome: (d.campos.f_nome || "Agente importado"), dados: d };
        trocarPara(id);
        sinalizar("Ficha importada.");
      };
      r.readAsText(f);
      e.target.value = "";
    });

    $("ficha-imprimir").addEventListener("click", () => window.print());

    // qualquer edição recalcula e guarda
    document.addEventListener("input", (e) => {
      if (e.target.closest(".ficha")) { calcular(); guardarAtual(); }
    });
    document.addEventListener("change", (e) => {
      if (e.target.closest(".ficha")) { calcular(); guardarAtual(); }
    });
  }

  /* ================================================================== início */

  montar();
  lerElenco();
  desenharElenco();
  aplicar(elenco.fichas[elenco.ativa].dados || {});
  ligarAcoes();
  calcular();
})();
