import confetti from "canvas-confetti";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Home,
  LifeBuoy,
  MessageSquare,
  Moon,
  Play,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Sparkles,
  Target,
  TrendingDown,
  Trophy,
  User,
  Users,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PERGUNTAS,
  TABULEIRO,
  calcularFinal,
  type Casa,
  type Efeito,
  type Opcao,
  type Pergunta,
} from "@/lib/game-data";
import { useGamepad } from "@/hooks/use-gamepad";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jogo da Vida: Escolhas Reais — Multiplayer Simultâneo" },
      {
        name: "description",
        content:
          "Jogo de tabuleiro digital multiplayer simultâneo para 2 a 4 jogadores sobre prevenção ao vício em drogas e em casas de aposta. Responda em conjunto pelo controle, avance e descubra seu final.",
      },
      { property: "og:title", content: "Jogo da Vida: Escolhas Reais" },
      {
        property: "og:description",
        content:
          "De 2 a 4 jogadores simultâneos, perguntas reais sobre drogas e apostas em 3 fases de dificuldade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Jogo,
});

// ==================== CUSTOMIZAÇÃO DE CORES & GÊNERO ====================
type Genero = "ele" | "ela" | "neutro";

type CorCustomizada = {
  id: string;
  nome: string;
  hex: string;
  bgSolid: string;
  bgLight: string;
  border: string;
  text: string;
  glow: string;
  ring: string;
};

const CORES_SELECAO: CorCustomizada[] = [
  {
    id: "azul",
    nome: "Azul",
    hex: "#3b82f6",
    bgSolid: "bg-blue-600",
    bgLight: "bg-blue-500/15",
    border: "border-blue-500",
    text: "text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    ring: "ring-blue-500",
  },
  {
    id: "verde",
    nome: "Verde",
    hex: "#10b981",
    bgSolid: "bg-emerald-600",
    bgLight: "bg-emerald-500/15",
    border: "border-emerald-500",
    text: "text-emerald-400",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    ring: "ring-emerald-500",
  },
  {
    id: "roxo",
    nome: "Roxo",
    hex: "#a855f7",
    bgSolid: "bg-purple-600",
    bgLight: "bg-purple-500/15",
    border: "border-purple-500",
    text: "text-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    ring: "ring-purple-500",
  },
  {
    id: "laranja",
    nome: "Laranja",
    hex: "#f97316",
    bgSolid: "bg-orange-600",
    bgLight: "bg-orange-500/15",
    border: "border-orange-500",
    text: "text-orange-400",
    glow: "shadow-[0_0_15px_rgba(249,115,22,0.5)]",
    ring: "ring-orange-500",
  },
  {
    id: "amarelo",
    nome: "Amarelo",
    hex: "#eab308",
    bgSolid: "bg-yellow-500",
    bgLight: "bg-yellow-500/15",
    border: "border-yellow-500",
    text: "text-yellow-400",
    glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]",
    ring: "ring-yellow-500",
  },
  {
    id: "rosa",
    nome: "Rosa",
    hex: "#ec4899",
    bgSolid: "bg-pink-600",
    bgLight: "bg-pink-500/15",
    border: "border-pink-500",
    text: "text-pink-400",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    ring: "ring-pink-500",
  },
];

const GENEROS_CONFIG: Record<
  Genero,
  { label: string; pronome: string; avatar: string }
> = {
  ele: { label: "Ele/Dele", pronome: "Ele", avatar: "👦" },
  ela: { label: "Ela/Dela", pronome: "Ela", avatar: "👧" },
  neutro: { label: "Neutro", pronome: "Neutro", avatar: "🧑" },
};

type Jogador = {
  id: number;
  nome: string;
  genero: Genero;
  cor: CorCustomizada;
  pos: number; // 0 a 21 (Casas 1 a 22)
  saude: number;
  dinheiro: number;
  familia: number;
  consciencia: number;
  terminou: boolean;
  usouApoio: boolean;
  esteveCritico: boolean;
  acertos: number;
  erros: number;
};

type Fase = "setup" | "tutorial" | "pergunta_simultanea" | "revelacao" | "fim";

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const CRITICO = 25;
const ALERTA = 30;

function emCritico(j: Jogador) {
  return Math.min(j.saude, j.dinheiro, j.familia, j.consciencia) < CRITICO;
}

function aplicar(j: Jogador, e: Efeito): Jogador {
  const novo: Jogador = {
    ...j,
    saude: clamp(j.saude + (e.saude ?? 0)),
    dinheiro: clamp(j.dinheiro + (e.dinheiro ?? 0)),
    familia: clamp(j.familia + (e.familia ?? 0)),
    consciencia: clamp(j.consciencia + (e.consciencia ?? 0)),
  };
  return { ...novo, esteveCritico: novo.esteveCritico || emCritico(novo) };
}

function novoJogador(
  id: number,
  nome: string,
  genero: Genero,
  cor: CorCustomizada,
): Jogador {
  return {
    id,
    nome,
    genero,
    cor,
    pos: 0,
    saude: 70,
    dinheiro: 60,
    familia: 70,
    consciencia: 50,
    terminou: false,
    usouApoio: false,
    esteveCritico: false,
    acertos: 0,
    erros: 0,
  };
}

function calcularPontuacaoTotal(j: Jogador): number {
  return j.saude + j.dinheiro + j.familia + j.consciencia;
}

function obterAtributoMaisForte(j: Jogador) {
  const atributos = [
    { nome: "Saúde", chave: "saude" as const, valor: j.saude, cor: "text-emerald-400", Icon: HeartPulse },
    { nome: "Dinheiro", chave: "dinheiro" as const, valor: j.dinheiro, cor: "text-yellow-400", Icon: CircleDollarSign },
    { nome: "Família", chave: "familia" as const, valor: j.familia, cor: "text-blue-400", Icon: Users },
    { nome: "Consciência", chave: "consciencia" as const, valor: j.consciencia, cor: "text-purple-400", Icon: Brain },
  ];
  return atributos.reduce((maior, a) => (a.valor > maior.valor ? a : maior), atributos[0]!);
}

