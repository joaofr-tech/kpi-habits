import { expect, test } from "@playwright/test";

test("cria, persiste, registra e exclui um hábito", async ({ page }) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight > window.innerHeight
    )
  ).toBe(false);
  await page.getByRole("button", { name: /criar primeiro hábito/i }).click();
  await page.getByLabel(/qual hábito você quer construir/i).fill("Caminhar");
  await page
    .getByLabel(/detalhe do hábito/i)
    .fill("por 20 minutos depois do almoço");

  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" })
    .format(new Date())
    .toUpperCase();
  const labels: Record<string, string> = {
    SUNDAY: "Domingo",
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado"
  };
  await page.getByRole("button", { name: labels[weekday] }).click();
  await page.getByRole("button", { name: /configurar estimador/i }).click();
  await page.getByRole("button", { name: /usar esta estimativa/i }).click();
  await page.getByRole("button", { name: /salvar hábito/i }).click();

  await expect(page.getByRole("heading", { name: "Caminhar" })).toBeVisible();
  await expect(page.getByText("por 20 minutos depois do almoço")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /^concluído/i }).click();
  await expect(page.getByText("100%")).toBeVisible();

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /excluir caminhar/i }).click();
  await expect(page.getByText(/seu primeiro hábito começa/i)).toBeVisible();
});

test("abre a metodologia e retorna ao painel", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /abrir metodologia/i }).click();
  await expect(page.getByRole("heading", { name: /repetir é construir/i })).toBeVisible();
  await page.getByRole("link", { name: /voltar ao painel/i }).click();
  await expect(
    page.getByRole("heading", { name: /seu primeiro hábito começa/i })
  ).toBeVisible();
});
