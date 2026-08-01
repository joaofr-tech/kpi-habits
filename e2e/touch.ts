import type { Locator, Page } from "@playwright/test";

export async function swipeUp(page: Page, target: Locator) {
  const box = await target.boundingBox();
  if (!box) throw new Error("Área rolável do modal não encontrada");

  const session = await page.context().newCDPSession(page);
  const x = Math.round(box.x + box.width / 2);
  const startY = Math.round(box.y + box.height - 45);
  const distance = Math.max(240, Math.round(box.height * 0.7));

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y: startY }]
  });
  for (let step = 1; step <= 8; step += 1) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: startY - Math.round((distance * step) / 8) }]
    });
    await page.waitForTimeout(20);
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: []
  });
  await session.detach();
}
