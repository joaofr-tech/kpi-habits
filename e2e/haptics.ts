import type { Page } from "@playwright/test";

type HapticWindow = Window & { __hapticPatterns: VibratePattern[] };

export async function installHapticProbe(page: Page) {
  await page.addInitScript(() => {
    const hapticWindow = window as HapticWindow;
    hapticWindow.__hapticPatterns = [];
    Object.defineProperty(window.navigator, "vibrate", {
      configurable: true,
      value: (pattern: VibratePattern) => {
        hapticWindow.__hapticPatterns.push(pattern);
        return true;
      }
    });
  });
}

export async function hapticPatterns(page: Page) {
  return page.evaluate(
    () => (window as HapticWindow).__hapticPatterns
  );
}
