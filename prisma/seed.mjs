import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "crypto";

const prisma = new PrismaClient();

const permissions = [
  ["home", ["read", "update"]],
  ["about", ["read", "update"]],
  ["gallery", ["read", "create", "update", "delete"]],
  ["gallery-type", ["read", "create", "update", "delete"]],
  ["media", ["read", "upload", "delete"]],
  ["locale", ["read", "create", "update", "delete"]],
  ["user", ["read", "create", "update", "delete"]],
  ["role", ["read", "create", "update", "delete"]],
  ["audit-log", ["read"]],
];

const LEGACY_GALLERY_TYPE_IDS = [
  "gallery-type-editorial-en",
  "gallery-type-editorial-es",
  "gallery-type-events-en",
  "gallery-type-events-es",
  "gallery-type-beauty-en",
  "gallery-type-beauty-es",
];

const LEGACY_GALLERY_ITEM_PREFIXES = [
  "gallery-editorial-cover-en",
  "gallery-editorial-cover-es",
  "gallery-evening-glow-en",
  "gallery-evening-glow-es",
  "gallery-clean-beauty-en",
  "gallery-clean-beauty-es",
  "gallery-fashion-light-en",
  "gallery-fashion-light-es",
  "gallery-soft-event-en",
  "gallery-soft-event-es",
  "gallery-natural-skin-en",
  "gallery-natural-skin-es",
];

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function cleanupLegacyGalleryData() {
  const now = new Date();

  await prisma.galleryType.updateMany({
    where: {
      documentId: { in: LEGACY_GALLERY_TYPE_IDS },
      deletedAt: null,
    },
    data: { deletedAt: now },
  });

  await prisma.galleryItem.updateMany({
    where: {
      documentId: { in: LEGACY_GALLERY_ITEM_PREFIXES },
      deletedAt: null,
    },
    data: { deletedAt: now },
  });
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

async function seedLocales() {
  const en = await prisma.locale.upsert({
    where: { code: "en" },
    update: {
      name: "English",
      isDefault: true,
      isActive: true,
      sortOrder: 0,
    },
    create: {
      code: "en",
      name: "English",
      isDefault: true,
      isActive: true,
      sortOrder: 0,
    },
  });

  const es = await prisma.locale.upsert({
    where: { code: "es-AR" },
    update: {
      name: "Español (Argentina)",
      isDefault: false,
      isActive: true,
      sortOrder: 1,
    },
    create: {
      code: "es-AR",
      name: "Español (Argentina)",
      isDefault: false,
      isActive: true,
      sortOrder: 1,
    },
  });

  await prisma.locale.updateMany({
    where: { id: { not: en.id }, isDefault: true },
    data: { isDefault: false },
  });

  return { en, es };
}

async function upsertGalleryType(documentId, translations) {
  const type = await prisma.galleryType.upsert({
    where: { documentId },
    update: { deletedAt: null },
    create: { documentId },
  });

  for (const [localeId, name] of translations) {
    await prisma.galleryTypeTranslation.upsert({
      where: {
        galleryTypeId_localeId: {
          galleryTypeId: type.id,
          localeId,
        },
      },
      update: { name },
      create: {
        galleryTypeId: type.id,
        localeId,
        name,
      },
    });
  }

  return type;
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

async function seedContent(media, locales) {
  await prisma.homeContent.upsert({
    where: { localeId: locales.en.id },
    update: {
      about:
        "Ana Lopez is a makeup artist focused on editorial, fashion and event looks. Her work highlights natural beauty with precise technique, soft textures and a refined use of light.",
      imageAboutId: media.ana.id,
      deletedAt: null,
    },
    create: {
      localeId: locales.en.id,
      about:
        "Ana Lopez is a makeup artist focused on editorial, fashion and event looks. Her work highlights natural beauty with precise technique, soft textures and a refined use of light.",
      imageAboutId: media.ana.id,
    },
  });

  await prisma.homeContent.upsert({
    where: { localeId: locales.es.id },
    update: {
      about:
        "Ana Lopez es una maquilladora enfocada en producciones editoriales, moda y eventos. Su trabajo realza la belleza natural con técnica precisa, texturas suaves y un uso cuidado de la luz.",
      imageAboutId: media.ana.id,
      deletedAt: null,
    },
    create: {
      localeId: locales.es.id,
      about:
        "Ana Lopez es una maquilladora enfocada en producciones editoriales, moda y eventos. Su trabajo realza la belleza natural con técnica precisa, texturas suaves y un uso cuidado de la luz.",
      imageAboutId: media.ana.id,
    },
  });

  await prisma.aboutContent.upsert({
    where: { localeId: locales.en.id },
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
      localeId: locales.en.id,
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
    where: { localeId: locales.es.id },
    update: {
      text1:
        "El enfoque de Ana empieza por escuchar: piel, estilo, ocasión y personalidad definen cada look.",
      image1Id: media.ana.id,
      text2:
        "Su portfolio combina belleza limpia, contraste editorial y terminaciones luminosas para cámara y vida real.",
      image2Id: media.header.id,
      text3:
        "Desde eventos sociales hasta producciones creativas, cada servicio se planifica con cuidado, higiene y detalle.",
      image3Id: media.test.id,
      deletedAt: null,
    },
    create: {
      localeId: locales.es.id,
      text1:
        "El enfoque de Ana empieza por escuchar: piel, estilo, ocasión y personalidad definen cada look.",
      image1Id: media.ana.id,
      text2:
        "Su portfolio combina belleza limpia, contraste editorial y terminaciones luminosas para cámara y vida real.",
      image2Id: media.header.id,
      text3:
        "Desde eventos sociales hasta producciones creativas, cada servicio se planifica con cuidado, higiene y detalle.",
      image3Id: media.test.id,
    },
  });
}

async function seedGallery(media, locales) {
  await cleanupLegacyGalleryData();

  const editorial = await upsertGalleryType("gallery-type-editorial", [
    [locales.en.id, "Editorial"],
    [locales.es.id, "Editorial"],
  ]);
  const events = await upsertGalleryType("gallery-type-events", [
    [locales.en.id, "Events"],
    [locales.es.id, "Eventos"],
  ]);
  const beauty = await upsertGalleryType("gallery-type-beauty", [
    [locales.en.id, "Beauty"],
    [locales.es.id, "Belleza"],
  ]);

  const items = [
    ["gallery-editorial-cover", "Editorial Cover", media.header.id, editorial.id],
    ["gallery-evening-glow", "Evening Glow", media.test.id, events.id],
    ["gallery-clean-beauty", "Clean Beauty", media.ana.id, beauty.id],
    ["gallery-fashion-light", "Fashion Light", media.header.id, editorial.id],
    ["gallery-soft-event", "Soft Event Look", media.test.id, events.id],
    ["gallery-natural-skin", "Natural Skin", media.ana.id, beauty.id],
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
  const locales = await seedLocales();
  const media = await seedMedia();
  await seedContent(media, locales);
  await seedGallery(media, locales);
  await seedSecurity();

  const [
    localeCount,
    homeCount,
    aboutCount,
    galleryTypeCount,
    galleryTranslationCount,
    galleryCount,
    mediaCount,
    adminCount,
  ] = await Promise.all([
    prisma.locale.count({ where: { isActive: true } }),
    prisma.homeContent.count({ where: { deletedAt: null } }),
    prisma.aboutContent.count({ where: { deletedAt: null } }),
    prisma.galleryType.count({ where: { deletedAt: null } }),
    prisma.galleryTypeTranslation.count(),
    prisma.galleryItem.count({ where: { deletedAt: null } }),
    prisma.mediaFile.count({ where: { deletedAt: null } }),
    prisma.adminUser.count({ where: { deletedAt: null } }),
  ]);

  console.log("Seed completed", {
    locales: localeCount,
    home: homeCount,
    about: aboutCount,
    galleryTypes: galleryTypeCount,
    galleryTypeTranslations: galleryTranslationCount,
    galleryItems: galleryCount,
    media: mediaCount,
    admins: adminCount,
    defaultLocale: "en",
    adminLogin: process.env.ADMIN_SEED_EMAIL || "admin@example.com",
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
