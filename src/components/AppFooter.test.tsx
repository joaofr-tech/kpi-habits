import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppFooter } from "./AppFooter";

describe("AppFooter", () => {
  it("renderiza o rodapé com a frase única unificada", () => {
    render(<AppFooter />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Nós somos o que fazemos repetidamente.");
    expect(screen.queryByText(/que importa o que eu quero/i)).not.toBeInTheDocument();
  });
});
