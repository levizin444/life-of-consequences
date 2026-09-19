export type Efeito = {
  saude?: number;
  dinheiro?: number;
  familia?: number;
  consciencia?: number;
};

export type Opcao = {
  texto: string;
  efeito: Efeito;
  feedback: string;
};

export type Pergunta = {
  id: number;
  tema: "drogas" | "apostas";
  enunciado: string;
  opcoes: Opcao[];
};

export type TipoCasa = "inicio" | "pergunta" | "evento" | "descanso" | "final";

export type Casa = {
  tipo: TipoCasa;
  rotulo: string;
};

export const PERGUNTAS: Pergunta[] = [
  {
    id: 1,
    tema: "drogas",
    enunciado: "Numa festa, oferecem uma substância e dizem que é segura porque veio de alguém conhecido. O que você faz?",
    opcoes: [
      {
        texto: "Aceito só metade para diminuir o risco",
        efeito: { saude: -20, consciencia: -10 },
        feedback: "Reduzir a quantidade não torna uma substância desconhecida segura. Composição e potência podem variar muito.",
      },
      {
        texto: "Recuso, permaneço com pessoas de confiança e procuro outro ambiente",
        efeito: { saude: 10, consciencia: 15, familia: 5 },
        feedback: "Você evitou o consumo e também saiu da situação de pressão. Essa combinação oferece maior proteção.",
      },
      {
        texto: "Guardo para pesquisar e experimentar sozinho depois",
        efeito: { saude: -25, consciencia: -15, familia: -10 },
        feedback: "Pesquisar não revela a composição real, e usar sozinho aumenta o risco de intoxicação sem ajuda por perto.",
      },
      {
        texto: "Fico na festa, mas digo que talvez aceite mais tarde",
        efeito: { saude: -5, consciencia: -5 },
        feedback: "Você adiou o uso, mas deixou aberta a negociação e continuou exposto à pressão do grupo.",
      },
    ],
  },
  {
    id: 2,
    tema: "apostas",
    enunciado: "Um aplicativo oferece bônus de R$ 50 se você depositar R$ 20 hoje. Qual decisão parece mais sensata?",
    opcoes: [
      {
        texto: "Deposito apenas os R$ 20 e retiro assim que ganhar",
        efeito: { dinheiro: -20, consciencia: -10 },
        feedback: "A promessa parece controlada, mas bônus costumam exigir muitas apostas antes de permitir qualquer saque.",
      },
      {
        texto: "Uso o bônus porque não estou apostando meu próprio dinheiro",
        efeito: { dinheiro: -15, saude: -5, consciencia: -15 },
        feedback: "O bônus é uma isca para criar frequência de uso; quase sempre há depósito real e regras de saque envolvidas.",
      },
      {
        texto: "Ignoro a oferta, bloqueio as notificações e mantenho o dinheiro",
        efeito: { dinheiro: 10, consciencia: 15 },
        feedback: "Bloquear o estímulo evita decisões impulsivas e protege seu dinheiro antes que o ciclo comece.",
      },
      {
        texto: "Deposito um valor maior para aproveitar melhor a promoção",
        efeito: { dinheiro: -30, familia: -10, consciencia: -15 },
        feedback: "Aumentar o depósito amplia a perda possível. A promoção foi criada para fazer você apostar mais, não para lucrar.",
      },
    ],
  },
  {
    id: 3,
    tema: "apostas",
    enunciado: "Depois de perder R$ 200, você sente que está perto de recuperar tudo. O que faz?",
    opcoes: [
      {
        texto: "Faço só mais uma aposta, mas com um limite definido",
        efeito: { dinheiro: -20, consciencia: -10 },
        feedback: "O limite parece responsável, porém continuar para recuperar uma perda mantém ativo o ciclo de perseguição.",
      },
      {
        texto: "Aumento a aposta porque uma vitória compensa as anteriores",
        efeito: { dinheiro: -30, saude: -10, familia: -15 },
        feedback: "As apostas anteriores não aumentam sua chance de vencer. Apostar mais apenas coloca mais dinheiro em risco.",
      },
      {
        texto: "Paro, registro a perda e converso com alguém de confiança",
        efeito: { dinheiro: 5, familia: 15, consciencia: 15 },
        feedback: "Reconhecer a perda e pedir apoio interrompe a perseguição e reduz decisões tomadas por impulso.",
      },
      {
        texto: "Mudo para um jogo que parece ter chances melhores",
        efeito: { dinheiro: -15, consciencia: -5 },
        feedback: "Trocar de jogo não elimina a vantagem da casa nem resolve a vontade de recuperar o que foi perdido.",
      },
    ],
  },
  {
    id: 4,
    tema: "drogas",
    enunciado: "Um amigo está usando drogas com frequência, mas pede segredo porque teme ser julgado. Como agir?",
    opcoes: [
      {
        texto: "Prometo segredo e tento cuidar dele sem envolver ninguém",
        efeito: { familia: -5, consciencia: -5, saude: -5 },
        feedback: "A intenção é acolher, mas enfrentar isso sozinho pode atrasar ajuda profissional e colocar vocês dois em risco.",
      },
      {
        texto: "Afasto-me até ele decidir parar por conta própria",
        efeito: { familia: -10, consciencia: -10 },
        feedback: "O afastamento sem oferecer uma ponte de ajuda pode aumentar o isolamento que alimenta a dependência.",
      },
      {
        texto: "Escuto sem humilhar e busco com ele um adulto ou serviço de saúde",
        efeito: { familia: 15, consciencia: 15, saude: 5 },
        feedback: "Acolhimento com apoio responsável preserva a confiança e aproxima a pessoa de tratamento seguro.",
      },
      {
        texto: "Conto para todo o grupo para que todos pressionem pela mudança",
        efeito: { familia: -20, consciencia: -15 },
        feedback: "Exposição e pressão coletiva podem gerar vergonha, romper a confiança e afastar a pessoa da ajuda.",
      },
    ],
  },
  {
    id: 5,
    tema: "drogas",
    enunciado: "Alguém diz que o vape é uma alternativa mais leve porque não tem a fumaça do cigarro. O que você conclui?",
    opcoes: [
      {
        texto: "Pode ser usado socialmente, desde que eu não compre um aparelho",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Uso ocasional também expõe à nicotina e pode iniciar dependência, mesmo sem ter um aparelho próprio.",
      },
      {
        texto: "O risco é menor se o líquido tiver sabor e procedência conhecida",
        efeito: { saude: -20, consciencia: -15 },
        feedback: "Sabor e embalagem não garantem segurança; o aerossol pode conter nicotina, metais e outras substâncias tóxicas.",
      },
      {
        texto: "Evito o uso porque ausência de fumaça não significa ausência de risco",
        efeito: { saude: 15, consciencia: 15 },
        feedback: "Correto. O vape produz aerossol com substâncias nocivas e pode causar dependência e lesões pulmonares.",
      },
      {
        texto: "Experimento sem nicotina, pois assim não existe dano",
        efeito: { saude: -10, consciencia: -5 },
        feedback: "Mesmo produtos anunciados sem nicotina podem ter composição incerta e substâncias prejudiciais ao pulmão.",
      },
    ],
  },
  {
    id: 6,
    tema: "apostas",
    enunciado: "Você percebe que as apostas estão tirando seu sono e atrapalhando os estudos. Qual é o melhor primeiro passo?",
    opcoes: [
      {
        texto: "Crio horários fixos para apostar sem atrapalhar minhas tarefas",
        efeito: { saude: -10, dinheiro: -10, consciencia: -5 },
        feedback: "Organizar o horário parece controle, mas mantém o acesso e não enfrenta a perda de controle já percebida.",
      },
      {
        texto: "Desinstalo os aplicativos, bloqueio os sites e conto a alguém",
        efeito: { saude: 10, dinheiro: 10, familia: 10, consciencia: 15 },
        feedback: "Criar barreiras e buscar apoio reduz o acesso imediato e aumenta sua chance de manter a decisão.",
      },
      {
        texto: "Continuo até recuperar o prejuízo e depois faço uma pausa",
        efeito: { saude: -15, dinheiro: -30, familia: -10, consciencia: -15 },
        feedback: "Condicionar a parada à recuperação aprofunda o prejuízo e prolonga o comportamento compulsivo.",
      },
      {
        texto: "Troco apostas com dinheiro por versões gratuitas",
        efeito: { saude: -5, consciencia: -5 },
        feedback: "Pode reduzir a perda imediata, mas mantém os gatilhos, o tempo de tela e o hábito de apostar.",
      },
    ],
  },
  {
    id: 7,
    tema: "drogas",
    enunciado: "Sua família percebe mudanças no seu comportamento e pede uma conversa. Como responder?",
    opcoes: [
      {
        texto: "Aceito conversar, conto o que está acontecendo e peço apoio",
        efeito: { familia: 20, consciencia: 15, saude: 5 },
        feedback: "Falar com honestidade fortalece a rede de apoio e facilita o acesso à ajuda antes que a situação piore.",
      },
      {
        texto: "Digo que está tudo bem para não preocupar ninguém",
        efeito: { familia: -10, consciencia: -10, saude: -5 },
        feedback: "Parece proteção, mas esconder o problema aumenta o isolamento e impede que a família ajude.",
      },
      {
        texto: "Peço para conversar outro dia e evito o assunto",
        efeito: { familia: -5, consciencia: -5 },
        feedback: "Escolher um momento melhor pode ser válido, mas evitar repetidamente adia o apoio necessário.",
      },
      {
        texto: "Acuso todos de invasão e corto o contato",
        efeito: { familia: -25, saude: -10, consciencia: -10 },
        feedback: "Romper vínculos elimina uma importante proteção e deixa o problema mais difícil de enfrentar sozinho.",
      },
    ],
  },
  {
    id: 8,
    tema: "apostas",
    enunciado: "Um influenciador mostra ganhos, carros e uma planilha que supostamente prova seu método. Como avaliar?",
    opcoes: [
      {
        texto: "Testo com pouco dinheiro antes de decidir se o método funciona",
        efeito: { dinheiro: -15, consciencia: -10 },
        feedback: "Um teste curto pode coincidir com sorte e não comprova o método; ainda coloca dinheiro real em risco.",
      },
      {
        texto: "Verifico se ele é patrocinado e lembro que ganhos não mostram as perdas",
        efeito: { dinheiro: 10, consciencia: 15 },
        feedback: "Publicidade, recortes de vitórias e resultados não auditados criam uma imagem enganosa de sucesso.",
      },
      {
        texto: "Sigo apenas as apostas com maior porcentagem indicada na planilha",
        efeito: { dinheiro: -20, consciencia: -10 },
        feedback: "Números bem apresentados podem parecer científicos sem serem verificáveis; a casa mantém sua vantagem.",
      },
      {
        texto: "Compro o curso para ter as mesmas informações que ele",
        efeito: { dinheiro: -25, familia: -5, consciencia: -15 },
        feedback: "Além de pagar pelo curso, você continua exposto às perdas. O lucro mais seguro pode ser o de quem vende o método.",
      },
    ],
  },
  {
    id: 9,
    tema: "drogas",
    enunciado: "Uma pessoa quer reduzir o uso de álcool ou outras drogas, mas diz que ainda não precisa de tratamento. O que sugerir?",
    opcoes: [
      {
        texto: "Esperar chegar ao fundo do poço para o tratamento funcionar",
        efeito: { saude: -25, familia: -15, consciencia: -15 },
        feedback: "Não é preciso chegar a uma crise. Quanto mais cedo houver cuidado, maiores são as possibilidades de recuperação.",
      },
      {
        texto: "Buscar orientação na UBS ou no CAPS-AD, mesmo sem saber se há dependência",
        efeito: { saude: 15, familia: 10, consciencia: 20 },
        feedback: "Os serviços públicos podem avaliar a situação e orientar gratuitamente, sem exigir que ela esteja no limite.",
      },
      {
        texto: "Tentar parar sozinho primeiro para provar que tem controle",
        efeito: { saude: -5, consciencia: -10 },
        feedback: "A tentativa parece determinada, mas transformar ajuda em prova de força pode atrasar cuidados e aumentar a culpa.",
      },
      {
        texto: "Substituir a substância por outra considerada menos prejudicial",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "A substituição sem orientação pode manter a dependência ou criar novos riscos, em vez de tratar suas causas.",
      },
    ],
  },
  {
    id: 10,
    tema: "apostas",
    enunciado: "Você recebeu R$ 300 do primeiro trabalho e quer usar uma parte para se divertir. Qual escolha protege melhor seu futuro?",
    opcoes: [
      {
        texto: "Separo uma parte para gastos e guardo o restante antes de decidir",
        efeito: { dinheiro: 20, familia: 10, consciencia: 10 },
        feedback: "Definir limites antes do impulso protege sua reserva sem impedir uma diversão planejada.",
      },
      {
        texto: "Aposto apenas o que eu aceitaria gastar em outro lazer",
        efeito: { dinheiro: -10, consciencia: -5 },
        feedback: "A comparação com lazer parece prudente, mas a aposta pode incentivar novas tentativas e ultrapassar o limite inicial.",
      },
      {
        texto: "Aposto metade em opções consideradas mais seguras",
        efeito: { dinheiro: -25, familia: -10, consciencia: -10 },
        feedback: "Nenhuma aposta é investimento seguro. Mesmo resultados prováveis podem falhar e a plataforma cobra sua vantagem.",
      },
      {
        texto: "Uso tudo em uma aposta para tentar transformar R$ 300 em R$ 600",
        efeito: { dinheiro: -35, familia: -15, consciencia: -15 },
        feedback: "Colocar toda a renda em um resultado incerto ameaça necessidades reais e reforça a ilusão do dinheiro fácil.",
      },
    ],
  },
  {
    id: 11,
    tema: "drogas",
    enunciado: "Oferecem dinheiro para você levar um pacote fechado sem dizer o conteúdo. Qual reação é mais segura?",
    opcoes: [
      {
        texto: "Aceito depois de confirmar que não preciso abrir o pacote",
        efeito: { dinheiro: 5, saude: -20, familia: -20, consciencia: -20 },
        feedback: "Não abrir o pacote não elimina responsabilidade nem risco. O segredo é justamente parte da tentativa de envolvimento.",
      },
      {
        texto: "Recuso, saio do local e procuro um adulto ou canal seguro de ajuda",
        efeito: { consciencia: 20, familia: 10, saude: 5 },
        feedback: "Recusar e buscar apoio reduz o risco de coerção, violência e envolvimento criminal.",
      },
      {
        texto: "Peço para ver o conteúdo antes de decidir",
        efeito: { saude: -10, consciencia: -10 },
        feedback: "Investigar sozinho prolonga o contato e pode aumentar a pressão ou a ameaça sobre você.",
      },
      {
        texto: "Levo uma vez e uso o dinheiro para ajudar em casa",
        efeito: { dinheiro: 10, saude: -25, familia: -25, consciencia: -20 },
        feedback: "Uma boa intenção não torna a ação segura. O primeiro transporte pode virar chantagem e gerar consequências graves.",
      },
    ],
  },
  {
    id: 12,
    tema: "apostas",
    enunciado: "Você começou a esconder quanto aposta para evitar discussões em casa. Como interpretar isso?",
    opcoes: [
      {
        texto: "É um sinal de alerta; preciso interromper e procurar apoio",
        efeito: { consciencia: 20, familia: 15, saude: 5 },
        feedback: "Reconhecer o segredo como alerta permite buscar ajuda antes que perdas e conflitos aumentem.",
      },
      {
        texto: "Mantenho em segredo até recuperar o dinheiro e então conto tudo",
        efeito: { dinheiro: -25, familia: -15, consciencia: -15 },
        feedback: "A promessa de contar depois depende de continuar apostando e costuma aprofundar tanto a perda quanto a mentira.",
      },
      {
        texto: "Defino um limite menor para não precisar falar sobre o assunto",
        efeito: { dinheiro: -10, familia: -10, consciencia: -10 },
        feedback: "Reduzir o valor parece controle, mas esconder continua sendo um sinal de que a aposta já afeta seus vínculos.",
      },
      {
        texto: "É apenas privacidade, pois o dinheiro é meu",
        efeito: { dinheiro: -15, familia: -10, consciencia: -10 },
        feedback: "Privacidade é diferente de esconder por medo das consequências. A vergonha e o segredo alimentam o ciclo.",
      },
    ],
  },
];

