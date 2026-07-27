import { describe, expect, it } from "vitest";
import { createId } from "./id";

describe("geração de identificadores", () => {
  it("usa randomUUID quando a API está disponível", () => {
    expect(
      createId({
        randomUUID: () => "00000000-0000-4000-8000-000000000001"
      })
    ).toBe("00000000-0000-4000-8000-000000000001");
  });

  it("gera um UUID válido sem randomUUID", () => {
    const id = createId({
      getRandomValues: (bytes) => {
        bytes.fill(1);
        return bytes;
      }
    });
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});
