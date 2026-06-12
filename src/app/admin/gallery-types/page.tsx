import { Tags } from "lucide-react";
import { requireAdmin } from "@/features/admin/infrastructure/admin-auth";
import {
  createGalleryTypeAction,
  deleteGalleryTypeAction,
} from "@/features/admin/application/admin-actions";
import { prisma } from "@/shared/infrastructure/prisma";
import { Field } from "../_components/form-fields";
import { LocaleToggle, resolveAdminLocale } from "../_components/locale-toggle";
import { PageHeader, EmptyState } from "@/features/admin/presentation/components/ui/page-shell";
import { Card, CardBody, CardHeader } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { ConfirmDeleteButton } from "@/features/admin/presentation/components/ui/confirm-delete-button";
import { Input } from "@/features/admin/presentation/components/ui/form-controls";

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
      translations: { where: { localeId: locale.id } },
      _count: { select: { galleries: { where: { deletedAt: null } } } },
    },
    orderBy: { documentId: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Gallery Types"
        description="Manage gallery categories. Names are translated per locale."
      />

      {/* Create form + locale toggle */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex-1">
          <CardHeader
            title="New type"
            description="Document ID is permanent and shared across all locales."
          />
          <CardBody>
            <form action={createGalleryTypeAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <input type="hidden" name="localeId" value={locale.id} />
              <Field label="Document ID" hint="e.g. gallery-editorial">
                <Input
                  name="documentId"
                  required
                  placeholder="gallery-editorial"
                  pattern="[a-z0-9\-]+"
                  title="Lowercase, numbers and hyphens only"
                  className="font-mono"
                />
              </Field>
              <Field label={`Name in ${locale.name}`}>
                <Input name="name" required placeholder="Editorial" />
              </Field>
              <Button type="submit" className="shrink-0 self-end">Create</Button>
            </form>
          </CardBody>
        </Card>

        <div className="lg:pt-1 shrink-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-white/40">
            Editing names in
          </p>
          <LocaleToggle current={locale} basePath="/admin/gallery-types" />
        </div>
      </div>

      {/* List */}
      {types.length === 0 ? (
        <EmptyState
          title="No gallery types yet"
          description="Create your first category to organise gallery items."
        />
      ) : (
        <Card>
          <CardHeader
            title={`${types.length} ${types.length === 1 ? "type" : "types"}`}
            description={`Editing names in: ${locale.name}`}
          />
          <ul className="divide-y divide-white/10">
            {types.map((type) => {
              const translation = type.translations[0];
              const itemCount = type._count.galleries;
              return (
                <li
                  key={`${type.id}-${locale.id}`}
                  className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
                >
                  {/* Icon + ID */}
                  <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pk/10 text-pk">
                      <Tags className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-white/50">{type.documentId}</p>
                      <p className="text-[11px] text-white/35">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Inline name edit form */}
                  <form
                    key={`${type.id}-${locale.id}`}
                    action={createGalleryTypeAction}
                    className="flex flex-1 items-center gap-2"
                  >
                    <input type="hidden" name="documentId" value={type.documentId} />
                    <input type="hidden" name="localeId" value={locale.id} />
                    <Input
                      name="name"
                      defaultValue={translation?.name ?? ""}
                      placeholder={`Name in ${locale.name}…`}
                      className="flex-1"
                    />
                    <Button type="submit" variant="secondary" size="sm" className="shrink-0">
                      Save
                    </Button>
                  </form>

                  {/* Delete */}
                  <ConfirmDeleteButton
                    action={deleteGalleryTypeAction}
                    id={type.id}
                    itemName={type.documentId}
                    title="Delete gallery type?"
                    description={`Delete "${type.documentId}"? ${itemCount > 0 ? `${itemCount} item(s) will lose their category.` : "No linked items."}`}
                    buttonLabel="Delete"
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
