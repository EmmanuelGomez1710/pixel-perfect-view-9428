// Configuración editable de contacto de Bee Petals.
// Escribe el número de WhatsApp en formato internacional, solo dígitos (ej. "5212221234567").
export const WHATSAPP_NUMBER = "522204470530";

// URL completa del Instagram oficial.
export const INSTAGRAM_URL = "https://www.instagram.com/bee_petalss";

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export interface BouquetAnswers {
  ocasion?: string;
  estilo?: string;
  colores?: string;
  tamano?: string;
}

export function buildBouquetMessage(answers: BouquetAnswers) {
  return [
    "Hola, Bee Petals. Me gustaría cotizar un ramo.",
    "",
    `Ocasión: ${answers.ocasion ?? "-"}`,
    `Estilo: ${answers.estilo ?? "-"}`,
    `Colores: ${answers.colores ?? "-"}`,
    `Tamaño: ${answers.tamano ?? "-"}`,
  ].join("\n");
}
