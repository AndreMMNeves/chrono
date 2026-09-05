/**
 * Gera a treliça do Fluxo — o desenho central do CHRONO.
 *
 * "Cada evento é uma viga, e o presente é o prédio em cima delas.
 *  Mexa numa viga e o prédio se reconstrói."
 *
 * Cada viga vertical é um evento. O banzo superior é o presente que elas
 * sustentam. Uma viga está partida: é a anomalia, e o presente cede em cima dela.
 *
 *   node build/gerar-trelica.mjs > /dev/null   (escreve build/paginas/_trelica.svg)
 */

import { writeFileSync } from "node:fs";

const N = 30;            // vigas
const X0 = 26;           // margem esquerda
const PASSO = 40;        // vão entre vigas
const BASE = 188;        // linha do banzo inferior
const QUEBRADA = 18;     // índice da viga partida
const L = X0 + (N - 1) * PASSO + 26;

const n = (v) => Math.round(v * 10) / 10;
const x = (i) => X0 + i * PASSO;

// altura de cada viga — duas senoides somadas dão um perfil irregular mas contínuo
const alturaBase = (i) => 102 + 32 * Math.sin(i * 0.5) + 18 * Math.sin(i * 1.27 + 1.1);

// a viga partida não sustenta mais nada: o banzo cede sobre ela e nos vizinhos
const cede = (i) => {
  const d = Math.abs(i - QUEBRADA);
  return d === 0 ? 62 : d === 1 ? 30 : d === 2 ? 12 : d === 3 ? 4 : 0;
};

const alturas = Array.from({ length: N }, (_, i) =>
  Math.max(30, alturaBase(i) - cede(i))
);
const topo = (i) => BASE - alturas[i];

/* -------------------------------------------------------------- banzos */

const banzoSuperior =
  "M" + alturas.map((_, i) => `${n(x(i))} ${n(topo(i))}`).join(" L");

const banzoInferior = `M${n(x(0))} ${BASE} L${n(x(N - 1))} ${BASE}`;

/* ------------------------------------------------- diagonais da treliça */

const diagonais = [];
for (let i = 0; i < N - 1; i++) {
  if (i === QUEBRADA || i + 1 === QUEBRADA) continue; // o vão da anomalia fica aberto
  diagonais.push(
    i % 2 === 0
      ? `M${n(x(i))} ${BASE} L${n(x(i + 1))} ${n(topo(i + 1))}`
      : `M${n(x(i))} ${n(topo(i))} L${n(x(i + 1))} ${BASE}`
  );
}

/* ------------------------------------------------------- vigas verticais */

const vigas = [];
for (let i = 0; i < N; i++) {
  if (i === QUEBRADA) continue;
  vigas.push(`M${n(x(i))} ${BASE} L${n(x(i))} ${n(topo(i))}`);
}

/* ------------------------------------------------------- a viga partida */

const xq = x(QUEBRADA);
const hq = alturas[QUEBRADA];
const corte = BASE - hq * 0.44;   // onde ela rompeu
const retomada = BASE - hq * 0.68; // onde o pedaço de cima sobrou, deslocado

const vigaQuebrada = {
  pe: `M${n(xq)} ${BASE} L${n(xq)} ${n(corte)}`,
  cabeca: `M${n(xq + 7)} ${n(retomada)} L${n(xq + 4)} ${n(BASE - hq)}`,
  vao: `M${n(xq)} ${n(corte)} L${n(xq + 7)} ${n(retomada)}`,
};

/* ------------------------------------------------------------------ SVG */

const svg = `<svg class="trelica" viewBox="0 0 ${L} 200" preserveAspectRatio="xMidYMax slice" role="img" aria-labelledby="trelica-titulo" focusable="false">
  <title id="trelica-titulo">Uma estrutura de vigas: cada viga é um evento do passado, e o presente se apoia nelas. Uma delas está partida — é a anomalia, e a estrutura cede em cima dela.</title>
  <g fill="none" stroke-linecap="square" vector-effect="non-scaling-stroke">
    <g class="t-vigas" stroke="currentColor" stroke-width="1.15" opacity=".5">
      <path d="${vigas.join(" ")}"/>
    </g>
    <g class="t-diagonais" stroke="currentColor" stroke-width=".75" opacity=".2">
      <path d="${diagonais.join(" ")}"/>
    </g>
    <path class="t-banzo" d="${banzoSuperior}" stroke="currentColor" stroke-width="1.7" opacity=".95"/>
    <path class="t-base" d="${banzoInferior}" stroke="currentColor" stroke-width="1.15" opacity=".4"/>
    <g class="t-quebra" stroke="var(--carimbo)" stroke-width="2.4">
      <path d="${vigaQuebrada.pe}"/>
      <path d="${vigaQuebrada.cabeca}"/>
      <path d="${vigaQuebrada.vao}" stroke-width="1" stroke-dasharray="2 3" opacity=".6"/>
      <circle cx="${n(xq)}" cy="${n(corte)}" r="3.4" fill="var(--carimbo)" stroke="none"/>
    </g>
  </g>
</svg>`;

writeFileSync(new URL("./paginas/_trelica.svg", import.meta.url), svg, "utf8");
console.log(`treliça: ${N} vigas, viga partida em ${QUEBRADA}, largura ${L}`);
