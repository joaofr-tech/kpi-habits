import { expect, test } from "@playwright/test";

test("mantém hábitos, metas e rotas disponíveis offline", async ({
  page,
  context
}) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);

  const cachedAssets = await page.evaluate(async () => {
    const requests = await Promise.all(
      (await caches.keys()).map(async (name) => (await caches.open(name)).keys())
    );
    return requests.flat().map((request) => new URL(request.url).pathname);
  });
  expect(cachedAssets).toContain("/index.html");
  expect(cachedAssets.some((path) => path.endsWith(".js"))).toBe(true);
  expect(cachedAssets.some((path) => path.endsWith(".css"))).toBe(true);
  expect(cachedAssets.some((path) => path.endsWith(".woff2"))).toBe(true);
  expect(cachedAssets).toContain("/apple-touch-icon.png");

  await context.setOffline(true);
  await expect(
    page.getByRole("heading", { name: /seu primeiro hábito começa/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /criar primeiro hábito/i }).click();
  await page.getByLabel(/qual hábito você quer construir/i).fill("Caminhar");
  await page
    .getByLabel(/detalhe do hábito/i)
    .fill("por 20 minutos depois do almoço");
  await page.getByRole("button", { name: "Selecionar todos" }).click();
  await page.getByRole("button", { name: /configurar estimador/i }).click();
  await page.getByRole("button", { name: /salvar hábito/i }).click();
  await expect(page.getByRole("heading", { name: "Caminhar" })).toBeVisible();

  await page.getByRole("link", { name: "Metas" }).click();
  await page.getByRole("button", { name: /criar primeira meta/i }).click();
  await page.getByLabel("Nome").fill("Criar uma reserva");
  await page
    .getByLabel(/^Especificação/)
    .fill("Guardar R$ 10.000 em uma conta separada");
  await page.getByLabel("Data-limite").fill("2099-12-31");
  await page.getByLabel(/^Motivação/).fill("Ter segurança para imprevistos");
  await page.getByRole("button", { name: "Criar meta" }).click();
  await page.getByRole("link", { name: "Hábitos" }).click();
  await page.getByRole("link", { name: "Metas" }).click();
  await expect(
    page.getByRole("heading", { name: "Criar uma reserva" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Hábitos" }).click();
  await page.getByRole("link", { name: /abrir metodologia/i }).click();
  await expect(
    page.getByRole("heading", { name: /repetir é construir/i })
  ).toBeVisible();
  await page.getByRole("link", { name: /voltar ao painel/i }).click();
  await expect(page.getByRole("heading", { name: "Caminhar" })).toBeVisible();

  await page.getByRole("button", { name: "Concluído", exact: true }).click();
  await expect(page.getByText("1 execução feita", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Metas" }).click();
  await page.getByRole("link", { name: "Hábitos" }).click();
  await expect(page.getByText("1 execução feita", { exact: true })).toBeVisible();
});
