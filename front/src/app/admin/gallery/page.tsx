import Image from "next/image";
import { Locale } from "@prisma/client";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import {
  createGalleryItemAction,
  deleteGalleryItemAction,
} from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field, MediaSelect } from "../_components/form-fields";
import { LocaleToggle, normalizeAdminLocale } from "../_components/locale-toggle";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = normalizeAdminLocale(params?.locale);
  const [items, media, types] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { deletedAt: null, galleryType: { locale } },
      include: { media: true, galleryType: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
    prisma.galleryType.findMany({ where: { deletedAt: null, locale }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="oswald mb-8 text-4xl">Gallery Items</h1>
      <LocaleToggle current={locale as Locale} basePath="/admin/gallery" />
      <form action={createGalleryItemAction} className="mb-8 grid gap-4 rounded border border-white/10 bg-white/5 p-5 lg:grid-cols-2">
        <Field label="Document ID">
          <input name="documentId" required className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="Nombre">
          <input name="name" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="Media">
          <MediaSelect name="mediaId" media={media} required />
        </Field>
        <Field label="Tipo">
          <select name="galleryTypeId" className="rounded border border-white/10 bg-black px-3 py-2">
            <option value="">Sin tipo</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.locale} - {type.name}
              </option>
            ))}
          </select>
        </Field>
        <button className="rounded bg-pk px-4 py-2 font-bold lg:col-span-2">Guardar item</button>
      </form>

      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-white/10 bg-white/5 p-4">
            <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded bg-black/40">
                {item.media.url.startsWith("/") && (
                  <Image
                    src={item.media.url}
                    alt={item.media.alternativeText || item.media.name}
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                )}
              </div>
              <form action={createGalleryItemAction} className="grid gap-4 lg:grid-cols-2">
                <input type="hidden" name="documentId" value={item.documentId} />
                <Field label="Nombre">
                  <input
                    name="name"
                    defaultValue={item.name || ""}
                    className="rounded border border-white/10 bg-black/40 px-3 py-2"
                  />
                </Field>
                <Field label="Tipo">
                  <select
                    name="galleryTypeId"
                    defaultValue={item.galleryTypeId || ""}
                    className="rounded border border-white/10 bg-black px-3 py-2"
                  >
                    <option value="">Sin tipo</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="lg:col-span-2">
                  <Field label="Media">
                    <MediaSelect
                      name="mediaId"
                      media={media}
                      required
                      defaultValue={item.mediaId}
                    />
                  </Field>
                </div>
                <div className="flex gap-3 lg:col-span-2">
                  <button className="rounded bg-pk px-4 py-2 font-bold text-black">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
            <form action={deleteGalleryItemAction} className="mt-4">
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded border border-red-400/30 px-3 py-2 text-sm text-red-200">
                Borrar
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
