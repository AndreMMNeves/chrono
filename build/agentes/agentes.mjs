/**
 * Os cinco agentes prontos.
 *
 * Fonte única: daqui saem tanto o seletor da ficha do site quanto as notas do
 * cofre. Todos em nível 1, Patente Novato, Camada 0, Instabilidade 0.
 *
 * As contas seguem as regras atuais:
 *   atributos compráveis somam 9, nenhum passa de 3 na criação
 *   perícias: 10 pontos, máximo 2 em cada
 *   PV = 12 + (Corpo × 2)      EP máx = 11 + (Vontade × 2)
 *   Defesa = 10 + Reflexo      Carga = 5 + Corpo
 */

export const AGENTES = [
  /* ====================================================== 1. VIAJANTE ==== */
  {
    id: "aurelio",
    nome: "Aurélio Sanches",
    classe: "Viajante",
    trilha: "Vanguarda",
    papel: "Fica na frente",
    epoca: "1932 · São Paulo",
    morte: "Levou três tiros cobrindo a retirada de um pelotão na Revolução Constitucionalista.",
    gancho:
      "Aguentou tempo demais para os outros passarem. Continua fazendo isso, e ainda não percebeu que agora é de graça.",
    atributos: { Corpo: 3, Reflexo: 3, Intelecto: 1, "Presença": 1, Vontade: 1, Sintonia: 0 },
    pericias: { Luta: 2, Atletismo: 2, "Resistência": 2, Reflexos: 2, "Percepção": 2 },
    trauma: "O Barulho",
    habilidades: [
      ["Peso Morto", "passiva", "+2 PV por nível, acumulado. Você já morreu uma vez; a segunda demora mais."],
      ["Interceptar", "2 EP", "Reação: se põe entre um aliado e um ataque, e recebe metade do dano."],
    ],
    memorias: [
      "O cheiro de pólvora molhada na trincheira do Túnel, e o sujeito ao lado rindo de nervoso.",
      "Minha mãe costurando a braçadeira MMDC na manga do meu paletó, sem falar nada.",
      "A primeira vez que atirei em alguém e o barulho ter sido mais alto do que eu esperava.",
      "Um copo de leite quente às cinco da manhã, antes de sair de casa pela última vez.",
      "O nome do rapaz que eu mandei correr — e ele correu, e eu nunca soube se chegou.",
    ],
    equipamento: [
      "Roupa de época (conjunto) — +2 em Disfarce naquela época",
      "Faca · 1d6 + Corpo · pode ser escondida",
      "Corda e gancho — +2 em Atletismo para escalar",
    ],
    dica:
      "Aurélio é o mais simples de jogar: fique na frente, use Interceptar quando alguém for atingido, e deixe o resto do grupo pensar. O Trauma dele acorda em toda cena de combate em massa — e passar na salvaguarda devolve 1 de Esforço.",
  },

  /* ====================================================== 2. VIAJANTE ==== */
  {
    id: "iracema",
    nome: "Iracema Vaz",
    classe: "Viajante",
    trilha: "Executor",
    papel: "Quebra o que está fora do lugar",
    epoca: "1974 · Osasco",
    morte: "Prensa industrial. Foi rápido, e ela não ouviu a máquina descer.",
    gancho:
      "Passou dezoito anos consertando o que a fábrica quebrava. Agora conserta o que o tempo quebra, e o método é parecido: achar a peça errada e arrancar.",
    atributos: { Corpo: 3, Reflexo: 2, Intelecto: 2, "Presença": 1, Vontade: 1, Sintonia: 0 },
    pericias: { Luta: 2, Atletismo: 2, Tecnologia: 2, "Resistência": 2, Pontaria: 2 },
    trauma: "O Súbito",
    habilidades: [
      ["Peso Morto", "passiva", "+2 PV por nível, acumulado. Você já morreu uma vez; a segunda demora mais."],
      ["Interceptar", "2 EP", "Reação: se põe entre um aliado e um ataque, e recebe metade do dano."],
    ],
    memorias: [
      "O apito das seis da tarde, e a fila inteira parando de fingir que trabalhava.",
      "Minha filha aprendendo a andar segurando no meu dedo mindinho, só nesse.",
      "A greve de 68, e a primeira vez que eu vi mil pessoas calarem a boca ao mesmo tempo.",
      "O gosto de mate gelado numa segunda-feira de calor, na porta do barracão.",
      "Meu pai dizendo que máquina não tem raiva de ninguém — ela só faz o que mandaram.",
    ],
    equipamento: [
      "Ferramentas — necessário para Gambiarra e consertos finos",
      "Cassetete ou barra de ferro · 1d4 + Corpo",
      "Roupa de época (conjunto)",
    ],
    dica:
      "Iracema aguenta pancada e entende máquina — é a ponte entre bater e resolver. Tecnologia 2 deixa ela útil na fase de Leitura, não só na de Correção. Cuidado: o Trauma acorda com barulho alto e repentino, e uma anomalia industrial é cheia disso.",
  },

  /* ===================================================== 3. ANCORADOR ==== */
  {
    id: "benedita",
    nome: "Benedita Rosa",
    classe: "Ancorador",
    trilha: "Sincronizador",
    papel: "Suporte, fantasmas e Instabilidade",
    epoca: "1888 · sertão da Bahia",
    morte: "Febre puerperal, quatro dias depois de um parto que deu certo. O da criança, não o dela.",
    gancho:
      "Passou a vida na porta entre nascer e morrer, segurando gente dos dois lados. A Agência não precisou explicar muito o serviço.",
    atributos: { Corpo: 1, Reflexo: 1, Intelecto: 2, "Presença": 2, Vontade: 3, Sintonia: 0 },
    pericias: { Medicina: 2, Autocontrole: 2, "Percepção": 2, "Persuasão": 2, "História": 2 },
    trauma: "O Lento",
    habilidades: [
      ["Olho Aberto", "passiva", "Vê fantasmas desde a Camada 0, sem precisar de Sintonia."],
      ["Costura", "2 EP", "Remove 5 de Instabilidade de um aliado. Você sobe 2."],
    ],
    memorias: [
      "O peso exato de um recém-nascido nas duas mãos, que é sempre menos do que a gente espera.",
      "13 de maio, a notícia chegando na vila com três dias de atraso e ninguém sabendo o que fazer da alegria.",
      "A voz da minha avó ensinando qual erva serve para febre e qual só serve para o cheiro.",
      "Um homem me agradecendo de joelhos, e eu com vergonha, porque a mulher tinha feito tudo sozinha.",
      "A última coisa que eu vi foi o teto de barro, e eu pensei: preciso consertar isso amanhã.",
    ],
    equipamento: [
      "Kit médico — +2 em Medicina, estabiliza quem descoagula sem teste",
      "Roupa de época (conjunto)",
      "Papel, tinta e documentos",
    ],
    dica:
      "Benedita é a única do grupo que enxerga fantasma desde o primeiro dia, e a única que tira Instabilidade dos outros — carregando parte dela. Segure a Costura para quando alguém estiver perto de 25. Com Vontade 3 ela tem o maior Esforço do grupo, e é ela quem aguenta uma missão longa.",
  },

  /* =================================================== 4. PARADOXISTA ==== */
  {
    id: "estevao",
    nome: "Estêvão Furtado",
    classe: "Paradoxista",
    trilha: "Manipulador",
    papel: "Especialista, a boca do grupo",
    epoca: "1969 · Rio de Janeiro",
    morte: "Entregue por um sócio de quinze anos. Levaram ele numa quinta e a família soube na terça.",
    gancho:
      "Falsificava documento bom o bastante para atravessar fronteira. Descobriu tarde que o papel dele era perfeito e a companhia não.",
    atributos: { Corpo: 1, Reflexo: 2, Intelecto: 2, "Presença": 3, Vontade: 1, Sintonia: 0 },
    pericias: { "Enganação": 2, Disfarce: 2, "Investigação": 2, "Persuasão": 2, Tecnologia: 2 },
    trauma: "A Mão Conhecida",
    habilidades: [
      ["Kit Anacrônico", "passiva", "Carrega 3 itens de outras épocas; repõe entre missões."],
      ["Memória do Certo", "passiva", "Sabe como o evento deveria ter acontecido, sem rolar. Não sabe quem mudou."],
    ],
    memorias: [
      "O cheiro de tinta fresca às três da manhã, quando o carimbo finalmente saía igual.",
      "Minha irmã atravessando a fronteira com um passaporte meu, e acenando sem olhar para trás.",
      "Um chope no Amarelinho com o sujeito que depois me entregou, e nós dois rindo alto.",
      "O barulho da máquina de escrever da minha mãe, que era datilógrafa e nunca soube o que eu fazia.",
      "A cara do rapaz de dezenove anos que abriu a porta, e que estava com mais medo do que eu.",
    ],
    equipamento: [
      "Papel, tinta e documentos falsos — permite Nome Falso sem gastar Esforço",
      "Roupa de época (conjunto) — +2 em Disfarce",
      "Dinheiro da época — resolve mais problema que espada",
    ],
    dica:
      "Estêvão é quem conversa. Memória do Certo é passiva e gratuita: use toda missão para saber como o evento deveria ter sido — é o motor da fase de Leitura. Ele tem PV 14 e Corpo 1: se entrar na briga, morre. O trabalho dele é fazer a briga não acontecer.",
  },

  /* =================================================== 5. PARADOXISTA ==== */
  {
    id: "hideo",
    nome: "Hideo Tanaka",
    classe: "Paradoxista",
    trilha: "Rupturista",
    papel: "Especialista, bugiganga e conserto",
    epoca: "1958 · Londrina",
    morte: "Incêndio na própria oficina de rádio. Voltou para buscar o cachorro e o cachorro já tinha saído.",
    gancho:
      "Consertava rádio, relógio e o que mais aparecesse. Agora conserta o século, com a mesma bancada bagunçada e a mesma paciência.",
    atributos: { Corpo: 1, Reflexo: 2, Intelecto: 3, "Presença": 0, Vontade: 3, Sintonia: 0 },
    pericias: { Tecnologia: 2, "Ciência": 2, "Investigação": 2, Reflexos: 2, Autocontrole: 2 },
    trauma: "A Coisa Quente",
    habilidades: [
      ["Kit Anacrônico", "passiva", "Carrega 3 itens de outras épocas; repõe entre missões."],
      ["Memória do Certo", "passiva", "Sabe como o evento deveria ter acontecido, sem rolar. Não sabe quem mudou."],
    ],
    memorias: [
      "O primeiro rádio que eu consertei sozinho, aos onze anos, e a novela saindo dele.",
      "Meu pai desembarcando em Santos com uma mala e nenhuma palavra de português.",
      "O cheiro de solda e o silêncio da oficina depois que a rua já tinha dormido.",
      "A vizinha trazendo bolo toda quarta e nunca aceitando pagamento pelo conserto.",
      "O cachorro latindo do lado de fora, e eu entendendo tarde demais o que aquilo significava.",
    ],
    equipamento: [
      "Ferramentas — necessário para Gambiarra e consertos finos",
      "Lanterna ou lampião",
      "Binóculo — +2 em Percepção à distância",
    ],
    dica:
      "Hideo tem Presença 0: ele não conversa, ele resolve. É o exemplo de zerar um atributo em troca de um ponto — custa caro em cena social e não custa nada na ficha, porque nenhum derivado usa Presença. Com Intelecto 3 e Tecnologia 2 ele é o melhor do grupo em qualquer teste técnico.",
  },
];

