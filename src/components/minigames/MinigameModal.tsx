import type { ComponentType } from "react";
import { Gamepad2, Star } from "lucide-react";
import { BossesDosVicios } from "./BossesDosVicios";

export type EventoMinigame = { casa: number; jogadores: string[] };

export type ResultadoMinigame = { c: number; w: number };

export type MinigameProps = {
  evento: EventoMinigame;
  quantidade: number;
  onConcluir: (resultados?: ResultadoMinigame[]) => void;
};

type DefinicaoMinigame = {
  titulo: string;
  descricao: string;
  /** Componente com a lógica do minigame. Enquanto null, mostra o placeholder. */
  Componente: ComponentType<MinigameProps> | null;
};

// Registro modular: basta plugar o componente de cada casa aqui.
export const MINIGAMES: Record<number, DefinicaoMinigame> = {
  15: { titulo: "Bosses dos Vícios", descricao: "Todos jogam juntos contra os chefes.", Componente: BossesDosVicios },
};

export function MinigameModal({ evento, quantidade, onConcluir }: MinigameProps) {
  const def = MINIGAMES[evento.casa];
  const Componente = def?.Componente;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm">
      <div className="panel w-full max-h-[96vh] max-w-3xl overflow-y-auto border-2 border-primary p-4 md:p-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Gamepad2 className="size-7" />
        </div>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary">
          <Star className="size-3.5" /> Casa {evento.casa}
        </p>
        <h2 className="mt-1 text-3xl text-foreground">Desafio Especial: Minigame</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Todos jogam! Quem chegou: <span className="font-bold text-foreground">{evento.jogadores.join(", ")}</span>
        </p>

        <div className="mt-5">
          {Componente ? (
            <Componente evento={evento} quantidade={quantidade} onConcluir={onConcluir} />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-5">
              <p className="font-bold text-foreground">{def?.titulo ?? "Minigame"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{def?.descricao ?? "Em construção."}</p>
            </div>
          )}
        </div>

        {!Componente && (
          <button
            type="button"
            onClick={() => onConcluir()}
            className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-display text-xl tracking-wider text-primary-foreground transition hover:opacity-90"
          >
            Concluir Minigame
          </button>
        )}
      </div>
    </div>
  );
}
