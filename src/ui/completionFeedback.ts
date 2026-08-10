type SafariWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const NOTES = [523.25, 659.25, 783.99];
const NOTE_LENGTH_SECONDS = 0.16;

export function playCompletionSound(): void {
  if (typeof window === "undefined") return;

  const AudioContextConstructor =
    window.AudioContext ?? (window as SafariWindow).webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const masterGain = context.createGain();
    const start = context.currentTime;

    masterGain.gain.setValueAtTime(0.0001, start);
    masterGain.gain.exponentialRampToValueAtTime(0.16, start + 0.025);
    masterGain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + NOTES.length * 0.075 + NOTE_LENGTH_SECONDS
    );
    masterGain.connect(context.destination);

    NOTES.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const noteStart = start + index * 0.075;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      oscillator.connect(masterGain);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + NOTE_LENGTH_SECONDS);
    });

    void context.resume?.().catch(() => undefined);
  } catch {
    // O áudio é um aprimoramento: o registro nunca depende dele.
  }
}
