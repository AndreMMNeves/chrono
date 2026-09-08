/**
 * Os cinco agentes prontos.
 *
 * Fonte única: daqui saem tanto o seletor da ficha do site quanto as notas do
 * cofre. Todos em nível 1, Patente Novato, Camada 0, Instabilidade 0.
 *
 * O elenco cobre cinco continentes, cinco épocas diferentes do Guia e 1750 anos
 * entre o mais antigo e o mais recente. A época de origem dá vantagem em testes
 * sociais e de História naquele período, então repetir época desperdiça alguém.
 *
 * A regra de composição: cada um faz para a Agência uma versão torta do que
 * fazia em vida. É daí que sai o personagem, não da ficha.
 *
 * As contas seguem as regras atuais:
 *   atributos compráveis somam 9, nenhum passa de 3 na criação
 *   perícias: 10 pontos, máximo 2 em cada
 *   PV = 12 + (Corpo × 2)      EP máx = 11 + (Vontade × 2)
 *   Defesa = 10 + Reflexo      Carga = 5 + Corpo
 */

export const AGENTES = [
  /* ==================================== 1. ÁFRICA · ANTIGUIDADE ========== */
  {
    id: "sesenebi",
    nome: "Sesenebi",
    classe: "Viajante",
    trilha: "Vanguarda",
    papel: "Fica na frente",
    epoca: "212 d.C. · Alexandria",
    epocaGuia: "Antiguidade",
    lugar: "África — Egito romano, a arena",
    oficio: "Bestiária de arena: entrava contra os animais",
    morte:
      "Um leopardo que já estava morto e ninguém conferiu. Ela virou de costas para agradecer a plateia.",
    ironia:
      "Passou nove anos matando animal grande na frente de vinte mil pessoas gritando. A Agência a manda atrás de animal grande de novo — só que agora o serviço é **não** matar, e o silêncio é a parte difícil.",
    gancho:
      "Ela sabe exatamente onde encostar num bicho de meia tonelada para ele mudar de ideia. O que ela nunca aprendeu foi a trabalhar sem alguém assistindo.",
    atributos: { Corpo: 3, Reflexo: 3, Intelecto: 1, "Presença": 1, Vontade: 1, Sintonia: 0 },
    pericias: { Luta: 2, Atletismo: 2, "Resistência": 2, "Percepção": 2, "Intimidação": 2 },
    trauma: "O Barulho",
    habilidades: [
      ["Peso Morto", "passiva", "+2 PV por nível, acumulado. Você já morreu uma vez; a segunda demora mais."],
      ["Interceptar", "2 EP", "Reação: se põe entre um aliado e um ataque, e recebe metade do dano."],
    ],
    memorias: [
      "O cheiro de areia molhada com o que a areia é molhada, que eu nunca consegui chamar de outra coisa.",
      "Minha irmã vendendo pão do lado de fora do circo e fingindo que não sabia o que eu fazia lá dentro.",
      "A primeira vez que a plateia gritou meu nome e eu percebi que eles não sabiam meu nome.",
      "Um tratador velho me ensinando que bicho nenhum te odeia — ele só tem pressa.",
      "O corredor escuro antes do portão abrir, e os seis segundos em que ainda dá para desistir.",
    ],
    equipamento: [
      "Lança · 1d8 + Corpo · 3 espaços · alcance, desvantagem em espaço fechado",
      "Couro batido · +2 de Defesa · 2 espaços",
      "Roupa de época (conjunto) · 1 espaço · +2 em Disfarce naquela época",
      "Corda e gancho · 1 espaço · +2 em Atletismo para escalar",
      "— 7 dos 8 espaços de Carga",
    ],
    dica:
      "A mais simples de jogar: fique na frente, use Interceptar quando alguém for atingido, deixe o resto do grupo pensar. O Trauma acorda em combate em massa e com muita gente gritando — e passar na salvaguarda devolve 1 de Esforço. Contra dois ou mais inimigos ela tem vantagem em Luta. Origem na Antiguidade: Roma, Egito e Grécia são casa dela, e a Biblioteca de Alexandria fica a três ruas de onde ela morreu.",
  },

  /* ======================================== 2. ÁSIA · IDADE MÉDIA ======== */
  {
    id: "linqiao",
    nome: "Lin Qiao",
    classe: "Viajante",
    trilha: "Executor",
    papel: "Quebra o que está fora do lugar",
    epoca: "1271 · Xiangyang",
    epocaGuia: "Idade Média",
    lugar: "Ásia — China Song, o cerco de Xiangyang",
    oficio: "Sapadora: cavava túneis por baixo da muralha e derrubava a muralha",
    morte:
      "O túnel dela cedeu com ela dentro, dois dias antes de a cidade cair de qualquer jeito.",
    ironia:
      "Derrubava estrutura de baixo para cima, achando o ponto onde uma escora de nada segura tudo. É literalmente o que uma anomalia é — e ela é a única do grupo que olha para o Fluxo e enxerga uma obra mal feita.",
    gancho:
      "Não gosta de altura, não gosta de espaço aberto e não confia em nada que ela mesma não tenha escorado. Entra primeiro assim mesmo.",
    atributos: { Corpo: 3, Reflexo: 2, Intelecto: 2, "Presença": 1, Vontade: 1, Sintonia: 0 },
    pericias: { Atletismo: 2, Luta: 2, "Resistência": 2, Tecnologia: 2, "Percepção": 2 },
    trauma: "O Chão Vindo",
    habilidades: [
      ["Peso Morto", "passiva", "+2 PV por nível, acumulado. Você já morreu uma vez; a segunda demora mais."],
      ["Interceptar", "2 EP", "Reação: se põe entre um aliado e um ataque, e recebe metade do dano."],
    ],
    memorias: [
      "O barulho que a terra faz um segundo antes de decidir cair, que é quase nenhum.",
      "Meu mestre marcando a escora com giz e dizendo: essa aqui é a que importa, decore ela.",
      "Arroz frio comido no escuro, a doze metros de profundidade, e sendo a melhor refeição do dia.",
      "A muralha de Fancheng caindo no lugar exato onde eu disse que ia cair.",
      "A luz da boca do túnel quando eu subia — sempre menor do que eu lembrava.",
    ],
    equipamento: [
      "**Bandoleira** · vestida · a marreta deixa de ocupar espaço, mas fica à vista: +1 de Anacronismo em público",
      "Marreta · 1d6 + Corpo · 2 espaços, zerados pela bandoleira",
      "Ferramentas · 1 espaço · necessário para Gambiarra e consertos finos",
      "Cota de malha · +3 de Defesa · 3 espaços · desvantagem em Furtividade",
      "Lanterna ou lampião · 1 espaço",
      "— 5 dos 8 espaços de Carga",
    ],
    dica:
      "Aguenta pancada e entende estrutura — é a ponte entre bater e resolver. Tecnologia 2 deixa ela útil na fase de Leitura, não só na de Correção. O Trauma dela compensa o Reflexo 2: vantagem em Iniciativa, sempre, porque ela sempre sabe quanto tempo tem. A Trilha Executor destrói objeto deslocado com as mãos, ignorando durabilidade — que é o serviço da vida inteira dela.",
  },

  /* ============================= 3. EUROPA · NAVEGAÇÕES E RENASCIMENTO === */
  {
    id: "cosimo",
    nome: "Cosimo Ferrante",
    classe: "Paradoxista",
    trilha: "Manipulador",
    papel: "Especialista, a boca do grupo",
    epoca: "1547 · Nápoles",
    epocaGuia: "Navegações e Renascimento",
    lugar: "Europa — Reino de Nápoles, sacristias e antessalas",
    oficio: "Falsificador de relíquias: vendeu quatro dedos do mesmo santo para quatro dioceses",
    morte:
      "O aprendiz dele o denunciou à Inquisição e ficou com a oficina. Cosimo levou onze dias.",
    ironia:
      "A vida inteira convencendo gente de que um pedaço de osso qualquer sempre foi sagrado. Agora ele declara coisas sobre o passado e o Fluxo às vezes **aceita** — o que confirma o pior medo dele, que é o de que nunca tenha havido diferença.",
    gancho:
      "Educado, encantador e absolutamente sem escrúpulo sobre a verdade dos outros. Sobre a própria, ele é um desastre.",
    atributos: { Corpo: 1, Reflexo: 2, Intelecto: 2, "Presença": 3, Vontade: 1, Sintonia: 0 },
    pericias: { "Enganação": 2, "Persuasão": 2, Disfarce: 2, "História": 2, "Investigação": 2 },
    trauma: "A Mão Conhecida",
    habilidades: [
      ["Kit Anacrônico", "passiva", "Carrega 3 itens de outras épocas; repõe entre missões."],
      ["Memória do Certo", "passiva", "Sabe como o evento deveria ter acontecido, sem rolar. Não sabe quem mudou."],
    ],
    memorias: [
      "O ouro em folha grudando no dedo e a certeza de que aquilo ia enganar um bispo.",
      "Minha mãe rezando para um relicário que eu tinha feito na quinta-feira anterior.",
      "O aprendiz aos catorze anos, sem jeito, perguntando se aquilo era pecado — e eu rindo.",
      "Vinho branco gelado numa antessala em Sorrento, esperando um cardeal que nunca desceu.",
      "A cara do primeiro homem que chorou de verdade segurando uma coisa que eu inventei.",
    ],
    equipamento: [
      "**Coldre** · vestido · a adaga deixa de ocupar espaço e não aparece",
      "Adaga · 1d6 + Corpo · 1 espaço, zerado pelo coldre · pode ser escondida",
      "Roupa de época (conjunto) · 1 espaço · +2 em Disfarce",
      "Papel, tinta e documentos falsos · miúdo · permite Nome Falso sem gastar Esforço",
      "Dinheiro da época · miúdo · resolve mais problema que espada",
      "— 2 dos 6 espaços de Carga. Ele anda leve de propósito: quem corre não carrega.",
    ],
    dica:
      "É quem conversa. Memória do Certo é passiva e gratuita: use toda missão para saber como o evento deveria ter sido — é o motor da fase de Leitura. Ele tem PV 14 e Corpo 1: se entrar na briga, morre. O trabalho dele é fazer a briga não acontecer. História 2 mais a origem no Renascimento faz dele a melhor fonte do grupo sobre Inquisição, corte e comércio.",
  },

  /* ============== 4. AMÉRICA DO NORTE · INDUSTRIAL E FRONTEIRA ========== */
  {
    id: "odette",
    nome: "Odette Baptiste",
    classe: "Ancorador",
    trilha: "Sincronizador",
    papel: "Suporte, fantasmas e Instabilidade",
    epoca: "1888 · Nova Orleans",
    epocaGuia: "Industrial e Fronteira",
    lugar: "América do Norte — Louisiana, salas de sessão espírita",
    oficio: "Médium de mesa. Charlatã completa: gaze, mesa articulada e uma assistente no armário",
    morte:
      "Uma cliente derrubou o lampião no escuro, durante a parte em que Odette fingia estar em transe.",
    ironia:
      "Vinte anos fingindo falar com os mortos, e nunca acreditou em uma palavra. Morreu, e agora eles falam com ela de verdade — e alguns **lembram** dela dizendo o nome deles errado numa sala cheia.",
    gancho:
      "A única do grupo que vê fantasma desde o primeiro dia. Isso não é dom, é cobrança.",
    atributos: { Corpo: 1, Reflexo: 1, Intelecto: 2, "Presença": 2, Vontade: 3, Sintonia: 0 },
    pericias: { Autocontrole: 2, "Percepção": 2, "Enganação": 2, "Persuasão": 2, Ecos: 2 },
    trauma: "A Coisa Quente",
    habilidades: [
      ["Olho Aberto", "passiva", "Vê fantasmas desde a Camada 0, sem precisar de Sintonia."],
      ["Costura", "2 EP", "Remove 5 de Instabilidade de um aliado. Você sobe 2."],
    ],
    memorias: [
      "O barbante preso no dedo mindinho, que fazia a mesa bater e nunca falhou uma vez.",
      "Uma viúva me pagando com a aliança do marido, e eu aceitando, e eu aceitando mesmo assim.",
      "Café com chicória na varanda, antes de qualquer cliente, quando a casa ainda era só casa.",
      "O nome que eu inventei de um filho morto e a mãe dizendo que sim, era esse mesmo.",
      "Minha assistente cantando baixinho dentro do armário porque ela tinha medo do escuro.",
    ],
    equipamento: [
      "Kit médico · 1 espaço · +2 em Medicina, estabiliza quem descoagula sem teste",
      "Roupa reforçada · +1 de Defesa · 1 espaço",
      "Roupa de época (conjunto) · 1 espaço",
      "Lanterna · 1 espaço",
      "Papel, tinta e documentos · miúdo",
      "— 4 dos 6 espaços de Carga",
    ],
    dica:
      "É a única que enxerga fantasma desde o primeiro dia, e a única que tira Instabilidade dos outros — carregando parte dela. Segure a Costura para quando alguém estiver perto de 25. Com Vontade 3 ela tem o maior Esforço do grupo. Ecos 2 com Sintonia 0 dá só +2, mas mostra que perícia de Sintonia pode ser treinada antes de a Sintonia existir — quando o Discernimento subir, ela dispara.",
  },

  /* ================================== 5. OCEANIA · GUERRA FRIA =========== */
  {
    id: "nell",
    nome: "Nell Corrigan",
    classe: "Paradoxista",
    trilha: "Rupturista",
    papel: "Especialista, explosivo e conserto",
    epoca: "1962 · Ilhas Salomão",
    epocaGuia: "Guerra Fria",
    lugar: "Oceania — Pacífico, limpeza de munição não detonada da guerra anterior",
    oficio: "Desarmava bomba. Passou onze anos tirando da terra o que outra geração enterrou",
    morte:
      "Uma espoleta japonesa de 1943 que tinha esperado dezenove anos e escolheu aquela terça-feira.",
    ironia:
      "A vida inteira garantindo que as coisas **não** explodissem. A Trilha dela na Agência se chama Rupturista, e a primeira habilidade é literalmente uma bomba. Ela acha isso de um mau gosto notável.",
    gancho:
      "Mão firme, paciência infinita e zero conversa. Se você perguntar como ela está, ela responde sobre o equipamento.",
    atributos: { Corpo: 2, Reflexo: 3, Intelecto: 3, "Presença": 0, Vontade: 1, Sintonia: 0 },
    pericias: { Tecnologia: 2, "Ciência": 2, Reflexos: 2, "Investigação": 2, Autocontrole: 2 },
    trauma: "O Súbito",
    habilidades: [
      ["Kit Anacrônico", "passiva", "Carrega 3 itens de outras épocas; repõe entre missões."],
      ["Memória do Certo", "passiva", "Sabe como o evento deveria ter acontecido, sem rolar. Não sabe quem mudou."],
    ],
    memorias: [
      "O clique que não é o clique errado, e como o corpo inteiro sabe disso antes da cabeça.",
      "Meu pai voltando de Tobruk e nunca mais entrando numa sala sem olhar o teto primeiro.",
      "Chá preto forte demais numa caneca amassada, às quatro da manhã, antes de descer para a praia.",
      "Um menino da aldeia me trazendo uma espoleta na mão aberta, sorrindo, e eu não podendo gritar.",
      "A lista de dezessete nomes que eu carregava, das pessoas que não morreram porque eu cheguei antes.",
    ],
    equipamento: [
      "Colete balístico · +3 de Defesa · 2 espaços · Anacronismo 2",
      "Explosivo plástico · 3d6 · 1 espaço · área, uso único, exige uma cena de preparo",
      "Ferramentas · 1 espaço · necessário para Gambiarra e consertos finos",
      "Binóculo · 1 espaço · +2 em Percepção à distância",
      "Lanterna · 1 espaço",
      "— 6 dos 7 espaços de Carga",
    ],
    dica:
      "Presença 0: ela não conversa, ela resolve. É o exemplo de zerar um atributo em troca de um ponto — custa caro em cena social e não custa nada na ficha, porque nenhum derivado usa Presença. Com Intelecto 3 e Tecnologia 2 é a melhor do grupo em teste técnico, e Reflexo 3 dá a ela a maior Defesa e Iniciativa entre os especialistas. A Trilha Rupturista derruba 10% da Instabilidade do Fluxo de uma vez, uma vez por missão.",
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

/** O elenco inteiro precisa cobrir mundo e história sem repetir. */
export function conferirElenco(agentes) {
  const erros = [];
  const unico = (campo, rotulo) => {
    const vistos = new Map();
    for (const a of agentes) {
      const v = a[campo];
      if (vistos.has(v)) erros.push(`${rotulo} repetido entre ${vistos.get(v)} e ${a.nome}: ${v}`);
      else vistos.set(v, a.nome);
    }
  };
  unico("epocaGuia", "Época do Guia");
  unico("trauma", "Trauma");
  unico("trilha", "Trilha");

  const continentes = new Set(agentes.map((a) => a.lugar.split("—")[0].trim()));
  if (continentes.size !== agentes.length) {
    erros.push(`${continentes.size} continentes para ${agentes.length} agentes — algum se repete`);
  }

  const porClasse = {};
  for (const a of agentes) porClasse[a.classe] = (porClasse[a.classe] || 0) + 1;
  if (porClasse.Viajante !== 2) erros.push(`${porClasse.Viajante || 0} Viajantes, deveriam ser 2`);
  if (porClasse.Ancorador !== 1) erros.push(`${porClasse.Ancorador || 0} Ancoradores, deveria ser 1`);
  if (porClasse.Paradoxista !== 2) erros.push(`${porClasse.Paradoxista || 0} Paradoxistas, deveriam ser 2`);
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
