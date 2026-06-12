import { Locale } from "@prisma/client";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { upsertHomeAction } from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field, MediaSelect } from "../_components/form-fields";
import { LocaleToggle, normalizeAdminLocale } from "../_components/locale-toggle";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = normalizeAdminLocale(params?.locale);
  const [record, media] = await Promise.all([
    prisma.homeContent.findUnique({ where: { locale } }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="oswald mb-8 text-4xl">Home Content</h1>
      <LocaleToggle current={locale as Locale} basePath="/admin/home" />
      <form
        action={upsertHomeAction}
        className="flex max-w-4xl flex-col gap-4 rounded border border-white/10 bg-white/5 p-5"
      >
        <h2 className="text-xl font-bold">
          {locale === "es_AR" ? "Español" : "English"}
        </h2>
        <input type="hidden" name="locale" value={locale} />
        <Field label="Texto About">
          <textarea
            name="about"
            required
            rows={8}
            defaultValue={record?.about || ""}
            className="rounded border border-white/10 bg-black/40 px-3 py-2"
          />
        </Field>
        <Field label="Imagen About">
          <MediaSelect
            name="imageAboutId"
            media={media}
            required
            defaultValue={record?.imageAboutId}
          />
        </Field>
        <button className="rounded bg-pk px-4 py-2 font-bold">Guardar</button>
      </form>
    </div>
  );
}
