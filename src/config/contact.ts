
export const WHATSAPP_NUMBER = "522204470530";

export const INSTAGRAM_URL = "https://www.instagram.com/bee_petalss";

export function whatsappWebLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${text}`;
}

export function whatsappAppLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function whatsappLink(message: string) {
  return whatsappWebLink(message);
}

export interface BouquetAnswers {
  ocasion?: string;
  estilo?: string;
  flores?: string[];
  colores?: string;
  tamano?: string;
}

export function buildBouquetMessage(answers: BouquetAnswers) {
  return [
    "Hola, Bee Petals. Me gustaría cotizar un ramo.",
    "",
    `Ocasión: ${answers.ocasion ?? "-"}`,
    `Estilo: ${answers.estilo ?? "-"}`,
    `Tipo de flores: ${answers.flores?.join(", ") ?? "-"}`,
    `Tamaño: ${answers.tamano ?? "-"}`,
  ].join("\n");
}
