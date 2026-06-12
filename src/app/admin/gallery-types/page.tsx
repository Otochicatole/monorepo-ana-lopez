import { Locale } from "@prisma/client";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import {
  createGalleryTypeAction,
  deleteGalleryTypeAction,
} from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field } from "../_components/form-fields";
import { LocaleToggle, normalizeAdminLocale } from "../_components/locale-toggle";

export default async function AdminGalleryTypesPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = normalizeAdminLocale(params?.locale);
  const types = await prisma.galleryType.findMany({
    where: { deletedAt: null, locale },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="oswald mb-8 text-4xl">Gallery Types</h1>
      <LocaleToggle current={locale as Locale} basePath="/admin/gallery-types" />
      <form action={createGalleryTypeAction} className="mb-8 grid gap-4 rounded border border-white/10 bg-white/5 p-5 lg:grid-cols-3">
        <Field label="Document ID">
          <input name="documentId" required className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <input type="hidden" name="locale" value={locale} />
        <Field label="Nombre">
          <input name="name" required className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <button className="self-end rounded bg-pk px-4 py-2 font-bold">Guardar tipo</button>
      </form>

      <div className="overflow-hidden rounded border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Locale</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id} className="border-t border-white/10">
                <td className="p-3">{type.documentId}</td>
                <td className="p-3">{type.locale}</td>
                <td className="p-3">
                  <form action={createGalleryTypeAction} className="flex gap-2">
                    <input type="hidden" name="documentId" value={type.documentId} />
                    <input type="hidden" name="locale" value={type.locale} />
                    <input
                      name="name"
                      defaultValue={type.name}
                      className="w-full rounded border border-white/10 bg-black/40 px-3 py-2"
                    />
                    <button className="rounded bg-pk px-3 py-2 font-bold text-black">
                      Guardar
                    </button>
                  </form>
                </td>
                <td className="p-3">
                  <form action={deleteGalleryTypeAction}>
                    <input type="hidden" name="id" value={type.id} />
                    <button className="text-red-200">Borrar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
