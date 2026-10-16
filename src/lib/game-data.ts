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
export type TemaPergunta = "drogas" | "apostas" | "hábitos" | "pressão social" | "redes sociais";

export type Pergunta = {
  id: number;
  fase: 1 | 2 | 3;
  dificuldade: Dificuldade;
  tema: TemaPergunta;
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

// 20 CASAS: fases 1–7, 8–14 e 15–20. Minigame exclusivo na casa 15.
export const TABULEIRO: Casa[] = [
  { numero: 1, fase: 1, tipo: "inicio", rotulo: "Ponto de Partida", subtitulo: "Início da Jornada", icone: "Compass" },
  { numero: 2, fase: 1, tipo: "pergunta", rotulo: "Casa da Família", subtitulo: "Diálogo & Vínculos", icone: "Home" },
  { numero: 3, fase: 1, tipo: "pergunta", rotulo: "Escola & Estudos", subtitulo: "Conhecimento & Futuro", icone: "GraduationCap" },
  { numero: 4, fase: 1, tipo: "pergunta", rotulo: "Praça de Esportes", subtitulo: "Lazer Saudável", icone: "Activity" },
  { numero: 5, fase: 1, tipo: "pergunta", rotulo: "Roda de Amigos", subtitulo: "Convivência Diária", icone: "Users" },
  { numero: 6, fase: 1, tipo: "pergunta", rotulo: "Primeiro Convite", subtitulo: "Saber Dizer Não", icone: "Sparkles" },
  { numero: 7, fase: 1, tipo: "pergunta", rotulo: "Mesada Consciente", subtitulo: "Planejar Gastos", icone: "CircleDollarSign" },
  { numero: 8, fase: 2, tipo: "pergunta", rotulo: "Redes Sociais", subtitulo: "Influência Digital", icone: "Smartphone" },
  { numero: 9, fase: 2, tipo: "pergunta", rotulo: "Hobby Saudável", subtitulo: "Tempo Livre", icone: "Award" },
  { numero: 10, fase: 2, tipo: "pergunta", rotulo: "Checkpoint 1", subtitulo: "Primeiras Escolhas", icone: "ShieldCheck" },
  { numero: 11, fase: 2, tipo: "pergunta", rotulo: "Festa de Sexta", subtitulo: "Pressão de Grupo", icone: "Sparkles" },
  { numero: 12, fase: 2, tipo: "pergunta", rotulo: "Feed do Celular", subtitulo: "Anúncios de Apostas", icone: "Smartphone" },
  { numero: 13, fase: 2, tipo: "pergunta", rotulo: "Jogos Online", subtitulo: "Armadilhas de Bets", icone: "Gamepad2" },
  { numero: 14, fase: 2, tipo: "pergunta", rotulo: "Balcão de Tentação", subtitulo: "Ofertas Fáceis", icone: "AlertTriangle" },
  { numero: 15, fase: 3, tipo: "minigame", rotulo: "Desafio Especial", subtitulo: "Minigame", icone: "Star" },
  { numero: 16, fase: 3, tipo: "pergunta", rotulo: "Primeiro Salário", subtitulo: "Gestão do Dinheiro", icone: "CircleDollarSign" },
  { numero: 17, fase: 3, tipo: "pergunta", rotulo: "Grupo de Mensagens", subtitulo: "Links Suspeitos", icone: "MessageSquare" },
  { numero: 18, fase: 3, tipo: "pergunta", rotulo: "Fim de Noite", subtitulo: "Limites Pessoais", icone: "Moon" },
  { numero: 19, fase: 3, tipo: "apoio", rotulo: "Rede de Apoio", subtitulo: "UBS & CAPS-AD", icone: "LifeBuoy" },
  { numero: 20, fase: 3, tipo: "final", rotulo: "O Futuro Chegou!", subtitulo: "Vitória das Escolhas", icone: "Trophy" },
];

export const PERGUNTAS: Pergunta[] = [
  // ==================== FASE 1: FÁCIL (Casas 1 a 7) ====================
  {
    id: 1,
    fase: 1,
    dificuldade: "fácil",
    tema: "drogas",
    enunciado: "Numa festa entre amigos, alguém oferece um cigarro eletrônico (vape) com sabor de frutas dizendo ser apenas vapor de água inofensivo. O que você faz?",
    opcoes: [
      {
        letra: "A",
        texto: "Dou só uma tragada curta para não passar vergonha na roda de colegas.",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Atenção: uma única tragada de vape pode liberar tanta nicotina quanto vários cigarros convencionais, iniciando a dependência respiratória.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Guardo o aparelho no bolso para experimentar mais tarde em casa sozinho.",
        efeito: { saude: -10, familia: -10, consciencia: -10 },
        feedback: "Consumir substâncias escondido aumenta a sensação de isolamento e camufla os riscos de intoxicação química.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Recuso com firmeza, ciente de que o vapor contém nicotina em alta dose e solventes cancerígenos.",
        efeito: { saude: 15, consciencia: 20, familia: 10 },
        feedback: "Decisão exemplar! Vapes contêm substâncias tóxicas, metais pesados e criam uma dependência química extremamente rápida.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Troco meu lanche pelo aparelho para usar apenas nos fins de semana com a turma.",
        efeito: { saude: -20, dinheiro: -15, consciencia: -15 },
        feedback: "O uso casual nos finais de semana quase sempre evolui para consumo diário compulsivo e prejuízo financeiro contínuo.",
        correta: false,
      },
    ],
  },
  {
    id: 2,
    fase: 1,
    dificuldade: "fácil",
    tema: "apostas",
    enunciado: "Um anúncio pop-up no celular promete dobrar R$ 20 via PIX se você se cadastrar agora em uma plataforma de apostas esportivas. Como você reage?",
    opcoes: [
      {
        letra: "A",
        texto: "Ignoro e fecho a aba, pois bônus de boas-vindas são iscas algorítmicas para induzir o hábito do jogo.",
        efeito: { dinheiro: 15, consciencia: 20, familia: 5 },
        feedback: "Perfeito! As plataformas utilizam bônus fictícios para capturar novos usuários e induzi-los a apostar dinheiro real sucessivamente.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Deposito os R$ 20 para testar minha intuição em uma partida de futebol da rodada.",
        efeito: { dinheiro: -20, consciencia: -10 },
        feedback: "Cuidado! Apostar com a ilusão de 'dinheiro fácil' abre caminho para o ciclo de pequenas perdas repetitivas.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Crio uma conta usando os dados de um familiar para não arriscar meu CPF.",
        efeito: { familia: -25, consciencia: -20 },
        feedback: "Utilizar dados de parentes sem consentimento é infração grave e quebra irremediavelmente a confiança dentro de casa.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Compartilho o link com 5 amigos da escola para tentar faturar comissões de indicação.",
        efeito: { dinheiro: -10, familia: -10, consciencia: -15 },
        feedback: "Disseminar links de apostas entre amigos arrasta outras pessoas para riscos financeiros e prejuízos emocionais.",
        correta: false,
      },
    ],
  },
  {
    id: 3,
    fase: 1,
    dificuldade: "fácil",
    tema: "hábitos",
    enunciado: "Em semana de provas finais, um colega sugere misturar bebidas energéticas com remédios para não dormir e estudar a madrugada toda. Qual é a melhor decisão?",
    opcoes: [
      {
        letra: "A",
        texto: "Aceito a mistura e tomo duas latas para garantir nota máxima sem interrupção.",
        efeito: { saude: -30, consciencia: -15 },
        feedback: "Altamente arriscado! A mistura sobrecarrega os batimentos cardíacos, eleva a pressão e pode provocar crises severas de arritmia.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Tomo só um gole pequeno para ver se realmente me deixa alerta e focado.",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Misturas químicas desconhecidas sem prescrição médica nunca são seguras, mesmo ingeridas em pequenas quantidades.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Fico sem dormir apenas jogando no celular para aliviar o estresse da prova de manhã.",
        efeito: { saude: -20, consciencia: -10 },
        feedback: "A privação de sono prejudica a retenção da memória e compromete o raciocínio exatamente no momento da prova.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Recuso a mistura, planejo um cronograma de estudos e priorizo horas de sono para fixar o aprendizado.",
        efeito: { saude: 20, consciencia: 20, familia: 10 },
        feedback: "Excelente! É durante o sono REM que o cérebro consolida a memória de longo prazo; descansar é parte essencial do aprendizado.",
        correta: true,
      },
    ],
  },
  {
    id: 4,
    fase: 1,
    dificuldade: "fácil",
    tema: "pressão social",
    enunciado: "Durante o recreio, um grupo de colegas está apostando R$ 10 em um jogo de cartas e insiste para que você participe para 'mostrar que é parceiro'. Como você age?",
    opcoes: [
      {
        letra: "A",
        texto: "Entro na aposta só dessa vez para que parem de me zoar e não me achem covarde.",
        efeito: { dinheiro: -10, consciencia: -10 },
        feedback: "Ceder à pressão por medo de reprovação enfraquece sua autonomia e normaliza o hábito perigoso de apostar.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Proponho jogarmos apenas por diversão e integração, sem envolver dinheiro de ninguém.",
        efeito: { consciencia: 20, familia: 10, dinheiro: 10 },
        feedback: "Ótima liderança! O jogo em grupo deve promover convivência saudável e diversão, sem transformar amigos em rivais financeiros.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Empresto dinheiro para outro colega apostar em meu nome para ver o que acontece.",
        efeito: { dinheiro: -15, consciencia: -10 },
        feedback: "Financiar apostas de colegas gera conflitos, cobranças desconfortáveis e perdas financeiras desnecessárias.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Aposto R$ 50 para provar que tenho mais coragem e dinheiro do que todos ali juntos.",
        efeito: { dinheiro: -30, consciencia: -20 },
        feedback: "Buscar validação social arriscando dinheiro é porta de entrada para perdas financeiras descontroladas e frustração.",
        correta: false,
      },
    ],
  },
  {
    id: 5,
    fase: 1,
    dificuldade: "fácil",
    tema: "redes sociais",
    enunciado: "Você percebe que passa mais de 5 horas todas as noites rolando vídeos curtos nas redes sociais, acordando cansado e sem concentração na escola. O que fazer?",
    opcoes: [
      {
        letra: "A",
        texto: "Defino limites de tempo no app, deixo o celular longe da cama e retomo uma rotina de sono saudável.",
        efeito: { saude: 20, consciencia: 20, familia: 10 },
        feedback: "Parabéns! Romper o ciclo de dopamina barata dos feeds infinitos restaura sua clareza mental, energia diária e foco escolar.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Continuo acordado até de madrugada, pois todo mundo da minha idade faz o mesmo.",
        efeito: { saude: -20, consciencia: -15 },
        feedback: "A normalização de hábitos nocivos não anula suas consequências biológicas: queda de rendimento e alterações de humor constantes.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Tomo café extra e energético pela manhã para compensar as noites mal dormidas.",
        efeito: { saude: -25, consciencia: -10 },
        feedback: "Estimulantes artificiais apenas mascaram o cansaço sem restaurar as funções neurais restauradas pelo sono natural.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Desinstalo tudo em segredo e minto para meus amigos dizendo que fui roubado.",
        efeito: { familia: -15, consciencia: -10 },
        feedback: "Mentir para disfarçar dificuldades emocionais gera culpa e dificulta a construção de limites maduros e transparentes.",
        correta: false,
      },
    ],
  },
  {
    id: 6,
    fase: 1,
    dificuldade: "fácil",
    tema: "drogas",
    enunciado: "Na saída da escola, conhecidos convidam você para fumar narguilé em uma praça, alegando que 'não vicia e filtra tudo na água'. Qual é a realidade?",
    opcoes: [
      {
        letra: "A",
        texto: "Vou junto e fumo bastante, já que o narguilé parece inofensivo e tem essência cheirosa de menta.",
        efeito: { saude: -25, consciencia: -15 },
        feedback: "Falso senso de segurança: essências aromáticas apenas disfarçam a agressão tóxica aos pulmões e à circulação sanguínea.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Fico na roda segurando a mangueira só para tirar fotos legais para postar nas redes sociais.",
        efeito: { consciencia: -10, saude: -10 },
        feedback: "A inalação passiva da queima do carvão também absorve monóxido de carbono e metais pesados em grandes quantidades.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Não participo, pois uma sessão de narguilé equivale a inalar a fumaça de cerca de 100 cigarros comuns em toxinas.",
        efeito: { saude: 20, consciencia: 20, familia: 10 },
        feedback: "Muito consciente! Estudos da OMS comprovam que a água não filtra as substâncias tóxicas nem o monóxido de carbono do carvão.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Sugiro trocar o narguilé por bebidas alcoólicas na praça pública.",
        efeito: { saude: -20, consciencia: -15 },
        feedback: "Trocar uma substância prejudicial por outra continua expondo a saúde a danos e ao risco de dependência precoce.",
        correta: false,
      },
    ],
  },
  {
    id: 7,
    fase: 1,
    dificuldade: "fácil",
    tema: "hábitos",
    enunciado: "Você recebeu sua primeira mesada ou bolsa de jovem aprendiz. Qual a atitude financeira mais protetiva e consciente para o seu futuro?",
    opcoes: [
      {
        letra: "A",
        texto: "Gasto todo o valor no primeiro dia em compras por impulso e lanches caros para ostentar.",
        efeito: { dinheiro: -25, consciencia: -10 },
        feedback: "O imediatismo consumista gera dependência financeira constante e impede a construção de metas e segurança futura.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Separo uma parte para poupança e cursos, cubro despesas reais e reservo um limite saudável para lazer.",
        efeito: { dinheiro: 25, consciencia: 20, familia: 10 },
        feedback: "Visão madura! Aprender a gerir os primeiros recursos desenvolve independência, disciplina e estabilidade a longo prazo.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Coloco metade do valor em rifas digitais esperando multiplicar rapidamente a quantia recebida.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Rifas e sorteios virtuais não regulamentados têm probabilidade de ganho ínfima e costumam drenar o orçamento juvenil.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Empresto o valor total para conhecidos sem saber quando eles poderão devolver.",
        efeito: { dinheiro: -20, familia: -10 },
        feedback: "Disponibilizar todo o seu recurso sem garantias fragiliza sua segurança pessoal e pode gerar conflitos relacionais.",
        correta: false,
      },
    ],
  },
  {
    id: 8,
    fase: 1,
    dificuldade: "fácil",
    tema: "apostas",
    enunciado: "Em um jogo de videogame com compras internas, surge uma 'loot box' (caixa misteriosa) que custa dinheiro real para tentar tirar uma skin rara. O que fazer?",
    opcoes: [
      {
        letra: "A",
        texto: "Uso o cartão dos meus pais sem avisar para comprar várias caixas até conseguir a skin rara.",
        efeito: { familia: -30, dinheiro: -25, consciencia: -20 },
        feedback: "Usar cartões familiares sem autorização é quebra grave de confiança e pode causar sérios transtornos financeiros no lar.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Compro todas as caixas possíveis com o dinheiro que seria do meu lanche escolar da semana.",
        efeito: { dinheiro: -20, saude: -15, consciencia: -15 },
        feedback: "Privar-se de alimentação adequada por cosméticos virtuais de chance aleatória é sinal de impulsividade prejudicial.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Vendo itens da minha conta para comprar moedas de roleta no jogo.",
        efeito: { dinheiro: -15, consciencia: -10 },
        feedback: "Alimentar o hábito da roleta em games reforça circuitos cerebrais similares aos caça-níqueis de cassinos reais.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Evito gastar em caixas aleatórias, reconhecendo que a mecânica replica o vício de caça-níqueis em jovens.",
        efeito: { dinheiro: 20, consciencia: 20, saude: 10 },
        feedback: "Excelente raciocínio crítico! Diversos países proíbem 'loot boxes' para menores por considerá-las apostas disfarçadas de game.",
        correta: true,
      },
    ],
  },
  {
    id: 9,
    fase: 1,
    dificuldade: "fácil",
    tema: "pressão social",
    enunciado: "Seus amigos começam a apelidar e excluir um colega de turma que se recusa a beber álcool nos encontros do grupo. Qual é o seu posicionamento?",
    opcoes: [
      {
        letra: "A",
        texto: "Entro na zoeira para não ser o próximo alvo de piadas do grupo de amigos.",
        efeito: { familia: -10, consciencia: -20 },
        feedback: "Apoiar agressões sociais por covardia enfraquece seu caráter e perpetua ambientes hostis e excludentes.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Me afasto e finjo que não vi nada acontecendo para não me indispor com ninguém.",
        efeito: { consciencia: -10 },
        feedback: "A omissão silenciosa valida comportamentos abusivos e deixa a pessoa vulnerável desamparada.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Defendo a escolha do colega, lembro que respeito é essencial e não compactuo com intimidação.",
        efeito: { consciencia: 25, familia: 15, saude: 10 },
        feedback: "Coragem moral admirável! Proteger a liberdade de escolha do outro fortalece relações verdadeiras e combate a pressão de grupo tóxica.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Convenço o colega a beber escondido só para agradar a turma e acabar logo com o assunto.",
        efeito: { saude: -15, consciencia: -15 },
        feedback: "Incentivar alguém a violar seus próprios princípios para agradar outros nunca é um ato de amizade verdadeira.",
        correta: false,
      },
    ],
  },
  {
    id: 10,
    fase: 1,
    dificuldade: "fácil",
    tema: "redes sociais",
    enunciado: "Um perfil de rede social promete um método 'secreto e garantido' de lucrar R$ 500 por dia com apostas se você pagar R$ 30 pelo curso. O que é isso?",
    opcoes: [
      {
        letra: "A",
        texto: "É um golpe clássico de afiliados que lucram vendendo falsas esperanças a jovens desavisados.",
        efeito: { dinheiro: 20, consciencia: 20, familia: 5 },
        feedback: "Na mosca! Não existem métodos garantidos em jogos de azar; o único lucro garantido é o de quem vende o suposto método.",
        correta: true,
      },
      {
        letra: "B",
        texto: "É uma oportunidade real que só pessoas espertas aproveitam antes que as vagas acabem.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "O gatilho de escassez ('últimas vagas') é técnica básica de persuasão para induzir compras precipitadas de esquemas fraudulentos.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Uma falha matemática que o criador de conteúdo descobriu e quer dividir por pura generosidade.",
        efeito: { dinheiro: -25, consciencia: -15 },
        feedback: "Cassinos e casas de aposta investem bilhões em segurança de software; não há falhas milagrosas acessíveis por R$ 30.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Um trabalho honesto de consultoria financeira digital recomendado por autoridades.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Jogos de azar não são investimentos nem trabalho formal. Tratar apostas como renda é o principal gatilho do endividamento precoce.",
        correta: false,
      },
    ],
  },
  {
    id: 11,
    fase: 1,
    dificuldade: "fácil",
    tema: "drogas",
    enunciado: "Sentindo muita ansiedade antes de uma apresentação na escola, um conhecido oferece um comprimido 'tarja preta' que ele pegou da gaveta da mãe. Como agir?",
    opcoes: [
      {
        letra: "A",
        texto: "Tomo o comprimido imediatamente para me acalmar rápido e não gaguejar na frente de todos.",
        efeito: { saude: -25, consciencia: -15 },
        feedback: "Perigoso! Medicamentos controlados exigem avaliação médica; podem causar sedação profunda, confusão mental e dependência física rápida.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Guardo o remédio na mochila para tomar se der dor de cabeça mais tarde no caminho.",
        efeito: { saude: -15, consciencia: -10 },
        feedback: "Portar e consumir medicamentos de tarja preta prescritos para terceiros coloca sua integridade em risco e configura infração sanitária.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Divido o comprimido ao meio para diminuir os efeitos colaterais e tomo metade.",
        efeito: { saude: -20, consciencia: -10 },
        feedback: "Fracionar doses sem indicação técnica não elimina o risco de reações alérgicas graves ou intoxicação medicamentosa.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Recuso prontamente e procuro a orientação pedagógica, família ou um médico para lidar com a ansiedade.",
        efeito: { saude: 20, consciencia: 25, familia: 15 },
        feedback: "Atitude corretíssima! Ansiedade situacional deve ser trabalhada com técnicas de respiração, diálogo e suporte de profissionais habilitados.",
        correta: true,
      },
    ],
  },
  {
    id: 12,
    fase: 1,
    dificuldade: "fácil",
    tema: "hábitos",
    enunciado: "Quando bate o tédio ou a frustração em casa, você nota o impulso automático de buscar prazer imediato em telas, apostas ou compras. Como quebrar esse ciclo?",
    opcoes: [
      {
        letra: "A",
        texto: "Alimentando a vontade e gastando ainda mais tempo no que traz alívio rápido e sem esforço.",
        efeito: { saude: -15, consciencia: -15 },
        feedback: "Recorrer a prazeres instantâneos sempre que houver frustração treina o cérebro para a dependência e a baixa tolerância ao estresse.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Praticando esportes, ouvindo música, lendo ou conversando com alguém de confiança sobre o que sinto.",
        efeito: { saude: 20, consciencia: 20, familia: 15 },
        feedback: "Sensacional! Construir fontes saudáveis de prazer e autorregulação emocional fortalece a resiliência neurológica contra vícios.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Ficando isolado no quarto escuro sem falar com ninguém por dias seguidos.",
        efeito: { saude: -15, familia: -20, consciencia: -10 },
        feedback: "O isolamento emocional agrava sentimentos de desamparo e costuma intensificar pensamentos autodestrutivos.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Buscando jogos de aposta gratuitos que depois cobram dinheiro de verdade para continuar.",
        efeito: { dinheiro: -15, consciencia: -15 },
        feedback: "Jogos gratuitos de cassino utilizam algoritmos viciantes calibrados para transicionar o usuário para apostas com dinheiro real.",
        correta: false,
      },
    ],
  },

  // ==================== FASE 2: MÉDIO (Casas 8 a 14) ====================
  {
    id: 13,
    fase: 2,
    dificuldade: "médio",
    tema: "apostas",
    enunciado: "Você perdeu R$ 100 em um jogo de apostas e sente uma raiva imensa acompanhada da urgência de apostar mais R$ 150 para 'recuperar'. O que fazer?",
    opcoes: [
      {
        letra: "A",
        texto: "Dobro a aposta na rodada seguinte porque a estatística diz que minha vez de ganhar chegou.",
        efeito: { dinheiro: -35, consciencia: -20, saude: -15 },
        feedback: "Essa é a falácia do apostador e o clássico 'efeito perseguição' (chasing losses). A probabilidade de perder tudo só aumenta.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Paro imediatamente, aceito o prejuízo como lição e fecho o aplicativo sem tentar recuperar perdas.",
        efeito: { consciencia: 25, dinheiro: 10, familia: 15 },
        feedback: "Excelente maturidade! Interromper o impulso de perseguição no momento da perda é o que separa um tropeço passageiro da ruína financeira.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Peço dinheiro emprestado a um amigo com promessa de juros para não perder a oportunidade.",
        efeito: { dinheiro: -30, familia: -25, consciencia: -20 },
        feedback: "Tomar empréstimos para sustentar apostas é um dos critérios diagnósticos mais agudos da ludopatia (transtorno do jogo patológico).",
        correta: false,
      },
      {
        letra: "D",
        texto: "Migro para a roleta do cassino online porque o resultado sai mais rápido e dinâmico.",
        efeito: { dinheiro: -30, saude: -15, consciencia: -15 },
        feedback: "Jogos mais rápidos aceleram a queima do saldo e impedem que a razão assimile o tamanho do prejuízo acumulado.",
        correta: false,
      },
    ],
  },
  {
    id: 14,
    fase: 2,
    dificuldade: "médio",
    tema: "drogas",
    enunciado: "Em uma festa, alguém coloca uma substância desconhecida no copo de uma pessoa do seu grupo que se descuidou. O que você faz imediatamente?",
    opcoes: [
      {
        letra: "A",
        texto: "Fico quieto para não estragar o clima da festa nem criar confusão com os outros presentes.",
        efeito: { consciencia: -25, familia: -15 },
        feedback: "A omissão coloca a integridade e a vida da outra pessoa em perigo extremo diante de substâncias desconhecidas.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Bebo um pouco para tentar descobrir o gosto e verificar se é realmente perigoso.",
        efeito: { saude: -40, consciencia: -20 },
        feedback: "Nunca ingira substâncias suspeitas! Drogas adulteradas podem causar reações alérgicas agudas, perda de consciência e coma.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Filmo a pessoa para postar nos stories e ganhar engajamento e visualizações.",
        efeito: { familia: -20, consciencia: -25 },
        feedback: "Expor a vulnerabilidade alheia é falta de empatia e crime contra a honra, além de atrasar o socorro indispensável.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Alerto a pessoa na hora, descarto o copo e busco ajuda com os organizadores ou socorro médico.",
        efeito: { saude: 20, consciencia: 25, familia: 15 },
        feedback: "Atitude heróica e protetiva! Intervenções rápidas previnem casos graves de intoxicação criminosa ('boa noite cinderela') e salvam vidas.",
        correta: true,
      },
    ],
  },
  {
    id: 15,
    fase: 2,
    dificuldade: "médio",
    tema: "pressão social",
    enunciado: "Em uma viagem com a galera, todos decidem beber até cair e zombam de quem prefere ficar lúcido, dizendo que 'quem não bebe é fraco'. Como você se posiciona?",
    opcoes: [
      {
        letra: "A",
        texto: "Mantenho minha decisão com firmeza, lembrando que maturidade é ser fiel aos próprios limites e saúde.",
        efeito: { saude: 20, consciencia: 25, familia: 15 },
        feedback: "Espetacular! A verdadeira força de caráter se demonstra quando você sustenta sua integridade diante da pressão da maioria.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Bebo escondido água fingindo ser destilado para enganar o grupo e me sentir aceito.",
        efeito: { consciencia: -10, familia: -5 },
        feedback: "Fingir comportamentos para ter aprovação ainda demonstra dependência da opinião alheia sobre suas escolhas pessoais.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Bebo até passar mal só para provar que sou tão corajoso e resistente quanto eles.",
        efeito: { saude: -35, consciencia: -20, familia: -15 },
        feedback: "O consumo desmedido de álcool (binge drinking) pode levar a coma alcoólico, vômitos com risco de asfixia e traumas graves.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Agrido verbalmente quem zombou de mim para impor respeito à força e na briga.",
        efeito: { familia: -15, consciencia: -15, saude: -10 },
        feedback: "Reagir com agressividade gera conflitos físicos perigosos e não resolve a raiz da pressão de grupo.",
        correta: false,
      },
    ],
  },
  {
    id: 16,
    fase: 2,
    dificuldade: "médio",
    tema: "apostas",
    enunciado: "Influenciadores digitais famosos postam vídeos com carrões e mansões, afirmando que ficaram ricos com um 'joguinho da internet'. Qual a realidade?",
    opcoes: [
      {
        letra: "A",
        texto: "Eles realmente enriqueceram com sua genialidade matemática nos jogos de azar online.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Ilusão comercial: jogos de azar são programados matematicamente para que a casa sempre lucre sobre os usuários comuns.",
        correta: false,
      },
      {
        letra: "B",
        texto: "O governo patrocina esses influenciadores para distribuir renda entre a população jovem.",
        efeito: { dinheiro: -25, consciencia: -20 },
        feedback: "Informação totalmente incorreta: casas de aposta são empresas privadas operando de paraísos fiscais com foco no lucro próprio.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Eles recebem contratos milionários pagos com base nas perdas reais dos seguidores que se cadastram.",
        efeito: { consciencia: 25, dinheiro: 15, familia: 10 },
        feedback: "Exato! Os contratos de afiliação de cassinos online pagam porcentagens das perdas líquidas geradas pelo público enganado.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Eles usam contas comuns e ganham honestamente jogando ao vivo sem truques nem roteiros.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Vídeos promocionais costumam utilizar contas de demonstração adulteradas com taxas de acerto infladas artificialmente.",
        correta: false,
      },
    ],
  },
  {
    id: 17,
    fase: 2,
    dificuldade: "médio",
    tema: "drogas",
    enunciado: "Um amigo próximo começa a faltar frequentemente às aulas, muda de humor e pede dinheiro emprestado com desculpas confusas para manter o uso diário de drogas. Como agir?",
    opcoes: [
      {
        letra: "A",
        texto: "Empresto o dinheiro para evitar que ele sofra abstinência ou fique chateado comigo.",
        efeito: { dinheiro: -20, familia: -15, consciencia: -15 },
        feedback: "Fornecer recursos financeiros facilita a continuidade do uso compulsivo e retarda o reconhecimento da dependência.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Espalho o que está acontecendo nas redes sociais para que a família dele tome vergonha.",
        efeito: { familia: -25, consciencia: -20 },
        feedback: "A humilhação pública destrói laços de confiança e empurra o indivíduo para um isolamento ainda mais profundo.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Corto o contato de vez e bloqueio o amigo sem tentar ajudá-lo de nenhuma forma.",
        efeito: { familia: -10, consciencia: -10 },
        feedback: "Abandonar sem orientação fecha as portas para o resgate; o apoio empático é essencial no início da recuperação.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Não financio o consumo, converso com carinho sem julgar e procuro orientação na escola, família ou CAPS.",
        efeito: { familia: 25, consciencia: 25, saude: 15 },
        feedback: "Equilíbrio perfeito! O acolhimento com limites claros e o direcionamento para profissionais especializados do SUS salvam trajetórias.",
        correta: true,
      },
    ],
  },
  {
    id: 18,
    fase: 2,
    dificuldade: "médio",
    tema: "redes sociais",
    enunciado: "Grupos de mensagens de apostas (como 'minas' e 'tigrinho') enviam alertas sonoros o dia todo incentivando depósitos rápidos. Qual impacto disso no cérebro?",
    opcoes: [
      {
        letra: "A",
        texto: "Nenhum impacto, o cérebro humano se acostuma facilmente sem desenvolver dependência.",
        efeito: { consciencia: -15, saude: -10 },
        feedback: "Notificações intermitentes exploram o sistema de reforço variável, o mecanismo biológico mais eficaz para induzir comportamentos viciantes.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Gera picos artificiais de dopamina e ansiedade contínua, condicionando o cérebro à compulsão.",
        efeito: { saude: 15, consciencia: 25, familia: 10 },
        feedback: "Constatação científica precisa! O estímulo sonoro constante ativa o sistema límbico, gerando ansiedade e perda de controle inibitório.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Ajuda a treinar a memória de trabalho e melhora o desempenho acadêmico em matemática.",
        efeito: { consciencia: -20, saude: -15 },
        feedback: "A distração repetitiva prejudica as redes neurais de foco sustentado e aumenta os sintomas de déficit de atenção.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Garante renda passiva estável se a pessoa silenciar o grupo durante o horário de sono.",
        efeito: { dinheiro: -25, consciencia: -15 },
        feedback: "Silenciar alertas não altera a matemática dos jogos: a longo prazo, apostadores frequentes perdem quase a totalidade dos valores apostados.",
        correta: false,
      },
    ],
  },
  {
    id: 19,
    fase: 2,
    dificuldade: "médio",
    tema: "hábitos",
    enunciado: "Após uma semana estressante, você percebe que gastou mais do que devia em saídas e compras impulsivas. Qual é a postura madura para o próximo mês?",
    opcoes: [
      {
        letra: "A",
        texto: "Tento recuperar o dinheiro apostando no time azarão do campeonato no domingo.",
        efeito: { dinheiro: -30, consciencia: -20 },
        feedback: "Tentar resolver deslizes orçamentários com apostas de alto risco quase sempre multiplica o buraco financeiro.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Finjo que nada aconteceu e continuo gastando no cartão de crédito rotativo dos pais.",
        efeito: { dinheiro: -35, familia: -25, consciencia: -15 },
        feedback: "Os juros do crédito rotativo estão entre os mais altos do país e podem transformar pequenas dívidas em bolas de neve impagáveis.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Analiso meu extrato com sinceridade, reduzo supérfluos e reestabeleço o controle do orçamento.",
        efeito: { dinheiro: 25, consciencia: 20, familia: 10 },
        feedback: "Atitude madura! Encarar a realidade financeira com disciplina e transparência é a chave da liberdade pessoal e estabilidade.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Deixo de comer e pagar contas essenciais para compensar o erro de forma drástica.",
        efeito: { saude: -25, consciencia: -10 },
        feedback: "Punições corporais drásticas geram estresse severo e costumam desencadear novos episódios de compulsão compensatória.",
        correta: false,
      },
    ],
  },
  {
    id: 20,
    fase: 2,
    dificuldade: "médio",
    tema: "drogas",
    enunciado: "No final de uma festa, a pessoa responsável pela carona bebeu muito álcool e insiste que 'dirige melhor bêbada'. Como você deve agir?",
    opcoes: [
      {
        letra: "A",
        texto: "Recuso entrar no carro, retenho as chaves com apoio de amigos e chamo um transporte por aplicativo.",
        efeito: { saude: 25, consciencia: 25, familia: 20 },
        feedback: "Decisão salvadora! O álcool reduz drasticamente o tempo de reflexo e a percepção de distância, sendo causa frequente de tragédias viárias.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Entro no carro e fecho os olhos rezando para chegarmos vivos em casa sem sermos parados.",
        efeito: { saude: -40, consciencia: -25 },
        feedback: "Entregar a própria vida a motoristas embriagados é assumir um risco altíssimo de acidentes com sequelas irreversíveis.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Sugiro que ela vá bem devagar pelo acostamento da rodovia para não chamar atenção.",
        efeito: { saude: -30, consciencia: -20 },
        feedback: "Dirigir pelo acostamento sob efeito de álcool é infração gravíssima e frequentemente resulta em atropelamentos fatais.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Deixo a pessoa dirigir e vou rindo filmando a imprudência no banco do passageiro.",
        efeito: { consciencia: -30, saude: -35, familia: -15 },
        feedback: "Incentivar e registrar condução perigosa é desrespeito à vida humana e cumplicidade em crimes de trânsito.",
        correta: false,
      },
    ],
  },
  {
    id: 21,
    fase: 2,
    dificuldade: "médio",
    tema: "apostas",
    enunciado: "Um amigo convida você para entrar em uma 'banca conjunta' de apostas esportivas, dizendo que juntando o dinheiro de 5 pessoas é impossível perder. O que é real?",
    opcoes: [
      {
        letra: "A",
        texto: "A probabilidade matemática de ganho aumenta e todos saem com lucro garantido a longo prazo.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "A probabilidade individual de cada evento não se altera pelo número de participantes cotistas da aposta.",
        correta: false,
      },
      {
        letra: "B",
        texto: "As chances matemáticas continuam contra o apostador, e bancas coletivas costumam destruir amizades.",
        efeito: { consciencia: 25, dinheiro: 15, familia: 15 },
        feedback: "Análise lúcida! Além de a vantagem estatística pertencer sempre à casa de aposta, perdas coletivas geram rancor e brigas sérias.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Se o grupo for disciplinado, as casas de aposta liberam bônus infinitos para os participantes.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Casas de aposta limitam e até bloqueiam contas lucrativas; o modelo de negócio delas depende matematicamente da perda dos clientes.",
        correta: false,
      },
      {
        letra: "D",
        texto: "O algoritmo das apostas favorece grupos de jovens por determinação de leis federais.",
        efeito: { consciencia: -20, dinheiro: -20 },
        feedback: "A legislação proíbe apostas para menores e impõe restrições severas sobre propagandas direcionadas a jovens.",
        correta: false,
      },
    ],
  },
  {
    id: 22,
    fase: 2,
    dificuldade: "médio",
    tema: "pressão social",
    enunciado: "Colegas gravam um vídeo constrangedor de alguém bêbado em uma resenha e querem criar um meme viral no colégio. Qual é a sua atitude?",
    opcoes: [
      {
        letra: "A",
        texto: "Curto e compartilho em todos os meus grupos para ter assunto com o pessoal da escola.",
        efeito: { familia: -15, consciencia: -25 },
        feedback: "Compartilhar registros vexatórios amplifica o sofrimento psicológico da vítima e pode configurar crime de difamação cibernética.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Ajudo a legendar o vídeo com piadas ainda mais pesadas sobre o estado da vítima.",
        efeito: { familia: -20, consciencia: -30 },
        feedback: "O cyberbullying gera traumas profundos, ansiedade fóbica e pode desencadear crises de depressão aguda na vítima.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Condeno o compartilhamento, alerto sobre o crime contra a dignidade e peço para apagarem o vídeo.",
        efeito: { consciencia: 25, familia: 15, saude: 10 },
        feedback: "Postura ética irretocável! Empatia e firmeza contra a cultura da humilhação virtual tornam os ambientes coletivos mais seguros.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Finjo que não vi e comento ironicamente no perfil da pessoa exposta para rir junto.",
        efeito: { consciencia: -20, familia: -10 },
        feedback: "A falsa neutralidade acompanhada de ironia corrobora a violência psicológica praticada pelo grupo.",
        correta: false,
      },
    ],
  },
  {
    id: 23,
    fase: 2,
    dificuldade: "médio",
    tema: "drogas",
    enunciado: "Um jovem consome maconha diariamente alegando que é 'natural e não faz mal'. O que os estudos de neurociência comprovam em cérebros jovens?",
    opcoes: [
      {
        letra: "A",
        texto: "O cérebro em desenvolvimento até os 21 anos pode sofrer redução de memória, foco e motivação crônica.",
        efeito: { saude: 20, consciencia: 25, familia: 10 },
        feedback: "Cientificamente comprovado: o córtex pré-frontal humano só amadurece aos 21-24 anos. O uso precoce compromete plasticidade e cognição.",
        correta: true,
      },
      {
        letra: "B",
        texto: "O uso contínuo melhora as sinapses neurais e estimula o raciocínio lógico em vestibulares.",
        efeito: { saude: -20, consciencia: -15 },
        feedback: "Evidências médicas mostram exatamente o oposto: declínio da velocidade de processamento e dificuldades de aprendizado complexo.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Por ser de origem vegetal, não possui nenhuma substância psicoativa capaz de causar dependência.",
        efeito: { saude: -25, consciencia: -20 },
        feedback: "O THC é uma substância altamente psicoativa com potencial documentado de dependência psicológica e quadros de síndrome amotivacional.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Substitui completamente tratamentos médicos para ansiedade sem nenhum efeito colateral.",
        efeito: { saude: -20, consciencia: -15 },
        feedback: "O uso recreativo pode deflagrar crises de pânico agudas e desencadear episódios psicóticos em indivíduos com predisposição genética.",
        correta: false,
      },
    ],
  },
  {
    id: 24,
    fase: 2,
    dificuldade: "médio",
    tema: "redes sociais",
    enunciado: "Você recebe uma mensagem de uma conta com uma 'oportunidade de trabalho home office' que exige pagar uma taxa de cadastro para começar a avaliar anúncios. O que fazer?",
    opcoes: [
      {
        letra: "A",
        texto: "Pago a taxa imediatamente usando o dinheiro reservado para o almoço da família.",
        efeito: { dinheiro: -30, familia: -20, consciencia: -15 },
        feedback: "Golpe clássico: uma vez paga a taxa inicial, os golpistas bloqueiam o usuário ou cobram novas taxas inexistentes.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Envio fotos dos meus documentos e cartões para garantir minha vaga prioritária de emprego.",
        efeito: { familia: -25, dinheiro: -25, consciencia: -20 },
        feedback: "Fornecer dados bancários e cópias de documentos expõe sua família a fraudes de identidade e empréstimos fraudulentos.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Convido parentes para pagarem a taxa junto comigo para que todos ganhem o dobro juntos.",
        efeito: { dinheiro: -35, familia: -30, consciencia: -25 },
        feedback: "Arrastar entes queridos para esquemas de pirâmide financeira causa perdas financeiras em cadeia e mágoas profundas.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Desconfio na hora, não pago nada e denuncio a conta, pois empregos reais não cobram taxas para contratar.",
        efeito: { dinheiro: 20, consciencia: 25, familia: 10 },
        feedback: "Perfeita leitura de risco! Empregos sérios pagam salário pelo seu trabalho; quem exige pagamento antecipado é estelionatário.",
        correta: true,
      },
    ],
  },

  // ==================== FASE 3: DIFÍCIL (Casas 15 a 20) ====================
  {
    id: 25,
    fase: 3,
    dificuldade: "difícil",
    tema: "drogas",
    enunciado: "Uma pessoa entra em crise de abstinência severa por substâncias químicas em casa: tremores incontroláveis, alucinações e taquicardia. Qual o protocolo de socorro?",
    opcoes: [
      {
        letra: "A",
        texto: "Trancar a pessoa no quarto escuro até a crise passar sozinha pela força de vontade pura.",
        efeito: { saude: -40, familia: -30, consciencia: -25 },
        feedback: "Negligência com risco de vida! Abstinências graves de depressores podem evoluir para convulsões, arritmias fatais e parada cardíaca.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Oferecer bebidas alcoólicas destiladas para tentar acalmar o sistema nervoso da pessoa.",
        efeito: { saude: -35, consciencia: -20 },
        feedback: "Misturar depressores e álcool em momentos de instabilidade autonômica pode induzir choque hipovolêmico ou coma profundo.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Dar banho de água gelada e obrigar a pessoa a fazer exercícios físicos pesados no quintal.",
        efeito: { saude: -30, consciencia: -20 },
        feedback: "Choques térmicos e esforço físico em estado febril e taquicárdico sobrecarregam perigosamente o músculo cardíaco.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Ligar para o SAMU (192) ou levar ao Pronto Atendimento/CAPS-AD, pois abstinência grave requer suporte médico urgente.",
        efeito: { saude: 30, familia: 30, consciencia: 30 },
        feedback: "Conduta médica impecável! O SUS oferece suporte hospitalar emergencial gratuito e humanizado para estabilizar o paciente com segurança.",
        correta: true,
      },
    ],
  },
  {
    id: 26,
    fase: 3,
    dificuldade: "difícil",
    tema: "apostas",
    enunciado: "Um jovem acumulou R$ 10.000 em dívidas de apostas online, pegou dinheiro com agiota e agora está sendo ameaçado. Como a família deve intervir de forma resolutiva?",
    opcoes: [
      {
        letra: "A",
        texto: "Fazer uma intervenção franca, buscar apoio jurídico/policial, assumir o controle financeiro com consentimento e iniciar terapia para jogo patológico.",
        efeito: { familia: 30, consciencia: 30, dinheiro: 20, saude: 15 },
        feedback: "Abordagem exemplar! O transtorno do jogo patológico é doença classificada pela OMS. Interromper o acesso ao dinheiro e tratar a mente salva o indivíduo.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Dar mais dinheiro para ele fazer uma 'aposta certeira' com cotação alta e quitar tudo de uma vez só.",
        efeito: { dinheiro: -45, familia: -30, consciencia: -30 },
        feedback: "Alimentar a ilusão da aposta salvadora amplia exponencialmente o rombo financeiro e alimenta o ciclo destrutivo do vício.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Expulsar a pessoa de casa sem nenhum contato, deixando-a entregue à própria sorte na rua.",
        efeito: { familia: -35, saude: -25, consciencia: -20 },
        feedback: "A rejeição radical e o desamparo total frequentemente empurram o indivíduo para a marginalidade extrema ou suicídio.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Pagar a dívida em segredo sem exigir que ele entre em tratamento médico contra o vício.",
        efeito: { dinheiro: -40, familia: -20, consciencia: -15 },
        feedback: "Quitar dívidas sem tratamento remove temporariamente a consequência da ação, incentivando novas apostas nas semanas seguintes.",
        correta: false,
      },
    ],
  },
  {
    id: 27,
    fase: 3,
    dificuldade: "difícil",
    tema: "drogas",
    enunciado: "Após 6 meses sóbrio e em tratamento no CAPS-AD, um amigo teve uma recaída e consumiu substâncias em um momento de perda familiar. Como agir?",
    opcoes: [
      {
        letra: "A",
        texto: "Dizer que ele é um caso perdido e que todo o esforço anterior foi jogado no lixo.",
        efeito: { familia: -30, consciencia: -30, saude: -20 },
        feedback: "O estigma e a condenação violenta induzem a pessoa ao abandono do tratamento e ao aprofundamento da crise depressiva.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Acolher sem julgar, entender a recaída como parte de um tratamento crônico e encorajá-lo a retornar imediatamente ao CAPS.",
        efeito: { consciencia: 30, familia: 25, saude: 20 },
        feedback: "Compreensão científica e humanizada! A dependência química é uma condição crônica; uma recaída não zera os aprendizados anteriores.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Fingir que não aconteceu nada e incentivar que ele use mais para esquecer o luto rapidamente.",
        efeito: { saude: -35, consciencia: -25 },
        feedback: "Usar substâncias para abafar o luto impede a elaboração emocional saudável da perda e acelera a tolerância neurológica.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Postar mensagens de decepção pública nas redes sociais para envergonhá-lo na internet.",
        efeito: { familia: -25, consciencia: -25 },
        feedback: "Exposição humilhante agrava o sentimento de inutilidade e sabota a rede de suporte necessária para a retomada.",
        correta: false,
      },
    ],
  },
  {
    id: 28,
    fase: 3,
    dificuldade: "difícil",
    tema: "apostas",
    enunciado: "A Organização Mundial da Saúde (OMS) classifica o vício em jogos e apostas (ludopatia) como transtorno mental. O que caracteriza essa condição médica?",
    opcoes: [
      {
        letra: "A",
        texto: "É apenas falta de sorte e fraqueza de caráter que se resolve com pensamento positivo matinal.",
        efeito: { consciencia: -20, saude: -10 },
        feedback: "Transtornos compulsivos não decorrem de 'fraqueza de caráter', mas de desregulação nos circuitos dopaminérgicos de recompensa cerebral.",
        correta: false,
      },
      {
        letra: "B",
        texto: "É uma escolha voluntária sem nenhuma alteração na química ou circuitos de recompensa do cérebro.",
        efeito: { consciencia: -15, saude: -10 },
        feedback: "Exames de neuroimagem comprovam que o cérebro de um jogador compulsivo reage às apostas de forma idêntica ao de dependentes de cocaína.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Perda de controle sobre o jogo, priorização das apostas sobre a vida pessoal e persistência mesmo diante de graves perdas.",
        efeito: { consciencia: 30, saude: 20, familia: 15 },
        feedback: "Definição clínica exata! O comprometimento funcional atinge relações afetivas, carreira e saúde mental, exigindo psicoterapia focada.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Uma habilidade profissional legítima que só precisa de gerenciamento de risco no Excel.",
        efeito: { dinheiro: -25, consciencia: -20 },
        feedback: "Planilhas não alteram a vantagem estatística da banca em jogos de azar; acreditar em 'controle' é sintoma do próprio transtorno.",
        correta: false,
      },
    ],
  },
  {
    id: 29,
    fase: 3,
    dificuldade: "difícil",
    tema: "hábitos",
    enunciado: "Um estudante se vê isolado socialmente, endividado e com sintomas depressivos profundos após meses de vício duplo em telas e jogos online. Qual o primeiro passo de reconstrução?",
    opcoes: [
      {
        letra: "A",
        texto: "Quebrar o silêncio, admitir a necessidade de ajuda para quem ama e buscar apoio profissional no SUS (UBS / CAPS) ou CVV (188).",
        efeito: { saude: 25, familia: 30, consciencia: 30, dinheiro: 15 },
        feedback: "Decisão corajosa e transformadora! Reconhecer a própria vulnerabilidade e acionar os serviços públicos de apoio é o início do recomeço.",
        correta: true,
      },
      {
        letra: "B",
        texto: "Apostar as últimas economias em uma cartela de loteria para resolver tudo magicamente.",
        efeito: { dinheiro: -35, consciencia: -25 },
        feedback: "Buscar 'soluções mágicas' de última hora é armadilha típica de quem se recusa a encarar a raiz do sofrimento emocional.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Se isolar ainda mais e cortar totalmente o diálogo com a família e amigos leais.",
        efeito: { familia: -35, saude: -30, consciencia: -20 },
        feedback: "O isolamento absoluto alimenta a espiral da depressão e aumenta o risco de desfechos trágicos.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Procurar soluções milagrosas vendidas por influenciadores em grupos fechados da internet.",
        efeito: { dinheiro: -30, consciencia: -20 },
        feedback: "Estelionatários digitais lucram explorando pessoas fragilizadas emocionalmente com promessas vazias.",
        correta: false,
      },
    ],
  },
  {
    id: 30,
    fase: 3,
    dificuldade: "difícil",
    tema: "drogas",
    enunciado: "Qual é o papel gratuito e essencial prestado pelo CAPS-AD (Centro de Atenção Psicossocial - Álcool e Drogas) no Sistema Único de Saúde (SUS)?",
    opcoes: [
      {
        letra: "A",
        texto: "É uma prisão onde pessoas com vício são internadas compulsoriamente sem atendimento médico.",
        efeito: { consciencia: -20, saude: -15 },
        feedback: "Incorreto: o CAPS-AD opera sob a diretriz de portas abertas, com acolhimento comunitário e respeito aos direitos fundamentais.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Uma clínica privada caríssima destinada exclusivamente a famílias de alta renda comprovada.",
        efeito: { consciencia: -15, dinheiro: -10 },
        feedback: "O CAPS-AD integra o SUS, sendo um serviço público, 100% gratuito e universal para qualquer cidadão brasileiro.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Oferece acolhimento multiprofissional gratuito (médicos, psicólogos e assistentes sociais) com respeito à dignidade humana.",
        efeito: { saude: 25, consciencia: 30, familia: 25 },
        feedback: "Informação correta e fundamental! O CAPS-AD constrói Projetos Terapêuticos Singulares (PTS) para reabilitar laços e recuperar a cidadania.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Um centro de punição judiciária que aplica multas a quem faz uso recreativo de substâncias.",
        efeito: { consciencia: -20 },
        feedback: "Serviços de saúde do SUS cuidam da saúde da população e não exercem funções penais ou punitivas.",
        correta: false,
      },
    ],
  },
  {
    id: 31,
    fase: 3,
    dificuldade: "difícil",
    tema: "apostas",
    enunciado: "Uma pessoa começou apostando R$ 10, passou para R$ 100 e agora precisa apostar R$ 1.000 para sentir a mesma emoção de antes. Esse fenômeno é conhecido como:",
    opcoes: [
      {
        letra: "A",
        texto: "Aumento de sorte exponencial gerado pelo tempo de fidelidade do cadastro na plataforma.",
        efeito: { dinheiro: -25, consciencia: -15 },
        feedback: "A fidelidade em plataformas de jogo apenas fornece dados comportamentais para o algoritmo manipular o usuário com ofertas direcionadas.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Estratégia de Martingale recomendada por economistas e bancos centrais pelo mundo.",
        efeito: { dinheiro: -30, consciencia: -20 },
        feedback: "A estratégia de Martingale é matematicamente insustentável e leva à bancarrota rápida devido aos limites de aposta e recursos finitos.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Amadurecimento do jogador que passa da fase amadora para a fase profissional de apostador.",
        efeito: { dinheiro: -25, consciencia: -15 },
        feedback: "Não há 'carreira profissional' em jogos de cassino com margem negativa da casa; esse discurso apenas disfarça a compulsão.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Tolerância neurobiológica, onde o cérebro exige estímulos financeiros cada vez maiores para liberar a mesma dopamina.",
        efeito: { consciencia: 30, saude: 20, dinheiro: 15 },
        feedback: "Conceito neurocientífico exato! A tolerância é um dos marcadores clássicos de dependência: doses cada vez maiores para obter o mesmo efeito.",
        correta: true,
      },
    ],
  },
  {
    id: 32,
    fase: 3,
    dificuldade: "difícil",
    tema: "pressão social",
    enunciado: "Um grupo de 'amigos' pressiona você a guardar na sua mochila uma sacola com substâncias ilícitas para ajudá-los a passar por uma blitz. Como reagir?",
    opcoes: [
      {
        letra: "A",
        texto: "Guardo a sacola, pois lealdade entre amigos exige assumir qualquer risco legal sem questionar.",
        efeito: { saude: -30, familia: -40, consciencia: -30 },
        feedback: "Grave equívoco! Transportar substâncias ilícitas pode configurar tráfico de drogas, resultando em processo criminal e prisão.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Nego categoricamente, me afasto do local e entendo que quem pede isso não é amigo, mas alguém que quer me incriminar.",
        efeito: { consciencia: 30, familia: 25, saude: 20 },
        feedback: "Decisão corajosa e lúcida! Amigos verdadeiros protegem seu futuro; quem transfere riscos criminais para você está sendo manipulador.",
        correta: true,
      },
      {
        letra: "C",
        texto: "Escondo a sacola em uma lixeira pública para recuperar logo após a passagem da blitz.",
        efeito: { consciencia: -25, familia: -20 },
        feedback: "Colaborar com a ocultação de materiais ilícitos mantém você como cúmplice da atividade ilegal e vulnerável a flagrantes.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Cobro R$ 50 para fazer o favor e assumir a guarda da encomenda perigosa.",
        efeito: { dinheiro: -20, familia: -35, consciencia: -30 },
        feedback: "Monetizar o envolvimento com atos ilícitos agrava a responsabilização penal e destrói sua trajetória pessoal por quantias insignificantes.",
        correta: false,
      },
    ],
  },
  {
    id: 33,
    fase: 3,
    dificuldade: "difícil",
    tema: "redes sociais",
    enunciado: "A superexposição em redes e a busca obsessiva por curtidas levam muitos jovens a falsificar uma vida perfeita, gerando burnout e vazio existencial. O que devolve o equilíbrio?",
    opcoes: [
      {
        letra: "A",
        texto: "Comprar seguidores falsos e postar fotos editadas mais vezes ao dia para manter o status.",
        efeito: { dinheiro: -20, saude: -20, consciencia: -15 },
        feedback: "Alimentar aparências artificiais intensifica o abismo entre quem você é de verdade e a imagem virtual, aumentando o sofrimento.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Fazer transmissões ao vivo 24 horas por dia para não perder audiência nem ser esquecido pelos algoritmos.",
        efeito: { saude: -35, consciencia: -20, familia: -25 },
        feedback: "A vigilância constante e a falta de privacidade sobrecarregam o sistema nervoso e aceleram o colapso por exaustão psicológica.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Praticar 'detox digital', valorizar conexões reais do dia a dia, projetos de vida palpáveis e convivência familiar.",
        efeito: { saude: 25, consciencia: 30, familia: 25 },
        feedback: "Perfeita reflexão! A vida com propósito se constrói no mundo concreto — nas relações afetivas, no autocuidado e no aprendizado constante.",
        correta: true,
      },
      {
        letra: "D",
        texto: "Entrar em brigas e polêmicas públicas com outros criadores para atrair fama e engajamento rápido.",
        efeito: { consciencia: -25, saude: -20 },
        feedback: "Cultivar hostilidade virtual atrai ódio desnecessário, estresse oxidativo crônico e deterioração da reputação pessoal.",
        correta: false,
      },
    ],
  },
  {
    id: 34,
    fase: 3,
    dificuldade: "difícil",
    tema: "drogas",
    enunciado: "A mistura de álcool com energéticos ou calmantes é comum em festas. Por que essa combinação é considerada uma das mais perigosas pela medicina?",
    opcoes: [
      {
        letra: "A",
        texto: "Porque o energético anula os efeitos do álcool no fígado, deixando a pessoa totalmente sóbria para dirigir.",
        efeito: { saude: -35, consciencia: -25 },
        feedback: "Mito fatal: a cafeína mascara a sonolência motora sem reduzir a taxa de alcoolemia nem recuperar os reflexos cerebrais.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Porque o sabor doce das bebidas melhora a hidratação dos rins e neutraliza as toxinas mais rápido.",
        efeito: { saude: -20, consciencia: -15 },
        feedback: "Bebidas açucaradas com álcool e cafeína aumentam a desidratação celular e retardam a percepção da embriaguez tóxica.",
        correta: false,
      },
      {
        letra: "C",
        texto: "Porque apenas pessoas idosas possuem receptores suscetíveis a essa interação química nociva.",
        efeito: { consciencia: -15 },
        feedback: "Jovens e adolescentes são ainda mais vulneráveis a arritmias graves induzidas por doses maciças de estimulantes e depressores.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Porque mascara os sinais de embriaguez, sobrecarrega o coração e multiplica o risco de parada cardiorrespiratória e coma.",
        efeito: { saude: 25, consciencia: 30, familia: 15 },
        feedback: "Precisão médica! O conflito entre o estímulo da cafeína e a depressão alcoólica desregula os sinais vitais e causa colapsos súbitos.",
        correta: true,
      },
    ],
  },
  {
    id: 35,
    fase: 3,
    dificuldade: "difícil",
    tema: "apostas",
    enunciado: "Em plataformas de apostas online com 'jogos rápidos', o que garante matematicamente que a esmagadora maioria dos apostadores perderá tudo com o tempo?",
    opcoes: [
      {
        letra: "A",
        texto: "O algoritmo programado com o 'Return to Player' (RTP) inferior a 100%, garantindo o lucro matemático fixo da casa.",
        efeito: { consciencia: 30, dinheiro: 25, familia: 10 },
        feedback: "Conhecimento matemático puro! A lei dos grandes números garante que, quanto mais rodadas jogadas, mais o resultado real converge para o lucro da banca.",
        correta: true,
      },
      {
        letra: "B",
        texto: "A falta de dedicação e concentração dos jogadores durante os horários da madrugada.",
        efeito: { dinheiro: -20, consciencia: -15 },
        feedback: "Concentração não altera a matemática de um software gerador de números pseudoaleatórios desenhado para reter margem financeira.",
        correta: false,
      },
      {
        letra: "C",
        texto: "A instabilidade da conexão de internet do apostador que cancela vitórias automaticamente.",
        efeito: { consciencia: -15, dinheiro: -10 },
        feedback: "A perda decorre do modelo de negócio estatístico da plataforma, e não de eventuais oscilações na rede de conexão.",
        correta: false,
      },
      {
        letra: "D",
        texto: "A intervenção manual de fiscais que desligam os prêmios quando um usuário ganha muitas rodadas seguidas.",
        efeito: { consciencia: -15, dinheiro: -15 },
        feedback: "Não é necessária interferência manual: o próprio algoritmo probabilístico é calibrado para que as perdas superem os ganhos sistematicamente.",
        correta: false,
      },
    ],
  },
  {
    id: 36,
    fase: 3,
    dificuldade: "difícil",
    tema: "hábitos",
    enunciado: "Você se aproxima do final do tabuleiro da vida. O que define uma trajetória verdadeiramente vitoriosa e de sucesso duradouro?",
    opcoes: [
      {
        letra: "A",
        texto: "Acumular riquezas rápidas através de esquemas arriscados, mesmo sacrificando saúde física e amigos leais.",
        efeito: { dinheiro: -20, familia: -30, saude: -25 },
        feedback: "Ganho efêmero não compensa a perda da paz interior, da saúde corporal e das relações que dão sentido à vida humana.",
        correta: false,
      },
      {
        letra: "B",
        texto: "Conquistar autonomia com escolhas conscientes, preservar a saúde mental, manter vínculos sinceros e ser apoio para outros.",
        efeito: { saude: 30, dinheiro: 30, familia: 30, consciencia: 30 },
        feedback: "Sensacional! Esse é o verdadeiro Grande Campeão da Vida: aquele que constrói um futuro sólido fundamentado em escolhas reais!",
        correta: true,
      },
      {
        letra: "C",
        texto: "Viver no imediatismo impulsivo sem planejar o futuro nem pensar nas consequências das ações.",
        efeito: { saude: -25, familia: -20, consciencia: -25 },
        feedback: "Ignorar o amanhã gera vulnerabilidade contínua e dependências que cobram contas pesadas nas etapas posteriores da vida.",
        correta: false,
      },
      {
        letra: "D",
        texto: "Ter a aprovação cega de qualquer grupo social, mesmo quando isso exige ferir a própria dignidade.",
        efeito: { consciencia: -30, familia: -20, saude: -15 },
        feedback: "Buscar aceitação a custo dos próprios valores aprisiona sua identidade e o torna refém da vontade e dos vícios alheios.",
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
