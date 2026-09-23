import { useEffect, useRef, useState } from "react";

type Direcao = "cima" | "baixo" | "esquerda" | "direita";

type Opcoes = {
  onConfirm: () => void;
  onMove: (direcao: Direcao) => void;
  onAjuda?: () => void;
  onForcaDown?: () => void;
  onForcaUp?: () => void;
};

const BOTOES_CONFIRMA = [0, 9]; // A / X e Start
const EIXO_LIMITE = 0.6;
const REPETICAO = 220;

export function useGamepad(opcoes: Opcoes) {
  const [conectado, setConectado] = useState(false);
  const acoes = useRef<Opcoes>(opcoes);
  acoes.current = opcoes;

  useEffect(() => {
    if (typeof navigator === "undefined" || !("getGamepads" in navigator)) return;

    let frame = 0;
    let confirmaAnterior = false;
    let ajudaAnterior = false;
    let forcaAnterior = false;
    let ultimoMovimento = 0;
    let direcaoAnterior: Direcao | null = null;

    const atualizaConexao = () => {
      const lista = Array.from(navigator.getGamepads?.() ?? []).filter(Boolean);
      setConectado(lista.length > 0);
    };

    const loop = () => {
      const pads = Array.from(navigator.getGamepads?.() ?? []).filter(
        (p): p is Gamepad => Boolean(p),
      );
      setConectado(pads.length > 0);

      let confirma = false;
      let ajuda = false;
      let forca = false;
      let direcao: Direcao | null = null;

      for (const pad of pads) {
        if (BOTOES_CONFIRMA.some((i) => pad.buttons[i]?.pressed)) confirma = true;
        if (pad.buttons[3]?.pressed) ajuda = true;
        if (pad.buttons[2]?.pressed) forca = true;
        if (pad.buttons[12]?.pressed) direcao = "cima";
        else if (pad.buttons[13]?.pressed) direcao = "baixo";
        else if (pad.buttons[14]?.pressed) direcao = "esquerda";
        else if (pad.buttons[15]?.pressed) direcao = "direita";

        const x = pad.axes[0] ?? 0;
        const y = pad.axes[1] ?? 0;
        if (!direcao) {
          if (y < -EIXO_LIMITE) direcao = "cima";
          else if (y > EIXO_LIMITE) direcao = "baixo";
          else if (x < -EIXO_LIMITE) direcao = "esquerda";
          else if (x > EIXO_LIMITE) direcao = "direita";
        }
      }

      if (confirma && !confirmaAnterior) acoes.current.onConfirm();
      confirmaAnterior = confirma;

      const agora = performance.now();
      if (direcao && (direcao !== direcaoAnterior || agora - ultimoMovimento > REPETICAO)) {
        acoes.current.onMove(direcao);
        ultimoMovimento = agora;
      }
      direcaoAnterior = direcao;

      frame = requestAnimationFrame(loop);
    };

    atualizaConexao();
    window.addEventListener("gamepadconnected", atualizaConexao);
    window.addEventListener("gamepaddisconnected", atualizaConexao);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("gamepadconnected", atualizaConexao);
      window.removeEventListener("gamepaddisconnected", atualizaConexao);
    };
  }, []);

  return conectado;
}
