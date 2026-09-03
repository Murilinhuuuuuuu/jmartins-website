const WHATSAPP_NUMBER = "551138258297";

function buildUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildDefaultWhatsAppUrl() {
  return buildUrl("Olá! Gostaria de falar com a JMartins Móveis.");
}

export function buildProductWhatsAppUrl(product: string) {
  return buildUrl(`Olá! Vi a cadeira ${product} no site da JMartins e gostaria de saber mais.`);
}

export function buildQuoteWhatsAppUrl(protocol: string) {
  return buildUrl(`Olá! Acabei de solicitar um orçamento pelo site da JMartins. Meu protocolo é ${protocol}.`);
}

export function buildProjectWhatsAppUrl(project: string) {
  return buildUrl(`Olá! Vi o projeto ${project} no portfólio da JMartins e gostaria de solicitar uma avaliação.`);
}
