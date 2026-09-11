// Configuración editable de contacto de Bee Petals.
// Escribe el número de WhatsApp en formato internacional, solo dígitos (ej. "5212221234567").
export const WHATSAPP_NUMBER = "";

// URL completa del Instagram oficial (ej. "https://instagram.com/tu_cuenta").
export const INSTAGRAM_URL = "";

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
}
