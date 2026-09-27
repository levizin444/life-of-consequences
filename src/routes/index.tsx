import confetti from "canvas-confetti";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Dices,
  Gamepad2,
  HeartPulse,
  Home,
  LifeBuoy,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
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
  type Efeito,
  type Opcao,
  type Pergunta,
} from "@/lib/game-data";
import somDado from "@/assets/dado-rolando.mp3.asset.json";
import somPasso from "@/assets/passo-peca.mp3.asset.json";
import { useGamepad } from "@/hooks/use-gamepad";

const DURACAO_DADO = 1900;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jogo da Vida: Escolhas Reais — Drogas e Apostas" },
      {
        name: "description",
        content:
          "Jogo de tabuleiro digital para 2 a 4 jogadores sobre prevenção ao vício em drogas e em casas de aposta. Responda, avance e descubra seu final.",
      },
      { property: "og:title", content: "Jogo da Vida: Escolhas Reais" },
      {
        property: "og:description",
        content:
          "De 2 a 4 jogadores, perguntas reais sobre drogas e apostas, e finais diferentes para cada escolha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Jogo,
});

type Jogador = {
  id: number;
  nome: string;
  cor: string;
  pos: number;
  saude: number;
  dinheiro: number;
  familia: number;
  consciencia: number;
  terminou: boolean;
  usouApoio: boolean;
  esteveCritico: boolean;
  perdaRisco: number;
};

type Fase =
  | "setup"
  | "tutorial"
  | "rolar"
  | "arremesso"
  | "rolando"
  | "movendo"
  | "pergunta"
  | "resultado"
  | "fim";

const CARDS_TUTORIAL = [
  {
    numero: 1,
    tag: "O OBJETIVO DO JOGO",
    titulo: "O Caminho das Escolhas",
    texto:
      "Você e seus amigos percorrerão a jornada da vida. A cada casa, perguntas reais sobre apostas, drogas e dilemas do dia a dia testarão suas atitudes. Cada decisão muda o seu destino!",
    icone: Target,
    corTag: "text-primary bg-primary/10 border-primary/20",
    corIcone: "text-primary",
  },
  {
    numero: 2,
    tag: "OS 4 PILARES DA VIDA",
    titulo: "Mantenha o Equilíbrio",
    texto:
      "Suas escolhas alteram 4 atributos essenciais: Saúde, Dinheiro, Família e Consciência. Se algum deles cair para menos de 30%, a barra entrará em ALERTA VERMELHO. Não deixe seus indicadores zerarem!",
    icone: BarChart3,
    corTag: "text-warning bg-warning/10 border-warning/20",
    corIcone: "text-warning",
  },
  {
    numero: 3,
    tag: "LANÇANDO O DADO",
    titulo: "Minigame de Força",
    texto:
      "Na sua vez, SEGURE o botão [ X / ◽ ] (ou barra de espaço) para ver a barra de força subir e descer. SOLTE no momento certo para arremessar o dado e avançar pelo mapa!",
    icone: Dices,
    corTag: "text-accent bg-accent/10 border-accent/20",
    corIcone: "text-accent",
  },
  {
    numero: 4,
    tag: "REDE DE APOIO (REDE DE EMERGÊNCIA)",
    titulo: "Pedindo Ajuda quando Precisa",
    texto:
      "Está em perigo? Se algum atributo estiver abaixo de 25%, pressione [ Y / △ ] no seu controle. Você usará o seu turno para pedir ajuda (Rede de Apoio), recuperando pontos vitais! (Uso único por jogador).",
    icone: LifeBuoy,
    corTag: "text-destructive bg-destructive/10 border-destructive/20",
    corIcone: "text-destructive",
  },
  {
    numero: 5,
    tag: "O CAMPEÃO E AS CONQUISTAS",
    titulo: "Chegue ao Futuro!",
    texto:
      "A partida termina quando todos chegarem à casa 'Futuro'. No final, quem somar a maior quantidade total de atributos será coroado o Grande Campeão e receberá um prêmio!",
    icone: Trophy,
    corTag: "text-warning bg-warning/10 border-warning/20",
    corIcone: "text-warning",
  },
];

const CORES = ["bg-p1", "bg-p2", "bg-p3", "bg-p4"];
const CORES_TEXTO = ["text-p1", "text-p2", "text-p3", "text-p4"];
const PADRAO = ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"];

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
    perdaRisco:
      j.perdaRisco +
      Object.values(e).reduce<number>((s, v) => s + (typeof v === "number" && v < 0 ? -v : 0), 0),
  };
  return { ...novo, esteveCritico: novo.esteveCritico || emCritico(novo) };
}

function novoJogador(id: number, nome: string): Jogador {
  return {
    id,
    nome,
    cor: CORES[id]!,
    pos: 0,
    saude: 70,
    dinheiro: 60,
    familia: 70,
    consciencia: 50,
    terminou: false,
    usouApoio: false,
    esteveCritico: false,
    perdaRisco: 0,
  };
}

function calcularPontuacaoTotal(j: Jogador): number {
  return j.saude + j.dinheiro + j.familia + j.consciencia;
}

function obterAtributoMaisForte(j: Jogador) {
  const atributos = [
    { nome: "Saúde", chave: "saude" as const, valor: j.saude, cor: "text-success", Icon: HeartPulse },
    { nome: "Dinheiro", chave: "dinheiro" as const, valor: j.dinheiro, cor: "text-warning", Icon: CircleDollarSign },
    { nome: "Família", chave: "familia" as const, valor: j.familia, cor: "text-p3", Icon: Users },
    { nome: "Consciência", chave: "consciencia" as const, valor: j.consciencia, cor: "text-primary", Icon: Brain },
  ];
  return atributos.reduce((maior, a) => (a.valor > maior.valor ? a : maior), atributos[0]!);
}

