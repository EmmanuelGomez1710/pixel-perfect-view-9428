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

// Solo para el botón "Cotizar mi ramo": abre WhatsApp Web directamente (sin redirección de wa.me).
export function whatsappWebLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

// Versión para teléfonos del botón "Cotizar mi ramo": abre la app de WhatsApp directamente.
export function whatsappAppLink(message: string) {
  const text = encodeURIComponent(message);
  return `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

export interface BouquetAnswers {
  ocasion?: string;
  estilo?: string;
  flores?: string[];
  colores?: string;
  tamano?: string;
}

export function buildBouquetMessage(answers: BouquetAnswers) {
  const lines = [
    "Hola, Bee Petals. Me gustaría cotizar un ramo.",
    "",
    `Ocasión: ${answers.ocasion ?? "-"}`,
    `Estilo: ${answers.estilo ?? "-"}`,
  ];

  if (answers.flores?.length) {
    lines.push(`Flores: ${answers.flores.join(", ")}`);
  }

  lines.push(
    `Colores: ${answers.colores ?? "-"}`,
    `Tamaño: ${answers.tamano ?? "-"}`,
  );

  return lines.join("\n");
}

