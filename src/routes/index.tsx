import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  DESCANSOS,
  EVENTOS,
  PERGUNTAS,
  TABULEIRO,
  calcularFinal,
  type Efeito,
  type Opcao,
  type Pergunta,
} from "@/lib/game-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jogo da Vida: Escolhas Reais — Drogas e Apostas" },
      {
        name: "description",
        content:
          "Jogo de tabuleiro digital para 4 jogadores sobre prevenção ao vício em drogas e em casas de aposta. Responda, avance e descubra seu final.",
      },
      { property: "og:title", content: "Jogo da Vida: Escolhas Reais" },
      {
        property: "og:description",
        content:
          "4 jogadores, perguntas reais sobre drogas e apostas, e finais diferentes para cada escolha.",
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
};

type Fase = "setup" | "rolar" | "pergunta" | "resultado" | "fim";

const CORES = ["bg-p1", "bg-p2", "bg-p3", "bg-p4"];
const CORES_TEXTO = ["text-p1", "text-p2", "text-p3", "text-p4"];
const PADRAO = ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"];

const clamp = (n: number) => Math.max(0, Math.min(100, n));

function aplicar(j: Jogador, e: Efeito): Jogador {
  return {
    ...j,
    saude: clamp(j.saude + (e.saude ?? 0)),
    dinheiro: clamp(j.dinheiro + (e.dinheiro ?? 0)),
    familia: clamp(j.familia + (e.familia ?? 0)),
    consciencia: clamp(j.consciencia + (e.consciencia ?? 0)),
  };
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
  };
}

