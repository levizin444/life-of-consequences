import { useEffect, useRef, useState } from "react";

export type Direcao = "cima" | "baixo" | "esquerda" | "direita";

export type UseGamepadOptions = {
  jogadorAtivoId: number; // 0 = Jogador 1, 1 = Jogador 2, 2 = Jogador 3, 3 = Jogador 4
  bloqueioTurno?: boolean; // Se true, apenas o controle do jogador ativo responde aos comandos
  modoCompartilhado?: boolean; // Se true, permite que um único controle controle todos os turnos
  onConfirm: () => void;
  onMove: (direcao: Direcao) => void;
  onAjuda?: () => void;
  onForcaDown?: () => void;
  onForcaUp?: () => void;
};

export type UseGamepadReturn = {
  conectado: boolean;
  controlesConectados: boolean[];
  quantidadeConectados: number;
  controleAtivoConectado: boolean;
};

const BOTOES_CONFIRMA = [0, 9]; // 0 = A (Xbox) / X (PlayStation), 9 = Start / Options
const EIXO_LIMITE = 0.6;
const REPETICAO = 220;

type EstadoPad = {
  confirmaAnterior: boolean;
  ajudaAnterior: boolean;
  forcaAnterior: boolean;
  direcaoAnterior: Direcao | null;
  ultimoMovimento: number;
};

export function useGamepad(opcoes: UseGamepadOptions): UseGamepadReturn {
  const [controlesConectados, setControlesConectados] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const acoes = useRef<UseGamepadOptions>(opcoes);
  acoes.current = opcoes;

  useEffect(() => {
    if (typeof navigator === "undefined" || !("getGamepads" in navigator)) return;

    let frame = 0;
    const estadosPads: EstadoPad[] = [
      { confirmaAnterior: false, ajudaAnterior: false, forcaAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
      { confirmaAnterior: false, ajudaAnterior: false, forcaAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
      { confirmaAnterior: false, ajudaAnterior: false, forcaAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
      { confirmaAnterior: false, ajudaAnterior: false, forcaAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
    ];

    const atualizaConexoes = () => {
      const rawPads = Array.from(navigator.getGamepads?.() ?? []);
      const status = [false, false, false, false];
      for (let i = 0; i < 4; i++) {
        status[i] = Boolean(rawPads[i] && rawPads[i]?.connected);
      }
      setControlesConectados(status);
    };

    const loop = () => {
      const rawPads = Array.from(navigator.getGamepads?.() ?? []);
      const status = [false, false, false, false];
      for (let i = 0; i < 4; i++) {
        status[i] = Boolean(rawPads[i] && rawPads[i]?.connected);
      }

      setControlesConectados((prev) => {
        if (prev.some((val, idx) => val !== status[idx])) return status;
        return prev;
      });

      const { jogadorAtivoId, bloqueioTurno = true, modoCompartilhado = false } = acoes.current;

      for (let i = 0; i < 4; i++) {
        const pad = rawPads[i];
        const estado = estadosPads[i]!;
        if (!pad || !pad.connected) {
          estado.confirmaAnterior = false;
          estado.ajudaAnterior = false;
          estado.forcaAnterior = false;
          estado.direcaoAnterior = null;
          continue;
        }

        const confirma = BOTOES_CONFIRMA.some((b) => pad.buttons[b]?.pressed);
        const ajuda = Boolean(pad.buttons[3]?.pressed); // Y (Xbox) / Triângulo (PS)
        const forca = Boolean(pad.buttons[2]?.pressed); // X (Xbox) / Quadrado (PS)

        let direcao: Direcao | null = null;
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

        // REGRA DE OURO: Bloqueio de Turno
        // Se o bloqueio de turno estiver ativo, APENAS o controle associado ao jogador ativo (pad.index === jogadorAtivoId)
        // surtirá efeito no jogo. Se outros jogadores pressionarem botões, serão ignorados!
        const ehJogadorAtivo = modoCompartilhado ? true : i === jogadorAtivoId;
        const podeExecutar = !bloqueioTurno || ehJogadorAtivo;

        if (podeExecutar) {
          if (confirma && !estado.confirmaAnterior) acoes.current.onConfirm();
          if (ajuda && !estado.ajudaAnterior) acoes.current.onAjuda?.();
          if (forca && !estado.forcaAnterior) acoes.current.onForcaDown?.();
          if (!forca && estado.forcaAnterior) acoes.current.onForcaUp?.();

          const agora = performance.now();
          if (direcao && (direcao !== estado.direcaoAnterior || agora - estado.ultimoMovimento > REPETICAO)) {
            acoes.current.onMove(direcao);
            estado.ultimoMovimento = agora;
          }
        }

        // Atualiza sempre o estado anterior deste pad para evitar disparos acidentais ao mudar de turno
        estado.confirmaAnterior = confirma;
        estado.ajudaAnterior = ajuda;
        estado.forcaAnterior = forca;
        estado.direcaoAnterior = direcao;
      }

      frame = requestAnimationFrame(loop);
    };

    atualizaConexoes();
    window.addEventListener("gamepadconnected", atualizaConexoes);
    window.addEventListener("gamepaddisconnected", atualizaConexoes);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("gamepadconnected", atualizaConexoes);
      window.removeEventListener("gamepaddisconnected", atualizaConexoes);
    };
  }, []);

  const quantidadeConectados = controlesConectados.filter(Boolean).length;
  const conectado = quantidadeConectados > 0;
  const controleAtivoConectado = Boolean(controlesConectados[opcoes.jogadorAtivoId]);

  return {
    conectado,
    controlesConectados,
    quantidadeConectados,
    controleAtivoConectado,
  };
}
