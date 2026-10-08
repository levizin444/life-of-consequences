export type Efeito = {
  saude?: number;
  dinheiro?: number;
  familia?: number;
  consciencia?: number;
};

export type Opcao = {
  letra: "A" | "B" | "C" | "D";
  texto: string;
  efeito: Efeito;
  feedback: string;
  correta: boolean; // true para escolha consciente / protetiva
};

export type Dificuldade = "fácil" | "médio" | "difícil";

export type Pergunta = {
  id: number;
  fase: 1 | 2 | 3;
  dificuldade: Dificuldade;
  tema: "drogas" | "apostas" | "hábitos";
  enunciado: string;
  opcoes: Opcao[];
};

export type TipoCasa = "inicio" | "pergunta" | "apoio" | "minigame" | "final";

export type Casa = {
  numero: number;
  fase: 1 | 2 | 3;
  tipo: TipoCasa;
  rotulo: string;
  subtitulo: string;
  icone: string;
};

// 30 CASAS EM 3 FASES: 1-10 introdutória, 11-20 pressão social, 21-30 alta consequência
// Casas 15 e 25 são eventos de MINIGAME (ver src/components/minigames)
export const TABULEIRO: Casa[] = [
  { numero: 1, fase: 1, tipo: "inicio", rotulo: "Ponto de Partida", subtitulo: "Início da Jornada", icone: "Compass" },
  { numero: 2, fase: 1, tipo: "pergunta", rotulo: "Casa da Família", subtitulo: "Diálogo & Vínculos", icone: "Home" },
  { numero: 3, fase: 1, tipo: "pergunta", rotulo: "Escola & Estudos", subtitulo: "Conhecimento & Futuro", icone: "GraduationCap" },
  { numero: 4, fase: 1, tipo: "pergunta", rotulo: "Praça de Esportes", subtitulo: "Lazer Saudável", icone: "Activity" },
  { numero: 5, fase: 1, tipo: "pergunta", rotulo: "Roda de Amigos", subtitulo: "Convivência Diária", icone: "Users" },
  { numero: 6, fase: 1, tipo: "pergunta", rotulo: "Primeiro Convite", subtitulo: "Saber Dizer Não", icone: "Sparkles" },
  { numero: 7, fase: 1, tipo: "pergunta", rotulo: "Mesada Consciente", subtitulo: "Planejar Gastos", icone: "CircleDollarSign" },
  { numero: 8, fase: 1, tipo: "pergunta", rotulo: "Redes Sociais", subtitulo: "Influência Digital", icone: "Smartphone" },
  { numero: 9, fase: 1, tipo: "pergunta", rotulo: "Hobby Saudável", subtitulo: "Tempo Livre", icone: "Award" },
  { numero: 10, fase: 1, tipo: "pergunta", rotulo: "Checkpoint 1", subtitulo: "Primeiras Escolhas", icone: "ShieldCheck" },
  { numero: 11, fase: 2, tipo: "pergunta", rotulo: "Festa de Sexta", subtitulo: "Pressão de Grupo", icone: "Sparkles" },
  { numero: 12, fase: 2, tipo: "pergunta", rotulo: "Feed do Celular", subtitulo: "Anúncios de Apostas", icone: "Smartphone" },
  { numero: 13, fase: 2, tipo: "pergunta", rotulo: "Jogos Online", subtitulo: "Armadilhas de Bets", icone: "Gamepad2" },
  { numero: 14, fase: 2, tipo: "pergunta", rotulo: "Balcão de Tentação", subtitulo: "Ofertas Fáceis", icone: "AlertTriangle" },
  { numero: 15, fase: 2, tipo: "minigame", rotulo: "Desafio Especial", subtitulo: "Minigame", icone: "Star" },
  { numero: 16, fase: 2, tipo: "pergunta", rotulo: "Primeiro Salário", subtitulo: "Gestão do Dinheiro", icone: "CircleDollarSign" },
  { numero: 17, fase: 2, tipo: "pergunta", rotulo: "Grupo de Mensagens", subtitulo: "Links Suspeitos", icone: "MessageSquare" },
  { numero: 18, fase: 2, tipo: "pergunta", rotulo: "Fim de Noite", subtitulo: "Limites Pessoais", icone: "Moon" },
  { numero: 19, fase: 2, tipo: "apoio", rotulo: "Rede de Apoio", subtitulo: "UBS & CAPS-AD", icone: "LifeBuoy" },
  { numero: 20, fase: 2, tipo: "pergunta", rotulo: "Checkpoint 2", subtitulo: "Maturidade & Alerta", icone: "ShieldAlert" },
  { numero: 21, fase: 3, tipo: "pergunta", rotulo: "Momento Crítico", subtitulo: "Sinais de Dependência", icone: "HeartPulse" },
  { numero: 22, fase: 3, tipo: "pergunta", rotulo: "Ilusão do Lucro", subtitulo: "Perseguição de Perdas", icone: "TrendingDown" },
  { numero: 23, fase: 3, tipo: "pergunta", rotulo: "Dívida Oculta", subtitulo: "Segredos Custam Caro", icone: "AlertTriangle" },
  { numero: 24, fase: 3, tipo: "pergunta", rotulo: "Reconstrução", subtitulo: "Recuperar Vínculos", icone: "HeartHandshake" },
  { numero: 25, fase: 3, tipo: "minigame", rotulo: "Desafio Especial", subtitulo: "Minigame", icone: "Star" },
  { numero: 26, fase: 3, tipo: "pergunta", rotulo: "Grande Encruzilhada", subtitulo: "Decisão Decisiva", icone: "Shuffle" },
  { numero: 27, fase: 3, tipo: "pergunta", rotulo: "Recaída?", subtitulo: "Força de Vontade", icone: "ShieldAlert" },
  { numero: 28, fase: 3, tipo: "pergunta", rotulo: "Exemplo Positivo", subtitulo: "Apoio a Outros", icone: "Award" },
  { numero: 29, fase: 3, tipo: "pergunta", rotulo: "Portão da Consciência", subtitulo: "Reta Final", icone: "Key" },
  { numero: 30, fase: 3, tipo: "final", rotulo: "O Futuro Chegou!", subtitulo: "Vitória das Escolhas", icone: "Trophy" },
];

