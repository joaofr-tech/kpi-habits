import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const outputDirectory = "artifacts/card-comparison";

test("gera comparações desktop e mobile", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "Capturas são geradas uma única vez no projeto desktop."
  );

  mkdirSync(outputDirectory, { recursive: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/laboratorio/cards");
  await expect(page.locator(".lab-card")).toHaveCount(3);
  await page.screenshot({
    path: `${outputDirectory}/desktop.png`,
    fullPage: true
  });

  await page.setViewportSize({ width: 390, height: 844 });
  for (const [index, variant] of [
    "structural",
    "condensed",
    "target"
  ].entries()) {
    await page
      .locator(`[data-variant="${variant}"]`)
      .locator("..")
      .screenshot({
        path: `${outputDirectory}/mobile-0${index + 1}-${variant}.png`
      });
  }
});
