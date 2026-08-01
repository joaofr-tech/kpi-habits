const IMPORTANT_ACTION_DURATION_MS = 10;

export function triggerHapticFeedback(): void {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function"
  ) {
    return;
  }

  try {
    navigator.vibrate(IMPORTANT_ACTION_DURATION_MS);
  } catch {
    // Feedback tátil é progressivo e nunca deve interromper a ação principal.
  }
}
