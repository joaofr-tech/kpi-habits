import { afterEach, describe, expect, it, vi } from "vitest";
import { playCompletionSound } from "./completionFeedback";

describe("feedback sonoro de conclusão", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("não lança quando Web Audio não existe ou falha", () => {
    vi.stubGlobal("AudioContext", undefined);
    expect(() => playCompletionSound()).not.toThrow();

    vi.stubGlobal(
      "AudioContext",
      vi.fn(() => {
        throw new Error("áudio bloqueado");
      })
    );
    expect(() => playCompletionSound()).not.toThrow();
  });

  it("cria um acorde ascendente curto", () => {
    const setFrequency = vi.fn();
    const oscillators = Array.from({ length: 3 }, () => ({
      type: "sine",
      frequency: { setValueAtTime: setFrequency },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    }));
    const context = {
      currentTime: 1,
      destination: {},
      createGain: () => ({
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn()
        },
        connect: vi.fn()
      }),
      createOscillator: vi.fn(() => oscillators.shift()),
      resume: vi.fn(() => Promise.resolve())
    };
    vi.stubGlobal("AudioContext", vi.fn(() => context));

    playCompletionSound();

    expect(context.createOscillator).toHaveBeenCalledTimes(3);
    expect(setFrequency.mock.calls.map(([frequency]) => frequency)).toEqual([
      523.25,
      659.25,
      783.99
    ]);
  });
});
