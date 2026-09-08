# CHRONO

RPG de mesa de viagem no tempo. Os personagens morreram e trabalham para uma
agência que conserta a linha temporal — porque só quem já morreu consegue andar
pelo passado sem ser corrigido pelo Fluxo.

Este repositório é o site do jogo: os três livros, a ficha interativa e o painel
do mestre. É estático, não tem dependência nenhuma e funciona offline.

## O que tem aqui

| Página | O que é |
|---|---|
| `index.html` | Hub: a premissa, o motor em duas rolagens e os volumes |
| `regras.html` | Livro de Regras — 19 partes, 68 seções |
| `inimigos.html` | Livro dos Inimigos — régua de Grau, 18 fichas, 4 anomalias prontas |
| `epocas.html` | Guia de Épocas — 11 séculos jogáveis |
| `ficha.html` | Ficha de agente que calcula sozinha, salva no navegador e imprime em A4 |
| `mesa.html` | Painel do mestre: relógios, iniciativa e régua de Grau |

O texto dos livros **não** é editado no HTML. Ele vive em `fontes/*.md` e o site
é gerado a partir dali.

## Rodar e gerar

Precisa de Node 18 ou mais novo. Nada além disso — sem `npm install`.

```sh
node build/build.mjs     # gera as páginas e o índice de busca
node build/servir.mjs    # abre em http://localhost:4173
```

`build.mjs` lê `fontes/*.md`, monta as páginas dos livros, injeta os fragmentos
de `build/paginas/` nas páginas escritas à mão, e escreve:

- `regras.html`, `inimigos.html`, `epocas.html`, `index.html`, `ficha.html`, `mesa.html`
- `assets/js/indice.js` — o índice da busca
- `sw.js` e `manifest.webmanifest` — o uso offline

**Sempre rode o build depois de mexer nos markdowns ou nos fragmentos.** Editar
o HTML gerado direto não adianta: a próxima geração sobrescreve.

Atenção ao nome: `fontes/` são os **textos-fonte** dos livros; `assets/fontes/`
são os **arquivos de tipografia**. Coisas diferentes.

### As tipografias

Ficam em `assets/fontes/` e são servidas pelo próprio site, não pelo Google.
Isso não é preferência: o service worker só guarda o que é do próprio domínio,
então com as fontes de fora o site abria offline com a tipografia errada — e a
página pulava na primeira visita, porque elas chegavam depois do texto.

Só precisa rodar se você trocar de família:

```sh
node build/baixar-fontes.mjs
```

Ele baixa os subconjuntos `latin` e `latin-ext` de cada família e regera o
`assets/css/fontes.css`. O `latin-ext` fica lá mas nem chega a ser baixado numa
página em português — o navegador só busca o subconjunto de que precisa.

## Editar

| Quero mudar | Mexo em |
|---|---|
| O texto de uma regra | `fontes/CHRONO_Livro_de_Regras.md` |
| Um inimigo ou anomalia | `fontes/CHRONO_Livro_dos_Inimigos.md` |
| Uma época | `fontes/CHRONO_Guia_de_Epocas.md` |
| O hub, a ficha ou a mesa | `build/paginas/*.html` |
| Cor, tipografia, espaçamento | `assets/css/chrono.css` |
| Leitura de um dado | `assets/js/dados.js` |
| A treliça da capa | `build/gerar-trelica.mjs` |

As cores vivem todas em dois blocos no topo de `assets/css/chrono.css`: um para
o tema papel, outro para o tema Zona. Se mexer neles, confira o contraste — os
três acentos (carimbo, fluxo, latão) precisam continuar distinguíveis **entre
si**, e não só contra o fundo.

### O markdown que o gerador entende

Títulos (`##` vira parte, `###` vira seção), tabelas, blocos de código,
citações, listas, `**negrito**`, `*itálico*` e `` `código` ``.

Duas convenções valem a pena conhecer:

- `## PARTE VII — CLASSES` vira uma parte numerada no sumário. O numeral romano
  entra no `id` da âncora, então `PARTE VII` é sempre `#parte-07`.
