import { expect, test } from "@playwright/test";
import { hapticPatterns, installHapticProbe } from "./haptics";
import { swipeUp } from "./touch";

test("cria, restaura, edita e exclui uma meta", async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 360, height: 640 });
  await installHapticProbe(page);
  await page.goto("/");
  await page.evaluate(() => {
    (window as Window & { __navigationMarker?: string }).__navigationMarker =
      "same-document";
  });
  await page.getByRole("link", { name: "Metas" }).click();
  await expect(page).toHaveURL(/\/metas$/);
  await expect(page.getByRole("link", { name: "Metas" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __navigationMarker?: string }).__navigationMarker
    )
  ).toBe("same-document");

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "Hábitos" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await page.goForward();
  await expect(page).toHaveURL(/\/metas$/);
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __navigationMarker?: string }).__navigationMarker
    )
  ).toBe("same-document");

  await page.getByRole("button", { name: /criar primeira meta/i }).click();
  await page.getByLabel("Nome").fill("Criar uma reserva");
  await page
    .getByLabel(/^Especificação/)
    .fill("Guardar R$ 10.000 em uma conta separada");
  await page.getByLabel("Data-limite").fill("2099-12-31");
  await page
    .getByLabel(/^Motivação/)
    .fill("Ter segurança para lidar com imprevistos");
  const createButton = page.getByRole("button", { name: "Criar meta" });

  if (isMobile) {
    const form = page.locator(".dialog-body.goal-form");
    await form.evaluate((element) => {
      element.scrollTop = 0;
    });
    await expect(createButton).not.toBeInViewport();
    await swipeUp(page, form);
    await expect
      .poll(() => form.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(0);
    await swipeUp(page, form);
    await expect(createButton).toBeInViewport();
  }

  expect(await hapticPatterns(page)).toEqual([]);
  await createButton.click();
  expect(await hapticPatterns(page)).toEqual([10]);

  await expect(
    page.getByRole("heading", { name: "Criar uma reserva" })
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Criar uma reserva" })
  ).toBeVisible();
  await expect(
    page.getByText("Guardar R$ 10.000 em uma conta separada")
  ).toBeVisible();

  await page.getByRole("button", { name: "Editar Criar uma reserva" }).click();
  expect(await hapticPatterns(page)).toEqual([]);
  await expect(
    page.getByRole("heading", { name: "Atualize os detalhes" })
  ).toBeVisible();
  await expect(page.getByLabel("Nome")).toHaveValue("Criar uma reserva");
  if (isMobile) {
    await expect
      .poll(() =>
        page
          .locator(".dialog-body.goal-form")
          .evaluate((element) => element.scrollTop)
      )
      .toBe(0);
    await expect(page.getByLabel("Nome")).toBeInViewport();
  }
  await page.getByLabel("Nome").fill("Criar reserva de emergência");
  await page
    .getByLabel(/^Especificação/)
    .fill("Guardar R$ 15.000 em uma conta separada");
  await page.getByLabel("Data-limite").fill("2098-11-30");
  await page
    .getByLabel(/^Motivação/)
    .fill("Ter tranquilidade diante de imprevistos");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  expect(await hapticPatterns(page)).toEqual([10]);

  await expect(
    page.getByRole("heading", { name: "Criar reserva de emergência" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Criar uma reserva" })
  ).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Criar reserva de emergência" })
  ).toBeVisible();
  await expect(
    page.getByText("Guardar R$ 15.000 em uma conta separada")
  ).toBeVisible();
  await expect(
    page.getByText("Ter tranquilidade diante de imprevistos")
  ).toBeVisible();

  const confirmation = page.waitForEvent("dialog");
  await Promise.all([
    confirmation.then(async (dialog) => {
      expect(dialog.message()).toBe(
        "Excluir a meta “Criar reserva de emergência”?"
      );
      await dialog.accept();
    }),
    page
      .getByRole("button", { name: "Excluir Criar reserva de emergência" })
      .click()
  ]);
  expect(await hapticPatterns(page)).toEqual([10]);

  await expect(
    page.getByRole("heading", { name: /uma meta clara transforma/i })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /uma meta clara transforma/i })
  ).toBeVisible();
});