export const EVENTOS: { texto: string; efeito: Efeito }[] = [
  { texto: "Você participou de uma palestra na escola sobre prevenção.", efeito: { consciencia: 10, saude: 5 } },
  { texto: "Notificação de bônus de aposta chegou no seu celular e te tentou a noite toda.", efeito: { saude: -5, consciencia: -5 } },
  { texto: "Você praticou esporte com os amigos: lazer sem substâncias.", efeito: { saude: 15, familia: 5 } },
  { texto: "Gastou o lanche da semana em raspadinhas online.", efeito: { dinheiro: -15 } },
  { texto: "Sua família te apoiou em um momento difícil.", efeito: { familia: 15, saude: 5 } },
  { texto: "Noite sem dormir rolando apps de aposta.", efeito: { saude: -15, dinheiro: -5 } },
  { texto: "Você ajudou um colega a procurar o CAPS-AD.", efeito: { consciencia: 15, familia: 10 } },
  { texto: "Começou a fumar para 'aliviar o estresse'.", efeito: { saude: -15, dinheiro: -5 } },
];

export const DESCANSOS = [
  "Pausa: você dormiu bem e recuperou energia.",
  "Pausa: terapia na escola ajudou a organizar as ideias.",
  "Pausa: um domingo em família fez bem.",
];

