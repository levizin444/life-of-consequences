export function faseDaCasa(numero: number): 1 | 2 | 3 {
  return numero <= 7 ? 1 : numero <= 14 ? 2 : 3;
}

export function proximoCardTutorial(atual: number, total: number): number {
  return Math.min(atual + 1, total - 1);
}

export function podeIniciarPartida(card: number, total: number): boolean {
  return card === total - 1;
}

export function podeReiniciarFinal(origem: string, tecla?: string): boolean {
  return origem === "mouse" || (origem === "teclado" && tecla === "F10");
}