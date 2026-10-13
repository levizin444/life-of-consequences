import { useEffect, useState } from "react";
import type { MinigameProps, ResultadoMinigame } from "./MinigameModal";

/** Minigame "Bosses dos Vícios" (HTML original em /public/minigames), todos jogam juntos. */
export function BossesDosVicios({ quantidade, onConcluir }: MinigameProps) {
  const [resultado, setResultado] = useState<{ win: boolean; st: ResultadoMinigame[] } | null>(null);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; win?: boolean; st?: ResultadoMinigame[] };
      if (d?.type === "bosses-result" && Array.isArray(d.st)) setResultado({ win: !!d.win, st: d.st });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <iframe
        title="Bosses dos Vícios"
        src={`/minigames/bosses-dos-vicios.html?n=${quantidade}`}
        className="h-[68vh] w-full rounded-lg border border-border"
        allow="gamepad; autoplay"
      />
      {resultado ? (
        <button
          type="button"
          onClick={() => onConcluir(resultado.st)}
          className="w-full rounded-xl bg-primary px-6 py-3 font-display text-xl tracking-wider text-primary-foreground transition hover:opacity-90"
        >
          {resultado.win ? "Vitória! " : ""}Voltar ao tabuleiro (aplicar pontos)
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">
          Cada acerto dá +4 Consciência e +2 Saúde; cada erro tira 3 de Saúde.
        </p>
      )}
    </div>
  );
}
