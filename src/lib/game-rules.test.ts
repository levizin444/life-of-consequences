import { describe, expect, test } from "bun:test";
import { TABULEIRO } from "./game-data";
import { faseDaCasa, podeIniciarPartida, podeReiniciarFinal, proximoCardTutorial } from "./game-rules";

describe("regras finais", () => {
  test("tabuleiro contém exatamente as casas 1 a 20 e termina na 20", () => {
    expect(TABULEIRO.map((c) => c.numero)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(TABULEIRO[19]?.tipo).toBe("final");
  });
  test("fase 1 cobre as casas 1 a 7", () => {
    expect(TABULEIRO.filter((c) => c.fase === 1).map((c) => c.numero)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(faseDaCasa(7)).toBe(1);
  });
  test("fase 2 cobre as casas 8 a 14", () => {
    expect(TABULEIRO.filter((c) => c.fase === 2).map((c) => c.numero)).toEqual([8, 9, 10, 11, 12, 13, 14]);
    expect(faseDaCasa(8)).toBe(2);
    expect(faseDaCasa(14)).toBe(2);
  });
  test("fase 3 cobre as casas 15 a 20", () => {
    expect(TABULEIRO.filter((c) => c.fase === 3).map((c) => c.numero)).toEqual([15, 16, 17, 18, 19, 20]);
    expect(faseDaCasa(15)).toBe(3);
  });
  test("tutorial avança um card por ação e não ultrapassa o último", () => {
    expect([0, 1, 2, 3, 4].map((c) => proximoCardTutorial(c, 5))).toEqual([1, 2, 3, 4, 4]);
  });
  test("partida só inicia no último card", () => {
    expect([0, 1, 2, 3, 4].map((c) => podeIniciarPartida(c, 5))).toEqual([false, false, false, false, true]);
  });
  test("reinício permite apenas mouse ou F10", () => {
    expect(podeReiniciarFinal("mouse")).toBe(true);
    expect(podeReiniciarFinal("teclado", "F10")).toBe(true);
    expect(podeReiniciarFinal("gamepad", "A")).toBe(false);
    expect(podeReiniciarFinal("gamepad", "Start")).toBe(false);
    expect(podeReiniciarFinal("teclado", "Enter")).toBe(false);
    expect(podeReiniciarFinal("teclado", " ")).toBe(false);
    expect(podeReiniciarFinal("touch")).toBe(false);
  });
});