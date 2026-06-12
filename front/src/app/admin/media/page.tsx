import Image from "next/image";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import {
  createMediaAction,
  deleteMediaAction,
  uploadMediaFileAction,
} from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field } from "../_components/form-fields";

export default async function AdminMediaPage() {
  await requireAdmin();
  const media = await prisma.mediaFile.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="oswald mb-8 text-4xl">Media Library</h1>
      <form
        action={uploadMediaFileAction}
        className="mb-8 grid gap-4 rounded border border-white/10 bg-white/5 p-5 lg:grid-cols-[1fr_1fr_auto]"
      >
        <Field label="Subir imagen">
          <input
            name="file"
            type="file"
            accept="image/*"
            required
            className="rounded border border-white/10 bg-black/40 px-3 py-2"
          />
        </Field>
        <Field label="Alt">
          <input
            name="alternativeText"
            className="rounded border border-white/10 bg-black/40 px-3 py-2"
          />
        </Field>
        <button className="self-end rounded bg-pk px-4 py-2 font-bold">
          Subir archivo
        </button>
      </form>

      <form
        action={createMediaAction}
        className="mb-8 grid gap-4 rounded border border-white/10 bg-white/5 p-5 lg:grid-cols-3"
      >
        <Field label="Document ID">
          <input name="documentId" required className="rounded border border-white/10 bg-black/40 px-3 py-2" placeholder="media-new-image" />
        </Field>
        <Field label="Nombre">
          <input name="name" required className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="URL">
          <input name="url" required className="rounded border border-white/10 bg-black/40 px-3 py-2" placeholder="/images/ana.png" />
        </Field>
        <Field label="Alt">
          <input name="alternativeText" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="MIME">
          <input name="mime" required defaultValue="image/png" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="Extension">
          <input name="ext" defaultValue=".png" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="Width">
          <input name="width" type="number" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="Height">
          <input name="height" type="number" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <Field label="Size KB">
          <input name="size" type="number" step="0.01" defaultValue="1" className="rounded border border-white/10 bg-black/40 px-3 py-2" />
        </Field>
        <button className="rounded bg-pk px-4 py-2 font-bold lg:col-span-3">
          Guardar media
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <article key={item.id} className="rounded border border-white/10 bg-white/5 p-4">
            <div className="relative mb-4 aspect-video overflow-hidden rounded bg-black/40">
              {item.url.startsWith("/") && (
                <Image src={item.url} alt={item.alternativeText || item.name} fill className="object-cover" />
              )}
            </div>
            <form action={createMediaAction} className="grid gap-3">
              <input type="hidden" name="documentId" value={item.documentId} />
              <Field label="Nombre">
                <input
                  name="name"
                  required
                  defaultValue={item.name}
                  className="rounded border border-white/10 bg-black/40 px-3 py-2"
                />
              </Field>
              <Field label="URL">
                <input
                  name="url"
                  required
                  defaultValue={item.url}
                  className="rounded border border-white/10 bg-black/40 px-3 py-2"
                />
              </Field>
              <Field label="Alt">
                <input
                  name="alternativeText"
                  defaultValue={item.alternativeText || ""}
                  className="rounded border border-white/10 bg-black/40 px-3 py-2"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="MIME">
                  <input
                    name="mime"
                    required
                    defaultValue={item.mime}
                    className="rounded border border-white/10 bg-black/40 px-3 py-2"
                  />
                </Field>
                <Field label="Extension">
                  <input
                    name="ext"
                    defaultValue={item.ext || ""}
                    className="rounded border border-white/10 bg-black/40 px-3 py-2"
                  />
                </Field>
                <Field label="Width">
                  <input
                    name="width"
                    type="number"
                    defaultValue={item.width || ""}
                    className="rounded border border-white/10 bg-black/40 px-3 py-2"
                  />
                </Field>
                <Field label="Height">
                  <input
                    name="height"
                    type="number"
                    defaultValue={item.height || ""}
                    className="rounded border border-white/10 bg-black/40 px-3 py-2"
                  />
                </Field>
              </div>
              <input type="hidden" name="size" value={item.size.toString()} />
              <button className="rounded bg-pk px-3 py-2 text-sm font-bold text-black">
                Guardar cambios
              </button>
            </form>
            <form action={deleteMediaAction} className="mt-4">
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
