import { useEffect, useRef, useState } from "react";

export type Direcao = "cima" | "baixo" | "esquerda" | "direita";

export type UseGamepadOptions = {
  // Chamado quando um jogador seleciona uma alternativa (0 = A, 1 = B, 2 = C / X, 3 = D / Y)
  onPlayerAnswer?: (jogadorId: number, opcao: 0 | 1 | 2 | 3) => void;
  // Chamado quando um jogador aciona a Rede de Apoio (botão Y/△ ou LB/RB)
  onPlayerAjuda?: (jogadorId: number) => void;
  // Chamado quando algum jogador pressiona o botão de confirmação geral (A ou Start)
  onConfirm?: (jogadorId?: number) => void;
  // Chamado para movimentação nos menus / cards
  onMove?: (direcao: Direcao, jogadorId?: number) => void;
};

export type UseGamepadReturn = {
  controlesConectados: boolean[];
  quantidadeConectados: number;
  algumConectado: boolean;
};

const EIXO_LIMITE = 0.6;
const REPETICAO = 240;

type EstadoPad = {
  btnAAnterior: boolean;
  btnBAnterior: boolean;
  btnXAnterior: boolean;
  btnYAnterior: boolean;
  btnStartAnterior: boolean;
  btnBumperAnterior: boolean;
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
      { btnAAnterior: false, btnBAnterior: false, btnXAnterior: false, btnYAnterior: false, btnStartAnterior: false, btnBumperAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
      { btnAAnterior: false, btnBAnterior: false, btnXAnterior: false, btnYAnterior: false, btnStartAnterior: false, btnBumperAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
      { btnAAnterior: false, btnBAnterior: false, btnXAnterior: false, btnYAnterior: false, btnStartAnterior: false, btnBumperAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
      { btnAAnterior: false, btnBAnterior: false, btnXAnterior: false, btnYAnterior: false, btnStartAnterior: false, btnBumperAnterior: false, direcaoAnterior: null, ultimoMovimento: 0 },
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

      for (let i = 0; i < 4; i++) {
        const pad = rawPads[i];
        const estado = estadosPads[i]!;
        if (!pad || !pad.connected) {
          estado.btnAAnterior = false;
          estado.btnBAnterior = false;
          estado.btnXAnterior = false;
          estado.btnYAnterior = false;
          estado.btnStartAnterior = false;
          estado.btnBumperAnterior = false;
          estado.direcaoAnterior = null;
          continue;
        }

        const btnA = Boolean(pad.buttons[0]?.pressed); // A (Xbox) / X (PS)
        const btnB = Boolean(pad.buttons[1]?.pressed); // B (Xbox) / O (PS)
        const btnX = Boolean(pad.buttons[2]?.pressed); // X (Xbox) / ◽ (PS)
        const btnY = Boolean(pad.buttons[3]?.pressed); // Y (Xbox) / △ (PS)
        const btnStart = Boolean(pad.buttons[9]?.pressed || pad.buttons[8]?.pressed); // Start / Select
        const btnBumper = Boolean(pad.buttons[4]?.pressed || pad.buttons[5]?.pressed); // LB / RB

        // RESPOSTAS MULTIPLAYER SIMULTÂNEAS:
        // Cada controle (i) envia sua escolha individual independente dos outros!
        if (btnA && !estado.btnAAnterior) {
          acoes.current.onPlayerAnswer?.(i, 0); // Opção A
          acoes.current.onConfirm?.(i);
        }
        if (btnB && !estado.btnBAnterior) {
          acoes.current.onPlayerAnswer?.(i, 1); // Opção B
        }
        if (btnX && !estado.btnXAnterior) {
          acoes.current.onPlayerAnswer?.(i, 2); // Opção C / X
        }
        if (btnY && !estado.btnYAnterior) {
          acoes.current.onPlayerAnswer?.(i, 3); // Opção D / Y
          acoes.current.onPlayerAjuda?.(i);
        }
        if (btnBumper && !estado.btnBumperAnterior) {
          acoes.current.onPlayerAjuda?.(i);
        }
        if (btnStart && !estado.btnStartAnterior) {
          acoes.current.onConfirm?.(i);
        }

        // Direcionais
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

        const agora = performance.now();
        if (direcao && (direcao !== estado.direcaoAnterior || agora - estado.ultimoMovimento > REPETICAO)) {
          acoes.current.onMove?.(direcao, i);
          estado.ultimoMovimento = agora;
        }

        estado.btnAAnterior = btnA;
        estado.btnBAnterior = btnB;
        estado.btnXAnterior = btnX;
        estado.btnYAnterior = btnY;
        estado.btnStartAnterior = btnStart;
        estado.btnBumperAnterior = btnBumper;
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
  const algumConectado = quantidadeConectados > 0;

  return {
    controlesConectados,
    quantidadeConectados,
    algumConectado,
  };
}