export const TABULEIRO: Casa[] = [
  { tipo: "inicio", rotulo: "Início" },
  { tipo: "pergunta", rotulo: "Escola" },
  { tipo: "pergunta", rotulo: "Rua" },
  { tipo: "pergunta", rotulo: "Festa" },
  { tipo: "pergunta", rotulo: "Casa" },
  { tipo: "pergunta", rotulo: "Celular" },
  { tipo: "pergunta", rotulo: "Praça" },
  { tipo: "pergunta", rotulo: "Amigos" },
  { tipo: "pergunta", rotulo: "Trabalho" },
  { tipo: "pergunta", rotulo: "Casa" },
  { tipo: "pergunta", rotulo: "Internet" },
  { tipo: "pergunta", rotulo: "Bar" },
  { tipo: "pergunta", rotulo: "Família" },
  { tipo: "pergunta", rotulo: "Shopping" },
  { tipo: "pergunta", rotulo: "Decisão" },
  { tipo: "pergunta", rotulo: "Posto de saúde" },
  { tipo: "pergunta", rotulo: "Redes sociais" },
  { tipo: "pergunta", rotulo: "Bairro" },
  { tipo: "pergunta", rotulo: "Encruzilhada" },
  { tipo: "final", rotulo: "Futuro" },
];

