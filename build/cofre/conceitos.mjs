/**
 * Os conceitos do CHRONO como notas atômicas.
 *
 * Cada um vira uma nota curta no cofre: o que é, por que existe, e o link para
 * a seção do livro publicado. São essas notas que você vai citar com [[...]]
 * quando escrever um personagem, um lugar ou uma sessão.
 *
 * `ancora` é o id da seção no site (regras.html#<ancora>).
 */

export const CONCEITOS = [
  /* ----------------------------------------------------------------- mundo */
  {
    nome: "O Fluxo",
    pasta: "Mundo",
    tags: ["mundo", "fundamento"],
    ancora: "s-1-1",
    resumo: `O passado não é história: é **estrutura**. Cada evento é uma viga, e o presente é o prédio apoiado em cima delas.

Mexa numa viga e o prédio não desaba — ele se **reconstrói**, virando um presente diferente, e ninguém dentro dele percebe que houve troca.

É daí que vem o horror de fundo do jogo: quando o inimigo vence, ninguém fica sabendo. O mundo simplesmente sempre foi assim.`,
    relacionados: ["A Viga", "Anomalia", "Instabilidade do Fluxo", "A Zona Fantasma"],
  },
  {
    nome: "Você morreu",
    pasta: "Mundo",
    tags: ["mundo", "fundamento"],
    ancora: "s-1-2",
    resumo: `Um vivo não pode viajar no tempo: o Fluxo tem a conta dele aberta — ele ainda vai construir vigas — e jogá-lo no século XIV cria um paradoxo que o Fluxo corrige apagando o intruso.

Um morto é diferente. A conta está fechada. Para o Fluxo ele não existe mais, e é exatamente por isso que consegue andar por dentro dele sem ser corrigido.

A Agência intercepta pessoas no instante da morte. Não ressuscita: **segura** no meio do caminho, antes da queda na Zona Fantasma. O agente não está vivo nem lá. Está pendurado.`,
    relacionados: ["O Fluxo", "A Zona Fantasma", "A Agência", "Trauma"],
  },
  {
    nome: "A Zona Fantasma",
    pasta: "Mundo",
    tags: ["mundo", "fantasmas"],
    ancora: "s-1-3",
    resumo: `Também chamada de Zona Negativa, o Lado de Fora, o Depósito.

É onde vão parar as pessoas que ficaram presas fora do Fluxo. Elas viram **fantasmas**: existem, lembram, querem, mas não têm mais lugar onde acontecer.

Fantasmas aparecem quando o tempo está colapsando — e quando *o agente* está colapsando, porque ele é quase um deles. Instabilidade Pessoal alta é, para um fantasma, uma vaga se abrindo.`,
    relacionados: ["Fantasmas", "Instabilidade Pessoal", "Você morreu", "Ancorador"],
  },
  {
    nome: "A Agência",
    pasta: "Mundo",
    tags: ["mundo", "instituição"],
    ancora: "s-1-4",
    resumo: `Ninguém sabe quem fundou nem em que ano fica a sede. O relógio do saguão não tem ponteiros.

Oficialmente: detecta divergências, envia equipes, corrige, arquiva. O que ninguém comenta: ela decide **qual** presente vale a pena defender.

> A Agência não é vilã. É uma instituição velha, cansada e razoavelmente competente que mente por conveniência. Isso é bem pior.`,
    relacionados: ["Patente", "Suspeita", "Descompressão", "Favores", "Renegados"],
  },
  {
    nome: "A Viga",
    pasta: "Mundo",
    tags: ["mundo", "missão"],
    ancora: "s-1-5",
    resumo: `A **Viga** é o ato que foi alterado — o ponto exato onde alguém mexeu no passado.

O trabalho de uma missão quase nunca é matar alguém. É descobrir **qual foi a viga**. Achar a viga é a fase de Leitura; consertá-la é a fase de Correção.

Ao montar uma anomalia, se você não consegue escrever a viga em uma frase, ainda não tem anomalia.`,
    relacionados: ["Anomalia", "O Fluxo", "Instabilidade do Fluxo", "Estrutura de missão"],
  },
  {
    nome: "Anomalia",
    pasta: "Mundo",
    tags: ["mundo", "missão"],
    ancora: "s-1-5",
    resumo: `Uma **anomalia** é o evento quebrado — a missão em si.

Alguém levou covid-19 para a Idade Média. Alguém trouxe um dinossauro para São Paulo. Alguém salvou Kennedy e o mundo virou ditadura. Alguém levou uma IA para a época de Einstein.

Cada anomalia tem Grau (dano ao Fluxo), Selo (contido, ativo ou terminal), Peso (quanto da Instabilidade do Fluxo ela segura), Época e Viga.`,
    relacionados: ["A Viga", "Grau", "Instabilidade do Fluxo", "As cinco famílias"],
  },

  /* ----------------------------------------------------------------- motor */
  {
    nome: "Ação",
    pasta: "Sistema/Motor",
    tags: ["motor", "rolagem"],
    ancora: "s-2-1",
    resumo: `**d20 + atributo + perícia contra o ND.**

| Dificuldade | Fácil | Padrão | Difícil | Extrema | Absurda |
|---|---|---|---|---|---|
| **ND** | 8 | 12 | 16 | 20 | 24 |`,
    relacionados: ["Leitura do teste", "Salvaguarda", "Atributos", "Perícias"],
  },
  {
    nome: "Salvaguarda",
    pasta: "Sistema/Motor",
    tags: ["motor", "rolagem"],
    ancora: "s-2-1",
    resumo: `**1d6 + perícia + patente contra o limiar** — 4 leve, 6 média, 8 severa, 10 extrema.

O d6 é pequeno de propósito. Salvaguarda não é lugar de heroísmo: é lugar de treino, de Patente e de gastar Esforço. Dá para somar **+1d6 por 2 de Esforço**, quantas vezes quiser, antes de saber o resultado.`,
    relacionados: ["Ação", "Patente", "Esforço", "Trauma"],
  },
  {
    nome: "Leitura do teste",
    pasta: "Sistema/Motor",
    tags: ["motor", "rolagem", "mestre"],
    ancora: "s-2-2",
    resumo: `A tabela mais consultada do livro. Todo teste tem cinco leituras:

| Resultado | Leitura |
|---|---|
| **20 natural** | Crítico. Acontece com estilo, e o mestre concede um benefício extra de graça. |
| **≥ ND** | Sucesso. |
| **ND −1 ou −2** | **Sucesso com custo.** Acontece, mas o Fluxo cobra — e o mestre fala o preço em voz alta antes do jogador confirmar. |
| **abaixo** | Falha. A cena avança mesmo assim. |
| **1 natural** | Falha crítica. Role 1d6. |

O sucesso com custo é onde o jogo vira negociação. Não abra mão de dizer o preço em voz alta.`,
    relacionados: ["Ação", "Falha crítica", "As alavancas do mestre"],
  },
  {
    nome: "Falha crítica",
    pasta: "Sistema/Motor",
    tags: ["motor", "rolagem"],
    ancora: "s-2-2",
    resumo: `Ao tirar 1 natural, role 1d6:

1 **Ruído** — alguém da época notou algo impossível, +5 IP
2 **Perda** — um item seu quebra ou fica para trás
3 **Trava** — perde a próxima ação
4 **Exposto** — inimigos têm vantagem contra você até o fim da cena
5 **Rastro** — a Instabilidade do Fluxo sobe 5%
6 **Eco** — role Ressonância imediatamente`,
    relacionados: ["Leitura do teste", "Ressonância", "Instabilidade Pessoal"],
  },
  {
    nome: "A Escada de Dados",
    pasta: "Sistema/Motor",
    tags: ["motor"],
    ancora: "s-2-3",
    resumo: `O tamanho do dado acompanha o tamanho do que você está tocando.

| Dado | O que mede |
|---|---|
| **d4** | você mexeu num detalhe — Sequela |
| **d6** | você aguentou algo — Salvaguarda |
| **d8** | você forçou uma cena — Perseguição |
| **d10** | você encostou no Fluxo — Ressonância |
| **d12** | você quebrou uma regra do tempo — Paradoxo |
| **d20** | você agiu — Ação |
| **d100** | o Fluxo respondeu — Deriva |`,
    relacionados: ["Ação", "Ressonância", "Paradoxo", "Deriva", "Sequela"],
  },
  {
    nome: "Ressonância",
    pasta: "Sistema/Motor",
    tags: ["motor", "fluxo"],
    ancora: "s-2-5",
    resumo: `Role **1d10** sempre que usar poder que mexe diretamente com o tempo.

1–2 **Eco** — algo pequeno se repete. Estético, na primeira vez.
3–8 nada. O Fluxo não notou.
9 **Atrito** — +5 IP.
10 **Rasgo** — um fantasma percebeu você, e chega na próxima cena.

Setenta por cento de nada é intencional: o dado precisa ser rolado sem drama para que o 10 assuste.`,
    relacionados: ["A Escada de Dados", "Fantasmas", "Instabilidade Pessoal"],
  },
  {
    nome: "Paradoxo",
    pasta: "Sistema/Motor",
    tags: ["motor", "fluxo"],
    ancora: "s-2-6",
    resumo: `**1d12**, rolado depois de algo que o tempo não deveria permitir: matar quem tinha história pela frente, encontrar você mesmo vivo, revelar o futuro, salvar quem deveria morrer.

1–2 colapso local · 3–4 correção · 5–6 testemunha · 7–8 cicatriz · 9–10 passou · **11–12 absorvido: a IF desce 5%**.

Um sexto de chance de o crime *melhorar* a missão é o que faz o dado valer a pena. Sem isso ninguém arrisca, e o jogo fica cauteloso demais para ser pulp.`,
    relacionados: ["A Escada de Dados", "Instabilidade do Fluxo", "Você mesmo"],
  },
  {
    nome: "Deriva",
    pasta: "Sistema/Motor",
    tags: ["motor", "missão"],
    ancora: "s-2-8",
    resumo: `Ao fim de cada missão, com a IF em 15% ou menos, role **1d100** uma vez, na frente de todos.

Maior que a IF final: o presente voltou limpo. Igual ou menor: ficou uma **Deriva** — diferença pequena, permanente e irreversível. Uma música que ninguém lembra. Uma rua com outro nome.

Fechar em 15% dá 15% de chance de estragar algo; fechar em 4% dá 4%. **É o motivo mecânico de continuar trabalhando depois de já ter vencido.** Anote todas e mostre a lista de uma vez só no fim da campanha.`,
    relacionados: ["Instabilidade do Fluxo", "Estrutura de missão"],
  },
  {
    nome: "Sequela",
    pasta: "Sistema/Motor",
    tags: ["motor", "condição"],
    ancora: "s-2-7",
    resumo: `Ao voltar de uma descoagulação, role **1d4**. Dura até a Descompressão.

1 **Voz atrasada** — desvantagem em Presença
2 **Mão de outro ano** — desvantagem em Reflexo
3 **Sombra fora de hora** — se um nativo notar, +5 IP
4 **Sem eco** — não aparece em espelho, água ou retrato; vantagem em Furtividade, mas fantasmas te acham de longe`,
    relacionados: ["Descoagular", "Descompressão", "A Escada de Dados"],
  },

  /* ------------------------------------------------------------ personagem */
  {
    nome: "Atributos",
    pasta: "Sistema/Personagem",
    tags: ["personagem", "criação"],
    ancora: "s-3-1",
    resumo: `Seis, de **0 a 5**: Corpo, Reflexo, Intelecto, Presença, Vontade e Sintonia.

**Na criação** os cinco primeiros começam em 1 e você recebe 4 pontos. Nenhum passa de 3 na criação — 4 e 5 só se alcançam subindo de nível. Dá para zerar um atributo para ganhar um ponto a mais, e um atributo em 0 é um buraco que a mesa vai encontrar.

**Sintonia começa em 0** e não pode ser comprada. Só sobe por Discernimento, nas Camadas 1, 3 e 5.`,
    relacionados: ["Perícias", "Derivados", "Discernimento", "Criação de personagem"],
  },
  {
    nome: "Perícias",
    pasta: "Sistema/Personagem",
    tags: ["personagem", "criação"],
    ancora: "s-3-2",
    resumo: `Na criação: **10 pontos, máximo 2** em qualquer perícia. Grau Veterano (3–4) exige nível 5; Expert (5) exige nível 11 e Camada 2.

**História é a perícia mais poderosa do jogo:** não serve para curiosidade, serve para saber *como o evento deveria ter sido*.`,
    relacionados: ["Atributos", "Ação", "Discernimento"],
  },
  {
    nome: "Derivados",
    pasta: "Sistema/Personagem",
    tags: ["personagem", "matemática"],
    ancora: "s-3-3",
    resumo: `\`\`\`
PV          = 10 + (Corpo × 2) + (Nível × 2) + (Patente × 3)
EP máx      = 10 + (Vontade × 2) + Nível + Patente + Camada
Defesa      = 10 + Reflexo + Patente
Iniciativa  = d20 + Reflexo + Patente
Salvaguarda = 1d6 + Perícia + Patente
Carga       = 5 + Corpo + Patente espaços
Limite de Esforço por rodada = 2 + (Nível ÷ 4)
\`\`\`

A **Patente** é o número que escala o personagem inteiro. Sobe sozinha com o nível, então só há um número para cuidar.

> ⚠ Há uma ambiguidade aberta em \`EP máx\`. Ver [[Decisões em aberto]].`,
    relacionados: ["Patente", "Atributos", "Decisões em aberto"],
  },
  {
    nome: "Criação de personagem",
    pasta: "Sistema/Personagem",
    tags: ["personagem", "criação"],
    ancora: "s-3-4",
    resumo: `Oito passos:

1. **Escolha a morte** — quando e como. A época de origem dá vantagem em testes sociais e de História naquele período.
2. **Atributos** — todos em 1, distribua 4 pontos, máximo 3.
3. **Perícias** — 10 pontos, máximo 2.
4. **Classe** — anote as duas habilidades de nível 1.
5. **Derivados.**
6. **Trauma** — o que corresponde à sua morte.
7. **Cinco Memórias** — uma linha cada. Escreva coisas que você não vai querer perder.
8. **Comece em** nível 1, Patente Novato, Camada 0, IP 0.`,
    relacionados: ["Atributos", "Perícias", "Trauma", "Memórias", "Classes"],
  },

  /* ----------------------------------------------- esforço e instabilidade */
  {
    nome: "Esforço",
    pasta: "Sistema/Esforço e Instabilidade",
    tags: ["recurso"],
    ancora: "s-4-1",
    resumo: `O combustível. Gasta em habilidade, poder, rerrolagem e salvaguarda.

Recupera tudo na Descompressão; metade da Vontade num Respiro de dez minutos seguros.

**Sacar do Fluxo** dá 1d6 de Esforço e custa **+5 IP**. É a decisão central do jogo: você está sem Esforço, a coisa está vindo, e a única forma de continuar útil é ficar um pouco mais parecido com um fantasma. Ninguém te impede — é esse o problema.`,
    relacionados: ["Instabilidade Pessoal", "Rebobinar", "Descompressão", "Sacrifício"],
  },
  {
    nome: "Rebobinar",
    pasta: "Sistema/Esforço e Instabilidade",
    tags: ["recurso"],
    ancora: "s-4-2",
    resumo: `**3 EP** rerrola qualquer d20 seu.

Rerrolar o mesmo teste de novo custa 3 EP **e +5 IP**; a terceira vez, 3 EP e **+10 IP**.

Rebobinar o mesmo instante é se recusar a deixar o tempo andar, e o tempo cobra.`,
    relacionados: ["Esforço", "Instabilidade Pessoal"],
  },
  {
    nome: "Instabilidade Pessoal",
    pasta: "Sistema/Esforço e Instabilidade",
    tags: ["recurso", "relógio"],
    ancora: "s-4-3",
    resumo: `De 0 a 100 — 120 a partir da Camada 4. Quanto mais alta, mais o agente se parece com um fantasma.

| Limiar | Efeito |
|---|---|
| **25 — Marcado** | Fantasmas te percebem à distância. −1 em Presença. |
| **50 — Atravessado** | Um fantasma por sessão vem atrás. Desvantagem em Autocontrole. |
| **75 — Dissolvendo** | Desvantagem em Corpo — e **+2 em Sintonia**. |
| **100 — Devolvido** | O Fluxo te expulsa de volta ao presente, no meio da missão. Você não morre: **falha**. |

Desce 20 na Descompressão e 5 num **Ato de Âncora**.`,
    relacionados: ["Ato de Âncora", "Esforço", "A Zona Fantasma", "Descompressão"],
  },
  {
    nome: "Ato de Âncora",
    pasta: "Sistema/Esforço e Instabilidade",
    tags: ["recurso", "cena"],
    ancora: "s-4-3",
    resumo: `Uma vez por sessão, faça algo profundamente humano e **sem utilidade tática** dentro da época. Comer com calma. Aprender o nome de uma criança. Dançar. Chorar por alguém morto há mil anos.

O Fluxo te reconhece como gente de novo: **−5 IP**.

Existe para forçar cenas de personagem numa mesa que naturalmente correria de explosão em explosão.`,
    relacionados: ["Instabilidade Pessoal", "As alavancas do mestre"],
  },
  {
    nome: "Instabilidade do Fluxo",
    pasta: "Sistema/Esforço e Instabilidade",
    tags: ["missão", "relógio", "mestre"],
    ancora: "s-4-4",
    resumo: `Começa em **100%**. A missão fecha em **15% ou menos**. O mestre decide o quanto desce.

| Conquista | Queda |
|---|---|
| Descobrir a natureza real da anomalia | 5–10% |
| Neutralizar um efeito colateral | 5–15% |
| Remover o objeto ou ser deslocado | 15–25% |
| Corrigir o ato central | 25–40% |
| Apagar rastros e testemunhas | 5–10% |

Também **sobe** quando o grupo faz besteira grande: uma missão pode piorar. Chegando a 15%, o Fluxo se conserta sozinho — não precisa ser perfeito, precisa ser bom o bastante para a inércia do tempo fazer o resto.`,
    relacionados: ["Deriva", "A Viga", "Anomalia", "As alavancas do mestre"],
  },

  /* ---------------------------------------------------------- discernimento */
  {
    nome: "Discernimento",
    pasta: "Sistema/Discernimento",
    tags: ["progressão", "trama"],
    ancora: "s-5-1",
    resumo: `Não é poder. É **percepção**. Não sobe matando: sobe entendendo — anomalia grave resolvida, mentira da Agência descoberta, paradoxo visto de perto, decisão que custou caro.

Vai de 0 a 5, em **Camadas**. O mestre concede, tipicamente um ponto a cada 3–5 sessões, sempre atrelado a uma revelação.

**É pré-requisito de progressão.** Um grupo que ignora a trama para farmar combate **para de subir de nível**. Não é punição: é o jogo dizendo que em CHRONO a recompensa é entender.`,
    relacionados: ["As Camadas", "Revelações", "Suspeita", "Progressão"],
  },
  {
    nome: "As Camadas",
    pasta: "Sistema/Discernimento",
    tags: ["progressão", "trama"],
    ancora: "s-5-3",
    resumo: `Cada Camada muda o mundo, não só a ficha.

| | | |
|---|---|---|
| **0** | Cego | Você acha que a Agência é heroica. |
| **1** | Desperto | Vê fantasmas antes de eles agirem. Nota a mesma pessoa em missões separadas por séculos. |
| **2** | Leitor | Sente o peso de um evento. Fantasmas conversam, e alguns esperavam você. |
| **3** | Divergente | Vê as linhas que não aconteceram — e lembra da própria morte de um jeito que não bate com o relatório. |
| **4** | Âncora | Não é alterado quando o Fluxo se reorganiza. A Agência passa a te tratar como risco. |
| **5** | Ponto Fixo | Fim de campanha. Consertar o Fluxo ou substituí-lo vira escolha sua. |

**Travas:** nível 5 exige C1 · 9 exige C2 · 13 exige C3 · 17 exige C4 · 20 exige C5.`,
    relacionados: ["Discernimento", "A Verdade da Morte", "Progressão", "Suspeita"],
  },
  {
    nome: "Revelações",
    pasta: "Sistema/Discernimento",
    tags: ["progressão", "mestre"],
    ancora: "s-16-3",
    resumo: `Camada não cai do céu: **cinco Revelações sobem uma Camada.**

Uma Revelação é conquistada quando o agente descobre uma mentira concreta da Agência; ouve um fantasma até o fim mesmo custando caro; lê no Arquivo um documento acima da própria Patente; resolve uma anomalia de Grau 4 ou 5; escolhe perder algo em troca de uma verdade; ou vê um Paradoxo de perto e continua inteiro.

Quatro dessas seis o **grupo controla**. É de propósito: Discernimento trava mais progressão que qualquer coisa no sistema, então precisa ser caçável, não sorteável.`,
    relacionados: ["Discernimento", "As Camadas", "A Agência"],
  },

  /* ---------------------------------------------------------------- classes */
  {
    nome: "Classes",
    pasta: "Sistema/Classes",
    tags: ["personagem", "índice"],
    ancora: "parte-07",
    resumo: `Três classes, dez habilidades cada: duas no nível 1, depois nos níveis 2, 5, 8, 10, 13, 16, 19 e o capstone no 20.

- [[Viajante]] — a linha de frente
- [[Ancorador]] — fantasmas, Instabilidade e suporte
- [[Paradoxista]] — o especialista que dobra a regra

Na Camada 1 escolhe-se **uma das três Trilhas** da classe. A escolha é definitiva.`,
    relacionados: ["Viajante", "Ancorador", "Paradoxista", "Enxerto", "Progressão"],
  },
  {
    nome: "Patente",
    pasta: "Sistema/Progressão",
    tags: ["progressão", "agência"],
    ancora: "s-6-2",
    resumo: `Sobe **automaticamente com o nível**. É ao mesmo tempo o cargo na Agência e o número que escala as defesas.

| Patente | Valor | Níveis |
|---|---|---|
| **Novato** | 0 | 1–3 |
| **Recruta** | 1 | 4–7 |
| **Soldado** | 2 | 8–11 |
| **Veterano** | 3 | 12–15 |
| **Elite** | 4 | 16–18 |
| **Ancião** | 5 | 19–20 |

O valor entra em **PV (×3), Defesa, Iniciativa, Salvaguarda, EP máximo e Carga**.

**Congelamento:** a Agência pode reter o cargo e os privilégios como punição, mas o valor numérico continua subindo. Você perde o acesso, não a competência — e destravar vira objetivo de missão.`,
    relacionados: ["Derivados", "A Agência", "Suspeita", "Itens da Agência"],
  },
  {
    nome: "Progressão",
    pasta: "Sistema/Progressão",
    tags: ["progressão"],
    ancora: "s-6-1",
    resumo: `Níveis 1 a 20, por marco — o mestre sobe o grupo junto, tipicamente ao fim de cada missão relevante.

Todo nível: **+2 PV, +1 EP máx, +2 pontos de perícia**. Atributo máximo 5; Sintonia nunca sobe por nível.

**Ataque Extra** no nível 6 (dois ataques por ação) e no 16 (três). Só vale para o ataque comum.

Travas de Camada nos níveis 5, 9, 13, 17 e 20.`,
    relacionados: ["Patente", "As Camadas", "Discernimento", "Classes"],
  },
  {
    nome: "Enxerto",
    pasta: "Sistema/Progressão",
    tags: ["progressão"],
    ancora: "parte-11",
    resumo: `Multiclasse. Libera na Camada 2, a partir do nível 10.

Você não gasta nível: gasta **Discernimento**. Custo: **1 Camada permanente**. Recebe as duas habilidades de nível 1 de outra classe e pode comprar as seguintes normalmente.

Sua Camada desce uma e você perde os benefícios dela até reconquistar. Enxertar deixa mais versátil e mais cego — trocou entendimento por ferramenta. Máximo dois por personagem.`,
    relacionados: ["Classes", "As Camadas", "Discernimento"],
  },

  /* ---------------------------------------------------- trauma e sacrifício */
  {
    nome: "Trauma",
    pasta: "Sistema/Trauma e Sacrifício",
    tags: ["personagem", "cena"],
    ancora: "s-10-1",
    resumo: `Ninguém morre em abstrato. A última coisa que você sentiu ficou grudada.

Cada Trauma tem **Gatilho** (o que faz acordar), **Peso** (o que acontece quando você não segura) e **Compensação** (o que você aprendeu morrendo assim — passiva e permanente).

A Compensação é o ponto: um Trauma não é desvantagem que você aceita por pontos, é **o motivo de você ser bom em alguma coisa**. Você entende aquele jeito de morrer porque ele te matou.

Quando o Gatilho aparece: salvaguarda de Autocontrole contra 6. Passou, +1 EP. Falhou, Abalado e +5 IP — e o limiar sobe 2 para as próximas da mesma missão.`,
    relacionados: ["A Verdade da Morte", "Você morreu", "Salvaguarda", "Criação de personagem"],
  },
  {
    nome: "A Verdade da Morte",
    pasta: "Sistema/Trauma e Sacrifício",
    tags: ["trama", "cena"],
    ancora: "s-10-4",
    resumo: `Na **Camada 3** o agente lembra da própria morte com clareza total pela primeira vez — e ela não bate com o que a Agência contou. O Trauma se transforma, e o jogador escolhe como.

**Encarar — vira Cicatriz.** Perde o Gatilho por completo e a Compensação **dobra**. Custo: perde 1 Memória, permanentemente. Para caber a verdade, algo bom teve que sair.

**Enterrar — vira Ferida.** O Gatilho passa a limiar 8 e a falha custa +10 IP. Ganho: um Poder de Fluxo extra. Você ficou mais forte e mais quebrado — que é, afinal, o que a maioria das pessoas faz com a verdade.

A escolha é definitiva e é uma cena. Faça na mesa, com o grupo assistindo.`,
    relacionados: ["Trauma", "As Camadas", "Memórias"],
  },
  {
    nome: "Memórias",
    pasta: "Sistema/Trauma e Sacrifício",
    tags: ["personagem", "recurso", "cena"],
    ancora: "s-9-2",
    resumo: `Cinco lembranças reais da sua vida, uma linha cada, escritas na criação.

Queimar uma, a qualquer momento: **EP totalmente restaurado**, ou **um teste falhado vira sucesso**, ou **anula um efeito que te mataria, apagaria ou Devolveria**.

Custo permanente: risque a Memória. O personagem não lembra mais, e nunca recupera. Além disso, **−5 no EP máximo**, para sempre.

**Queimou as cinco:** não sobrou o suficiente de você. Vira fantasma e sai de jogo, para as mãos do mestre.

> A regra de mesa: o jogador precisa **ler a Memória em voz alta** antes de riscá-la. Sem isso a mecânica é um recurso; com isso, é uma cena. Não abra mão disso.`,
    relacionados: ["Sacrifício", "A Verdade da Morte", "Fantasmas"],
  },
  {
    nome: "Sacrifício",
    pasta: "Sistema/Trauma e Sacrifício",
    tags: ["recurso", "cena"],
    ancora: "parte-09",
    resumo: `Quando o Esforço não basta, você paga com você mesmo. Três níveis, do reversível ao definitivo.

**Corpo** — 1×/missão, reduz um atributo em 1 até a próxima Descompressão e recupera EP igual à Vontade × 2. Barato e sempre disponível; existe para que o próximo pese.

**Memória** — ver [[Memórias]].

**Último** — uma vez, e é a última coisa que o personagem faz. Aceita ser **apagado do Fluxo**, sem ter existido, para garantir um resultado. Ninguém vai lembrar dele. Nem os outros agentes. Uma vez por campanha, no máximo, e só quando a mesa inteira sentir que a cena merece.`,
    relacionados: ["Memórias", "Esforço", "Instabilidade Pessoal"],
  },

  /* -------------------------------------------------------------- a viagem */
  {
    nome: "A Janela",
    pasta: "Sistema/Viagem",
    tags: ["viagem"],
    ancora: "s-15-1",
    resumo: `A Agência abre uma **Janela**: uma abertura direcionada no Fluxo. Só passa quem já morreu.

Entrar é de graça — a Agência paga. **Sair é que é o problema.**

A precisão da inserção é d20 + Intelecto + Leitura de Fluxo, contra ND 12 (época e local amplos) a 24 (o instante exato do ato). Falhou, role 1d6 de deriva de chegada.`,
    relacionados: ["A Regra das Brasas", "Extração", "Você mesmo", "Estrutura de missão"],
  },
  {
    nome: "A Regra das Brasas",
    pasta: "Sistema/Viagem",
    tags: ["viagem", "fundamento"],
    ancora: "s-15-4",
    resumo: `> **Quando uma Janela se fecha, o instante em que ela abriu fica queimado. Nenhuma Janela pode ser aberta naquele mesmo ponto de espaço-tempo outra vez. Nem por vocês. Nem por ninguém. Nunca.**

A regra mais importante do livro depois de "você morreu".

Existe para matar a coisa que destrói toda campanha de viagem no tempo: **voltar e tentar de novo**. Se o grupo falhou na terça-feira, na feira de Avignon, aquela terça virou cinza.

Consequências que valem dizer em voz alta na primeira sessão: missão falhada se resolve **para a frente**, nunca do começo; a Agência queima instantes há séculos, e existem trechos de história sem por onde entrar — as **Zonas Cegas**; e é por isso que ela precisa de tantos agentes.`,
    relacionados: ["A Janela", "Zonas Cegas", "Estrutura de missão"],
  },
  {
    nome: "Zonas Cegas",
    pasta: "Sistema/Viagem",
    tags: ["viagem", "gancho"],
    ancora: "s-15-4",
    resumo: `Trechos de história onde a Agência já queimou todos os instantes de entrada, ao longo de séculos de operação. Não sobrou por onde entrar.

São o motivo de certas anomalias serem impossíveis de alcançar diretamente — e um gancho de campanha inteiro.`,
    relacionados: ["A Regra das Brasas", "A Janela", "A Agência"],
  },
  {
    nome: "Extração",
    pasta: "Sistema/Viagem",
    tags: ["viagem"],
    ancora: "s-15-5",
    resumo: `Você não sai quando quer. Antes da inserção a equipe combina um **Ponto de Saída**: lugar e horário. A Janela abre lá, uma vez. Perdeu, espera a próxima — horas ou dias de ficção, e a missão anda sem vocês.

**Puxão (emergência):** qualquer agente gasta 8 EP e puxa todo mundo em contato físico. Custa +15 IP em cada um, e a Janela sai Rachada.`,
    relacionados: ["A Janela", "Instabilidade Pessoal", "Favores"],
  },
  {
    nome: "Você mesmo",
    pasta: "Sistema/Viagem",
    tags: ["viagem", "trama"],
    ancora: "s-15-6",
    resumo: `Se a época de destino cai dentro da vida do personagem, a coisa fica perigosa.

**Ser visto pelo seu eu vivo:** 1d12 de Paradoxo com desvantagem, e +20 IP.

**Inserir no instante da própria morte:** a Janela recusa. Simplesmente não abre. A Agência diz que é limitação técnica.

Ela não é. Na **Camada 5**, a Janela abre.`,
    relacionados: ["A Janela", "Paradoxo", "As Camadas", "A Verdade da Morte"],
  },
  {
    nome: "Anacronismo",
    pasta: "Sistema/Inventário",
    tags: ["inventário", "época"],
    ancora: "s-12-2",
    resumo: `Todo item carrega um **Grau de Anacronismo (0 a 3)** — o quanto ele grita que não é dali.

0 comum na época · 1 de outra época humana, mas explicável · 2 de outra época humana, inexplicável · 3 da Agência, não existe em época nenhuma.

**Se a soma do Anacronismo que você carrega passar da sua Vontade e você aparecer em público: +5 IP por cena.**

Anacronismo não é sobre tecnologia: é sobre **o que aquela gente consegue explicar**. Um isqueiro em 1348 é grau 3 se você acender na frente de alguém e grau 0 no seu bolso. Uma frase é tão anacrônica quanto um objeto.`,
    relacionados: ["Instabilidade Pessoal", "Itens da Agência", "Épocas"],
  },
  {
    nome: "Arsenal",
    pasta: "Sistema/Inventário",
    tags: ["inventário", "combate"],
    ancora: "s-12-3",
    extrair: { secao: "12.3" },
    resumo: `As três tabelas completas, com dano, espaços e Anacronismo — puxadas direto do livro.`,
    relacionados: ["Suportes", "Proteções", "Anacronismo", "Itens da Agência", "Ressonância"],
  },
  {
    nome: "Suportes",
    pasta: "Sistema/Inventário",
    tags: ["inventário"],
    ancora: "s-12-1",
    extrair: { secao: "12.1", de: "**Suportes.**" },
    resumo: `Uma arma na mão ocupa espaço. Uma arma **presa ao corpo** não: ela está vestida, não carregada.`,
    relacionados: ["Arsenal", "Anacronismo", "Patente"],
  },
  {
    nome: "Proteções",
    pasta: "Sistema/Inventário",
    tags: ["inventário", "combate"],
    ancora: "s-12-4",
    extrair: { secao: "12.4" },
    resumo: `A tabela completa, com o bônus de Defesa, espaços, Anacronismo e penalidade de cada uma.`,
    relacionados: ["Arsenal", "Anacronismo", "Derivados"],
  },
  {
    nome: "Itens da Agência",
    pasta: "Sistema/Inventário",
    tags: ["inventário", "agência"],
    ancora: "s-12-6",
    resumo: `Requisitados na Descompressão. Cada um exige Patente e Camada.

Do Traje Correspondente (Novato) ao **Relógio Sem Ponteiros** (Ancião), que para o tempo por um minuto, uma vez por campanha, e ninguém sabe de onde veio.

Todos são Anacronismo 3 na prática: não existem em época nenhuma.`,
    relacionados: ["Patente", "Anacronismo", "Descompressão"],
  },

  /* --------------------------------------------------------------- agência */
  {
    nome: "Descompressão",
    pasta: "Sistema/Agência",
    tags: ["agência", "entre missões"],
    ancora: "s-16-1",
    resumo: `Entre missões, cada agente tem **3 Ações de Base**. É aqui que a campanha respira e onde metade dos sistemas do livro tem lugar para acontecer.

**Requisitar** item · **Arquivo** (uma verdade sobre a anomalia ou sobre a Agência) · **Treinar** (+1 perícia) · **Reancorar** (−10 IP além dos −20 automáticos) · **Relacionar** (rende um Favor) · **Perguntar** a um superior (o mestre responde a verdade, e a **Suspeita sobe 1**) · **Oficina** (só Paradoxista).

A Descompressão também devolve o Esforço cheio e tira 20 de Instabilidade Pessoal.`,
    relacionados: ["Favores", "Suspeita", "Instabilidade Pessoal", "Itens da Agência"],
  },
  {
    nome: "Favores",
    pasta: "Sistema/Agência",
    tags: ["agência", "social"],
    ancora: "s-16-2",
    resumo: `Moeda social. Máximo de **3** guardados.

Um Favor gasta: ignorar uma exigência de Patente uma vez; extração de emergência sem o custo de IP; a Agência apaga um rastro do grupo; ou um NPC da Agência faz uma coisa arriscada por você, sem perguntar.`,
    relacionados: ["Descompressão", "A Agência", "Extração"],
  },
  {
    nome: "Suspeita",
    pasta: "Sistema/Agência",
    tags: ["agência", "relógio", "mestre"],
    ancora: "s-16-4",
    resumo: `Um relógio do **grupo inteiro**, de 0 a 10, visível na mesa.

Sobe quando alguém atinge uma Camada (+1), pergunta direto a um superior (+1), traz algo do passado sem autorização (+1), lê documento acima da Patente (+2), deixa um Renegado ir (+2), ou atinge a Camada 4 (+3).

| Limiar | O que a Agência faz |
|---|---|
| **3** | Observação — um segundo agente acompanha, simpático e competente, e relata tudo. |
| **5** | Restrição — Patente congelada para o grupo inteiro. |
| **7** | Teste — chega uma missão que é claramente uma armadilha. |
| **10** | Corte — a Agência tenta reancorar o grupo à força e apagar as Camadas. Isso é um arco inteiro. |

O relógio de Suspeita e a escada de Discernimento sobem juntos de propósito: **ficar mais capaz e ficar mais vigiado é a mesma curva.**`,
    relacionados: ["Discernimento", "A Agência", "Patente", "Renegados"],
  },

  /* ---------------------------------------------------------------- mestre */
  {
    nome: "Estrutura de missão",
    pasta: "Mesa/Conduzir",
    tags: ["mestre", "estrutura"],
    ancora: "s-18-1",
    resumo: `1. **Briefing** — a Agência dá informação incompleta. Sempre.
2. **Inserção** — teste de precisão, deriva de chegada, e o instante escolhido queima para sempre.
3. **Leitura** — a fase mais importante: descobrir qual é a Viga.
4. **Correção** — a parte pulp: perseguição, briga, gambiarra, gritaria.
5. **Fechamento** — IF em 15%? Sumam, ou fiquem e empurrem mais para baixo.
6. **Deriva** — 1d100 contra a IF final, na mesa, na frente de todos.
7. **Extração** — chegar ao Ponto de Saída na hora combinada, ou pagar o Puxão.
8. **Descompressão.**`,
    relacionados: ["A Viga", "A Janela", "Deriva", "Descompressão", "As alavancas do mestre"],
  },
  {
    nome: "As alavancas do mestre",
    pasta: "Mesa/Conduzir",
    tags: ["mestre"],
    ancora: "s-18-2",
    resumo: `- **Suba a Instabilidade Pessoal** quando o grupo tomar atalhos. É a punição por pressa.
- **Desça a Instabilidade do Fluxo** quando o grupo entender coisas. É a recompensa por atenção.
- **Dê Discernimento** quando o grupo pagar um preço. É a recompensa por coragem.
- **Cobre o custo em voz alta** no sucesso com custo. É onde o jogo vira negociação.
- **Suba a Suspeita** quando o grupo enxergar demais. É o preço institucional de entender.

**Nunca use uma no lugar da outra.**`,
    relacionados: ["Instabilidade Pessoal", "Instabilidade do Fluxo", "Discernimento", "Suspeita", "Leitura do teste"],
  },
  {
    nome: "Segurando o tom",
    pasta: "Mesa/Conduzir",
    tags: ["mestre", "tom"],
    ancora: "s-18-3",
    resumo: `CHRONO tem premissa triste e jogo divertido. **A premissa fica no fundo.** Se toda sessão for sobre estar morto, a mesa cansa em três semanas.

Deixe o absurdo ser absurdo: um dinossauro em São Paulo é engraçado antes de ser assustador. A melancolia funciona melhor aparecendo uma vez por sessão, de surpresa, em vinte segundos, e indo embora.

**A pergunta que sustenta a campanha:** todo agente morreu, todo agente quer voltar, e a Agência diz que não dá. A Agência pode estar mentindo. *Não responda isso cedo.*`,
    relacionados: ["A Agência", "Você morreu", "As alavancas do mestre"],
  },
  {
    nome: "Grau",
    pasta: "Bestiário",
    tags: ["mestre", "inimigos"],
    ancora: "s-1-1",
    livro: "inimigos",
    resumo: `**Grau mede dano ao Fluxo, não capacidade de combate.** Um vírus é Grau 5 e não tem um único ponto de vida. Um cachorro deslocado é Grau 1 e pode matar um Novato.

Não use Grau para escolher encontro. Use para saber **quanto da Instabilidade do Fluxo aquilo segura** — e portanto quanto a missão anda quando os jogadores resolvem.

| Grau | Defesa | PV | Ataque | Dano | Salv. | Grupo |
|---|---|---|---|---|---|---|
| 1 | 12 | 20 | +3 | 1d6+2 | +1 | 1–4 |
| 2 | 15 | 45 | +6 | 1d8+4 | +3 | 5–8 |
| 3 | 18 | 90 | +9 | 2d6+6 | +5 | 9–12 |
| 4 | 21 | 170 | +12 | 3d6+8 | +7 | 13–17 |
| 5 | 24 | 300 | +15 | 4d6+10 | +9 | 18–20 |

**Grau 3+** Presença Pesada · **Grau 4+** Resiliência e Duas Ações · **Grau 5** Não Se Mata Assim.`,
    relacionados: ["As cinco famílias", "Instabilidade do Fluxo", "Anomalia"],
  },
  {
    nome: "As cinco famílias",
    pasta: "Bestiário",
    tags: ["inimigos", "índice"],
    ancora: "parte-02",
    livro: "inimigos",
    resumo: `**Deslocados** — coisa ou criatura fora da própria época. Sem intenção, e difíceis de esconder.

**Divergentes** — humanos que preferem a linha nova e vão matar para mantê-la. O JFK que sobreviveu acha que é o mocinho, e na linha dele ele é. Normalmente os melhores vilões.

**Paradoxos** — seres impossíveis nascidos da contradição. Cada um quebra uma regra específica do sistema, e o grupo precisa descobrir qual.

**Fantasmas** — a população da Zona.

**Renegados** — ex-agentes que chegaram à Camada 5 e decidiram que o Fluxo atual não valia a pena. Têm mais Discernimento que você.`,
    relacionados: ["Grau", "Fantasmas", "Renegados", "Anomalia"],
  },
  {
    nome: "Fantasmas",
    pasta: "Bestiário",
    tags: ["inimigos", "fantasmas"],
    ancora: "s-14-4",
    resumo: `Fantasmas **não têm PV e não causam dano**. Fantasmas causam Instabilidade.

Toque de fantasma: salvaguarda de Autocontrole contra o limiar indicado. Falhou, sobe a IP indicada.

Você **não pode matá-los**. Pode afastar, selar, conversar, correr, negociar. Um combate contra fantasmas não é sobre reduzir números — é sobre sair da sala antes de virar um.

Isso os torna aterrorizantes sem estatísticas grandes: a solução para um fantasma é sempre esperta, nunca bruta.`,
    relacionados: ["A Zona Fantasma", "Instabilidade Pessoal", "Ancorador", "As cinco famílias"],
  },
  {
    nome: "Renegados",
    pasta: "Bestiário",
    tags: ["inimigos", "trama"],
    ancora: "parte-06",
    livro: "inimigos",
    resumo: `Ex-agentes que chegaram à Camada 5 e decidiram que o Fluxo atual não valia a pena.

Têm classe, trilha, Instabilidade — e **mais Discernimento que você**. Montam-se com as regras dos jogadores.

Um Renegado capturado é a melhor fonte de informação do jogo. Deixar um ir sobe a Suspeita em 2.`,
    relacionados: ["As cinco famílias", "As Camadas", "Suspeita", "A Agência"],
  },
  {
    nome: "Descoagular",
    pasta: "Sistema/Conflito",
    tags: ["condição", "conflito"],
    ancora: "s-14-3",
    resumo: `A 0 PV você **descoagula**: inconsciente e translúcido, **+10 IP por rodada** até ser estabilizado.

Estabilizar: Medicina ND 12, ou qualquer habilidade de Ancorador. Ao voltar, role 1d4 de [[Sequela]].

**Três descoagulações na mesma missão** e você é Devolvido automaticamente, independente da Instabilidade.`,
    relacionados: ["Sequela", "Instabilidade Pessoal", "Ancorador"],
  },
];

