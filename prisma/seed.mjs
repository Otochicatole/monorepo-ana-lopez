import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

const permissions = [
  ["home", ["read", "update"]],
  ["about", ["read", "update"]],
  ["gallery", ["read", "create", "update", "delete"]],
  ["gallery-type", ["read", "create", "update", "delete"]],
  ["media", ["read", "upload", "delete"]],
  ["user", ["read", "create", "update", "delete"]],
  ["role", ["read", "create", "update", "delete"]],
  ["audit-log", ["read"]],
];

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function upsertMedia(input) {
  return prisma.mediaFile.upsert({
    where: { documentId: input.documentId },
    update: {
      name: input.name,
      alternativeText: input.alternativeText,
      caption: input.caption ?? null,
      width: input.width,
      height: input.height,
      formats: input.formats ?? {},
      hash: input.hash,
      ext: input.ext,
      mime: input.mime,
      size: input.size,
      url: input.url,
      previewUrl: null,
      provider: "local",
      providerMetadata: {},
      focalPoint: null,
      deletedAt: null,
    },
    create: {
      documentId: input.documentId,
      name: input.name,
      alternativeText: input.alternativeText,
      caption: input.caption ?? null,
      width: input.width,
      height: input.height,
      formats: input.formats ?? {},
      hash: input.hash,
      ext: input.ext,
      mime: input.mime,
      size: input.size,
      url: input.url,
      previewUrl: null,
      provider: "local",
      providerMetadata: {},
      focalPoint: null,
    },
  });
}

async function upsertGalleryType(input) {
  return prisma.galleryType.upsert({
    where: { documentId: input.documentId },
    update: {
      locale: input.locale,
      name: input.name,
      deletedAt: null,
    },
    create: {
      documentId: input.documentId,
      locale: input.locale,
      name: input.name,
    },
  });
}

async function upsertGalleryItem(input) {
  return prisma.galleryItem.upsert({
    where: { documentId: input.documentId },
    update: {
      name: input.name,
      mediaId: input.mediaId,
      galleryTypeId: input.galleryTypeId,
      deletedAt: null,
    },
    create: {
      documentId: input.documentId,
      name: input.name,
      mediaId: input.mediaId,
      galleryTypeId: input.galleryTypeId,
    },
  });
}

async function seedMedia() {
  const ana = await upsertMedia({
    documentId: "media-ana-portrait",
    name: "ana.png",
    alternativeText: "Ana Lopez makeup portrait",
    width: 800,
    height: 800,
    hash: "ana",
    ext: ".png",
    mime: "image/png",
    size: "95.10",
    url: "/images/ana.png",
  });

  const header = await upsertMedia({
    documentId: "media-header-editorial",
    name: "header.png",
    alternativeText: "Editorial makeup hero image",
    width: 1920,
    height: 1080,
    hash: "header",
    ext: ".png",
    mime: "image/png",
    size: "1119.06",
    url: "/images/header.png",
  });

  const test = await upsertMedia({
    documentId: "media-gallery-test",
    name: "test.webp",
    alternativeText: "Makeup portfolio work",
    width: 900,
    height: 1200,
    hash: "test",
    ext: ".webp",
    mime: "image/webp",
    size: "72.83",
    url: "/images/test.webp",
  });

  return { ana, header, test };
}

async function seedContent(media) {
  await prisma.homeContent.upsert({
    where: { locale: "en" },
    update: {
      about:
        "Ana Lopez is a makeup artist focused on editorial, fashion and event looks. Her work highlights natural beauty with precise technique, soft textures and a refined use of light.",
      imageAboutId: media.ana.id,
      deletedAt: null,
    },
    create: {
      locale: "en",
      about:
        "Ana Lopez is a makeup artist focused on editorial, fashion and event looks. Her work highlights natural beauty with precise technique, soft textures and a refined use of light.",
      imageAboutId: media.ana.id,
    },
  });

  await prisma.homeContent.upsert({
    where: { locale: "es_AR" },
    update: {
      about:
        "Ana Lopez es una maquilladora enfocada en producciones editoriales, moda y eventos. Su trabajo realza la belleza natural con tecnica precisa, texturas suaves y un uso cuidado de la luz.",
      imageAboutId: media.ana.id,
      deletedAt: null,
    },
    create: {
      locale: "es_AR",
      about:
        "Ana Lopez es una maquilladora enfocada en producciones editoriales, moda y eventos. Su trabajo realza la belleza natural con tecnica precisa, texturas suaves y un uso cuidado de la luz.",
      imageAboutId: media.ana.id,
    },
  });

  await prisma.aboutContent.upsert({
    where: { locale: "en" },
    update: {
      text1:
        "Ana's approach starts with listening: skin, style, occasion and personality define every look.",
      image1Id: media.ana.id,
      text2:
        "Her portfolio combines clean beauty, editorial contrast and luminous finishes for camera and real life.",
      image2Id: media.header.id,
      text3:
        "From social events to creative productions, every service is planned with care, hygiene and attention to detail.",
      image3Id: media.test.id,
      deletedAt: null,
    },
    create: {
      locale: "en",
      text1:
        "Ana's approach starts with listening: skin, style, occasion and personality define every look.",
      image1Id: media.ana.id,
      text2:
        "Her portfolio combines clean beauty, editorial contrast and luminous finishes for camera and real life.",
      image2Id: media.header.id,
      text3:
        "From social events to creative productions, every service is planned with care, hygiene and attention to detail.",
      image3Id: media.test.id,
    },
  });

  await prisma.aboutContent.upsert({
    where: { locale: "es_AR" },
    update: {
      text1:
        "El enfoque de Ana empieza por escuchar: piel, estilo, ocasion y personalidad definen cada look.",
      image1Id: media.ana.id,
      text2:
        "Su portfolio combina belleza limpia, contraste editorial y terminaciones luminosas para camara y vida real.",
      image2Id: media.header.id,
      text3:
        "Desde eventos sociales hasta producciones creativas, cada servicio se planifica con cuidado, higiene y detalle.",
      image3Id: media.test.id,
      deletedAt: null,
    },
    create: {
      locale: "es_AR",
      text1:
        "El enfoque de Ana empieza por escuchar: piel, estilo, ocasion y personalidad definen cada look.",
      image1Id: media.ana.id,
      text2:
        "Su portfolio combina belleza limpia, contraste editorial y terminaciones luminosas para camara y vida real.",
      image2Id: media.header.id,
      text3:
        "Desde eventos sociales hasta producciones creativas, cada servicio se planifica con cuidado, higiene y detalle.",
      image3Id: media.test.id,
    },
  });
}