export type Final = {
  titulo: string;
  descricao: string;
  tom: "bom" | "medio" | "ruim";
};

export function calcularFinal(p: {
  saude: number;
  dinheiro: number;
  familia: number;
  consciencia: number;
}): Final {
  const total = p.saude + p.dinheiro + p.familia + p.consciencia;

  if (p.saude <= 15)
    return {
      titulo: "Final: A saúde cobrou a conta",
      descricao:
        "O corpo não aguentou. Internação, tratamento longo e um recomeço difícil. A dependência química é doença e tem tratamento gratuito pelo SUS — quanto antes, melhor.",
      tom: "ruim",
    };
  if (p.dinheiro <= 15)
    return {
      titulo: "Final: Afundado em dívidas",
      descricao:
        "As apostas levaram tudo: salário, poupança e dinheiro emprestado. A casa de apostas nunca perde — quem perde é sempre o jogador.",
      tom: "ruim",
    };
  if (p.familia <= 15)
    return {
      titulo: "Final: Sozinho",
      descricao:
        "Mentiras e brigas afastaram todo mundo. O isolamento é combustível do vício. Reconstruir vínculos é parte essencial de qualquer recuperação.",
      tom: "ruim",
    };
  if (total >= 280)
    return {
      titulo: "Final: Livre e consciente",
      descricao:
        "Você atravessou a pressão, soube dizer não e ainda ajudou outras pessoas. Hoje você é referência de prevenção na sua comunidade.",
      tom: "bom",
    };
  if (total >= 200)
    return {
      titulo: "Final: De pé, com cicatrizes",
      descricao:
        "Você escorregou algumas vezes, mas pediu ajuda a tempo. A recuperação é um caminho com recaídas — o que importa é não parar de buscar apoio.",
      tom: "medio",
    };
  return {
    titulo: "Final: Na corda bamba",
    descricao:
      "Você chegou ao fim ainda preso ao ciclo de apostas e substâncias. Ainda dá tempo: CAPS-AD, UBS e a própria família são portas abertas.",
    tom: "ruim",
  };
}