const CARDS_TUTORIAL = [
  {
    numero: 1,
    tag: "O OBJETIVO DO JOGO",
    titulo: "O Caminho das Escolhas",
    texto:
      "Você e seus amigos percorrem uma trilha de 22 casas dividida em 3 fases de maturidade. A cada rodada, perguntas reais sobre apostas, drogas e dilemas do dia a dia testarão sua postura. Suas decisões constroem seu destino!",
    icone: Target,
    corTag: "text-primary bg-primary/10 border-primary/20",
    corIcone: "text-primary",
  },
  {
    numero: 2,
    tag: "OS 4 PILARES DA VIDA",
    titulo: "Mantenha o Equilíbrio",
    texto:
      "Suas respostas afetam 4 pilares: Saúde, Dinheiro, Família e Consciência. Se algum deles cair para menos de 30%, entrará em ALERTA VERMELHO. Se cair abaixo de 25%, você pode acionar a Rede de Apoio para se reerguer!",
    icone: BarChart3,
    corTag: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    corIcone: "text-yellow-400",
  },
  {
    numero: 3,
    tag: "RESPOSTAS SIMULTÂNEAS MULTIPLAYER",
    titulo: "Todos Jogam ao Mesmo Tempo!",
    texto:
      "Uma mesma pergunta surge na tela para todos. Cada participante usa seu próprio controle (Comando 0 = P1, Comando 1 = P2, etc.) para escolher secretamente sua alternativa: [ A ], [ B ], [ X ] ou [ Y ]. Quando todos confirmarem, as respostas são reveladas!",
    icone: Gamepad2,
    corTag: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    corIcone: "text-blue-400",
  },
  {
    numero: 4,
    tag: "SEM DADOS • PROGRESSÃO POR DIFICULDADE",
    titulo: "Avanço por Consciência",
    texto:
      "Não há sorte de dados! Quem faz a escolha consciente avança +2 casas e ganha pontos; quem faz a escolha de risco não avança (+0 casas) e perde atributos. O jogo evolui pela Fase 1 (Fácil), Fase 2 (Médio) até a Fase 3 (Difícil).",
    icone: Compass,
    corTag: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    corIcone: "text-emerald-400",
  },
  {
    numero: 5,
    tag: "O GRANDE CAMPEÃO & FUTURO",
    titulo: "Chegue à Casa 22!",
    texto:
      "A partida é vencida por quem cruzar o portal do Futuro e mantiver o maior equilíbrio de vida. No encerramento, o Grande Campeão é coroado com troféu dourado, fanfarra e chuva de confetes!",
    icone: Trophy,
    corTag: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    corIcone: "text-yellow-400",
  },
];

// Helper para renderizar ícones do tabuleiro
function renderIconeCasa(icone: string, className = "size-4") {
  switch (icone) {
    case "Compass": return <Compass className={className} />;
    case "Home": return <Home className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "Activity": return <Activity className={className} />;
    case "Users": return <Users className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Gamepad2": return <Gamepad2 className={className} />;
    case "AlertTriangle": return <AlertTriangle className={className} />;
    case "CircleDollarSign": return <CircleDollarSign className={className} />;
    case "MessageSquare": return <MessageSquare className={className} />;
    case "Moon": return <Moon className={className} />;
    case "ShieldAlert": return <ShieldAlert className={className} />;
    case "HeartPulse": return <HeartPulse className={className} />;
    case "TrendingDown": return <TrendingDown className={className} />;
    case "LifeBuoy": return <LifeBuoy className={className} />;
    case "HeartHandshake": return <HeartHandshake className={className} />;
    case "Shuffle": return <Shuffle className={className} />;
    case "Award": return <Award className={className} />;
    case "Trophy": return <Trophy className={className} />;
    default: return <Sparkles className={className} />;
  }
}

