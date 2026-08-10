import type { Locator, Page } from "@playwright/test";

export async function swipeUp(page: Page, target: Locator) {
  const box = await target.boundingBox();
  if (!box) throw new Error("Área rolável do modal não encontrada");

  const distance = Math.max(240, Math.round(box.height * 0.7));
  await target.evaluate((element, amount) => {
    element.scrollBy({ top: amount, behavior: "instant" });
  }, distance);
  await page.waitForTimeout(20);
}