async function seedGallery(media) {
  const editorialEn = await upsertGalleryType({
    documentId: "gallery-type-editorial-en",
    locale: "en",
    name: "Editorial",
  });
  const eventsEn = await upsertGalleryType({
    documentId: "gallery-type-events-en",
    locale: "en",
    name: "Events",
  });
  const beautyEn = await upsertGalleryType({
    documentId: "gallery-type-beauty-en",
    locale: "en",
    name: "Beauty",
  });
  const editorialEs = await upsertGalleryType({
    documentId: "gallery-type-editorial-es",
    locale: "es_AR",
    name: "Editorial",
  });
  const eventsEs = await upsertGalleryType({
    documentId: "gallery-type-events-es",
    locale: "es_AR",
    name: "Eventos",
  });
  const beautyEs = await upsertGalleryType({
    documentId: "gallery-type-beauty-es",
    locale: "es_AR",
    name: "Belleza",
  });

  const items = [
    ["gallery-editorial-cover-en", "Editorial Cover", media.header.id, editorialEn.id],
    ["gallery-evening-glow-en", "Evening Glow", media.test.id, eventsEn.id],
    ["gallery-clean-beauty-en", "Clean Beauty", media.ana.id, beautyEn.id],
    ["gallery-fashion-light-en", "Fashion Light", media.header.id, editorialEn.id],
    ["gallery-soft-event-en", "Soft Event Look", media.test.id, eventsEn.id],
    ["gallery-natural-skin-en", "Natural Skin", media.ana.id, beautyEn.id],
    ["gallery-editorial-cover-es", "Tapa Editorial", media.header.id, editorialEs.id],
    ["gallery-evening-glow-es", "Brillo de Noche", media.test.id, eventsEs.id],
    ["gallery-clean-beauty-es", "Belleza Limpia", media.ana.id, beautyEs.id],
    ["gallery-fashion-light-es", "Luz de Moda", media.header.id, editorialEs.id],
    ["gallery-soft-event-es", "Look Suave de Evento", media.test.id, eventsEs.id],
    ["gallery-natural-skin-es", "Piel Natural", media.ana.id, beautyEs.id],
  ];

  for (const [documentId, name, mediaId, galleryTypeId] of items) {
    await upsertGalleryItem({ documentId, name, mediaId, galleryTypeId });
  }
}

async function seedSecurity() {
  const adminRole = await prisma.role.upsert({
    where: { code: "admin" },
    update: {
      name: "Administrator",
      description: "Full access to the custom CMS.",
    },
    create: {
      code: "admin",
      name: "Administrator",
      description: "Full access to the custom CMS.",
    },
  });

  for (const [subject, actions] of permissions) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: { action_subject: { action, subject } },
        update: {},
        create: { action, subject },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "admin123456";
  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_SEED_EMAIL || "admin@example.com" },
    update: {
      username: process.env.ADMIN_SEED_USERNAME || "admin",
      passwordHash: hashPassword(adminPassword),
      roleId: adminRole.id,
      blocked: false,
      deletedAt: null,
    },
    create: {
      email: process.env.ADMIN_SEED_EMAIL || "admin@example.com",
      username: process.env.ADMIN_SEED_USERNAME || "admin",
      passwordHash: hashPassword(adminPassword),
      roleId: adminRole.id,
    },
  });
}

async function main() {
  const media = await seedMedia();
  await seedContent(media);
  await seedGallery(media);
  await seedSecurity();

  const [homeCount, aboutCount, galleryTypeCount, galleryCount, mediaCount] =
    await Promise.all([
      prisma.homeContent.count(),
      prisma.aboutContent.count(),
      prisma.galleryType.count(),
      prisma.galleryItem.count(),
      prisma.mediaFile.count(),
    ]);

  console.log("Seed completed", {
    home: homeCount,
    about: aboutCount,
    galleryTypes: galleryTypeCount,
    galleryItems: galleryCount,
    media: mediaCount,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
