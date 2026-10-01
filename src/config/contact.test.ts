import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { WHATSAPP_NUMBER, buildBouquetMessage, whatsappLink } from "./contact";

const SRC_DIR = join(__dirname, "..");

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return collectSourceFiles(full);
    return /\.(ts|tsx|js|jsx|css|html)$/.test(entry) ? [full] : [];
  });
}

describe("enlaces de WhatsApp", () => {
  it("usa exclusivamente https://wa.me/", () => {
    const link = whatsappLink("Hola");
    expect(link.startsWith("https://wa.me/")).toBe(true);
  });

  it("conserva exactamente el número configurado", () => {
    expect(WHATSAPP_NUMBER).toBe("522204470530");
    expect(whatsappLink("Hola")).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
  });

  it("conserva el parámetro ?text= con el mensaje codificado", () => {
    const link = whatsappLink("Hola, Bee Petals. Me gustaría más información.");
    expect(link).toContain("?text=");
    const text = new URL(link).searchParams.get("text");
    expect(text).toBe("Hola, Bee Petals. Me gustaría más información.");
  });

  it("el mensaje del configurador incluye ocasión, estilo, colores y tamaño", () => {
    const message = buildBouquetMessage({
      ocasion: "🎂 Cumpleaños",
      estilo: "🌹 Rosas de listón",
      colores: "Rosa",
      tamano: "Mediano",
    });
    expect(message).toContain("Ocasión: 🎂 Cumpleaños");
    expect(message).toContain("Estilo: 🌹 Rosas de listón");
    expect(message).toContain("Colores: Rosa");
    expect(message).toContain("Tamaño: Mediano");

    const link = whatsappLink(message);
    const text = new URL(link).searchParams.get("text") ?? "";
    for (const field of ["Ocasión:", "Estilo:", "Colores:", "Tamaño:"]) {
      expect(text).toContain(field);
    }
  });

  it("el mensaje del configurador muestra guiones cuando falta información", () => {
    const message = buildBouquetMessage({});
    expect(message).toContain("Ocasión: -");
    expect(message).toContain("Tamaño: -");
  });

  it("ningún archivo del proyecto usa api.whatsapp.com", () => {
    const offenders = collectSourceFiles(SRC_DIR).filter((file) =>
      readFileSync(file, "utf8").includes("api.whatsapp.com"),
    );
    expect(
      offenders.map((f) => relative(SRC_DIR, f)),
      `Archivos con api.whatsapp.com: ${offenders.join(", ")}`,
    ).toEqual([]);
  });

  it("ningún enlace de WhatsApp del código usa otro dominio", () => {
    const files = collectSourceFiles(SRC_DIR).filter((f) => !f.endsWith(".test.ts"));
    const urlPattern = /https?:\/\/[^\s"'`)]*whatsapp[^\s"'`)]*/gi;
    for (const file of files) {
      const matches = readFileSync(file, "utf8").match(urlPattern) ?? [];
      expect(matches, `Dominio de WhatsApp no permitido en ${relative(SRC_DIR, file)}`).toEqual([]);
    }
  });

  it("todos los puntos de WhatsApp pasan por whatsappLink()", () => {
    const index = readFileSync(join(SRC_DIR, "routes/index.tsx"), "utf8");
    const configurator = readFileSync(join(SRC_DIR, "components/BouquetConfigurator.tsx"), "utf8");

    // Botón flotante y pie de página (index.tsx)
    expect(index).toContain('className="whatsapp-float"');
    expect(index).toMatch(/whatsapp-float[\s\S]*?whatsappLink\(/);
    // Enlace de WhatsApp en el footer
    expect(index).toContain('aria-label="WhatsApp"');
    // Botón "Cotizar mi ramo" del configurador
    expect(configurator).toContain("Cotizar mi ramo");
    expect(configurator).toContain("whatsappLink(message)");
    // Ningún enlace directo a wa.me escrito a mano: todo pasa por whatsappLink
    for (const source of [index, configurator]) {
      expect(source).not.toMatch(/href=["']https?:\/\/(wa\.me|api\.whatsapp\.com)/);
    }
  });
});