export const PERGUNTAS: Pergunta[] = [
  // ==================== FASE 1: FÁCIL (Casas 1 a 6) ====================
  {
    id: 1,
    fase: 1,
    dificuldade: "fácil",
    tema: "drogas",
    enunciado: "Numa festa entre conhecidos, alguém oferece um cigarro eletrônico (vape) com aroma de frutas dizendo ser inofensivo. O que você faz?",
    opcoes: [
      {
        letra: "A",
        texto: "Recuso com firmeza, lembrando que vapes contêm nicotina e substâncias tóxicas.",
        efeito: { saude: 15, consciencia: 15, familia: 5 },
        feedback: "Excelente! O vapor contém metais pesados e nicotina em alta concentração, gerando rápida dependência química.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Dou só uma tragada para ver o gosto e não parecer chato com a turma.",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Cuidado! O primeiro contato com a nicotina pode iniciar uma dependência respiratória silenciosa.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Compro um aparelho para guardar e usar apenas nos fins de semana.",
        efeito: { saude: -25, dinheiro: -20, consciencia: -15 },
        feedback: "Gasto desnecessário e risco alto. O uso de fim de semana quase sempre evolui para o uso diário compulsivo.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Fico em dúvida e deixo para experimentar quando estiver sozinho.",
        efeito: { saude: -10, consciencia: -10 },
        feedback: "Usar escondido aumenta o isolamento e mascara os riscos de intoxicação.",
        correta: false,
      },
    ],
  },
  {
    id: 2,
    fase: 1,
    dificuldade: "fácil",
    tema: "apostas",
    enunciado: "Um anúncio pop-up promete dobrar R$ 20 se você se cadastrar hoje numa plataforma de apostas esportivas. Como agir?",
    opcoes: [
      {
        letra: "A",
        texto: "Deposito os R$ 20 para testar minha sorte na partida de futebol.",
        efeito: { dinheiro: -20, consciencia: -10 },
        feedback: "A promoção de bônus é uma isca projetada por algoritmos para criar o hábito diário de apostar.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Ignoro a oferta, fecho o anúncio e guardo o dinheiro para meus projetos reais.",
        efeito: { dinheiro: 15, consciencia: 15, familia: 5 },
        feedback: "Muito bem! Você não caiu no gatilho do dinheiro fácil e protegeu sua renda.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Compartilho o link com 5 amigos para tentar ganhar comissões de indicação.",
        efeito: { dinheiro: -10, familia: -10, consciencia: -15 },
        feedback: "Indicar plataformas de apostas expõe seus amigos e familiares a prejuízos financeiros.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Crio uma conta falsa usando o CPF de um parente para jogar sem risco.",
        efeito: { familia: -25, consciencia: -20 },
        feedback: "Usar dados de terceiros sem autorização é perigoso e abala a confiança familiar.",
        correta: false,
      },
    ],
  },
  {
    id: 3,
    fase: 1,
    dificuldade: "fácil",
    tema: "hábitos",
    enunciado: "Você está sobrecarregado com provas e tarefas. Um amigo sugere tomar energéticos misturados com remédios para ficar acordado. O que você faz?",
    opcoes: [
      {
        letra: "A",
        texto: "Tomo a mistura, pois preciso terminar tudo de qualquer jeito.",
        efeito: { saude: -30, consciencia: -15 },
        feedback: "Perigoso! Misturar estimulantes sobrecarrega o coração e pode provocar arritmias graves e crises de ansiedade.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Organizo meu tempo, durmo o necessário e peço ajuda aos professores ou família.",
        efeito: { saude: 15, familia: 10, consciencia: 15 },
        feedback: "A escolha certa! Boa rotina de sono e pedidos de apoio são as ferramentas mais saudáveis contra o estresse.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Tomo só metade da dose para não exagerar.",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Automedicação sem prescrição médica nunca é segura, mesmo em doses reduzidas.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Fico sem dormir a noite toda jogando no celular para aliviar.",
        efeito: { saude: -20, consciencia: -10 },
        feedback: "Privação de sono piora a memória, o humor e aumenta o risco de impulsividade.",
        correta: false,
      },
    ],
  },
  {
    id: 4,
    fase: 1,
    dificuldade: "fácil",
    tema: "apostas",
    enunciado: "Na saída da escola, colegas apostam R$ 10 em um jogo de cartas valendo dinheiro. Convidam você a entrar. Qual a atitude mais consciente?",
    opcoes: [
      {
        letra: "A",
        texto: "Entro apenas uma vez para não ficar de fora do grupo.",
        efeito: { dinheiro: -10, consciencia: -5 },
        feedback: "Apostar por pressão social normaliza o jogo com dinheiro e pode criar vícios prematuros.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Proponho jogarmos apenas por diversão, sem envolver dinheiro de ninguém.",
        efeito: { consciencia: 15, familia: 5, dinheiro: 10 },
        feedback: "Ótima liderança! O lazer compartilhado não precisa de apostas para ser divertido e saudável.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Aposto R$ 20 para mostrar que tenho mais coragem que os outros.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Competir por status financeiro é porta de entrada para perdas descontroladas.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Empresto meu dinheiro para um colega apostar e cobrar com juros.",
        efeito: { familia: -10, consciencia: -10 },
        feedback: "Financiar apostas de terceiros desgasta amizades e gera conflitos sérios.",
        correta: false,
      },
    ],
  },

  // ==================== FASE 2: MÉDIO (Casas 7 a 14) ====================
  {
    id: 5,
    fase: 2,
    dificuldade: "médio",
    tema: "drogas",
    enunciado: "Em um evento noturno, colocam bebidas com substâncias desconhecidas no copo de alguém do grupo. O que você faz imediatamente?",
    opcoes: [
      {
        letra: "A",
        texto: "Alertei a pessoa, descarto o copo e busco auxílio com a segurança do evento.",
        efeito: { saude: 15, familia: 10, consciencia: 20 },
        feedback: "Decisão corajosa e protetiva! A intervenção rápida evita intoxicações graves e crimes de vulnerabilidade.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Deixo para lá, pois cada um deve cuidar do seu próprio copo.",
        efeito: { consciencia: -20, familia: -10 },
        feedback: "A omissão coloca a integridade do seu amigo em risco severo. Cuidar do outro fortalece o grupo.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Bebo um pouco do copo para tentar identificar o que colocaram.",
        efeito: { saude: -30, consciencia: -20 },
        feedback: "Nunca consuma líquidos sob suspeita. Substâncias adulteradas podem causar desmaios e paradas cardíacas.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Filmo a situação para postar nas redes sociais antes de avisar.",
        efeito: { consciencia: -15, familia: -10 },
        feedback: "Priorize o socorro à vida antes de qualquer registro em redes sociais.",
        correta: false,
      },
    ],
  },
  {
    id: 6,
    fase: 2,
    dificuldade: "médio",
    tema: "apostas",
    enunciado: "Você acabou de perder R$ 150 em apostas online. Sente raiva e a vontade incontrolável de apostar mais R$ 200 para 'recuperar'. O que faz?",
    opcoes: [
      {
        letra: "A",
        texto: "Aumento o valor da aposta na certeza de que a sorte vai virar agora.",
        efeito: { dinheiro: -35, saude: -15, consciencia: -20 },
        feedback: "Esse é o clássico 'efeito perseguição' (chasing losses). A máquina é programada matematicamente para aumentar sua perda.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Reconheço o prejuízo, fecho o app imediatamente e conto o ocorrido a alguém de confiança.",
        efeito: { consciencia: 20, familia: 15, dinheiro: 5 },
        feedback: "Parabéns! Interromper o impulso e aceitar a perda pontual é o ato que impede o endividamento catastrófico.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Peço dinheiro emprestado com a promessa de devolver com o lucro da próxima aposta.",
        efeito: { dinheiro: -30, familia: -25, consciencia: -20 },
        feedback: "Pedir dinheiro emprestado para apostar é um dos sintomas mais graves do transtorno do jogo compulsivo.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Mudo para o 'jogo do tigrinho' ou roleta porque dizem que paga mais rápido.",
        efeito: { dinheiro: -25, consciencia: -15 },
        feedback: "Cassinos online possuem margem matemática da casa de até 97% a favor deles. Não há estratégia que vença o algoritmo.",
        correta: false,
      },
    ],
  },
  {
    id: 7,
    fase: 2,
    dificuldade: "médio",
    tema: "drogas",
    enunciado: "Um colega próximo mudou de comportamento, falta às aulas e pede dinheiro com desculpas vagas para manter o uso diário de drogas. Como ajudá-lo?",
    opcoes: [
      {
        letra: "A",
        texto: "Empresto o dinheiro para evitar que ele fique agressivo ou em abstinência.",
        efeito: { dinheiro: -15, familia: -10, consciencia: -10 },
        feedback: "Financiar o uso sem querer adia a busca por ajuda médica e aprofunda a dependência.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Escuto com empatia, não financio o consumo e busco orientação no CAPS ou serviço de saúde.",
        efeito: { familia: 20, consciencia: 20, saude: 10 },
        feedback: "Atitude perfeita! Acolher sem julgar e orientar para serviços públicos gratuitos como o CAPS-AD salva vidas.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Espalho a fofoca para todos na escola para forçá-lo a mudar.",
        efeito: { familia: -20, consciencia: -20 },
        feedback: "Expor a vulnerabilidade alheia gera humilhação e afasta a pessoa da rede de apoio necessária.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Corto amizade de vez e bloqueio o contato para não me incomodar.",
        efeito: { familia: -10, consciencia: -10 },
        feedback: "O isolamento social é o principal combustível do agravamento do vício.",
        correta: false,
      },
    ],
  },
  {
    id: 8,
    fase: 2,
    dificuldade: "médio",
    tema: "apostas",
    enunciado: "Influenciadores digitais famosos exibem carros de luxo afirmando que enriqueceram com 'robôs de sinais' de apostas. Qual a verdade por trás disso?",
    opcoes: [
      {
        letra: "A",
        texto: "Eles ganham dinheiro recebendo comissões por cada perda dos seguidores que cadastram.",
        efeito: { consciencia: 20, dinheiro: 15, familia: 5 },
        feedback: "Exatamente! Contratos de afiliação pagam aos influenciadores uma porcentagem das perdas financeiras do público que eles enganam.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Acredito e compro o robô de sinais por R$ 97 para lucrar como eles.",
        efeito: { dinheiro: -30, consciencia: -15 },
        feedback: "Golpe comum. Contas de demonstração são manipuladas para mostrar lucros falsos em vídeos gravados.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Sigo os sinais deles apenas de madrugada, quando o sistema supostamente falha.",
        efeito: { dinheiro: -20, saude: -15, consciencia: -10 },
        feedback: "Não existem horários de falha. Os cassinos operam com geradores de números aleatórios certificados contra o jogador.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Aposto o dinheiro da conta de luz familiar confiando no influenciador.",
        efeito: { dinheiro: -40, familia: -30, consciencia: -25 },
        feedback: "Comprometer recursos vitais da família gera crises profundas e sofrimento evitável.",
        correta: false,
      },
    ],
  },

  // ==================== FASE 3: DIFÍCIL (Casas 15 a 22) ====================
  {
    id: 9,
    fase: 3,
    dificuldade: "difícil",
    tema: "drogas",
    enunciado: "Uma pessoa entra em crise de abstinência grave por dependência química. A família está desesperada sem saber para onde ligar. Qual é a orientação correta?",
    opcoes: [
      {
        letra: "A",
        texto: "Trancar a pessoa no quarto escuro até os sintomas passarem sozinhos.",
        efeito: { saude: -40, familia: -25, consciencia: -25 },
        feedback: "Abstinência severa pode provocar convulsões, alucinações e risco de óbito. Exige supervisão médica imediata.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Acionar o SAMU (192) ou levar ao CAPS-AD/Pronto Atendimento SUS para acolhimento médico especializado.",
        efeito: { saude: 25, familia: 25, consciencia: 25 },
        feedback: "Excelente! O SUS oferece tratamento multidisciplinar gratuito (médicos, psicólogos, terapeutas) pelo CAPS-AD e rede hospitalar.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Oferecer bebidas alcoólicas fortes para tentar acalmar o sistema nervoso.",
        efeito: { saude: -35, consciencia: -20 },
        feedback: "Misturar depressores do sistema nervoso pode provocar coma e colapso cardiorrespiratório.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Chamar curandeiros da internet que cobram fortunas por receitas milagrosas.",
        efeito: { dinheiro: -30, familia: -20, saude: -20 },
        feedback: "Golpistas se aproveitam do desespero das famílias. Confie na ciência, no SUS e em profissionais habilitados.",
        correta: false,
      },
    ],
  },
  {
    id: 10,
    fase: 3,
    dificuldade: "difícil",
    tema: "apostas",
    enunciado: "Um familiar perdeu o emprego e começou a passar noites inteiras apostando online, acumulando dívidas com agiotas. Como agir de forma resolutiva?",
    opcoes: [
      {
        letra: "A",
        texto: "Pagar todas as dívidas dele em segredo para não preocupar o restante da família.",
        efeito: { dinheiro: -40, familia: -20, consciencia: -10 },
        feedback: "Pagar dívidas sem tratar o vício apenas alimenta o ciclo. O jogador volta a apostar pois não enfrentou o problema.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Reunir a família com amor, bloquear acessos bancários com consentimento e buscar atendimento psicológico especializado.",
        efeito: { familia: 25, consciencia: 25, dinheiro: 15, saude: 10 },
        feedback: "Perfeito! O transtorno do jogo patológico é classificado pela OMS como doença. Proteção financeira e terapia são os pilares da recuperação.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Incentivar ele a apostar no time do coração para 'virar a sorte' de uma vez.",
        efeito: { dinheiro: -35, familia: -25, consciencia: -20 },
        feedback: "Apostas emocionais aumentam o desespero e aprofundam a ruína financeira.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Expulsar a pessoa de casa sem direito a diálogo ou busca por tratamento.",
        efeito: { familia: -30, saude: -20, consciencia: -15 },
        feedback: "A rejeição radical pode empurrar o indivíduo para a marginalidade ou desfechos fatais.",
        correta: false,
      },
    ],
  },
  {
    id: 11,
    fase: 3,
    dificuldade: "difícil",
    tema: "drogas",
    enunciado: "Após meses em recuperação, um colega tem uma recaída e consome álcool/substâncias em um momento de dor emocional. Como interpretar a situação?",
    opcoes: [
      {
        letra: "A",
        texto: "Compreender que recaídas fazem parte do processo crônico de recuperação e encorajar o retorno imediato ao tratamento.",
        efeito: { consciencia: 25, familia: 20, saude: 15 },
        feedback: "Visão madura e científica! Uma recaída não anula todo o progresso feito. O apoio rápido restabelece o caminho da sobriedade.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Condená-lo como caso perdido e dizer que o tratamento nunca funcionará para ele.",
        efeito: { familia: -25, consciencia: -25, saude: -15 },
        feedback: "O estigma e o julgamento destrutivo levam ao abandono do tratamento e ao agravamento da crise.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Celebrar com ele, fingindo que a recaída é algo normal e sem importância.",
        efeito: { saude: -25, consciencia: -20 },
        feedback: "Minimizar o risco impede que a pessoa reconheça os gatilhos que causaram o tropeço.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Aconselhar que ele só procure ajuda se tiver uma overdose grave.",
        efeito: { saude: -35, consciencia: -30 },
        feedback: "Esperar o extremo pode ser fatal. A intervenção precoce é a chave para salvar vidas.",
        correta: false,
      },
    ],
  },
  {
    id: 12,
    fase: 3,
    dificuldade: "difícil",
    tema: "apostas",
    enunciado: "Você chega à etapa final de suas decisões na vida. O que define uma pessoa verdadeiramente vitoriosa e realizada?",
    opcoes: [
      {
        letra: "A",
        texto: "Vencer acumulando o máximo de dinheiro em apostas de alto risco, mesmo sacrificando saúde e família.",
        efeito: { dinheiro: -20, familia: -25, saude: -20 },
        feedback: "O dinheiro passageiro não compensa a perda dos vínculos afetivos, da paz mental e da integridade física.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Equilibrar saúde, família, estabilidade e consciência, sabendo dizer não às ilusões e apoiando quem precisa.",
        efeito: { saude: 30, dinheiro: 25, familia: 30, consciencia: 30 },
        feedback: "Sensacional! Esse é o verdadeiro Grande Campeão da Vida: aquele que constrói um futuro sólido com escolhas reais e conscientes!",
        correta: true,
      },
      {
        letra: "C",
        texto: "Viver sem regras e sem pensar nas consequências de amanhã.",
        efeito: { saude: -20, consciencia: -20, familia: -15 },
        feedback: "Viver no imediatismo gera vazios e dependências difíceis de reparar mais tarde.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Acreditar que o sucesso depende exclusivamente de sorte e apostas.",
        efeito: { dinheiro: -25, consciencia: -25 },
        feedback: "Sorte é ilusão comercial. Sucesso duradouro nasce de constância, estudo, respeito e saúde emocional.",
        correta: false,
      },
    ],
  },
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
        "O corpo sentiu as consequências do uso de substâncias e noites em claro. A dependência química é uma doença e tem tratamento gratuito pelo SUS — acolhimento no CAPS-AD e na UBS é o caminho para recomeçar.",
      tom: "ruim",
    };
  if (p.dinheiro <= 15)
    return {
      titulo: "Final: Afundado em dívidas de apostas",
      descricao:
        "As plataformas de apostas levaram economias e geraram dívidas difíceis. A casa de apostas foi programada para lucrar — quem aposta repetidamente sempre perde. Reorganizar as finanças e buscar apoio é urgente.",
      tom: "ruim",
    };
  if (p.familia <= 15)
    return {
      titulo: "Final: Afastado de quem ama",
      descricao:
        "Mentiras e segredos afastaram os familiares e amigos mais leais. O isolamento alimenta o ciclo do vício. Pedir desculpas e reconstruir a confiança é o primeiro passo para ter paz de novo.",
      tom: "ruim",
    };
  if (total >= 280)
    return {
      titulo: "Final: Livre, Consciente & Campeão",
      descricao:
        "Você resistiu à pressão social, identificou as armadilhas das apostas e escolheu hábitos que protegem sua saúde física e mental. Você é inspiração e referência de prevenção para todos ao seu redor!",
      tom: "bom",
    };
  if (total >= 200)
    return {
      titulo: "Final: De pé, com aprendizados",
      descricao:
        "Você enfrentou momentos difíceis e tentações, mas soube pedir ajuda e reconhecer erros a tempo. A maturidade nasce de saber se reerguer e manter o rumo certo.",
      tom: "medio",
    };
  return {
    titulo: "Final: Na corda bamba",
    descricao:
      "Você chegou ao fim ainda vulnerável às promessas fáceis e às pressões de grupo. Lembre-se: sempre há tempo de procurar uma UBS, o CAPS-AD ou conversar francamente com quem quer o seu bem.",
    tom: "ruim",
  };
}