function Jogo() {
  const [fase, setFase] = useState<Fase>("setup");
  const [cardTutorial, setCardTutorial] = useState(0);
  const [quantidade, setQuantidade] = useState(4);
  const [nomes, setNomes] = useState<string[]>(["", "", "", ""]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [vez, setVez] = useState(0);
  const [dado, setDado] = useState<number | null>(null);
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const [usadas, setUsadas] = useState<number[]>([]);
  const [resultado, setResultado] = useState<{ titulo: string; texto: string; efeito: Efeito } | null>(
    null,
  );
  const [flutuante, setFlutuante] = useState<{ id: number; efeito: Efeito; key: number } | null>(null);
  const [modalApoio, setModalApoio] = useState<string | null>(null);
  const intervaloDado = useRef<ReturnType<typeof setInterval> | null>(null);
  const esperaDado = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esperasMovimento = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioDado = useRef<HTMLAudioElement | null>(null);
  const fadeDado = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPasso = useRef<HTMLAudioElement | null>(null);
  const [foco, setFoco] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [mutado, setMutado] = useState(false);
  const volumeEfetivo = mutado ? 0 : volume;

  const forcaBarra = useRef<HTMLDivElement | null>(null);
  const forcaPercento = useRef<HTMLParagraphElement | null>(null);
  const [segurando, setSegurando] = useState(false);

  const audioTensao = useRef<HTMLAudioElement | null>(null);
  const audioFinal = useRef<HTMLAudioElement | null>(null);

  function tocarSomPasso() {
    if (typeof Audio === "undefined" || volumeEfetivo <= 0) return;
    const url = somPasso.url || "/passo-peca.mp3";
    if (!audioPasso.current) audioPasso.current = new Audio(url);
    const a = audioPasso.current.cloneNode() as HTMLAudioElement;
    a.volume = Math.min(1, 0.8 * volumeEfetivo);
    void a.play().catch((err) => console.warn("Erro ao reproduzir som do passo:", err));
  }

  function tocarSomDado() {
    if (typeof Audio === "undefined" || volumeEfetivo <= 0) return;
    const url = somDado.url || "/dado-rolando.mp3";
    if (!audioDado.current) audioDado.current = new Audio(url);
    const a = audioDado.current;
    if (fadeDado.current) {
      clearInterval(fadeDado.current);
      fadeDado.current = null;
    }
    a.pause();
    a.currentTime = 0;
    a.volume = Math.min(1, 1 * volumeEfetivo);
    void a.play().catch((err) => console.warn("Erro ao reproduzir som do dado:", err));
  }

  function pararSomDado() {
    const a = audioDado.current;
    if (!a) return;
    if (fadeDado.current) clearInterval(fadeDado.current);
    fadeDado.current = setInterval(() => {
      const v = a.volume - 0.15;
      if (v <= 0) {
        a.pause();
        a.currentTime = 0;
        a.volume = 1;
        if (fadeDado.current) clearInterval(fadeDado.current);
        fadeDado.current = null;
      } else {
        a.volume = v;
      }
    }, 25);
  }

  function tocarSomNavegacao() {
    if (typeof Audio === "undefined" || volumeEfetivo <= 0) return;
    const a = new Audio("/botao-navegacao.mp3");
    a.volume = Math.min(1, 0.6 * volumeEfetivo);
    void a.play().catch(() => undefined);
  }

  function tocarSomTensao() {
    if (typeof Audio === "undefined" || volumeEfetivo <= 0) return;
    if (!audioTensao.current) {
      audioTensao.current = new Audio("/audio-barradodado.mp3");
      audioTensao.current.loop = true;
    }
    const a = audioTensao.current;
    a.volume = Math.min(1, 0.75 * volumeEfetivo);
    if (a.paused) {
      a.currentTime = 0;
      void a.play().catch(() => undefined);
    }
  }

  function pararSomTensao() {
    const a = audioTensao.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
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

  const atual = jogadores[vez]!;

  useEffect(() => {
    return () => {
      if (intervaloDado.current) clearInterval(intervaloDado.current);
      if (esperaDado.current) clearTimeout(esperaDado.current);
      esperasMovimento.current.forEach(clearTimeout);
      if (fadeDado.current) clearInterval(fadeDado.current);
      audioDado.current?.pause();
      pararSomTensao();
      pararSomFinal();
    };
  }, []);

  function dispararConfetesVitoria() {
    if (typeof window === "undefined") return;

    // Rajada 1: Lado esquerdo explodindo em direção ao centro
    confetti({
      particleCount: 65,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.75 },
      colors: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"],
      disableForReducedMotion: true,
    });

    // Rajada 2: Lado direito explodindo em direção ao centro (após 250ms)
    setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.75 },
        colors: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"],
        disableForReducedMotion: true,
      });
    }, 250);

    // Rajada 3: Grande explosão central festiva (após 500ms)
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#ffd700", "#ffaa00", "#00f0ff", "#a855f7", "#22c55e"],
        disableForReducedMotion: true,
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
    if (audioTensao.current) {
      audioTensao.current.volume = Math.min(1, 0.75 * volumeEfetivo);
    }
  }, [volumeEfetivo, fase]);

  function mostrarDeltas(id: number, efeito: Efeito) {
    const key = Date.now();
    setFlutuante({ id, efeito, key });
    setTimeout(() => setFlutuante((f) => (f && f.key === key ? null : f)), 1400);
  }

  function buscarAjuda() {
    const menor = (["saude", "dinheiro", "familia", "consciencia"] as const).reduce((a, b) =>
      atual[a] <= atual[b] ? a : b,
    );
    const efeito: Efeito = { [menor]: 30 };
    const lista = jogadores.map((j) => {
      if (j.id !== atual.id) return j;
      const atualizado: Jogador = { ...j, usouApoio: true, esteveCritico: true };
      atualizado[menor] = clamp(j[menor] + 30);
      return atualizado;
    });
    setJogadores(lista);
    mostrarDeltas(atual.id, efeito);
    setModalApoio(
      "Você buscou apoio na sua rede de contatos (família/profissionais). Pedir ajuda não é fraqueza: é o passo mais forte de quem quer recomeçar.",
    );
  }

  function fecharApoio() {
    setModalApoio(null);
    proximoTurno(jogadores);
  }

  function iniciar() {
    setJogadores(
      nomes.slice(0, quantidade).map((n, i) => novoJogador(i, n.trim() || PADRAO[i]!)),
    );
    setVez(0);
    setUsadas([]);
    setDado(null);
    setResultado(null);
    setCardTutorial(0);
    setFase("tutorial");
  }

  function tutorialAnterior() {
    setCardTutorial((c) => {
      const novo = Math.max(0, c - 1);
      if (novo !== c) tocarSomNavegacao();
      return novo;
    });
  }

  function tutorialProximo() {
    setCardTutorial((c) => {
      if (c >= CARDS_TUTORIAL.length - 1) {
        comecarPartida();
        return c;
      }
      tocarSomNavegacao();
      return c + 1;
    });
  }

  function comecarPartida() {
    setFase("rolar");
  }

  function sortearPergunta(): Pergunta {
    const livres = PERGUNTAS.filter((p) => !usadas.includes(p.id));
    const pool = livres.length ? livres : PERGUNTAS;
    const p = pool[Math.floor(Math.random() * pool.length)]!;
    setUsadas((u) => (livres.length ? [...u, p.id] : [p.id]));
    return p;
  }

  function proximoTurno(lista: Jogador[]) {
    if (lista.every((j) => j.terminou)) {
      setFase("fim");
      return;
    }
    let i = vez;
    do {
      i = (i + 1) % lista.length;
    } while (lista[i]!.terminou);
    setVez(i);
    setDado(null);
    setResultado(null);
    setFase("rolar");
  }

  function concluirMovimento(destino: number, lista: Jogador[]) {
    const casa = TABULEIRO[destino]!;

    if (casa.tipo === "pergunta") {
      setPergunta(sortearPergunta());
      setFase("pergunta");
      return;
    }
    if (casa.tipo === "final") {
      const finalizados = lista.map((j) => (j.id === atual.id ? { ...j, terminou: true } : j));
      setJogadores(finalizados);
      setResultado({
        titulo: "Chegada",
        texto: `${atual.nome} chegou ao fim do caminho. O final será revelado no encerramento.`,
        efeito: {},
      });
      setFase("resultado");
      return;
    }
    setResultado({ titulo: "Início", texto: "Você continua no ponto de partida.", efeito: {} });
    setFase("resultado");
  }

  function concluirRolagem(valor: number) {
    setDado(valor);
    setFase("movendo");
    const origem = atual.pos;
    const destino = Math.min(origem + valor, TABULEIRO.length - 1);
    const passos = destino - origem;

    esperasMovimento.current.forEach(clearTimeout);
    esperasMovimento.current = [];

    for (let passo = 1; passo <= passos; passo += 1) {
      const novaPosicao = origem + passo;
      const espera = setTimeout(() => {
        tocarSomPasso();
        setJogadores((listaAtual) =>
          listaAtual.map((j) => (j.id === atual.id ? { ...j, pos: novaPosicao } : j)),
        );
      }, passo * 320);
      esperasMovimento.current.push(espera);
    }

    const esperaFinal = setTimeout(() => {
      const lista = jogadores.map((j) => (j.id === atual.id ? { ...j, pos: destino } : j));
      setJogadores(lista);
      concluirMovimento(destino, lista);
      esperasMovimento.current = [];
    }, passos * 320 + 420);
    esperasMovimento.current.push(esperaFinal);
  }

  function abrirArremesso() {
    if (fase !== "rolar") return;
    setSegurando(false);
    setFase("arremesso");
  }

  function soltarForca() {
    if (fase !== "arremesso" || !segurando) return;
    setSegurando(false);
    pararSomTensao();
    rolar();
  }

  const ajudaDisponivel = Boolean(atual) && !atual.usouApoio && emCritico(atual);

  function rolar() {
    if (fase !== "rolar" && fase !== "arremesso") return;
    const valorFinal = 1 + Math.floor(Math.random() * 6);
    setFase("rolando");
    setDado(1 + Math.floor(Math.random() * 6));
    tocarSomDado();

    intervaloDado.current = setInterval(() => {
      setDado(1 + Math.floor(Math.random() * 6));
    }, 90);

    esperaDado.current = setTimeout(() => {
      if (intervaloDado.current) clearInterval(intervaloDado.current);
      intervaloDado.current = null;
      pararSomDado();
      concluirRolagem(valorFinal);
    }, DURACAO_DADO);
  }

  function responder(op: Opcao) {
    const lista = jogadores.map((j) => (j.id === atual.id ? aplicar(j, op.efeito) : j));
    setJogadores(lista);
    mostrarDeltas(atual.id, op.efeito);

    const somaEfeitos = Object.values(op.efeito).reduce<number>(
      (acc, v) => acc + (typeof v === "number" ? v : 0),
      0,
    );
    if (somaEfeitos > 0) {
      tocarSomRespostaBoa();
    }

    setResultado({ titulo: "Consequência", texto: op.feedback, efeito: op.efeito });
    setFase("resultado");
  }

  function continuar() {
    proximoTurno(jogadores);
  }

  function reiniciar() {
    pararSomFinal();
    pararSomTensao();
    setFase("setup");
    setCardTutorial(0);
    setJogadores([]);
    setNomes(["", "", "", ""]);
    setQuantidade(4);
  }

  useEffect(() => {
    setFoco(0);
  }, [fase, vez, pergunta]);

  useEffect(() => {
    if (fase !== "arremesso" || !segurando) return;
    let frame = 0;
    const inicio = performance.now();
    const CICLO = 1500; // 0 -> 100 -> 0 em 1,5 s, movimento contínuo
    const loop = () => {
      const t = (performance.now() - inicio) % CICLO;
      const metade = CICLO / 2;
      const valor = t < metade ? (t / metade) * 100 : (1 - (t - metade) / metade) * 100;
      const v = Math.round(valor);
      if (forcaBarra.current) forcaBarra.current.style.width = `${v}%`;
      if (forcaPercento.current) forcaPercento.current.textContent = `${v}%`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      if (forcaBarra.current) forcaBarra.current.style.width = "0%";
      if (forcaPercento.current) forcaPercento.current.textContent = "0%";
    };
  }, [fase, segurando]);

  useEffect(() => {
    if (fase !== "arremesso") return;
    const down = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
      setSegurando(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      soltarForca();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [fase, segurando]);

  // SUPORTE A MÚLTIPLOS CONTROLES COM BLOQUEIO DE TURNO:
  // - Gamepad 0 = Jogador 1 (id: 0)
  // - Gamepad 1 = Jogador 2 (id: 1)
  // - Gamepad 2 = Jogador 3 (id: 2)
  // - Gamepad 3 = Jogador 4 (id: 3)
  // Bloqueio de turno: APENAS o controle do jogador ativo responde durante as fases de jogo!
  const {
    conectado: controleConectado,
    controlesConectados,
    controleAtivoConectado,
    quantidadeConectados,
  } = useGamepad({
    jogadorAtivoId: atual ? atual.id : 0,
    bloqueioTurno: fase !== "setup" && fase !== "tutorial" && fase !== "fim",
    onConfirm: () => {
      if (modalApoio) {
        fecharApoio();
        return;
      }
      if (fase === "setup") iniciar();
      else if (fase === "tutorial") comecarPartida();
      else if (fase === "rolar") abrirArremesso();
      else if (fase === "pergunta" && pergunta) {
        const op = pergunta.opcoes[foco] ?? pergunta.opcoes[0];
        if (op) responder(op);
      } else if (fase === "resultado") continuar();
      else if (fase === "fim") reiniciar();
    },
    onMove: (direcao) => {
      if (fase === "tutorial") {
        if (direcao === "esquerda" || direcao === "cima") {
          tutorialAnterior();
        } else if (direcao === "direita" || direcao === "baixo") {
          tutorialProximo();
        }
        return;
      }
      if (fase !== "pergunta" || !pergunta) return;
      const total = pergunta.opcoes.length;
      const passo = direcao === "cima" || direcao === "esquerda" ? -1 : 1;
      setFoco((f) => {
        const prox = (f + passo + total) % total;
        if (prox !== f) {
          tocarSomNavegacao();
        }
        return prox;
      });
    },
    onAjuda: () => {
      if (modalApoio || fase !== "rolar" || !ajudaDisponivel) return;
      buscarAjuda();
    },
    onForcaDown: () => {
      if (fase === "arremesso") setSegurando(true);
    },
    onForcaUp: () => {
      soltarForca();
    },
  });

  useEffect(() => {
    if (fase !== "tutorial") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        tutorialAnterior();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        tutorialProximo();
      } else if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        comecarPartida();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fase]);

  useEffect(() => {
    if (fase !== "pergunta" || !pergunta) return;
    const onKey = (e: KeyboardEvent) => {
      const total = pergunta.opcoes.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setFoco((f) => {
          const prox = (f - 1 + total) % total;
          if (prox !== f) tocarSomNavegacao();
          return prox;
        });
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setFoco((f) => {
          const prox = (f + 1) % total;
          if (prox !== f) tocarSomNavegacao();
          return prox;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fase, pergunta, volumeEfetivo]);

  if (fase === "setup") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10">
        <ControleAudio
          volume={volume}
          mutado={mutado}
          onVolumeChange={(v) => {
            setVolume(v);
            if (mutado && v > 0) setMutado(false);
          }}
          onToggleMute={() => setMutado((m) => !m)}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Feira de ciências • Prevenção
        </p>
        <h1 className="mt-3 text-5xl leading-none text-foreground">
          Jogo da Vida:
          <br />
          <span className="text-accent">Escolhas Reais</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          De dois a quatro jogadores percorrem o mesmo caminho da vida. A cada casa, uma pergunta sobre drogas
          ou casas de aposta. Suas escolhas mudam saúde, dinheiro, família e consciência — e cada um
          termina com um final diferente.
        </p>

        <div className="panel mt-8 p-5">
          <h2 className="text-2xl">Quem vai jogar?</h2>
          <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Quantidade de jogadores">
            {[2, 3, 4].map((total) => (
              <button
                key={total}
                type="button"
                onClick={() => setQuantidade(total)}
                aria-pressed={quantidade === total}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  quantidade === total
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {total} jogadores
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {nomes.slice(0, quantidade).map((n, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`size-5 shrink-0 rounded-full ${CORES[i]}`} />
                <input
                  value={n}
                  onChange={(e) =>
                    setNomes((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  placeholder={PADRAO[i]}
                  className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>

          {/* Painel informativo de comandos conectados */}
          <div className="mt-6 rounded-lg border border-border bg-secondary/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Gamepad2 className="size-4 text-primary" />
                Comandos Gamepad Conectados:
              </span>
              <span className="text-xs font-bold text-primary">
                {quantidadeConectados} de {quantidade} detectado(s)
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((slot) => {
                const ativoNoJogo = slot < quantidade;
                const conectado = controlesConectados[slot];
                return (
                  <div
                    key={slot}
                    className={`rounded-md border p-2 text-center text-xs transition ${
                      !ativoNoJogo
                        ? "opacity-30 border-dashed border-border"
                        : conectado
                        ? "border-success/60 bg-success/10 text-foreground"
                        : "border-border bg-secondary text-muted-foreground"
                    }`}
                  >
                    <p className="font-bold">Comando {slot}</p>
                    <p className="text-[10px] opacity-80">Jogador {slot + 1}</p>
                    <span
                      className={`inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded ${
                        conectado ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {conectado ? "● Conectado" : "○ Desconectado"}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2.5 text-[11px] text-muted-foreground">
              Regra de bloqueio de turno ativa: cada jogador responderá exclusivamente pelo seu comando correspondente.
            </p>
          </div>

          <button
            onClick={iniciar}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-display text-xl tracking-wide text-primary-foreground transition hover:opacity-90"
          >
            Começar partida
          </button>
        </div>

        <div className="panel mt-4 p-5 text-sm text-muted-foreground">
          <h3 className="text-xl text-foreground">Como jogar</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Na sua vez, role o dado no seu respectivo comando e avance pelo mapa.</li>
            <li>Casa de pergunta: escolha uma resposta e veja a consequência real.</li>
            <li>Se saúde, dinheiro ou família chegarem perto de zero, seu final muda.</li>
            <li>A partida acaba quando todos chegam à casa "Futuro" e o grande campeão é revelado!</li>
          </ul>
        </div>
      </main>
    );
  }

  // TELA DE TUTORIAL INTERATIVO ("COMO JOGAR")
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

        {/* Cabeçalho do Tutorial */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5" />
            <span>Guia Rápido • Como Jogar</span>
          </div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-foreground">
            Instruções da Partida
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conheça as regras essenciais antes de iniciar a jornada das escolhas.
          </p>
        </div>

        {/* Indicador de Passos / Stepper */}
        <div className="mt-6 flex items-center justify-center gap-2" aria-label="Progresso do tutorial">
          {CARDS_TUTORIAL.map((c, i) => (
            <button
              key={c.numero}
              type="button"
              onClick={() => {
                if (i !== cardTutorial) {
                  tocarSomNavegacao();
                  setCardTutorial(i);
                }
              }}
              title={`Ir para card ${c.numero}: ${c.tag}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === cardTutorial
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>

        {/* Card Principal Interativo */}
        <div className="panel relative mt-6 overflow-hidden p-6 md:p-8 text-center transition-all duration-300 border-2 border-border/80 shadow-2xl">
          {/* Top badge */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              CARD {cardAtual.numero} DE {CARDS_TUTORIAL.length}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cardAtual.corTag}`}
            >
              {cardAtual.tag}
            </span>
          </div>

          {/* Ícone Grande */}
          <div className="mx-auto mt-4 flex size-20 items-center justify-center rounded-2xl shadow-inner md:size-24 bg-secondary">
            <IconeCard className={`size-10 md:size-12 ${cardAtual.corIcone}`} />
          </div>

          {/* Título do Card */}
          <h2 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">
            {cardAtual.titulo}
          </h2>

          {/* Texto explicativo */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {cardAtual.texto}
          </p>

          {/* Elementos visuais extras específicos de cada card para enriquecer a experiência */}
          {cardAtual.numero === 2 && (
            <div className="mx-auto mt-5 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-2.5 py-1.5 text-xs font-semibold text-success justify-center">
                <HeartPulse className="size-3.5" /> Saúde
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/10 px-2.5 py-1.5 text-xs font-semibold text-warning justify-center">
                <CircleDollarSign className="size-3.5" /> Dinheiro
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-p3/30 bg-p3/10 px-2.5 py-1.5 text-xs font-semibold text-p3 justify-center">
                <Users className="size-3.5" /> Família
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary justify-center">
                <Brain className="size-3.5" /> Consciência
              </div>
            </div>
          )}

          {cardAtual.numero === 3 && (
            <div className="mx-auto mt-5 max-w-md rounded-lg border border-border bg-secondary/50 p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Força do Arremesso</span>
                <span className="font-semibold text-primary">[ X / ◽ ] Segure e Solte</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full w-3/4 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, var(--success), var(--warning) 60%, var(--destructive))",
                  }}
                />
              </div>
            </div>
          )}

          {cardAtual.numero === 4 && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive">
              <LifeBuoy className="size-4 animate-spin" />
              <span>Pressione [ Y / △ ] quando estiver em estado crítico (&lt; 25%) para recuperar +30 pontos!</span>
            </div>
          )}

          {cardAtual.numero === 5 && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-4 py-2 text-xs font-bold text-warning">
              <Trophy className="size-4" />
              <span>Soma total dos 4 atributos define o vencedor da partida!</span>
            </div>
          )}

          {/* Botões de Navegação Anterior / Próximo */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/80 pt-5">
            <button
              type="button"
              onClick={tutorialAnterior}
              disabled={cardTutorial === 0}
              className={`flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-semibold transition ${
                cardTutorial === 0
                  ? "opacity-40 cursor-not-allowed text-muted-foreground"
                  : "bg-secondary text-secondary-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              <ChevronLeft className="size-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Navegue com [ ◀ ▶ ] ou botões
            </span>

            <button
              type="button"
              onClick={tutorialProximo}
              className="flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <span>{cardTutorial === CARDS_TUTORIAL.length - 1 ? "Entendido!" : "Próximo"}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Rodapé: Botão de Iniciar com Destaque e Opção de Pular */}
        <div className="mt-6 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={comecarPartida}
            className="group flex w-full max-w-md items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:opacity-95 active:scale-[0.99]"
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

  // TELA FINAL: DESTAQUE DO CAMPEÃO DA PARTIDA
  if (fase === "fim") {
    const selos = calcularSelos(jogadores);

    // Ranking de todos os jogadores ordenado pela pontuação total
    const ranking = [...jogadores].sort((a, b) => {
      const scoreA = calcularPontuacaoTotal(a);
      const scoreB = calcularPontuacaoTotal(b);
      if (scoreB !== scoreA) return scoreB - scoreA;
      // Critérios de desempate
      if (b.consciencia !== a.consciencia) return b.consciencia - a.consciencia;
      if (b.saude !== a.saude) return b.saude - a.saude;
      return b.dinheiro - a.dinheiro;
    });

    const campeao = ranking[0]!;
    const demaisJogadores = ranking.slice(1);
    const pontuacaoCampeao = calcularPontuacaoTotal(campeao);
    const atributoForteCampeao = obterAtributoMaisForte(campeao);
    const finalCampeao = calcularFinal(campeao);
    const corFinalCampeao =
      finalCampeao.tom === "bom"
        ? "text-success"
        : finalCampeao.tom === "medio"
        ? "text-warning"
        : "text-destructive";

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
        {/* Cabeçalho */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Feira de ciências • Encerramento da partida
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl text-foreground font-display">
            Desfechos & Campeão da Partida
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            A pontuação total reflete a soma de todas as suas decisões em Saúde, Dinheiro, Família e Consciência.
          </p>
        </div>

        {/* CARD CENTRAL DE DESTAQUE: GRANDE CAMPEÃO */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-500/15 via-card to-card p-6 md:p-8 shadow-[0_0_40px_rgba(250,204,21,0.25)] text-center">
          {/* Efeito de brilho de fundo */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-yellow-400/20 blur-3xl" />

          {/* Badge superior */}
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-400/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-300 shadow-sm">
            <Sparkles className="size-4 animate-pulse text-yellow-400" />
            Grande Campeão / Destaque da Partida
            <Sparkles className="size-4 animate-pulse text-yellow-400" />
          </div>

          {/* Troféu Dourado em Destaque */}
          <div className="mx-auto mt-5 mb-3 flex size-20 items-center justify-center rounded-full border-2 border-yellow-400/80 bg-gradient-to-tr from-yellow-500/30 to-yellow-300/30 shadow-[0_0_25px_rgba(250,204,21,0.4)]">
            <Trophy className="size-11 text-yellow-400 drop-shadow" />
          </div>

          {/* Nome e Indicador do Campeão */}
          <h2 className="text-3xl md:text-4xl text-foreground font-display tracking-wide flex items-center justify-center gap-3">
            <span className={`size-4 rounded-full ${campeao.cor}`} />
            {campeao.nome}
          </h2>

          {/* Métricas Principais do Campeão */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {/* Pontuação Total */}
            <div className="rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-3.5 shadow-sm text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                Pontuação Total Acumulada
              </p>
              <p className="font-display text-4xl text-foreground mt-1">
                {pontuacaoCampeao}
                <span className="text-sm font-sans text-muted-foreground font-normal ml-1">/ 400 pts</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                (Saúde + Dinheiro + Família + Consciência)
              </p>
            </div>

            {/* Atributo Mais Forte */}
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-3.5 shadow-sm text-center flex flex-col justify-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Atributo Mais Forte
              </p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <atributoForteCampeao.Icon className={`size-6 ${atributoForteCampeao.cor}`} />
                <span className="font-display text-3xl text-foreground">{atributoForteCampeao.nome}</span>
                <span className="rounded bg-secondary px-2 py-0.5 font-sans text-xs font-bold text-foreground">
                  {atributoForteCampeao.valor} pts
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Maior equilíbrio e proteção demonstrados
              </p>
            </div>
          </div>

          {/* Desfecho Narrativo do Campeão */}
          <div className="mt-6 border-t border-border/80 pt-5 text-left max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Desfecho no Futuro:
              </span>
              <span className={`text-xl font-bold ${corFinalCampeao}`}>{finalCampeao.titulo}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{finalCampeao.descricao}</p>

            {(selos.get(campeao.id) ?? []).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(selos.get(campeao.id) ?? []).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-yellow-400/50 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Barras j={campeao} />
            </div>
          </div>
        </div>

        {/* CLASSIFICAÇÃO GERAL DOS DEMAIS JOGADORES */}
        {demaisJogadores.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl text-foreground font-display flex items-center gap-2 mb-4">
              <Award className="size-6 text-muted-foreground" />
              Classificação Geral dos Participantes
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {demaisJogadores.map((j, index) => {
                const posicao = index + 2;
                const score = calcularPontuacaoTotal(j);
                const forte = obterAtributoMaisForte(j);
                const f = calcularFinal(j);
                const cor =
                  f.tom === "bom"
                    ? "text-success"
                    : f.tom === "medio"
                    ? "text-warning"
                    : "text-destructive";

                return (
                  <div key={j.id} className="panel p-5 flex flex-col justify-between border border-border">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xl text-muted-foreground">#{posicao}</span>
                          <span className={`size-3.5 rounded-full ${j.cor}`} />
                          <span className="font-bold text-foreground text-base">{j.nome}</span>
                        </div>
                        <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-foreground">
                          {score} pts
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>Mais forte:</span>
                        <forte.Icon className={`size-3.5 ${forte.cor}`} />
                        <span className="font-semibold text-foreground">{forte.nome} ({forte.valor} pts)</span>
                      </div>

                      <h4 className={`mt-3 text-lg font-bold ${cor}`}>{f.titulo}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {f.descricao}
                      </p>

                      {(selos.get(j.id) ?? []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(selos.get(j.id) ?? []).map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60">
                      <Barras j={j} compacto />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Informações de Apoio e Prevenção Real */}
        <div className="panel mt-8 p-5 text-sm text-muted-foreground border border-border">
          <h3 className="text-xl text-foreground font-display flex items-center gap-2">
            <LifeBuoy className="size-5 text-primary" />
            Precisa de ajuda de verdade?
          </h3>
          <p className="mt-2 leading-relaxed">
            CAPS-AD e Unidades Básicas de Saúde atendem gratuitamente pelo SUS. <strong>CVV: 188 (24h)</strong>.
            Dependência de drogas ou apostas não é falta de caráter — é uma doença com tratamento e acolhimento.
          </p>
        </div>

        {/* Botão de Reinício rápido com Controle */}
        <div className="mt-6 text-center">
          <button
            onClick={reiniciar}
            className="w-full rounded-xl bg-primary px-6 py-4 font-display text-2xl text-primary-foreground transition hover:opacity-90 shadow-lg flex items-center justify-center gap-3 ring-2 ring-primary/40"
          >
            <Dices className="size-6" />
            Jogar de Novo
            <span className="rounded-md border border-primary-foreground/40 bg-primary-foreground/10 px-2.5 py-0.5 font-sans text-xs tracking-normal font-semibold">
              Pressione [A] no Controle ou Clique Aqui
            </span>
          </button>
        </div>
      </main>
    );
  }

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
      <header className="mx-auto flex max-w-[1500px] items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Jogo da vida</p>
            <h1 className="text-2xl leading-none text-foreground">Escolhas Reais</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Progresso</p>
          <p className="font-display text-xl text-foreground">
            {atual.pos + 1}<span className="text-muted-foreground">/{TABULEIRO.length}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto mt-4 grid max-w-[1500px] items-start gap-4 md:min-h-[calc(100vh-112px)] md:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.8fr)]">
        <div className="flex min-h-0 flex-col gap-3">
          <Tabuleiro jogadores={jogadores} atual={atual} />

          <section className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-4" aria-label="Status dos jogadores">
            {jogadores.map((j, i) => (
              <div
                key={j.id}
                className={`player-panel min-w-0 p-3 ${j.id === atual.id ? "player-panel-active" : ""} ${
                  j.terminou ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`size-3 shrink-0 rounded-full ${j.cor}`} />
                    <span className={`truncate text-sm font-bold ${CORES_TEXTO[i]}`}>{j.nome}</span>
                  </div>
                  <span className="shrink-0 font-display text-base text-muted-foreground">#{j.pos + 1}</span>
                </div>
                <Barras
                  j={j}
                  compacto
                  delta={flutuante && flutuante.id === j.id ? flutuante.efeito : undefined}
                  deltaKey={flutuante?.key}
                />
              </div>
            ))}
          </section>
        </div>

        <section className="question-panel flex min-h-[420px] flex-col p-5 md:min-h-0 md:p-6">
          {/* Indicação visual da rodada */}
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 shadow-sm">
            <Gamepad2 className="size-5 animate-pulse text-primary shrink-0" />
            <p className="text-sm font-bold tracking-wide text-foreground">
              Aguardando <span className={CORES_TEXTO[atual.id]}>{atual.nome}</span> fazer sua jogada
            </p>
          </div>

          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rodada atual</p>
              <h2 className={`mt-1 text-2xl ${CORES_TEXTO[atual.id]}`}>{atual.nome}</h2>
            </div>
            <div className={`flex size-12 items-center justify-center rounded-md border border-border bg-secondary ${fase === "rolando" ? "dice-rolling" : ""}`}>
              {dado ? <DiceFace valor={dado} compacto /> : <Dices className="size-6 text-primary" />}
            </div>
          </div>

          {fase === "rolar" && (
            <div className="flex flex-1 flex-col justify-center text-center">
              <Dices className="mx-auto size-14 text-primary" aria-hidden="true" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sua vez de avançar</p>
              <h2 className="mt-2 text-4xl text-foreground">Role o dado</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Cada casa do caminho traz uma nova decisão sobre drogas ou apostas.</p>
              <button
                onClick={abrirArremesso}
                className={`mt-7 w-full rounded-md bg-primary px-4 py-4 font-display text-2xl text-primary-foreground transition hover:opacity-90 ${
                  controleAtivoConectado ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""
                }`}
              >
                Rolar o dado
              </button>
              <button
                onClick={buscarAjuda}
                disabled={!ajudaDisponivel}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-60 ${
                  ajudaDisponivel
                    ? "border-accent bg-accent/15 text-accent ring-2 ring-accent/60 hover:bg-accent/25"
                    : "border-accent/60 bg-accent/10 text-accent"
                }`}
              >
                <LifeBuoy className="size-4" aria-hidden="true" />
                Buscar ajuda {atual.usouApoio ? "(já usado)" : "(1 uso)"}
                <span className="rounded border border-current px-1.5 py-0.5 font-display text-xs tracking-widest">
                  Y / △
                </span>
              </button>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Disponível quando algum atributo estiver abaixo de 25%. Gasta o turno e recupera +30 no
                atributo mais baixo.
              </p>
            </div>
          )}

          {fase === "rolando" && dado && (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center" aria-live="polite">
              <div className="dice-stage" aria-label={`Dado mostrando ${dado}`}>
                <DiceFace valor={dado} />
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dado em movimento</p>
              <h2 className="mt-2 text-4xl text-foreground">Rolando...</h2>
              <p className="mt-2 text-sm text-muted-foreground">A sorte está lançada, {atual.nome}.</p>
            </div>
          )}

          {fase === "movendo" && dado && (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center" aria-live="polite">
              <DiceFace valor={dado} />
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Resultado: {dado}</p>
              <h2 className="mt-2 text-4xl text-foreground">Avançando...</h2>
              <p className="mt-2 text-sm text-muted-foreground">{atual.nome} está percorrendo o caminho.</p>
            </div>
          )}

          {fase === "pergunta" && pergunta && (
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {pergunta.tema === "drogas" ? <HeartPulse className="size-4" /> : <CircleDollarSign className="size-4" />}
                <span>{pergunta.tema === "drogas" ? "Drogas" : "Apostas"}</span>
              </div>
              <h2 className="mt-4 font-sans text-xl font-semibold leading-snug text-foreground xl:text-2xl">{pergunta.enunciado}</h2>
              <div className="mt-6 grid gap-3 pb-4">
                {pergunta.opcoes.map((op, index) => (
                  <button
                    key={op.texto}
                    onClick={() => responder(op)}
                    onMouseEnter={() => {
                      if (foco !== index) {
                        tocarSomNavegacao();
                        setFoco(index);
                      }
                    }}
                    className={`answer-option group flex min-h-16 w-full items-center gap-4 rounded-md border bg-secondary px-4 py-3 text-left text-sm text-secondary-foreground transition hover:border-primary hover:bg-muted ${
                      foco === index
                        ? "scale-[1.02] border-accent bg-muted ring-2 ring-accent"
                        : "border-border"
                    }`}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border font-display text-lg text-primary transition group-hover:border-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="leading-snug">{op.texto}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {fase === "resultado" && resultado && (
            <div className="flex flex-1 flex-col">
              <div className="flex size-12 items-center justify-center rounded-md bg-accent/15 text-accent">
                <Brain className="size-6" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{resultado.titulo}</p>
              <h2 className="mt-2 text-3xl text-foreground">Toda escolha deixa uma marca</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{resultado.texto}</p>
              <Efeitos efeito={resultado.efeito} />
              <button
                onClick={continuar}
                className="mt-auto w-full rounded-md bg-primary px-4 py-3 font-display text-xl text-primary-foreground transition hover:opacity-90"
              >
                Passar a vez
              </button>
            </div>
          )}
        </section>
      </div>

      {fase === "arremesso" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4">
          <div className="panel w-full max-w-md p-6 text-center">
            <Dices className="mx-auto size-12 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl text-foreground">Lançar o dado</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Segure <span className="font-semibold text-primary">[ X / ◽ ]</span> (ou a barra de
              espaço / botão abaixo) para carregar a força e solte para rolar!
            </p>

            <div className="mt-6 h-6 w-full overflow-hidden rounded-full border border-border bg-secondary">
              <div
                ref={forcaBarra}
                className="h-full rounded-full will-change-[width]"
                style={{
                  width: "0%",
                  background:
                    "linear-gradient(90deg, var(--success), var(--warning) 60%, var(--destructive))",
                }}
              />
            </div>
            <p ref={forcaPercento} className="mt-2 font-display text-2xl text-primary">0%</p>

            <button
              onPointerDown={(e) => {
                e.preventDefault();
                setSegurando(true);
              }}
              onPointerUp={() => soltarForca()}
              onPointerLeave={() => soltarForca()}
              className="mt-5 w-full select-none rounded-md bg-primary px-4 py-4 font-display text-2xl text-primary-foreground transition hover:opacity-90"
            >
              {segurando ? "Solte para lançar!" : "Segure para carregar"}
            </button>
          </div>
        </div>
      )}

      {modalApoio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div className="panel w-full max-w-md p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <LifeBuoy className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-3xl text-foreground">Rede de apoio</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{modalApoio}</p>
            <p className="mt-3 text-sm font-semibold text-accent">
              +30 no seu atributo mais baixo. CVV 188 e CAPS-AD atendem de graça, 24h.
            </p>
            <button
              onClick={fecharApoio}
              className="mt-6 w-full rounded-md bg-primary px-4 py-3 font-display text-xl text-primary-foreground transition hover:opacity-90"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function calcularSelos(jogadores: Jogador[]): Map<number, string[]> {
  const selos = new Map<number, string[]>();
  const add = (id: number, s: string) => selos.set(id, [...(selos.get(id) ?? []), s]);
  if (!jogadores.length) return selos;

  const menorRisco = jogadores.reduce((a, b) => (a.perdaRisco <= b.perdaRisco ? a : b));
  add(menorRisco.id, "🛡️ Mente Blindada");

  const maisFamilia = jogadores.reduce((a, b) => (a.familia >= b.familia ? a : b));
  add(maisFamilia.id, "❤️ Pilar Familiar");

  const maisConsciencia = jogadores.reduce((a, b) => (a.consciencia >= b.consciencia ? a : b));
  add(maisConsciencia.id, "🧠 Consciência Elevada");

  jogadores
    .filter((j) => j.esteveCritico && j.usouApoio && j.terminou)
    .forEach((j) => add(j.id, "🔥 Superação"));

  return selos;
}

function Tabuleiro({ jogadores, atual }: { jogadores: Jogador[]; atual: Jogador }) {
  const porCasa = useMemo(() => {
    const m = new Map<number, Jogador[]>();
    jogadores.forEach((j) => m.set(j.pos, [...(m.get(j.pos) ?? []), j]));
    return m;
  }, [jogadores]);

  const casasVisuais = useMemo(() => {
    const linhas: { casa: (typeof TABULEIRO)[number]; indice: number }[][] = [];
    for (let inicio = 0; inicio < TABULEIRO.length; inicio += 5) {
      const linha = TABULEIRO.slice(inicio, inicio + 5).map((casa, offset) => ({ casa, indice: inicio + offset }));
      linhas.push(linhas.length % 2 === 1 ? linha.reverse() : linha);
    }
    return linhas.flat();
  }, []);

  return (
    <section className="board-panel flex min-h-[460px] flex-1 flex-col p-3 md:min-h-[480px] md:p-4 xl:min-h-[520px]" aria-label="Mapa do jogo">
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">O caminho das escolhas</p>
          <h2 className="mt-1 text-2xl text-foreground">Mapa da vida</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-4" /> {jogadores.length} jogadores
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-5 grid-rows-4 gap-3">
      {casasVisuais.map(({ casa, indice: i }) => {
        const aqui = porCasa.get(i) ?? [];
        const tom = casa.tipo === "final" ? "border-accent/60 bg-accent/10" : casa.tipo === "inicio" ? "border-border bg-muted" : "border-border bg-secondary";
        const linha = Math.floor(i / 5);
        const fimDaLinha = i % 5 === 4;
        const direcao = linha % 2 === 0 ? "direita" : "esquerda";
        return (
          <div
            key={i}
            className={`board-space relative flex min-h-0 flex-col justify-between rounded-md border p-2 ${tom} ${
              atual.pos === i ? "board-space-active" : ""
            }`}
          >
            {i < TABULEIRO.length - 1 && (
              <span
                aria-hidden="true"
                className={`board-connector ${
                  fimDaLinha ? (direcao === "direita" ? "board-connector-down-right" : "board-connector-down-left") : direcao === "direita" ? "board-connector-right" : "board-connector-left"
                }`}
              />
            )}
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] font-semibold uppercase leading-tight text-muted-foreground">{casa.rotulo}</span>
              <span className="font-display text-base leading-none text-border">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {aqui.map((j) => (
                <span key={`${j.id}-${j.pos}`} className={`player-token player-token-hop size-4 rounded-full border-2 border-background ${j.cor}`} title={j.nome} />
              ))}
              {casa.tipo === "inicio" && !aqui.length ? <Home className="size-4 text-muted-foreground" /> : null}
              {casa.tipo === "final" ? <ShieldCheck className="ml-auto size-4 text-accent" /> : null}
            </div>
          </div>
        );
      })}
      </div>
    </section>
  );
}

function DiceFace({ valor, compacto = false }: { valor: number; compacto?: boolean }) {
  const pontos: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  const ativos = pontos[valor] ?? pontos[1];
  return (
    <div className={`grid grid-cols-3 grid-rows-3 ${compacto ? "size-7 gap-0.5" : "size-24 gap-2 rounded-xl border-2 border-primary bg-secondary p-4 shadow-lg"}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`${compacto ? "size-1.5" : "size-3"} place-self-center rounded-full ${ativos?.includes(i) ? "bg-primary" : "bg-transparent"}`}
        />
      ))}
    </div>
  );
}

function Barras({
  j,
  compacto,
  delta,
  deltaKey,
}: {
  j: Jogador;
  compacto?: boolean;
  delta?: Efeito | undefined;
  deltaKey?: number | undefined;
}) {
  const itens: [string, keyof Efeito, number, string, typeof HeartPulse][] = [
    ["Saúde", "saude", j.saude, "bg-success", HeartPulse],
    ["Dinheiro", "dinheiro", j.dinheiro, "bg-warning", CircleDollarSign],
    ["Família", "familia", j.familia, "bg-p3", Users],
    ["Consciência", "consciencia", j.consciencia, "bg-primary", Brain],
  ];
  return (
    <div className={compacto ? "mt-2 space-y-1" : "mt-4 space-y-1.5"}>
      {itens.map(([nome, chave, valor, cor, Icon]) => {
        const critico = valor < ALERTA;
        const d = delta?.[chave] ?? 0;
        return (
          <div key={nome} className="relative flex items-center gap-2">
            <Icon
              className={`size-3 shrink-0 ${critico ? "text-destructive" : "text-muted-foreground"}`}
              aria-label={nome}
            />
            <div
              className={`h-1.5 w-full overflow-hidden rounded-full bg-muted ${critico ? "bar-critical" : ""}`}
            >
              <div
                className={`h-full rounded-full transition-[width] duration-500 ${critico ? "bg-destructive" : cor}`}
                style={{ width: `${valor}%` }}
              />
            </div>
            <span
              className={`w-5 text-right text-[9px] ${critico ? "font-bold text-destructive" : "text-muted-foreground"}`}
            >
              {valor}
            </span>
            {d !== 0 && (
              <span
                key={`${deltaKey}-${chave}`}
                className={`float-delta absolute right-0 -top-2 text-[11px] font-bold ${
                  d > 0 ? "text-success" : "text-destructive"
                }`}
              >
                {d > 0 ? "+" : ""}
                {d}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Efeitos({ efeito }: { efeito: Efeito }) {
  const mapa: Record<string, string> = {
    saude: "Saúde",
    dinheiro: "Dinheiro",
    familia: "Família",
    consciencia: "Consciência",
  };
  const entradas = Object.entries(efeito).filter(([, v]) => v);
  if (!entradas.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {entradas.map(([k, v]) => (
        <span
          key={k}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            (v as number) > 0
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive"
          }`}
        >
          {mapa[k]} {(v as number) > 0 ? "+" : ""}
          {v}
        </span>
      ))}
    </div>
  );
}

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
