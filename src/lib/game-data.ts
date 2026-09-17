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
    enunciado:
      "Numa festa, um amigo insiste para você experimentar uma droga dizendo que 'só uma vez não vicia'. O que você faz?",
    opcoes: [
      {
        texto: "Recuso e explico que não quero",
        efeito: { saude: 10, consciencia: 15, familia: 5 },
        feedback: "Dizer não é uma escolha de força. A primeira vez é justamente onde a dependência começa.",
      },
      {
        texto: "Experimento só para não ser excluído",
        efeito: { saude: -20, consciencia: -10, familia: -10 },
        feedback: "Pressão do grupo é o principal gatilho na adolescência. Nenhuma dose é segura.",
      },
      {
        texto: "Finjo que aceito e descarto escondido",
        efeito: { saude: -5, consciencia: 0 },
        feedback: "Você escapou, mas continuar no ambiente de pressão aumenta o risco na próxima vez.",
      },
    ],
  },
  {
    id: 2,
    tema: "apostas",
    enunciado:
      "Um anúncio promete 'ganho garantido' em um jogo do tigrinho com apenas R$ 20. Qual sua reação?",
    opcoes: [
      {
        texto: "Denuncio o anúncio e ignoro",
        efeito: { dinheiro: 5, consciencia: 15 },
        feedback: "Não existe ganho garantido: o algoritmo é calculado para a casa sempre lucrar.",
      },
      {
        texto: "Deposito os R$ 20 para testar",
        efeito: { dinheiro: -15, consciencia: -10 },
        feedback: "A 'vitória iniciante' é isca. Ela libera dopamina e cria o ciclo da aposta.",
      },
      {
        texto: "Deposito tudo que tenho guardado",
        efeito: { dinheiro: -30, familia: -15, consciencia: -15 },
        feedback: "Apostar a reserva é o passo mais comum rumo ao endividamento.",
      },
    ],
  },
  {
    id: 3,
    tema: "apostas",
    enunciado: "Você perdeu R$ 200 apostando. Uma voz diz: 'aposte mais para recuperar'. E agora?",
    opcoes: [
      {
        texto: "Paro, respiro e converso com alguém de confiança",
        efeito: { dinheiro: 5, familia: 15, consciencia: 15 },
        feedback: "Pedir ajuda interrompe o ciclo. Falar sobre a perda reduz a vergonha que alimenta o vício.",
      },
      {
        texto: "Dobro a aposta para virar o jogo",
        efeito: { dinheiro: -25, saude: -10, consciencia: -15 },
        feedback: "Isso se chama 'perseguir a perda' e é o sintoma clássico do jogo patológico.",
      },
      {
        texto: "Pego dinheiro emprestado com um colega",
        efeito: { dinheiro: -15, familia: -15 },
        feedback: "Dívidas com pessoas próximas destroem relações e aumentam a pressão para apostar mais.",
      },
    ],
  },
  {
    id: 4,
    tema: "drogas",
    enunciado: "Você percebe que um amigo está usando drogas com frequência. Qual atitude?",
    opcoes: [
      {
        texto: "Converso sem julgar e procuro um adulto responsável",
        efeito: { familia: 15, consciencia: 15 },
        feedback: "Acolher sem julgar é o que faz a pessoa aceitar tratamento (CAPS-AD, escola, família).",
      },
      {
        texto: "Exponho ele nas redes sociais",
        efeito: { familia: -15, consciencia: -10 },
        feedback: "Humilhação afasta a pessoa da ajuda e agrava o uso.",
      },
      {
        texto: "Finjo que não vi",
        efeito: { consciencia: -10, familia: -5 },
        feedback: "O silêncio deixa a dependência avançar sem freio.",
      },
    ],
  },
  {
    id: 5,
    tema: "drogas",
    enunciado: "Qual dessas afirmações sobre o cigarro eletrônico (vape) é verdadeira?",
    opcoes: [
      {
        texto: "Contém nicotina e causa dependência",
        efeito: { saude: 10, consciencia: 15 },
        feedback: "Correto. O vape é proibido no Brasil pela Anvisa e causa lesões pulmonares graves.",
      },
      {
        texto: "É só vapor de água, é inofensivo",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Mito. O aerossol tem metais pesados e substâncias cancerígenas.",
      },
      {
        texto: "Serve para parar de fumar sem risco",
        efeito: { saude: -10, consciencia: -5 },
        feedback: "Na maioria dos casos cria uma nova dependência em vez de encerrar a antiga.",
      },
    ],
  },
  {
    id: 6,
    tema: "apostas",
    enunciado: "Você ficou 5 horas seguidas em apps de aposta e perdeu a prova de amanhã. O que faz?",
    opcoes: [
      {
        texto: "Desinstalo os apps e uso bloqueio de sites",
        efeito: { saude: 10, dinheiro: 10, consciencia: 15 },
        feedback: "Reduzir o acesso é a estratégia mais eficaz nas primeiras semanas.",
      },
      {
        texto: "Deixo para me organizar depois",
        efeito: { saude: -10, consciencia: -10 },
        feedback: "O adiamento é como o vício consome estudos, sono e trabalho.",
      },
      {
        texto: "Aposto mais para 'compensar' o tempo perdido",
        efeito: { dinheiro: -20, saude: -10, familia: -10 },
        feedback: "Perda de controle sobre o tempo é critério de diagnóstico de jogo patológico.",
      },
    ],
  },
  {
    id: 7,
    tema: "drogas",
    enunciado: "Sua família percebe mudanças no seu comportamento e quer conversar. Você...",
    opcoes: [
      {
        texto: "Aceito a conversa e conto a verdade",
        efeito: { familia: 20, consciencia: 15, saude: 5 },
        feedback: "Vínculo familiar forte é o maior fator de proteção contra dependência.",
      },
      {
        texto: "Minto e me tranco no quarto",
        efeito: { familia: -15, saude: -5, consciencia: -10 },
        feedback: "O isolamento é sinal de alerta e afasta a rede de apoio.",
      },
      {
        texto: "Brigo e saio de casa",
        efeito: { familia: -25, saude: -10 },
        feedback: "Romper o vínculo aumenta muito o risco de agravamento.",
      },
    ],
  },
  {
    id: 8,
    tema: "apostas",
    enunciado: "Um influenciador diz que vive de apostas e mostra carros de luxo. Você conclui que:",
    opcoes: [
      {
        texto: "Ele é pago para divulgar e esconde as perdas",
        efeito: { dinheiro: 10, consciencia: 15 },
        feedback: "A maioria é remunerada por indicação. Mostram ganhos e nunca as perdas.",
      },
      {
        texto: "Se ele consegue, eu também consigo",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Viés de sobrevivência: você só vê quem ganhou, nunca os milhões que perderam.",
      },
      {
        texto: "Vou copiar as apostas dele",
        efeito: { dinheiro: -25, familia: -10 },
        feedback: "Seguir 'palpites' pagos é a forma mais rápida de perder dinheiro real.",
      },
    ],
  },
  {
    id: 9,
    tema: "drogas",
    enunciado: "Onde uma pessoa pode buscar ajuda gratuita para dependência no Brasil?",
    opcoes: [
      {
        texto: "CAPS-AD e Unidade Básica de Saúde (SUS)",
        efeito: { saude: 15, consciencia: 20, familia: 10 },
        feedback: "Correto. O CAPS-AD atende gratuitamente pessoas com uso problemático de álcool e drogas.",
      },
      {
        texto: "Só em clínicas particulares caras",
        efeito: { consciencia: -10 },
        feedback: "Mito comum. O tratamento pelo SUS é público e gratuito.",
      },
      {
        texto: "Ninguém pode ajudar, é só força de vontade",
        efeito: { saude: -10, consciencia: -15 },
        feedback: "Dependência é doença, não falta de caráter. Precisa de tratamento.",
      },
    ],
  },
  {
    id: 10,
    tema: "apostas",
    enunciado: "Você recebeu R$ 300 do seu primeiro trabalho. Qual escolha?",
    opcoes: [
      {
        texto: "Guardo parte e ajudo em casa",
        efeito: { dinheiro: 20, familia: 15, consciencia: 10 },
        feedback: "Planejamento financeiro reduz a atração por 'dinheiro fácil'.",
      },
      {
        texto: "Aposto metade achando que dobro",
        efeito: { dinheiro: -25, familia: -10, consciencia: -10 },
        feedback: "Estatisticamente, quanto mais você aposta, mais perto está de perder tudo.",
      },
      {
        texto: "Gasto tudo em uma noite com bebida",
        efeito: { dinheiro: -20, saude: -15 },
        feedback: "Álcool é a droga que mais causa internações entre jovens no Brasil.",
      },
    ],
  },
  {
    id: 11,
    tema: "drogas",
    enunciado: "Um traficante oferece dinheiro fácil para você 'só levar um pacote'. Você:",
    opcoes: [
      {
        texto: "Recuso e procuro ajuda segura de um adulto",
        efeito: { consciencia: 20, familia: 10 },
        feedback: "Envolvimento com o tráfico traz risco de morte e processo criminal, mesmo para menores.",
      },
      {
        texto: "Aceito, é só uma vez",
        efeito: { dinheiro: 10, saude: -20, familia: -20, consciencia: -20 },
        feedback: "O 'só uma vez' vira dívida e chantagem. Saída quase impossível.",
      },
      {
        texto: "Peço tempo para pensar",
        efeito: { consciencia: -5, saude: -5 },
        feedback: "Hesitar é entendido como interesse e aumenta a pressão sobre você.",
      },
    ],
  },
  {
    id: 12,
    tema: "apostas",
    enunciado: "Você se pega mentindo sobre quanto apostou. Esse comportamento indica:",
    opcoes: [
      {
        texto: "Sinal de alerta de vício — preciso de ajuda",
        efeito: { consciencia: 20, familia: 10, saude: 5 },
        feedback: "Mentir sobre a quantia é um dos critérios oficiais de jogo patológico.",
      },
      {
        texto: "Nada demais, todo mundo faz isso",
        efeito: { consciencia: -15, familia: -10 },
        feedback: "Normalizar o comportamento é o que atrasa o pedido de ajuda.",
      },
      {
        texto: "Só significa que quero privacidade",
        efeito: { consciencia: -10, familia: -5 },
        feedback: "Segredo e vergonha andam juntos no ciclo da compulsão.",
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
  { tipo: "evento", rotulo: "Rua" },
  { tipo: "pergunta", rotulo: "Festa" },
  { tipo: "descanso", rotulo: "Casa" },
  { tipo: "pergunta", rotulo: "Celular" },
  { tipo: "evento", rotulo: "Praça" },
  { tipo: "pergunta", rotulo: "Amigos" },
  { tipo: "pergunta", rotulo: "Trabalho" },
  { tipo: "descanso", rotulo: "Casa" },
  { tipo: "evento", rotulo: "Internet" },
  { tipo: "pergunta", rotulo: "Bar" },
  { tipo: "pergunta", rotulo: "Família" },
  { tipo: "evento", rotulo: "Shopping" },
  { tipo: "pergunta", rotulo: "Decisão" },
  { tipo: "descanso", rotulo: "Posto de saúde" },
  { tipo: "pergunta", rotulo: "Redes sociais" },
  { tipo: "evento", rotulo: "Bairro" },
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