/* -------------------------------------------------------------------------- */

/** Confere que cada agente respeita as regras de criação. */
export function conferir(a) {
  const erros = [];
  const compraveis = ["Corpo", "Reflexo", "Intelecto", "Presença", "Vontade"];
  const soma = compraveis.reduce((n, k) => n + (a.atributos[k] ?? 0), 0);
  if (soma !== 9) erros.push(`atributos somam ${soma}, deveriam somar 9`);
  for (const k of compraveis) {
    const v = a.atributos[k] ?? 0;
    if (v > 3) erros.push(`${k} ${v} passa do teto 3 na criação`);
    if (v < 0) erros.push(`${k} negativo`);
  }
  if ((a.atributos.Sintonia ?? 0) !== 0) erros.push("Sintonia deveria começar em 0");

  const pontos = Object.values(a.pericias).reduce((n, v) => n + v, 0);
  if (pontos !== 10) erros.push(`perícias somam ${pontos}, deveriam somar 10`);
  for (const [p, v] of Object.entries(a.pericias)) {
    if (v > 2) erros.push(`${p} ${v} passa do teto 2 na criação`);
  }
  if (a.memorias.length !== 5) erros.push(`${a.memorias.length} memórias, deveriam ser 5`);
  if (a.habilidades.length !== 2) erros.push(`${a.habilidades.length} habilidades de nível 1, deveriam ser 2`);
  return erros;
}

/** Os derivados de um agente de nível 1, Patente Novato, Camada 0. */
export function derivados(a) {
  const at = a.atributos;
  return {
    pv: 12 + at.Corpo * 2,
    ep: 11 + at.Vontade * 2,
    defesa: 10 + at.Reflexo,
    iniciativa: at.Reflexo,
    carga: 5 + at.Corpo,
    epRodada: 2,
  };
}
