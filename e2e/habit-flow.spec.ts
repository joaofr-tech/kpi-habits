import { expect, test } from "@playwright/test";
import { hapticPatterns, installHapticProbe } from "./haptics";
import { swipeUp } from "./touch";

test("cria, persiste, registra e exclui um hábito", async ({
  page,
  isMobile
}) => {
  await installHapticProbe(page);
  await page.goto("/");
  if (!isMobile) {
    expect(
      await page.evaluate(
        () => document.documentElement.scrollHeight > window.innerHeight
      )
    ).toBe(false);
  }
  await page.getByRole("button", { name: /criar primeiro hábito/i }).click();
  await page.getByLabel(/qual hábito você quer construir/i).fill("Caminhar");
  await page
    .getByLabel(/detalhe do hábito/i)
    .fill("por 20 minutos depois do almoço");

  await page.getByRole("button", { name: "Selecionar todos" }).click();
  await expect(page.getByText("7 vezes por semana.")).toBeVisible();
  await page.getByRole("button", { name: /configurar estimador/i }).click();
  expect(await hapticPatterns(page)).toEqual([]);
  await page.getByRole("button", { name: /salvar hábito/i }).click();
  expect(await hapticPatterns(page)).toEqual([10]);

  await expect(page.getByRole("heading", { name: "Caminhar" })).toBeVisible();
  await expect(page.getByText("por 20 minutos depois do almoço")).toBeVisible();

  if (isMobile) {
    await expect(page.locator(".mobile-card-summary")).toBeVisible();
    await expect(page.locator(".metric-row")).toBeHidden();
  } else {
    await expect(page.locator(".mobile-card-summary")).toBeHidden();
    await expect(page.locator(".metric-row")).toBeVisible();
  }

  await page.reload();
  await page.getByRole("button", { name: /^concluído/i }).click();
  expect(await hapticPatterns(page)).toEqual([]);
  await expect(page.getByText("1 execução feita", { exact: true })).toBeVisible();
  await expect(
    isMobile
      ? page.getByText("100% consistência")
      : page.getByText("100%", { exact: true })
  ).toBeVisible();

  await page.getByRole("button", { name: /excluir caminhar/i }).click();
  await expect(
    page.getByRole("heading", { name: "Excluir “Caminhar”?" })
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Caminhar" })).toBeVisible();
  expect(await hapticPatterns(page)).toEqual([]);

  await page.getByRole("button", { name: /excluir caminhar/i }).click();
  await page.getByRole("button", { name: "Excluir hábito" }).click();
  expect(await hapticPatterns(page)).toEqual([10]);
  await expect(page.getByText(/seu primeiro hábito começa/i)).toBeVisible();
  await page.getByRole("link", { name: /abrir metodologia/i }).click();
  await expect(page.getByRole("heading", { name: /repetir é construir/i })).toBeVisible();
  await page.getByRole("link", { name: /voltar ao painel/i }).click();
  await expect(
    page.getByRole("heading", { name: /seu primeiro hábito começa/i })
  ).toBeVisible();
});

test("conclui o cadastro em um celular compacto", async ({ page, isMobile }) => {
  test.skip(!isMobile, "cenário específico do projeto móvel");

  await page.addInitScript(() => {
    Object.defineProperty(Crypto.prototype, "randomUUID", {
      value: undefined,
      configurable: true
    });
  });
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await page.getByRole("button", { name: /criar primeiro hábito/i }).click();

  await page.getByLabel(/qual hábito você quer construir/i).fill("Alongar");
  await page.getByLabel(/detalhe do hábito/i).fill("por 5 minutos ao acordar");
  await page.getByRole("button", { name: "Domingo" }).click();

  const configure = page.getByRole("button", { name: /configurar estimador/i });
  await configure.scrollIntoViewIfNeeded();
  await expect(configure).toBeInViewport();
  await configure.click();

  const estimator = page.locator(".dialog-body.estimator");
  await expect.poll(() => estimator.evaluate((element) => element.scrollTop)).toBe(0);

  for (const select of await estimator.locator("select").all()) {
    await select.selectOption("HIGH");
  }

  await estimator.evaluate((element) => {
    element.scrollTop = 0;
  });
  const save = page.getByRole("button", { name: /salvar hábito/i });
  await expect(save).not.toBeInViewport();

  await swipeUp(page, estimator);
  await expect.poll(() => estimator.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await swipeUp(page, estimator);
  await expect(save).toBeInViewport();
  await save.click();

  await expect(page.getByRole("heading", { name: "Alongar" })).toBeVisible();
});