function Jogo() {
  const [fase, setFase] = useState<Fase>("setup");
  const [quantidade, setQuantidade] = useState(4);
  const [cardTutorial, setCardTutorial] = useState(0);

  // Configuração inicial de cada jogador na tela de Setup
  const [nomes, setNomes] = useState<string[]>(["Lucas", "Marina", "Gabriel", "Beatriz"]);
  const [generos, setGeneros] = useState<Genero[]>(["ele", "ela", "ele", "ela"]);
  const [coresSelecionadas, setCoresSelecionadas] = useState<CorCustomizada[]>([
    CORES_SELECAO[0]!, // Azul
    CORES_SELECAO[1]!, // Verde
    CORES_SELECAO[2]!, // Roxo
    CORES_SELECAO[3]!, // Laranja
  ]);

  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [perguntasUsadas, setPerguntasUsadas] = useState<number[]>([]);
  const [respostasRodada, setRespostasRodada] = useState<Record<number, number>>({});
  const [modalApoio, setModalApoio] = useState<string | null>(null);

  // Áudio e volume
  const [volume, setVolume] = useState(0.8);
  const [mutado, setMutado] = useState(false);
  const volumeEfetivo = mutado ? 0 : volume;
  const audioFinal = useRef<HTMLAudioElement | null>(null);

  function tocarSomNavegacao() {
    if (typeof Audio === "undefined" || volumeEfetivo <= 0) return;
    const a = new Audio("/botao-navegacao.mp3");
    a.volume = Math.min(1, 0.6 * volumeEfetivo);
    void a.play().catch(() => undefined);
  }

  function tocarSomRespostaBoa() {
    if (typeof Audio === "undefined" || volumeEfetivo <= 0) return;
    const a = new Audio("/audio-respostaboa.mp3");
    a.volume = Math.min(1, 0.85 * volumeEfetivo);
    void a.play().catch(() => undefined);
  }

  function tocarSomFinal() {
    if (typeof Audio === "undefined") return;
    if (!audioFinal.current) {
      audioFinal.current = new Audio("/audio-telafinal.mp3");
      audioFinal.current.loop = true;
    }
    const a = audioFinal.current;
    a.volume = Math.min(1, 0.75 * volumeEfetivo);
    if (volumeEfetivo > 0 && a.paused) {
      a.currentTime = 0;
      void a.play().catch(() => undefined);
    }
  }

  function pararSomFinal() {
    const a = audioFinal.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }

  function dispararConfetesVitoria() {
    if (typeof window === "undefined") return;
    const fire =
      typeof confetti === "function"
        ? confetti
        : (confetti as unknown as { default?: typeof confetti })?.default;

    const execFire = (opts: confetti.Options) => {
      try {
        if (typeof fire === "function") {
          void fire(opts);
        } else if (
          typeof (window as unknown as { confetti?: typeof confetti }).confetti === "function"
        ) {
          void (window as unknown as { confetti: typeof confetti }).confetti(opts);
        }
      } catch (err) {
        console.warn("Erro ao disparar confetes:", err);
      }
    };

    // Rajada 1: Esquerda
    execFire({
      particleCount: 70,
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.75 },
      colors: ["#3b82f6", "#10b981", "#a855f7", "#f97316", "#eab308"],
      zIndex: 9999,
      disableForReducedMotion: false,
    });

    // Rajada 2: Direita (+250ms)
    setTimeout(() => {
      execFire({
        particleCount: 70,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.75 },
        colors: ["#3b82f6", "#10b981", "#a855f7", "#f97316", "#eab308"],
        zIndex: 9999,
        disableForReducedMotion: false,
      });
    }, 250);

    // Rajada 3: Centro (+500ms)
    setTimeout(() => {
      execFire({
        particleCount: 130,
        spread: 100,
        origin: { x: 0.5, y: 0.55 },
        colors: ["#ffd700", "#ffaa00", "#00f0ff", "#a855f7", "#22c55e"],
        zIndex: 9999,
        disableForReducedMotion: false,
      });
    }, 500);
  }

  useEffect(() => {
    if (fase === "fim") {
      tocarSomFinal();
      dispararConfetesVitoria();
    } else {
      pararSomFinal();
    }
    return () => {
      pararSomFinal();
    };
  }, [fase]);

  useEffect(() => {
    if (audioFinal.current) {
      audioFinal.current.volume = Math.min(1, 0.75 * volumeEfetivo);
      if (volumeEfetivo <= 0) {
        audioFinal.current.pause();
      } else if (fase === "fim" && audioFinal.current.paused) {
        void audioFinal.current.play().catch(() => undefined);
      }
    }
  }, [volumeEfetivo, fase]);

  // Sorteia pergunta adequada à fase de dificuldade do tabuleiro
  function sortearPerguntaParaFase(faseDificuldade: 1 | 2 | 3): Pergunta {
    const doNivel = PERGUNTAS.filter((p) => p.fase === faseDificuldade && !perguntasUsadas.includes(p.id));
    const pool = doNivel.length
      ? doNivel
      : PERGUNTAS.filter((p) => !perguntasUsadas.includes(p.id));
    const finalPool = pool.length ? pool : PERGUNTAS;
    const escolhida = finalPool[Math.floor(Math.random() * finalPool.length)]!;
    setPerguntasUsadas((antigas) => [...antigas, escolhida.id]);
    return escolhida;
  }

  // Iniciar partida após criação dos personagens
  function iniciar() {
    const novos = Array.from({ length: quantidade }, (_, i) =>
      novoJogador(
        i,
        nomes[i]?.trim() || `Jogador ${i + 1}`,
        generos[i] || "neutro",
        coresSelecionadas[i] || CORES_SELECAO[i % CORES_SELECAO.length]!,
      ),
    );
    setJogadores(novos);
    setCardTutorial(0);
    setFase("tutorial");
  }

  function comecarPartida() {
    setPerguntasUsadas([]);
    const primeira = sortearPerguntaParaFase(1);
    setPerguntaAtual(primeira);
    setRespostasRodada({});
    setFase("pergunta_simultanea");
  }

  // Registrar resposta de um jogador específico (0 a 3)
  function responderSimultaneo(jogadorId: number, opcaoIndex: 0 | 1 | 2 | 3) {
    if (fase !== "pergunta_simultanea") return;
    if (jogadorId >= jogadores.length) return;

    setRespostasRodada((prev) => {
      if (prev[jogadorId] === opcaoIndex) return prev;
      tocarSomNavegacao();
      return { ...prev, [jogadorId]: opcaoIndex };
    });
  }

  const todosResponderam =
    jogadores.length > 0 &&
    jogadores.every((j) => respostasRodada[j.id] !== undefined);

  // Revelação de todas as escolhas feitas
  function revelarRespostas() {
    if (fase !== "pergunta_simultanea" || !perguntaAtual) return;

    let houveEscolhaBoa = false;
    const atualizados = jogadores.map((j) => {
      const opcaoIndex = respostasRodada[j.id];
      if (opcaoIndex === undefined) return j;

      const opcao = perguntaAtual.opcoes[opcaoIndex];
      if (!opcao) return j;

      if (opcao.correta) houveEscolhaBoa = true;

      // Avança +2 casas se acertou; avança 0 se errou
      const novaPos = opcao.correta ? Math.min(TABULEIRO.length - 1, j.pos + 2) : j.pos;
      const terminou = novaPos >= TABULEIRO.length - 1;

      const jComEfeito = aplicar(j, opcao.efeito);
      return {
        ...jComEfeito,
        pos: novaPos,
        terminou: j.terminou || terminou,
        acertos: j.acertos + (opcao.correta ? 1 : 0),
        erros: j.erros + (opcao.correta ? 0 : 1),
      };
    });

    setJogadores(atualizados);
    if (houveEscolhaBoa) {
      tocarSomRespostaBoa();
    }
    setFase("revelacao");
  }

  // Avançar para a próxima rodada
  function proximaRodada() {
    // Se alguém chegou ao fim (casa 22)
    if (jogadores.some((j) => j.pos >= TABULEIRO.length - 1 || j.terminou)) {
      setFase("fim");
      return;
    }

    // Identifica a fase do mapa pela posição máxima dos jogadores
    const maxPos = Math.max(...jogadores.map((j) => j.pos));
    const faseDificuldade: 1 | 2 | 3 = maxPos < 6 ? 1 : maxPos < 14 ? 2 : 3;

    const prox = sortearPerguntaParaFase(faseDificuldade);
    setPerguntaAtual(prox);
    setRespostasRodada({});
    setFase("pergunta_simultanea");
  }

  // Acionamento de emergência da Rede de Apoio
  function acionarRedeApoio(jogadorId: number) {
    const j = jogadores[jogadorId];
    if (!j || j.usouApoio || !emCritico(j)) return;

    const menorAtributo = (["saude", "dinheiro", "familia", "consciencia"] as const).reduce(
      (a, b) => (j[a] <= j[b] ? a : b),
    );

    const atualizados = jogadores.map((item) => {
      if (item.id !== jogadorId) return item;
      const att = { ...item, usouApoio: true, esteveCritico: true };
      att[menorAtributo] = clamp(item[menorAtributo] + 30);
      return att;
    });

    setJogadores(atualizados);
    setModalApoio(
      `${j.nome} acionou a Rede de Apoio! Pedir ajuda profissional (CAPS-AD / UBS) ou familiar restabeleceu +30 pontos vitais em ${menorAtributo.toUpperCase()}.`,
    );
  }

  function reiniciar() {
    pararSomFinal();
    setFase("setup");
    setCardTutorial(0);
    setJogadores([]);
    setRespostasRodada({});
    setPerguntaAtual(null);
  }

  // Atalho para teste rápido da tela final
  function testarTelaFinal() {
    const mock = Array.from({ length: quantidade }, (_, i) => {
      const base = novoJogador(
        i,
        nomes[i]?.trim() || `Jogador ${i + 1}`,
        generos[i] || "neutro",
        coresSelecionadas[i] || CORES_SELECAO[i]!,
      );
      return {
        ...base,
        pos: TABULEIRO.length - 1,
        saude: 70 + (i === 0 ? 25 : -i * 10),
        dinheiro: 60 + (i === 0 ? 30 : -i * 15),
        familia: 70 + (i === 0 ? 20 : -i * 5),
        consciencia: 65 + (i === 0 ? 25 : -i * 10),
        terminou: true,
        acertos: 5 - i,
        erros: i,
      };
    });
    setJogadores(mock);
    setFase("fim");
  }

  // ==================== INTEGRAÇÃO COM MÚLTIPLOS CONTROLES ====================
  const { controlesConectados, quantidadeConectados } = useGamepad({
    onPlayerAnswer: (jogadorId, opcao) => {
      if (fase === "pergunta_simultanea") {
        responderSimultaneo(jogadorId, opcao);
      }
    },
    onPlayerAjuda: (jogadorId) => {
      acionarRedeApoio(jogadorId);
    },
    onConfirm: () => {
      if (modalApoio) {
        setModalApoio(null);
        return;
      }
      if (fase === "setup") iniciar();
      else if (fase === "tutorial") comecarPartida();
      else if (fase === "pergunta_simultanea" && todosResponderam) revelarRespostas();
      else if (fase === "revelacao") proximaRodada();
      else if (fase === "fim") reiniciar();
    },
    onMove: (direcao) => {
      if (fase === "tutorial") {
        if (direcao === "esquerda" || direcao === "cima") {
          setCardTutorial((c) => Math.max(0, c - 1));
          tocarSomNavegacao();
        } else if (direcao === "direita" || direcao === "baixo") {
          setCardTutorial((c) => Math.min(CARDS_TUTORIAL.length - 1, c + 1));
          tocarSomNavegacao();
        }
      }
    },
  });

  // Atalhos de teclado para teste rápido e acessibilidade
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalApoio && (e.key === "Enter" || e.key === "Escape")) {
        setModalApoio(null);
        return;
      }

      if (fase === "setup" && e.key === "Enter") {
        iniciar();
      } else if (fase === "tutorial") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          setCardTutorial((c) => Math.max(0, c - 1));
          tocarSomNavegacao();
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          setCardTutorial((c) => Math.min(CARDS_TUTORIAL.length - 1, c + 1));
          tocarSomNavegacao();
        } else if (e.key === "Enter" || e.key === " ") {
          comecarPartida();
        }
      } else if (fase === "pergunta_simultanea") {
        // P1: Teclas 1, 2, 3, 4
        if (e.key === "1") responderSimultaneo(0, 0);
        else if (e.key === "2") responderSimultaneo(0, 1);
        else if (e.key === "3") responderSimultaneo(0, 2);
        else if (e.key === "4") responderSimultaneo(0, 3);
        // P2: Teclas 7, 8, 9, 0
        else if (e.key === "7") responderSimultaneo(1, 0);
        else if (e.key === "8") responderSimultaneo(1, 1);
        else if (e.key === "9") responderSimultaneo(1, 2);
        else if (e.key === "0") responderSimultaneo(1, 3);
        // Enter revela se todos responderam
        else if (e.key === "Enter" && todosResponderam) {
          revelarRespostas();
        }
      } else if (fase === "revelacao" && (e.key === "Enter" || e.key === " ")) {
        proximaRodada();
      } else if (fase === "fim" && (e.key === "Enter" || e.key === " ")) {
        reiniciar();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fase, todosResponderam, modalApoio]);

  // Fase máxima atual dos jogadores no tabuleiro
  const faseMapaAtual = useMemo(() => {
    if (!jogadores.length) return 1;
    const max = Math.max(...jogadores.map((j) => j.pos));
    if (max < 6) return 1;
    if (max < 14) return 2;
    return 3;
  }, [jogadores]);

  // ==================== TELA 1: SETUP & CUSTOMIZAÇÃO ====================
  if (fase === "setup") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 md:py-12">
        <ControleAudio
          volume={volume}
          mutado={mutado}
          onVolumeChange={(v) => {
            setVolume(v);
            if (mutado && v > 0) setMutado(false);
          }}
          onToggleMute={() => setMutado((m) => !m)}
        />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Gamepad2 className="size-3.5" />
            <span>Multiplayer Simultâneo • Feira de Ciências</span>
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-foreground">
            Jogo da Vida: <span className="text-primary">Escolhas Reais</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Customizem seus personagens, peguem seus controles e joguem todos ao mesmo tempo! Suas escolhas determinam o avanço no tabuleiro e o seu futuro.
          </p>
        </div>

        {/* Quantidade de Jogadores */}
        <div className="panel mt-8 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Quantos jogadores na partida?</h2>
              <p className="text-xs text-muted-foreground">Todos jogam simultaneamente com seus respectivos controles</p>
            </div>
            <div className="flex gap-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuantidade(n)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    quantidade === n
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {n} Jogadores
                </button>
              ))}
            </div>
          </div>

          {/* Cards de Customização dos Jogadores */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: quantidade }, (_, i) => {
              const corAtual = coresSelecionadas[i] || CORES_SELECAO[i % CORES_SELECAO.length]!;
              const generoAtual = generos[i] || "neutro";
              const conectado = Boolean(controlesConectados[i]);

              return (
                <div
                  key={i}
                  className={`relative rounded-xl border-2 p-4 transition-all duration-300 bg-card/60 backdrop-blur-sm ${corAtual.border} ${corAtual.glow}`}
                >
                  {/* Cabeçalho do Card com Comando */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className={`size-8 rounded-full flex items-center justify-center text-lg ${corAtual.bgLight} border ${corAtual.border}`}>
                        {GENEROS_CONFIG[generoAtual].avatar}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-foreground">P{i + 1}</span>
                        <span className="text-xs text-muted-foreground ml-1.5">• Comando {i}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        conectado
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {conectado ? "● Controle Conectado" : "○ Teclado / Mouse"}
                    </span>
                  </div>

                  {/* Campo de Nome */}
                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Nome do Participante
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      value={nomes[i] || ""}
                      onChange={(e) => {
                        const copia = [...nomes];
                        copia[i] = e.target.value;
                        setNomes(copia);
                      }}
                      placeholder={`Jogador ${i + 1}`}
                      className="w-full rounded-md border border-border bg-secondary/80 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Seletor de Gênero / Pronome */}
                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Avatar / Pronome
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["ele", "ela", "neutro"] as Genero[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            const copia = [...generos];
                            copia[i] = g;
                            setGeneros(copia);
                          }}
                          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold border transition ${
                            generoAtual === g
                              ? `${corAtual.bgSolid} text-white border-transparent shadow-sm`
                              : "border-border bg-secondary/60 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{GENEROS_CONFIG[g].avatar}</span>
                          <span>{GENEROS_CONFIG[g].label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seletor de Cor */}
                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Cor do Jogador
                    </label>
                    <div className="flex items-center justify-between gap-1">
                      {CORES_SELECAO.map((cor) => {
                        const selecionada = corAtual.id === cor.id;
                        return (
                          <button
                            key={cor.id}
                            type="button"
                            onClick={() => {
                              const copia = [...coresSelecionadas];
                              copia[i] = cor;
                              setCoresSelecionadas(copia);
                            }}
                            title={cor.nome}
                            style={{ backgroundColor: cor.hex }}
                            className={`size-7 rounded-full transition-transform flex items-center justify-center text-white ${
                              selecionada ? "scale-110 ring-2 ring-white shadow-lg" : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            {selecionada && <Check className="size-3.5 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão de Iniciar */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={iniciar}
              className="w-full max-w-md rounded-xl bg-primary px-6 py-4 font-display text-xl tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:opacity-95 active:scale-[0.99]"
            >
              Começar Partida
            </button>

            <button
              type="button"
              onClick={testarTelaFinal}
              className="text-xs text-muted-foreground hover:text-primary transition underline underline-offset-4"
            >
              🧪 Atalho de teste: Visualizar Tela Final com Confetes e Campeão
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==================== TELA 2: TUTORIAL INTERATIVO ====================
  if (fase === "tutorial") {
    const cardAtual = CARDS_TUTORIAL[cardTutorial]!;
    const IconeCard = cardAtual.icone;

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-8 md:py-12">
        <ControleAudio
          volume={volume}
          mutado={mutado}
          onVolumeChange={(v) => {
            setVolume(v);
            if (mutado && v > 0) setMutado(false);
          }}
          onToggleMute={() => setMutado((m) => !m)}
        />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" />
            <span>Guia Rápido • Como Jogar</span>
          </div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-foreground">
            Instruções da Partida
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conheça as novas regras de disputa simultânea antes de iniciar.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {CARDS_TUTORIAL.map((c, i) => (
            <button
              key={c.numero}
              type="button"
              onClick={() => {
                setCardTutorial(i);
                tocarSomNavegacao();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === cardTutorial ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>

        {/* Card Principal */}
        <div className="panel relative mt-6 overflow-hidden p-6 md:p-8 text-center border-2 border-border/80 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              CARD {cardAtual.numero} DE {CARDS_TUTORIAL.length}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cardAtual.corTag}`}>
              {cardAtual.tag}
            </span>
          </div>

          <div className="mx-auto mt-4 flex size-20 items-center justify-center rounded-2xl bg-secondary shadow-inner md:size-24">
            <IconeCard className={`size-10 md:size-12 ${cardAtual.corIcone}`} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">{cardAtual.titulo}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {cardAtual.texto}
          </p>

          {/* Navegação */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/80 pt-5">
            <button
              type="button"
              onClick={() => {
                setCardTutorial((c) => Math.max(0, c - 1));
                tocarSomNavegacao();
              }}
              disabled={cardTutorial === 0}
              className={`flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-semibold transition ${
                cardTutorial === 0
                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                  : "bg-secondary text-secondary-foreground hover:border-primary"
              }`}
            >
              <ChevronLeft className="size-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-muted-foreground hidden sm:inline">
              Navegue com [ ◀ ▶ ] ou analógico
            </span>

            <button
              type="button"
              onClick={() => {
                if (cardTutorial === CARDS_TUTORIAL.length - 1) {
                  comecarPartida();
                } else {
                  setCardTutorial((c) => c + 1);
                  tocarSomNavegacao();
                }
              }}
              className="flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <span>{cardTutorial === CARDS_TUTORIAL.length - 1 ? "Entendido!" : "Próximo"}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={comecarPartida}
            className="group flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:opacity-95"
          >
            <Gamepad2 className="size-6 transition group-hover:scale-110" />
            <span>Pressionar [ A / X ] para Iniciar Partida</span>
          </button>
          <button
            type="button"
            onClick={comecarPartida}
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition"
          >
            Pular tutorial e começar direto
          </button>
        </div>
      </main>
    );
  }

  if (fase === "fim") {
    return (
      <TelaFinalCampeao
        jogadores={jogadores}
        reiniciar={reiniciar}
        dispararConfetes={dispararConfetesVitoria}
        volume={volume}
        mutado={mutado}
        onVolumeChange={(v) => {
          setVolume(v);
          if (mutado && v > 0) setMutado(false);
        }}
        onToggleMute={() => setMutado((m) => !m)}
      />
    );
  }

  // ==================== TELA 3 & 4: JOGO PRINCIPAL (PERGUNTA SIMULTÂNEA & REVELAÇÃO) ====================
  return (
    <main className="min-h-screen w-full px-4 pb-10 pt-4 md:px-6 md:pb-12 md:pt-5">
      <ControleAudio
        volume={volume}
        mutado={mutado}
        onVolumeChange={(v) => {
          setVolume(v);
          if (mutado && v > 0) setMutado(false);
        }}
        onToggleMute={() => setMutado((m) => !m)}
      />

      {/* Cabeçalho do Tabuleiro */}
      <header className="mx-auto flex max-w-[1500px] flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Jogo da Vida: Escolhas Reais
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Multiplayer Simultâneo</h1>
          </div>
        </div>

        {/* Indicador de Fases do Tabuleiro */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
              faseMapaAtual === 1
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                : "bg-muted/50 text-muted-foreground border-transparent opacity-60"
            }`}
          >
            <span>Fase 1: Fácil</span>
            <span className="text-[10px] opacity-80">(1-6)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
              faseMapaAtual === 2
                ? "bg-orange-500/20 text-orange-400 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                : "bg-muted/50 text-muted-foreground border-transparent opacity-60"
            }`}
          >
            <span>Fase 2: Médio</span>
            <span className="text-[10px] opacity-80">(7-14)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
              faseMapaAtual === 3
                ? "bg-purple-500/20 text-purple-400 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                : "bg-muted/50 text-muted-foreground border-transparent opacity-60"
            }`}
          >
            <span>Fase 3: Difícil</span>
            <span className="text-[10px] opacity-80">(15-22)</span>
          </div>
        </div>
      </header>

      {/* Grid Principal: Tabuleiro Refinado + Painel de Pergunta Simultânea */}
      <div className="mx-auto mt-4 grid max-w-[1500px] items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.9fr)]">
        {/* LADO ESQUERDO: TABULEIRO MODERNO DE 22 CASAS */}
        <div className="flex flex-col gap-4">
          <TabuleiroModerno jogadores={jogadores} />

          {/* Status dos Jogadores (Barras de Vida e Rede de Apoio) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {jogadores.map((j) => {
              const precisaApoio = emCritico(j) && !j.usouApoio;
              return (
                <div
                  key={j.id}
                  className={`rounded-xl border p-3.5 transition-all bg-card/70 backdrop-blur-sm ${j.cor.border} ${j.cor.glow}`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className={`size-7 rounded-full flex items-center justify-center text-sm ${j.cor.bgLight} border ${j.cor.border}`}>
                        {GENEROS_CONFIG[j.genero].avatar}
                      </span>
                      <div>
                        <p className="font-bold text-xs text-foreground leading-tight">{j.nome}</p>
                        <p className={`text-[10px] font-semibold ${j.cor.text}`}>{GENEROS_CONFIG[j.genero].label}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                      Casa {j.pos + 1}/22
                    </span>
                  </div>

                  {/* Barras de Atributos */}
                  <div className="mt-2.5 space-y-1.5">
                    <BarraAtributo nome="Saúde" valor={j.saude} cor="bg-emerald-500" Icon={HeartPulse} />
                    <BarraAtributo nome="Dinheiro" valor={j.dinheiro} cor="bg-yellow-500" Icon={CircleDollarSign} />
                    <BarraAtributo nome="Família" valor={j.familia} cor="bg-blue-500" Icon={Users} />
                    <BarraAtributo nome="Consciência" valor={j.consciencia} cor="bg-purple-500" Icon={Brain} />
                  </div>

                  {/* Alerta de Apoio */}
                  {precisaApoio && (
                    <button
                      type="button"
                      onClick={() => acionarRedeApoio(j.id)}
                      className="mt-2.5 w-full rounded-md border border-destructive/50 bg-destructive/15 px-2 py-1.5 text-[11px] font-bold text-destructive hover:bg-destructive/25 transition flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <LifeBuoy className="size-3.5" />
                      <span>🆘 Acionar Rede de Apoio (+30)</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LADO DIREITO: ÁREA DE PERGUNTA SIMULTÂNEA / REVELAÇÃO */}
        <div className="panel flex flex-col min-h-[520px] p-5 md:p-6 border-2 border-primary/20 shadow-xl">
          {fase === "pergunta_simultanea" && perguntaAtual && (
            <div className="flex flex-col flex-1">
              {/* Badge de Tema e Dificuldade */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                  <Sparkles className="size-3.5" />
                  <span>Fase {perguntaAtual.fase} • {perguntaAtual.dificuldade}</span>
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tema: {perguntaAtual.tema}
                </span>
              </div>

              {/* Enunciado */}
              <h2 className="mt-4 text-lg md:text-xl font-bold leading-snug text-foreground">
                {perguntaAtual.enunciado}
              </h2>

              {/* Status Simultâneo dos Jogadores (Prontos ou Pensando) */}
              <div className="mt-4 rounded-xl border border-border/80 bg-secondary/50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center">
                  Status das Respostas em Tempo Real:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {jogadores.map((j) => {
                    const respondeu = respostasRodada[j.id] !== undefined;
                    return (
                      <div
                        key={j.id}
                        className={`flex flex-col items-center justify-center rounded-lg p-2 border transition-all ${
                          respondeu
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm"
                            : `${j.cor.border} ${j.cor.bgLight} text-muted-foreground`
                        }`}
                      >
                        <span className="text-base">{GENEROS_CONFIG[j.genero].avatar}</span>
                        <span className="text-[11px] font-bold truncate max-w-[80px]">{j.nome}</span>
                        <span
                          className={`mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            respondeu ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground animate-pulse"
                          }`}
                        >
                          {respondeu ? "PRONTO ✓" : "PENSANDO..."}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4 Alternativas de Resposta */}
              <div className="mt-5 space-y-2.5 flex-1">
                {perguntaAtual.opcoes.map((op, idx) => {
                  const botoesGuia = ["[ A / ✕ ]", "[ B / ◯ ]", "[ X / ▢ ]", "[ Y / △ ]"];
                  return (
                    <div
                      key={op.letra}
                      className="group flex items-center justify-between rounded-xl border border-border bg-secondary/80 p-3 text-sm text-foreground transition-all hover:border-primary/50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/30 font-display font-bold text-primary">
                          {op.letra}
                        </span>
                        <p className="leading-snug text-xs md:text-sm pt-0.5">{op.texto}</p>
                      </div>
                      <span className="ml-3 shrink-0 rounded bg-muted/80 px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground group-hover:text-primary">
                        {botoesGuia[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Controles de Clique / Revelação */}
              <div className="mt-6 border-t border-border pt-4">
                {todosResponderam ? (
                  <button
                    type="button"
                    onClick={revelarRespostas}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-display text-lg tracking-wider text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] hover:bg-emerald-500 animate-bounce"
                  >
                    ✨ Todos Prontos! [ A / Revelar Respostas ]
                  </button>
                ) : (
                  <div className="space-y-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      Pressione a alternativa correspondente no seu controle ou clique no seu nome abaixo:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {jogadores.map((j) => (
                        <div key={j.id} className="flex items-center gap-1 bg-secondary rounded-lg px-2 py-1 border border-border">
                          <span className="text-xs font-bold">{j.nome}:</span>
                          {(["A", "B", "C", "D"] as const).map((letra, opIdx) => {
                            const selecionada = respostasRodada[j.id] === opIdx;
                            return (
                              <button
                                key={letra}
                                type="button"
                                onClick={() => responderSimultaneo(j.id, opIdx as 0 | 1 | 2 | 3)}
                                className={`size-6 rounded text-[10px] font-bold transition ${
                                  selecionada
                                    ? "bg-emerald-500 text-white shadow"
                                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-white"
                                }`}
                              >
                                {letra}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FASE DE REVELAÇÃO GERAL */}
          {fase === "revelacao" && perguntaAtual && (
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Brain className="size-4" />
                <span>Revelação Geral das Respostas</span>
              </div>

              <h2 className="mt-3 text-base md:text-lg font-bold text-foreground">
                {perguntaAtual.enunciado}
              </h2>

              {/* Explicação da Escolha Consciente */}
              {(() => {
                const opcaoCorreta = perguntaAtual.opcoes.find((o) => o.correta);
                return (
                  opcaoCorreta && (
                    <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        ✨ Escolha Consciente ({opcaoCorreta.letra}):
                      </p>
                      <p className="mt-1 text-xs text-foreground font-medium">{opcaoCorreta.texto}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                        {opcaoCorreta.feedback}
                      </p>
                    </div>
                  )
                );
              })()}

              {/* Desempenho de Cada Jogador */}
              <div className="mt-4 space-y-2.5 flex-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Decisão de Cada Participante:
                </p>
                {jogadores.map((j) => {
                  const idxEscolhida = respostasRodada[j.id];
                  const opcao = idxEscolhida !== undefined ? perguntaAtual.opcoes[idxEscolhida] : null;
                  const acertou = opcao?.correta;

                  return (
                    <div
                      key={j.id}
                      className={`flex items-center justify-between rounded-xl border p-3 ${
                        acertou
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-destructive/40 bg-destructive/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`size-8 rounded-full flex items-center justify-center text-sm ${j.cor.bgLight} border ${j.cor.border}`}>
                          {GENEROS_CONFIG[j.genero].avatar}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-foreground">{j.nome}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Escolheu: <span className="font-bold">{opcao ? `[${opcao.letra}]` : "Nenhuma"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            acertou ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                          }`}
                        >
                          {acertou ? "Avança +2 Casas ✨" : "+0 Casas ⚠️"}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          Posição: Casa {j.pos + 1}/22
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botão de Próxima Rodada */}
              <div className="mt-5 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={proximaRodada}
                  className="w-full rounded-xl bg-primary px-4 py-3.5 font-display text-lg tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:opacity-95"
                >
                  {jogadores.some((j) => j.pos >= TABULEIRO.length - 1)
                    ? "🏆 Ver Grande Campeão [ A / Continuar ]"
                    : "Próxima Pergunta [ A / Continuar ]"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Alerta da Rede de Apoio */}
      {modalApoio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="panel max-w-md w-full p-6 text-center border-2 border-emerald-500 shadow-2xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <LifeBuoy className="size-8" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-foreground">Rede de Apoio Acionada!</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{modalApoio}</p>
            <button
              type="button"
              onClick={() => setModalApoio(null)}
              className="mt-5 w-full rounded-lg bg-primary py-2.5 font-bold text-sm text-primary-foreground transition hover:opacity-90"
            >
              Compreendido! Continuar Jogo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ==================== COMPONENTE: TABULEIRO MODERNO (22 CASAS) ====================
function TabuleiroModerno({ jogadores }: { jogadores: Jogador[] }) {
  return (
    <section aria-label="Tabuleiro da Vida" className="panel p-4 md:p-5 border-2 border-border/80 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <h2 className="text-base md:text-lg font-bold text-foreground">Trilha das Escolhas Reais</h2>
          <p className="text-xs text-muted-foreground">Avance pelas 22 casas através de decisões conscientes</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <span>Partida: Casa 1</span>
          <span>➔</span>
          <span className="text-primary font-bold">Futuro: Casa 22</span>
        </div>
      </div>

      {/* Grid de 22 Casas em Trilha Serpentine / Modular */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-2">
        {TABULEIRO.map((casa, idx) => {
          const jogadoresAqui = jogadores.filter((j) => j.pos === idx);
          const corBordaFase =
            casa.fase === 1
              ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500"
              : casa.fase === 2
              ? "border-orange-500/40 bg-orange-500/5 hover:border-orange-500"
              : "border-purple-500/40 bg-purple-500/5 hover:border-purple-500";

          return (
            <div
              key={casa.numero}
              className={`relative flex min-h-[92px] flex-col justify-between rounded-xl border-2 p-2 transition-all ${corBordaFase} ${
                jogadoresAqui.length ? "ring-2 ring-primary shadow-md" : ""
              }`}
            >
              {/* Top: Número e Ícone */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">
                  #{casa.numero}
                </span>
                <span className="text-muted-foreground/80">
                  {renderIconeCasa(casa.icone, "size-3.5")}
                </span>
              </div>

              {/* Rótulo da Casa */}
              <div className="my-1">
                <p className="font-bold text-[11px] leading-tight text-foreground truncate" title={casa.rotulo}>
                  {casa.rotulo}
                </p>
                <p className="text-[9px] text-muted-foreground truncate">{casa.subtitulo}</p>
              </div>

              {/* Pinos dos Jogadores Presentes na Casa */}
              <div className="flex flex-wrap items-center gap-1 min-h-[22px]">
                {jogadoresAqui.map((j) => (
                  <span
                    key={j.id}
                    title={`${j.nome} (${GENEROS_CONFIG[j.genero].label})`}
                    className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md transition-transform hover:scale-125 ${j.cor.bgSolid} border border-white`}
                  >
                    {GENEROS_CONFIG[j.genero].avatar}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Barra de atributo individual com indicador crítico
function BarraAtributo({
  nome,
  valor,
  cor,
  Icon,
}: {
  nome: string;
  valor: number;
  cor: string;
  Icon: typeof HeartPulse;
}) {
  const critico = valor < ALERTA;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className={`size-3 shrink-0 ${critico ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${critico ? "bg-destructive animate-pulse" : cor}`}
          style={{ width: `${valor}%` }}
        />
      </div>
      <span className={`w-6 text-right font-mono text-[10px] ${critico ? "font-bold text-destructive" : "text-muted-foreground"}`}>
        {valor}
      </span>
    </div>
  );
}

// ==================== TELA 5: ENCERRAMENTO & GRANDE CAMPEÃO ====================
function TelaFinalCampeao({
  jogadores,
  reiniciar,
  dispararConfetes,
  volume,
  mutado,
  onVolumeChange,
  onToggleMute,
}: {
  jogadores: Jogador[];
  reiniciar: () => void;
  dispararConfetes: () => void;
  volume: number;
  mutado: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}) {
  const ranking = [...jogadores].sort((a, b) => {
    const scoreA = calcularPontuacaoTotal(a);
    const scoreB = calcularPontuacaoTotal(b);
    if (scoreB !== scoreA) return scoreB - scoreA;
    if (b.consciencia !== a.consciencia) return b.consciencia - a.consciencia;
    return b.saude - a.saude;
  });

  const campeao = ranking[0] || jogadores[0]!;
  const pontuacaoCampeao = calcularPontuacaoTotal(campeao);
  const atributoForteCampeao = obterAtributoMaisForte(campeao);
  const finalCampeao = calcularFinal(campeao);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 md:py-12">
      <ControleAudio
        volume={volume}
        mutado={mutado}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Feira de Ciências • Grande Encerramento
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-display text-foreground">
          O Futuro das Escolhas Reais
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          A vida é moldada pelas decisões diárias. Veja quem construiu a trajetória mais equilibrada e consciente!
        </p>
        <div className="mt-3">
          <button
            type="button"
            onClick={dispararConfetes}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/25 active:scale-95 shadow-sm"
          >
            <Sparkles className="size-3.5 text-yellow-400" />
            <span>Soltar confetes novamente 🎊</span>
          </button>
        </div>
      </div>

      {/* Card Dourado do Campeão */}
      <div className={`relative mt-8 overflow-hidden rounded-2xl border-2 p-6 md:p-8 text-center shadow-2xl bg-card/80 backdrop-blur-md ${campeao.cor.border} ${campeao.cor.glow}`}>
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-400/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-300 shadow-sm">
          <Sparkles className="size-4 animate-pulse text-yellow-400" />
          Grande Campeão da Partida
          <Sparkles className="size-4 animate-pulse text-yellow-400" />
        </div>

        <div className="mx-auto mt-5 mb-3 flex size-20 items-center justify-center rounded-full border-2 border-yellow-400/80 bg-gradient-to-tr from-yellow-500/30 to-yellow-300/30 shadow-[0_0_25px_rgba(250,204,21,0.4)]">
          <Trophy className="size-11 text-yellow-400 drop-shadow" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {GENEROS_CONFIG[campeao.genero].avatar} {GENEROS_CONFIG[campeao.genero].label}
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-1">
          {campeao.nome}
        </h2>

        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 border border-border">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pontuação Total:</span>
          <span className="font-mono text-2xl font-bold text-primary">{pontuacaoCampeao}</span>
          <span className="text-xs text-muted-foreground">/ 400 pts</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold">
          <span className="text-emerald-400">✨ {campeao.acertos} Escolhas Conscientes</span>
          <span className="text-muted-foreground">•</span>
          <span>Atributo Destaque: <strong className={atributoForteCampeao.cor}>{atributoForteCampeao.nome} ({atributoForteCampeao.valor})</strong></span>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-secondary/50 p-4 max-w-xl mx-auto text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{finalCampeao.titulo}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{finalCampeao.descricao}</p>
        </div>
      </div>

      {/* Ranking Completo dos Demais Participantes */}
      <div className="mt-8 panel p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Classificação Geral da Partida</h3>
        <div className="space-y-3">
          {ranking.map((j, index) => (
            <div
              key={j.id}
              className={`flex items-center justify-between rounded-xl border p-3.5 ${
                index === 0 ? "border-yellow-400/50 bg-yellow-400/10" : "border-border bg-secondary/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-muted-foreground w-6 text-center">
                  #{index + 1}
                </span>
                <span className={`size-8 rounded-full flex items-center justify-center text-sm ${j.cor.bgLight} border ${j.cor.border}`}>
                  {GENEROS_CONFIG[j.genero].avatar}
                </span>
                <div>
                  <p className="font-bold text-sm text-foreground">{j.nome}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Casa {j.pos + 1}/22 • {j.acertos} acertos
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-lg font-bold text-foreground">
                  {calcularPontuacaoTotal(j)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">pts</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={reiniciar}
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display text-lg text-primary-foreground shadow-lg shadow-primary/25 transition hover:scale-105 active:scale-95"
          >
            <RefreshCw className="size-5" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      </div>
    </main>
  );
}

// ==================== CONTROLE DISCRETO DE ÁUDIO ====================
function ControleAudio({
  volume,
  mutado,
  onVolumeChange,
  onToggleMute,
}: {
  volume: number;
  mutado: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}) {
  const [expandido, setExpandido] = useState(false);

  return (
    <aside
      aria-label="Controle de áudio"
      className="fixed top-3 right-3 z-50 flex items-center gap-2 rounded-full border border-border/80 bg-card/95 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all hover:border-primary/50"
      onMouseEnter={() => setExpandido(true)}
      onMouseLeave={() => setExpandido(false)}
    >
      <button
        type="button"
        onClick={onToggleMute}
        title={mutado || volume === 0 ? "Ativar som" : "Desativar som (mutar)"}
        className="flex size-7 items-center justify-center rounded-full text-foreground/80 hover:bg-secondary hover:text-foreground transition active:scale-95"
      >
        {mutado || volume === 0 ? (
          <VolumeX className="size-4 text-destructive" />
        ) : volume < 0.5 ? (
          <Volume1 className="size-4 text-primary" />
        ) : (
          <Volume2 className="size-4 text-primary" />
        )}
      </button>

      <div
        className={`flex items-center gap-2 transition-all duration-200 overflow-hidden ${
          expandido ? "w-28 opacity-100" : "w-0 sm:w-24 opacity-0 sm:opacity-100"
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={mutado ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          aria-label="Volume geral"
          className="h-1.5 w-16 cursor-pointer rounded-lg bg-muted accent-primary"
          title={`Volume: ${Math.round((mutado ? 0 : volume) * 100)}%`}
        />
        <span className="w-6 text-right font-mono text-[10px] text-muted-foreground select-none">
          {mutado ? "0%" : `${Math.round(volume * 100)}%`}
        </span>
      </div>
    </aside>
  );
}
