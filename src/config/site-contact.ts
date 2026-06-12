/**
 * Contacto y redes sociales del sitio.
 * Editá estos valores directamente acá — no van en .env.
 */

export const siteContact = {
  email: "anaartista122@gmail.com",
  phone: "+965 96087035",
  whatsappUrl: "https://wa.me/96596087035",
  instagramUrl: "https://www.instagram.com/ana.artista",
  tiktokUrl: "https://www.tiktok.com/@ana.artista",
} as const;

export const socialLinks = [
  { label: "TikTok", url: siteContact.tiktokUrl },
  { label: "Instagram", url: siteContact.instagramUrl },
] as const;

export function getMailtoHref(email = siteContact.email): string {
  return `mailto:${email}`;
}

export function getGmailComposeHref(email = siteContact.email): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

export function getTelHref(phone = siteContact.phone): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized}`;
}
