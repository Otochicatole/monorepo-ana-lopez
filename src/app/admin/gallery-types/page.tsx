import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import {
  createGalleryTypeAction,
  deleteGalleryTypeAction,
} from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field } from "../_components/form-fields";
import { LocaleToggle, resolveAdminLocale } from "../_components/locale-toggle";
import { PageHeader } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";
import { EmptyState } from "@/features/admin/presentation/components/ui/page-shell";

export default async function AdminGalleryTypesPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const locale = await resolveAdminLocale(params?.locale);
  const types = await prisma.galleryType.findMany({
    where: { deletedAt: null },
    include: {
      translations: {
        where: { localeId: locale.id },
      },
    },
    orderBy: { documentId: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Gallery Types"
        description="Manage gallery categories. Names are translated per locale; types are shared globally."
      />
      <LocaleToggle current={locale} basePath="/admin/gallery-types" />

      <Card className="mb-8">
        <CardHeader
          title="Create gallery type"
          description="Use a stable document ID shared across locales."
        />
        <CardBody>
          <form action={createGalleryTypeAction} className="grid gap-4 lg:grid-cols-3">
            <Field label="Document ID" hint="Example: gallery-type-editorial">
              <Input name="documentId" required placeholder="gallery-type-editorial" />
            </Field>
            <input type="hidden" name="localeId" value={locale.id} />
            <Field label={`Name (${locale.name})`}>
              <Input name="name" required />
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full lg:w-auto">
                Save type
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {types.length === 0 ? (
        <EmptyState
          title="No gallery types yet"
          description="Create your first category to organize gallery items."
        />
      ) : (
        <Card>
          <CardHeader title="Existing types" />
          <CardBody className="overflow-x-auto p-0">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-white/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Document ID</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => {
                  const translation = type.translations[0];
                  return (
                    <tr key={`${type.id}-${locale.id}`} className="border-t border-white/10">
                      <td className="px-5 py-4 font-mono text-xs text-white/70">
                        {type.documentId}
                      </td>
                      <td className="px-5 py-4">
                        <form key={`${type.id}-${locale.id}`} action={createGalleryTypeAction} className="flex gap-2">
                          <input type="hidden" name="documentId" value={type.documentId} />
                          <input type="hidden" name="localeId" value={locale.id} />
                          <Input
                            name="name"
                            defaultValue={translation?.name || ""}
                            placeholder={`Name in ${locale.name}`}
                          />
                          <Button type="submit" variant="secondary" size="sm">
                            Save
                          </Button>
                        </form>
                      </td>
                      <td className="px-5 py-4">
                        <ConfirmDeleteButton
                          action={deleteGalleryTypeAction}
                          id={type.id}
                          itemName={type.documentId}
                          title="Delete gallery type?"
                          description={`Are you sure you want to delete "${type.documentId}"? Items linked to this type will lose their category.`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
