import { afterEach, describe, expect, it, vi } from "vitest";
import { triggerHapticFeedback } from "./haptics";

describe("feedback tátil", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("usa um pulso curto e tolera ausência ou falha da API", () => {
    vi.stubGlobal("navigator", {});
    expect(() => triggerHapticFeedback()).not.toThrow();

    const vibrate = vi.fn(() => true);
    vi.stubGlobal("navigator", { vibrate });
    triggerHapticFeedback();
    expect(vibrate).toHaveBeenCalledWith(10);

    vibrate.mockImplementation(() => {
      throw new Error("hardware indisponível");
    });
    expect(() => triggerHapticFeedback()).not.toThrow();
  });
});