/** As três classes, com trilhas — geram notas próprias, mais ricas. */
export const CLASSES = [
  {
    nome: "Viajante",
    papel: "Linha de frente",
    analogia: "o Combatente de Ordem Paranormal",
    atributos: "Corpo, Reflexo",
    lema: "Você atravessa. O que estiver no caminho é problema do caminho.",
    ideia: `O Viajante é quem entra primeiro e quem não sai do lugar. Metade das habilidades dele existe para que **outra pessoa** não seja atingida — Interceptar, Muro, Não Hoje — e o capstone é literalmente segurar todo mundo no lugar enquanto o Fluxo tenta reescrever a cena.`,
    trilhas: [
      ["Vanguarda", "Fica na frente e absorve. Transfere Instabilidade de um aliado para si, e na Camada 3 pode ser Devolvido no lugar de outro."],
      ["Caçador Temporal", "Fareja a anomalia e rastreia alvos através de épocas. Na Camada 3, sabe ao olhar se alguém já viajou no tempo."],
      ["Executor", "Destrói o que está deslocado com as mãos. Na Camada 3, o ataque alcança algo que existe em outra época."],
    ],
  },
  {
    nome: "Ancorador",
    papel: "Fantasmas, Instabilidade e suporte",
    analogia: "o Ocultista de Ordem Paranormal, mais o suporte do time",
    atributos: "Vontade, Sintonia",
    lema: "Você é o único que conversa com eles — e o único que segura o resto.",
    ideia: `O Ancorador é a única classe que interage de verdade com a [[A Zona Fantasma|Zona]]. Vê fantasmas desde a Camada 0, tira Instabilidade dos outros carregando parte dela, e no fim consegue tirar alguém da Zona em definitivo.

É também o único jeito confiável de estabilizar quem [[Descoagular|descoagulou]] sem um teste de Medicina.`,
    trilhas: [
      ["Médico Temporal", "Costura o dobro e estabiliza sem teste. Na Camada 3, remove uma Sequela ou um Trauma adquirido de um aliado."],
      ["Estabilizador", "Destrói um fantasma em definitivo — e isso apaga a pessoa que ele foi. Na Camada 3, consegue destruir sem apagar; você carrega o que sobra."],
      ["Sincronizador", "Convence fantasmas a agir como aliados. Na Camada 3, pode perguntar a um fantasma sobre qualquer evento que ele viu, inclusive o futuro dele."],
    ],
  },
  {
    nome: "Paradoxista",
    papel: "O especialista que dobra a regra",
    analogia: "o Especialista de Ordem Paranormal",
    atributos: "Intelecto, Presença",
    lema: "Você resolve com o que tem na mesa, e o que não tem você declara que sempre teve.",
    ideia: `Junta três coisas que antes eram classes separadas: bugiganga, disfarce e investigação. O fio que amarra é declarar coisas sobre o passado e o Fluxo aceitar.

Carrega as ferramentas de achar a [[A Viga|Viga]] — Memória do Certo, Linha Cortada, Ver a Viga — que são o motor da fase de Leitura de toda missão.`,
    trilhas: [
      ["Manipulador", "Fala a língua de qualquer época e redireciona a culpa do grupo para um NPC plausível. Na Camada 3, convence um Divergente de que a linha original era a dele."],
      ["Rupturista", "Bomba de Estabilidade derruba 10% da IF de uma vez. Na Camada 3, o Remendo Bruto desfaz fisicamente um efeito da anomalia."],
      ["Anômalo", "Declara ter plantado algo naquele lugar, no passado. Na Camada 3, reescreve retroativamente o próprio papel numa situação."],
    ],
  },
];
