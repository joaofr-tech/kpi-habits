import { expect, test } from "@playwright/test";

test("compara cards acessíveis sem alterar dados locais", async ({
  page,
  isMobile
}) => {
  await page.goto("/laboratorio/cards");

  await expect(
    page.getByRole("heading", { name: "Densidade dos cards" })
  ).toBeVisible();
  await expect(page.locator(".lab-card")).toHaveCount(3);
  await expect(page.getByText("49 dias")).toBeVisible();

  const storage = await page.evaluate(() => localStorage.length);
  expect(storage).toBe(0);

  for (const button of await page.locator(".lab-card button").all()) {
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);

  if (!isMobile) {
    const structural = await page.locator('[data-variant="structural"]').boundingBox();
    const condensed = await page.locator('[data-variant="condensed"]').boundingBox();
    const target = await page.locator('[data-variant="target"]').boundingBox();

    expect(structural?.width).toBeGreaterThanOrEqual(360);
    expect(structural?.width).toBeLessThanOrEqual(395);
    expect(structural?.height).toBeLessThanOrEqual(320);
    expect(condensed?.height).toBeLessThanOrEqual(370);
    expect(target?.height).toBeLessThanOrEqual(300);
  }
});