function Jogo() {
  const [fase, setFase] = useState<Fase>("setup");
  const [nomes, setNomes] = useState<string[]>(["", "", "", ""]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [vez, setVez] = useState(0);
  const [dado, setDado] = useState<number | null>(null);
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const [usadas, setUsadas] = useState<number[]>([]);
  const [resultado, setResultado] = useState<{ titulo: string; texto: string; efeito: Efeito } | null>(
    null,
  );

  const atual = jogadores[vez]!;

  function iniciar() {
    setJogadores(nomes.map((n, i) => novoJogador(i, n.trim() || PADRAO[i]!)));
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

  function rolar() {
    const valor = 1 + Math.floor(Math.random() * 6);
    setDado(valor);
    const destino = Math.min(atual.pos + valor, TABULEIRO.length - 1);
    const lista = jogadores.map((j) => (j.id === atual.id ? { ...j, pos: destino } : j));
    setJogadores(lista);

    const casa = TABULEIRO[destino]!;

    if (casa.tipo === "pergunta") {
      setPergunta(sortearPergunta());
      setFase("pergunta");
      return;
    }
    if (casa.tipo === "evento") {
      const ev = EVENTOS[Math.floor(Math.random() * EVENTOS.length)]!;
      setJogadores(lista.map((j) => (j.id === atual.id ? aplicar(j, ev.efeito) : j)));
      setResultado({ titulo: "Acontecimento", texto: ev.texto, efeito: ev.efeito });
      setFase("resultado");
      return;
    }
    if (casa.tipo === "descanso") {
      const ef: Efeito = { saude: 10, familia: 5 };
      setJogadores(lista.map((j) => (j.id === atual.id ? aplicar(j, ef) : j)));
      setResultado({
        titulo: "Respiro",
        texto: DESCANSOS[Math.floor(Math.random() * DESCANSOS.length)]!,
        efeito: ef,
      });
      setFase("resultado");
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

  function responder(op: Opcao) {
    const lista = jogadores.map((j) => (j.id === atual.id ? aplicar(j, op.efeito) : j));
    setJogadores(lista);
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
  }

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
          Quatro jogadores percorrem o mesmo caminho da vida. A cada casa, uma pergunta sobre drogas
          ou casas de aposta. Suas escolhas mudam saúde, dinheiro, família e consciência — e cada um
          termina com um final diferente.
        </p>

        <div className="panel mt-8 p-5">
          <h2 className="text-2xl">Quem vai jogar?</h2>
          <div className="mt-4 space-y-3">
            {nomes.map((n, i) => (
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
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-6 pb-28">
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl text-foreground">Escolhas Reais</h1>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Casa {atual.pos + 1}/{TABULEIRO.length}
        </span>
      </header>

      <Tabuleiro jogadores={jogadores} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        {jogadores.map((j, i) => (
          <div
            key={j.id}
            className={`panel p-3 ${j.id === atual.id ? "ring-2 ring-ring" : ""} ${
              j.terminou ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`size-3 rounded-full ${j.cor}`} />
              <span className={`truncate text-sm font-semibold ${CORES_TEXTO[i]}`}>{j.nome}</span>
            </div>
            <Barras j={j} compacto />
          </div>
        ))}
      </div>

      <section className="panel mt-4 p-5">
        {fase === "rolar" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Vez de</p>
            <h2 className={`text-3xl ${CORES_TEXTO[atual.id]}`}>{atual.nome}</h2>
            <button
              onClick={rolar}
              className="mt-4 w-full rounded-lg bg-accent px-4 py-4 font-display text-2xl text-accent-foreground transition hover:opacity-90"
            >
              Rolar o dado
            </button>
          </div>
        )}

        {fase === "pergunta" && pergunta && (
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
              <span>{pergunta.tema === "drogas" ? "Drogas" : "Apostas"}</span>
              <span>Dado: {dado}</span>
            </div>
            <h2 className="mt-2 text-xl leading-snug text-foreground">{pergunta.enunciado}</h2>
            <div className="mt-4 space-y-2">
              {pergunta.opcoes.map((op) => (
                <button
                  key={op.texto}
                  onClick={() => responder(op)}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-left text-sm text-secondary-foreground transition hover:border-primary hover:bg-muted"
                >
                  {op.texto}
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === "resultado" && resultado && (
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">{resultado.titulo}</p>
            <p className="mt-2 text-base leading-relaxed text-foreground">{resultado.texto}</p>
            <Efeitos efeito={resultado.efeito} />
            <button
              onClick={continuar}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-display text-xl text-primary-foreground transition hover:opacity-90"
            >
              Passar a vez
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function Tabuleiro({ jogadores }: { jogadores: Jogador[] }) {
  const porCasa = useMemo(() => {
    const m = new Map<number, Jogador[]>();
    jogadores.forEach((j) => m.set(j.pos, [...(m.get(j.pos) ?? []), j]));
    return m;
  }, [jogadores]);

  return (
    <div className="panel mt-4 grid grid-cols-5 gap-1.5 p-3">
      {TABULEIRO.map((casa, i) => {
        const aqui = porCasa.get(i) ?? [];
        const tom =
          casa.tipo === "pergunta"
            ? "border-primary/40 bg-primary/10"
            : casa.tipo === "evento"
              ? "border-accent/40 bg-accent/10"
              : casa.tipo === "descanso"
                ? "border-success/40 bg-success/10"
                : "border-border bg-secondary";
        return (
          <div
            key={i}
            className={`relative flex min-h-16 flex-col justify-between rounded-md border p-1.5 ${tom}`}
          >
            <span className="text-[9px] leading-tight text-muted-foreground">{casa.rotulo}</span>
            <div className="flex flex-wrap gap-0.5">
              {aqui.map((j) => (
                <span key={j.id} className={`size-2.5 rounded-full ${j.cor}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Barras({ j, compacto }: { j: Jogador; compacto?: boolean }) {
  const itens: [string, number, string][] = [
    ["Saúde", j.saude, "bg-success"],
    ["Dinheiro", j.dinheiro, "bg-warning"],
    ["Família", j.familia, "bg-p3"],
    ["Consciência", j.consciencia, "bg-primary"],
  ];
  return (
    <div className={compacto ? "mt-2 space-y-1" : "mt-4 space-y-1.5"}>
      {itens.map(([nome, valor, cor]) => (
        <div key={nome} className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
            {nome}
          </span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full ${cor}`} style={{ width: `${valor}%` }} />
          </div>
        </div>
      ))}
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
