import { Locale } from "@prisma/client";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import { upsertAboutAction } from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field, MediaSelect } from "../_components/form-fields";
import { LocaleToggle, normalizeAdminLocale } from "../_components/locale-toggle";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = normalizeAdminLocale(params?.locale);
  const [record, media] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { locale } }),
    prisma.mediaFile.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="oswald mb-8 text-4xl">About Content</h1>
      <LocaleToggle current={locale as Locale} basePath="/admin/about" />
      <form
        action={upsertAboutAction}
        className="flex max-w-4xl flex-col gap-4 rounded border border-white/10 bg-white/5 p-5"
      >
        <h2 className="text-xl font-bold">
          {locale === "es_AR" ? "Español" : "English"}
        </h2>
        <input type="hidden" name="locale" value={locale} />
        {[1, 2, 3].map((index) => (
          <div key={index} className="rounded border border-white/10 p-4">
            <Field label={`Texto ${index}`}>
              <textarea
                name={`text${index}`}
                rows={5}
                defaultValue={
                  index === 1
                    ? record?.text1 || ""
                    : index === 2
                      ? record?.text2 || ""
                      : record?.text3 || ""
                }
                className="rounded border border-white/10 bg-black/40 px-3 py-2"
              />
            </Field>
            <div className="mt-4">
              <Field label={`Imagen ${index}`}>
                <MediaSelect
                  name={`image${index}Id`}
                  media={media}
                  defaultValue={
                    index === 1
                      ? record?.image1Id
                      : index === 2
                        ? record?.image2Id
                        : record?.image3Id
                  }
                />
              </Field>
            </div>
          </div>
        ))}
        <button className="rounded bg-pk px-4 py-2 font-bold">Guardar</button>
      </form>
    </div>
  );
}