- `### 4.3 Instabilidade Pessoal` vira a âncora `#s-4-3`. Se você renumerar uma
  seção, os links antigos para ela quebram.

Toda notação de dado no texto (`d20`, `1d6`, `3d6+8`) vira um botão que rola de
verdade. Isso é automático — não precisa marcar nada.

### A capa

`node build/gerar-trelica.mjs` redesenha a treliça do Fluxo. As constantes no
topo do arquivo controlam quantas vigas existem, qual delas está partida e o
quanto o presente cede em cima dela.

### O cartão de compartilhamento

`build/og.render.html` é gerado pelo build. Abra em 1200×630 e capture a tela
em `assets/og.png` se mudar a capa ou o texto de abertura.

## O cofre do Obsidian

O cofre em `Documents\André - TI\Obsidian` é o caderno de trabalho: as regras
como notas interligadas, mais o espaço para criar personagem, lugar e sessão.

```sh
node build/sincronizar-cofre.mjs   # atualiza o cofre a partir de fontes/
node build/verificar-cofre.mjs     # procura link quebrado e nota órfã
```

O sincronizador escreve três coisas:

| Pasta | O quê |
|---|---|
| `CHRONO/Sistema`, `Mundo`, `Bestiário`, `Anomalias` | ~90 notas atômicas, uma por conceito, inimigo, época e anomalia — cada uma linkando para a seção certa do site |
| `CHRONO/Livros` | os três livros na íntegra, como backup |
| `Modelos/` | modelos de agente, NPC, lugar, sessão, inimigo e anomalia |

**Ele nunca apaga o que é seu.** Só sobrescreve notas que carregam
`gerado: true` nas propriedades — as que ele mesmo criou. Qualquer nota sua
sobrevive, mesmo dentro de uma pasta gerada. As pastas `Personagens/`, `Mesa/`
e `Mundo/Lugares/` são inteiramente suas.

Se o cofre mudar de lugar: `COFRE="D:/outro/caminho" node build/sincronizar-cofre.mjs`.

Os textos dos conceitos ficam em `build/cofre/conceitos.mjs` — é lá que se
edita o resumo de "Instabilidade Pessoal", não na nota do cofre.

## Publicar no GitHub Pages

1. Suba estes arquivos na raiz de um repositório.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Em um ou dois minutos o site sobe.
4. Troque `SITE.url` em `build/build.mjs` pelo endereço real e gere de novo.

O `.nojekyll` na raiz existe para o Pages não ignorar nada.

## Offline

Com o site em HTTPS (ou em `localhost`), o service worker guarda tudo na
primeira visita. Depois disso os três livros, a ficha e a mesa abrem sem
internet — que é a condição normal de um porão com uma mesa de RPG dentro.

Dá para instalar como aplicativo pelo próprio navegador.

## Atalhos

| Tecla | O que faz |
|---|---|
| `Ctrl K` ou `/` | Busca nos três livros ao mesmo tempo |
| `↑` `↓` `↵` | Navegar e abrir um resultado |
| `Esc` | Fechar |

## Onde ficam os dados

Tudo no navegador de quem usa, em `localStorage`, e nunca sai dali:

- `chrono:fichas` — o elenco de personagens
- `chrono:mesa` — a missão em andamento do mestre
- `chrono:tema` — papel ou Zona

A ficha exporta `.json` para levar um agente de um computador para outro.

## O sistema em cinco linhas

- **Ação:** d20 + atributo + perícia contra ND 8/12/16/20/24.
- **Salvaguarda:** 1d6 + perícia + patente contra limiar 4/6/8/10.
- **Esforço** move tudo, e a única forma de conseguir mais é subir
  **Instabilidade** — ficar um pouco mais parecido com um fantasma.
- **Discernimento** trava a progressão de propósito: não dá para passar do
  nível 5, 9, 13, 17 ou 20 sem entender mais do mundo.
- **A Regra das Brasas:** o instante em que uma Janela abre queima para sempre.
  Missão falhada se resolve para a frente, nunca do começo.

## Licença

Sistema autoral. Faça o que quiser com ele na sua mesa.
