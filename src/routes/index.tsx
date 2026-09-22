import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  CircleDollarSign,
  Dices,
  HeartPulse,
  Home,
  LifeBuoy,
  ShieldCheck,
  Users,
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

type Fase = "setup" | "rolar" | "rolando" | "movendo" | "pergunta" | "resultado" | "fim";

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

function Jogo() {
  const [fase, setFase] = useState<Fase>("setup");
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

  function tocarSomPasso() {
    if (typeof Audio === "undefined") return;
    if (!audioPasso.current) audioPasso.current = new Audio(somPasso.url);
    const a = audioPasso.current.cloneNode() as HTMLAudioElement;
    a.volume = 0.8;
    void a.play().catch(() => undefined);
  }

  function tocarSomDado() {
    if (typeof Audio === "undefined") return;
    if (!audioDado.current) audioDado.current = new Audio(somDado.url);
    const a = audioDado.current;
    if (fadeDado.current) {
      clearInterval(fadeDado.current);
      fadeDado.current = null;
    }
    a.pause();
    a.currentTime = 0;
    a.volume = 1;
    void a.play().catch(() => undefined);
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

  const atual = jogadores[vez]!;

  useEffect(() => {
    return () => {
      if (intervaloDado.current) clearInterval(intervaloDado.current);
      if (esperaDado.current) clearTimeout(esperaDado.current);
      esperasMovimento.current.forEach(clearTimeout);
      if (fadeDado.current) clearInterval(fadeDado.current);
      audioDado.current?.pause();
    };
  }, []);

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

  function rolar() {
    if (fase !== "rolar") return;
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
    setResultado({ titulo: "Consequência", texto: op.feedback, efeito: op.efeito });
    setFase("resultado");
  }

  function continuar() {
    proximoTurno(jogadores);
  }

  function reiniciar() {
    setFase("setup");
    setJogadores([]);
    setNomes(["", "", "", ""]);
    setQuantidade(4);
  }

  useEffect(() => {
    setFoco(0);
  }, [fase, vez, pergunta]);

  const controleConectado = useGamepad({
    onConfirm: () => {
      if (modalApoio) {
        fecharApoio();
        return;
      }
      if (fase === "rolar") rolar();
      else if (fase === "pergunta" && pergunta) {
        const op = pergunta.opcoes[foco] ?? pergunta.opcoes[0];
        if (op) responder(op);
      } else if (fase === "resultado") continuar();
      else if (fase === "fim") reiniciar();
      else if (fase === "setup") iniciar();
    },
    onMove: (direcao) => {
      if (fase !== "pergunta" || !pergunta) return;
      const total = pergunta.opcoes.length;
      const passo = direcao === "cima" || direcao === "esquerda" ? -1 : 1;
      setFoco((f) => (f + passo + total) % total);
    },
  });


  if (fase === "setup") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10">
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
            <li>Na sua vez, role o dado e avance pelo mapa.</li>
            <li>Casa de pergunta: escolha uma resposta e veja a consequência real.</li>
            <li>Se saúde, dinheiro ou família chegarem perto de zero, seu final muda.</li>
            <li>A partida acaba quando todos chegam à casa "Futuro".</li>
          </ul>
        </div>
      </main>
    );
  }

  if (fase === "fim") {
    const selos = calcularSelos(jogadores);
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-10">
        <h1 className="text-4xl text-foreground">Finais da partida</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cada caminho gerou um desfecho. Compare as escolhas de cada jogador.
        </p>
        <div className="mt-6 space-y-4">
          {jogadores.map((j) => {
            const f = calcularFinal(j);
            const cor =
              f.tom === "bom" ? "text-success" : f.tom === "medio" ? "text-warning" : "text-destructive";
            return (
              <div key={j.id} className="panel p-5">
                <div className="flex items-center gap-2">
                  <span className={`size-4 rounded-full ${j.cor}`} />
                  <span className="font-semibold">{j.nome}</span>
                </div>
                <h2 className={`mt-2 text-2xl ${cor}`}>{f.titulo}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{f.descricao}</p>
                {(selos.get(j.id) ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selos.get(j.id) ?? []).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <Barras j={j} />
              </div>
            );
          })}
        </div>
        <div className="panel mt-6 p-5 text-sm text-muted-foreground">
          <h3 className="text-xl text-foreground">Precisa de ajuda de verdade?</h3>
          <p className="mt-2">
            CAPS-AD e Unidades Básicas de Saúde atendem gratuitamente pelo SUS. CVV: 188 (24h).
            Dependência não é falta de caráter — é uma doença com tratamento.
          </p>
        </div>
        <button
          onClick={reiniciar}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 font-display text-xl text-primary-foreground transition hover:opacity-90"
        >
          Jogar de novo
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full px-4 pb-10 pt-4 md:px-6 md:pb-12 md:pt-5">
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
          {controleConectado && (
            <div className="mb-3 flex items-center gap-2 rounded-md border border-accent/50 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent">
              🎮 Controle conectado — pressione [A] para jogar
            </div>
          )}
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
              onClick={rolar}
              className={`mt-7 w-full rounded-md bg-primary px-4 py-4 font-display text-2xl text-primary-foreground transition hover:opacity-90 ${
                controleConectado ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""
              }`}
            >
              Rolar o dado
            </button>
            <button
              onClick={buscarAjuda}
              disabled={atual.usouApoio || !emCritico(atual)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-accent/60 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:border-border disabled:bg-transparent disabled:text-muted-foreground"
            >
              <LifeBuoy className="size-4" aria-hidden="true" />
              Buscar ajuda {atual.usouApoio ? "(já usado)" : "(1 uso)"}
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
                  className="answer-option group flex min-h-16 w-full items-center gap-4 rounded-md border border-border bg-secondary px-4 py-3 text-left text-sm text-secondary-foreground transition hover:border-primary hover:bg-muted"
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
